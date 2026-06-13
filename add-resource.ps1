<#
.SYNOPSIS
  Add a PDF resource to the Education library
.DESCRIPTION
  Drag a PDF onto this script to add it to assets/education/ and catalog.json.
  You will be prompted for title, description, and category.
.EXAMPLE
  .\add-resource.ps1 "C:\Users\me\Desktop\my-book.pdf"
#>

param(
  [string]$PdfPath = ""
)

# --- If no argument, show file picker ---
if (-not $PdfPath -or $PdfPath -eq "") {
  Add-Type -AssemblyName System.Windows.Forms
  $dialog = New-Object System.Windows.Forms.OpenFileDialog
  $dialog.Title = "Select a PDF file to add"
  $dialog.Filter = "PDF Files (*.pdf)|*.pdf"
  $dialog.ShowDialog() | Out-Null
  $PdfPath = $dialog.FileName
  if (-not $PdfPath) { Write-Host "No file selected. Exiting." -ForegroundColor Yellow; exit }
}

# --- Validate file ---
if (-not (Test-Path -LiteralPath $PdfPath)) {
  Write-Host "File not found: $PdfPath" -ForegroundColor Red
  exit 1
}

if ($PdfPath -notlike "*.pdf") {
  Write-Host "Only PDF files are supported." -ForegroundColor Red
  exit 1
}

# --- Determine script location & paths ---
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$TargetDir = Join-Path $ScriptDir "assets\education"
$CatalogFile = Join-Path $TargetDir "catalog.json"

if (-not (Test-Path -LiteralPath $TargetDir)) {
  New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
}

# --- Copy the PDF ---
$FileName = [System.IO.Path]::GetFileName($PdfPath)
$DestPath = Join-Path $TargetDir $FileName

# Check if file already exists
if (Test-Path -LiteralPath $DestPath) {
  $overwrite = Read-Host "File '$FileName' already exists. Overwrite? (y/N)"
  if ($overwrite -ne "y" -and $overwrite -ne "Y") { Write-Host "Cancelled." -ForegroundColor Yellow; exit }
}

Copy-Item -LiteralPath $PdfPath -Destination $DestPath -Force
Write-Host "Copied: $FileName" -ForegroundColor Green

# --- Get metadata ---
Write-Host ""
Write-Host "Enter resource details (press Enter to accept defaults):" -ForegroundColor Cyan
$title = Read-Host "  Title (without .pdf)"
if (-not $title) { $title = [System.IO.Path]::GetFileNameWithoutExtension($FileName) }

$description = Read-Host "  Description"
if (-not $description) { $description = "Educational resource on $title." }

$category = Read-Host "  Category (e.g. AI, Deep Learning, Mathematics)"
if (-not $category) { $category = "General" }

$sizeBytes = (Get-Item -LiteralPath $DestPath).Length
if ($sizeBytes -lt 1MB) {
  $fileSize = "{0:N1} KB" -f ($sizeBytes / 1KB)
} else {
  $fileSize = "{0:N1} MB" -f ($sizeBytes / 1MB)
}

$today = Get-Date -Format "yyyy-MM-dd"
$id = ($FileName -replace '\.pdf$','') -replace '[^a-zA-Z0-9]','-' -replace '-+','-' -replace '^-|-$',''
$id = $id.ToLower()

# --- Build new entry ---
$entry = @{
  id          = $id
  title       = $title
  description = $description
  fileName    = $FileName
  fileSize    = $fileSize
  addedDate   = $today
  category    = $category
}

# --- Read existing catalog, append entry ---
$catalog = @()
if (Test-Path -LiteralPath $CatalogFile) {
  try {
    $catalog = Get-Content -LiteralPath $CatalogFile -Raw -Encoding UTF8 | ConvertFrom-Json
  } catch {
    Write-Host "Warning: Could not parse existing catalog.json, starting fresh." -ForegroundColor Yellow
    $catalog = @()
  }
}

# Make sure it's an array
if (-not $catalog -or $catalog -isnot [System.Array]) { $catalog = @($catalog) }

$catalog = @($catalog) + $entry

# --- Write catalog.json ---
$json = $catalog | ConvertTo-Json -Depth 4
Set-Content -LiteralPath $CatalogFile -Value $json -Encoding UTF8

Write-Host ""
Write-Host "Done! Added to library:" -ForegroundColor Green
Write-Host "  File:     $FileName" -ForegroundColor White
Write-Host "  Title:    $title" -ForegroundColor White
Write-Host "  Category: $category" -ForegroundColor White
Write-Host "  Size:     $fileSize" -ForegroundColor White
Write-Host ""
Write-Host "Open education.html to see it in the grid." -ForegroundColor Cyan

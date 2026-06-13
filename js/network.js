/* 
   Malinda Lakshan - Neural Network Particle Backdrop
   Interactive HTML Canvas Simulation
*/

class NeuralNetworkBackdrop {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    
    // Config
    this.maxParticles = 80;
    this.connectionDist = 120;
    this.speed = 0.5;
    
    this.init();
  }
  
  init() {
    this.resizeCanvas();
    this.createParticles();
    this.setupEventListeners();
    this.animate();
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    this.particles = [];
    const count = Math.min(this.maxParticles, (this.canvas.width * this.canvas.height) / 15000);
    
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 2 + 1;
      // Theme colors: crimson (#d80706) or burgundy (#800505)
      const colorType = Math.random() > 0.4 ? 'crimson' : 'burgundy';
      const color = colorType === 'crimson' ? 'rgba(216, 7, 6,' : 'rgba(128, 5, 5,';
      
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.speed,
        vy: (Math.random() - 0.5) * this.speed,
        radius: radius,
        color: color,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseVal: Math.random() * Math.PI
      });
    }
  }
  
  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    this.particles.forEach((p) => {
      // Drift movement
      p.x += p.vx;
      p.y += p.vy;
      
      // Boundaries check
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
      
      // Subtle gravity towards mouse
      if (this.mouse.x !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x += (dx / dist) * force * 0.4;
          p.y += (dy / dist) * force * 0.4;
        }
      }
      
      // Node glow pulsating value
      p.pulseVal += p.pulseSpeed;
      const alpha = 0.3 + Math.sin(p.pulseVal) * 0.2;
      
      // Draw node
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.color} ${alpha})`;
      this.ctx.fill();
    });
    
    // Draw connections
    for (let i = 0; i < this.particles.length; i++) {
      const p1 = this.particles[i];
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.connectionDist) {
          // Opacity decreases with distance
          const alpha = (1 - dist / this.connectionDist) * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          
          // Draw connection with gradient depending on positions
          const grad = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          grad.addColorStop(0, `${p1.color} ${alpha})`);
          grad.addColorStop(1, `${p2.color} ${alpha})`);
          
          this.ctx.strokeStyle = grad;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
      
      // Draw line from mouse if close
      if (this.mouse.x !== null) {
        const dx = this.mouse.x - p1.x;
        const dy = this.mouse.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.mouse.radius) {
          const alpha = (1 - dist / this.mouse.radius) * 0.25;
          this.ctx.beginPath();
          this.ctx.moveTo(this.mouse.x, this.mouse.y);
          this.ctx.lineTo(p1.x, p1.y);
          this.ctx.strokeStyle = `rgba(216, 7, 6, ${alpha})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialise on load
document.addEventListener('DOMContentLoaded', () => {
  new NeuralNetworkBackdrop('network-canvas');
});

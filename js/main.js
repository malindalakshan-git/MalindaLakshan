/* 
   Malinda Lakshan - Core Interactive Scripts
   Features: Navigation, Scroll Reveals, Typing FX, Neural Playground, Contact Terminal
*/

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Header scroll state
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // 3. Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-item a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 4. Typewriter Animation (Hero section)
  const typeTextElement = document.querySelector('.typing-text');
  if (typeTextElement) {
    const words = ["AI Student", "AI Researcher", "Deep Learning Enthusiast", "Computer Vision Specialist"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function type() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typeTextElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeDelay = 50;
      } else {
        typeTextElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeDelay = 150;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeDelay = 2000; // Pause at end of word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeDelay = 500; // Pause before typing next word
      }

      setTimeout(type, typeDelay);
    }

    setTimeout(type, 500);
  }

  // 5. Scroll Reveal Animations (IntersectionObserver)
  const revealSelectors = ['.reveal', '.reveal-scale', '.reveal-left', '.reveal-right'];
  const revealElements = document.querySelectorAll(revealSelectors.join(','));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // If it's the skills section, animate skill fills
        if (entry.target.classList.contains('skills-container')) {
          animateSkillBars();
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Function to animate skill fills
  function animateSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');
    skillFills.forEach(fill => {
      const percentage = fill.getAttribute('data-percent');
      fill.style.width = percentage + '%';
    });
  }

  // 6. Contact Form - Terminal Success Animation
  const contactForm = document.getElementById('contact-form');
  const terminalOverlay = document.getElementById('terminal-overlay');
  const terminalLogs = document.getElementById('terminal-logs');

  if (contactForm && terminalOverlay && terminalLogs) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get values
      const nameVal = document.getElementById('contact-name').value;
      const emailVal = document.getElementById('contact-email').value;
      const msgVal = document.getElementById('contact-message').value;
      
      if (!nameVal || !emailVal || !msgVal) return;

      // Show terminal overlay
      terminalOverlay.classList.add('active');
      terminalLogs.innerHTML = '';
      
      const commands = [
        `guest@malinda-ai:~# send-mail --to malinda`,
        `> Resolving mail node target... OK [relay.malindalakshan.com]`,
        `> Establishing secure TLS 1.3 handshake...`,
        `> Key exchange verified. (ECDHE-ECDSA-AES128-GCM-SHA256)`,
        `> Packaging message payload (Sender: ${emailVal})...`,
        `> Encrypting message bytes with AES-GCM-256...`,
        `> Transmission buffer streaming: [████████████████] 100%`,
        `> Synapses fire: routing message to primary cognitive cluster...`,
        `> Server response: 200 OK (Packet ID: ML-${Math.floor(1000 + Math.random() * 9000)})`,
        `guest@malinda-ai:~# echo "Transmission successful! Thanks, ${nameVal}."`
      ];

      let cmdIndex = 0;
      function printCommand() {
        if (cmdIndex < commands.length) {
          const logLine = document.createElement('div');
          logLine.textContent = commands[cmdIndex];
          
          // Color command prompts differently
          if (commands[cmdIndex].startsWith('guest@')) {
            logLine.style.color = '#d80706';
          } else if (commands[cmdIndex].includes('successful') || commands[cmdIndex].includes('OK')) {
            logLine.style.color = '#22c55e';
          }
          
          terminalLogs.appendChild(logLine);
          cmdIndex++;
          
          // Scroll to bottom
          terminalLogs.scrollTop = terminalLogs.scrollHeight;
          
          setTimeout(printCommand, 600 + Math.random() * 400);
        } else {
          // Success completed! Hide terminal and display success card in form after 2 seconds
          setTimeout(() => {
            terminalOverlay.classList.remove('active');
            contactForm.innerHTML = `
              <div class="glass-card glow-border" style="text-align: center; border-color: #22c55e; padding: 3rem 1.5rem;">
                <div style="font-size: 3rem; color: #22c55e; margin-bottom: 1.5rem;">✓</div>
                <h3 style="color: #ffffff; margin-bottom: 1rem;">Message Successfully Routed!</h3>
                <p style="color: var(--text-secondary);">Thank you, <strong>${nameVal}</strong>. Your transmission has been integrated into my database. I will respond to your node shortly.</p>
                <button onclick="window.location.reload()" class="btn btn-secondary" style="margin-top: 2rem;">Send Another Transmission</button>
              </div>
            `;
          }, 1500);
        }
      }

      setTimeout(printCommand, 300);
    });
  }
});



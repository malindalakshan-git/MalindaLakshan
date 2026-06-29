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
  const navOverlay = document.getElementById('nav-overlay');
  const htmlEl = document.documentElement;

  function toggleNav(open) {
    const isActive = open !== undefined ? open : !navMenu.classList.contains('active');
    navMenu.classList.toggle('active', isActive);
    hamburger.classList.toggle('active', isActive);
    if (navOverlay) navOverlay.classList.toggle('active', isActive);
    htmlEl.classList.toggle('nav-open', isActive);
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => toggleNav());

    // Close menu when overlay is clicked
    if (navOverlay) {
      navOverlay.addEventListener('click', () => toggleNav(false));
    }

    // Close menu when link is clicked
    document.querySelectorAll('.nav-item a').forEach(link => {
      link.addEventListener('click', () => toggleNav(false));
    });
  }

  // Set theme toggle label for mobile sidebar
  if (themeToggle) {
    function updateToggleLabel() {
      const theme = document.documentElement.getAttribute('data-theme');
      themeToggle.setAttribute('data-label', theme === 'light' ? 'Switch to Dark' : 'Switch to Light');
    }
    updateToggleLabel();
    themeToggle.addEventListener('click', updateToggleLabel);
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

  // Function to animate skill fills (legacy - kept for observer compatibility)
  function animateSkillBars() {
    // Skills are now displayed as glass cards — no animation needed
  }

  // 6. Contact Form - Terminal & Web3Forms Submission
  const contactForm = document.getElementById('contact-form');
  const terminalOverlay = document.getElementById('terminal-overlay');
  const terminalLogs = document.getElementById('terminal-logs');

  if (contactForm && terminalOverlay && terminalLogs) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('contact-name').value.trim();
      const emailVal = document.getElementById('contact-email').value.trim();
      const msgVal = document.getElementById('contact-message').value.trim();

      if (!nameVal || !emailVal || !msgVal) return;

      // Show terminal overlay
      terminalOverlay.classList.add('active');
      terminalLogs.innerHTML = '';

      const commands = [
        `guest@malinda-ai:~# send-mail --to malinda`,
        `> Resolving mail node target... OK [relay.web3forms.com]`,
        `> Establishing secure TLS 1.3 handshake...`,
        `> Key exchange verified. (ECDHE-ECDSA-AES128-GCM-SHA256)`,
        `> Packaging message payload (Sender: ${emailVal})...`,
        `> Encrypting message bytes with AES-GCM-256...`,
      ];

      let cmdIndex = 0;
      let animationDone = false;

      function printCommand() {
        if (cmdIndex < commands.length) {
          const logLine = document.createElement('div');
          logLine.textContent = commands[cmdIndex];
          if (commands[cmdIndex].startsWith('guest@')) {
            logLine.style.color = '#d80706';
          } else if (commands[cmdIndex].includes('OK')) {
            logLine.style.color = '#22c55e';
          }
          terminalLogs.appendChild(logLine);
          cmdIndex++;
          terminalLogs.scrollTop = terminalLogs.scrollHeight;
          setTimeout(printCommand, 500 + Math.random() * 300);
        } else {
          animationDone = true;
        }
      }

      setTimeout(printCommand, 300);

      // Send to Web3Forms
      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();

        // Wait for animation to finish
        const checkDone = setInterval(() => {
          if (animationDone) {
            clearInterval(checkDone);

            if (result.success) {
              const successLine = document.createElement('div');
              successLine.textContent = `> Server response: 200 OK (Packet ID: ML-${Math.floor(1000 + Math.random() * 9000)})`;
              successLine.style.color = '#22c55e';
              terminalLogs.appendChild(successLine);

              const finalLine = document.createElement('div');
              finalLine.textContent = `guest@malinda-ai:~# echo "Transmission successful! Thanks, ${nameVal}."`;
              finalLine.style.color = '#d80706';
              terminalLogs.appendChild(finalLine);
              terminalLogs.scrollTop = terminalLogs.scrollHeight;

              setTimeout(() => {
                terminalOverlay.classList.remove('active');
                contactForm.innerHTML = `
                  <div class="glass-card glow-border" style="text-align: center; border-color: #22c55e; padding: 3rem 1.5rem;">
                    <div style="font-size: 3rem; color: #22c55e; margin-bottom: 1.5rem;">✓</div>
                    <h3 style="color: var(--text-primary); margin-bottom: 1rem;">Message Successfully Routed!</h3>
                    <p style="color: var(--text-secondary);">Thank you, <strong>${nameVal}</strong>. Your message has been delivered. I will respond to you shortly.</p>
                    <button onclick="window.location.reload()" class="btn btn-secondary" style="margin-top: 2rem;">Send Another Transmission</button>
                  </div>
                `;
                if (typeof createToast === 'function') createToast('Message sent successfully!', 'success');
              }, 1200);
            } else {
              const errLine = document.createElement('div');
              errLine.textContent = `> ERROR: ${result.message || 'Transmission failed. Please try again.'}`;
              errLine.style.color = '#ef4444';
              terminalLogs.appendChild(errLine);
              terminalLogs.scrollTop = terminalLogs.scrollHeight;

              setTimeout(() => {
                terminalOverlay.classList.remove('active');
                if (typeof createToast === 'function') createToast('Transmission failed. Please try again.', 'error', 5000);
              }, 2500);
            }
          }
        }, 100);
      } catch (err) {
        const checkDone2 = setInterval(() => {
          if (animationDone) {
            clearInterval(checkDone2);
            const errLine = document.createElement('div');
            errLine.textContent = `> NETWORK ERROR: Could not reach mail server. Check your connection.`;
            errLine.style.color = '#ef4444';
            terminalLogs.appendChild(errLine);
            terminalLogs.scrollTop = terminalLogs.scrollHeight;

            setTimeout(() => {
              terminalOverlay.classList.remove('active');
              if (typeof createToast === 'function') createToast('Network error. Check your connection.', 'error', 5000);
            }, 2500);
          }
        }, 100);
      }
    });
  }

  // 7. Scroll Progress Bar
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        progressBar.style.width = (scrollTop / docHeight) * 100 + '%';
      }
    });
  }

  // 8. Back to Top Button
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 9. 3D Card Tilt Effect (disabled on touch devices)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) {
    const tiltCards = document.querySelectorAll('.glass-card, .skill-card, .project-card, .project-node-card');
    tiltCards.forEach(card => {
      card.classList.add('tilt-card-inner');
      const parent = document.createElement('div');
      parent.className = 'tilt-card';
      card.parentNode.insertBefore(parent, card);
      parent.appendChild(card);

      let ticking = false;
      parent.addEventListener('mousemove', (e) => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const rect = parent.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -6;
          const rotateY = ((x - centerX) / centerX) * 6;
          card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
          ticking = false;
        });
      });

      parent.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }

  // 10. Magnetic Button Effect (disabled on touch devices)
  if (!isTouchDevice) {
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .node-btn, .filter-btn');
    magneticBtns.forEach(btn => {
      btn.classList.add('magnetic-btn');
      let ticking = false;
      btn.addEventListener('mousemove', (e) => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const dist = Math.sqrt(x * x + y * y);
          const maxDist = 150;
          if (dist < maxDist) {
            const strength = 0.25;
            const moveX = x * strength;
            const moveY = y * strength;
            btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
          }
          ticking = false;
        });
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // 11. Page Transitions
  const transitionOverlay = document.createElement('div');
  transitionOverlay.className = 'page-transition-overlay';
  transitionOverlay.id = 'page-transition-overlay';
  document.body.appendChild(transitionOverlay);

  document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="mailto"]):not([href^="tel"]):not([href^="javascript"])').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('//')) return;
    link.addEventListener('click', (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      const target = href;
      transitionOverlay.classList.add('active');
      setTimeout(() => {
        window.location.href = target;
      }, 400);
    });
  });

  // 12. Image Clip Reveal
  const revealImages = document.querySelectorAll('.reveal-img');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        imgObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealImages.forEach(img => imgObserver.observe(img));

  // 13. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  // 14. Page Load Entrance Animation
  const entranceElements = document.querySelectorAll('.entrance, .entrance-left, .entrance-right, .entrance-scale');
  if (entranceElements.length > 0) {
    setTimeout(() => {
      entranceElements.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('active');
        }, i * 80);
      });
    }, 150);
  }

  // 15. Toast Notification System
  function createToast(message, type, duration) {
    type = type || 'info';
    duration = duration || 4000;

    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: 'fa-solid fa-check-circle',
      error: 'fa-solid fa-exclamation-circle',
      info: 'fa-solid fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML =
      '<span class="toast-icon"><i class="' + (icons[type] || icons.info) + '"></i></span>' +
      '<span class="toast-message">' + message + '</span>' +
      '<button class="toast-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>';

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));

    if (duration > 0) {
      setTimeout(() => removeToast(toast), duration);
    }

    return toast;
  }

  function removeToast(toast) {
    toast.classList.remove('visible');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  }

  window.createToast = createToast;

  // Hook into contact form success
  const origSuccess = document.querySelector('.terminal-overlay');
  if (!origSuccess) {
    const contactFormEl = document.getElementById('contact-form');
    if (contactFormEl) {
      const origSubmit = contactFormEl._origSubmit;
    }
  }

  // 16. Keyboard Shortcuts
  const shortcutsModal = document.createElement('div');
  shortcutsModal.className = 'shortcuts-modal-overlay';
  shortcutsModal.id = 'shortcuts-modal';
  shortcutsModal.innerHTML =
    '<div class="shortcuts-modal">' +
    '<button class="skills-modal-close" id="shortcuts-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>' +
    '<h3>Keyboard Shortcuts</h3>' +
    '<div class="shortcut-row"><span class="shortcut-desc">Toggle theme</span><span class="shortcut-key">T</span></div>' +
    '<div class="shortcut-row"><span class="shortcut-desc">Close modals</span><span class="shortcut-key">Esc</span></div>' +
    '<div class="shortcut-row"><span class="shortcut-desc">Show shortcuts</span><span class="shortcut-key">?</span></div>' +
    '<div class="shortcut-row"><span class="shortcut-desc">Back to top</span><span class="shortcut-key">Shift + T</span></div>' +
    '</div>';
  document.body.appendChild(shortcutsModal);

  document.getElementById('shortcuts-close').addEventListener('click', () => {
    shortcutsModal.classList.remove('active');
  });

  shortcutsModal.addEventListener('click', (e) => {
    if (e.target === shortcutsModal) shortcutsModal.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 't' || e.key === 'T') {
      if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        document.getElementById('theme-toggle').click();
      }
    }

    if (e.key === '?') {
      e.preventDefault();
      shortcutsModal.classList.toggle('active');
      document.body.style.overflow = shortcutsModal.classList.contains('active') ? 'hidden' : '';
    }

    if (e.key === 'Escape') {
      shortcutsModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // 17. Image Load Effect
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.filter = 'blur(10px)';
    img.style.opacity = '0.5';
    if (img.complete) {
      img.classList.add('loaded');
      img.style.filter = 'none';
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
        img.style.filter = 'none';
        img.style.opacity = '1';
      });
    }
  });
});



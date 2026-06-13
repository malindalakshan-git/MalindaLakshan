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
  const revealElements = document.querySelectorAll('.reveal');
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

  // 6. Interactive Neural Network Playground
  initNeuralPlayground();

  // 7. Contact Form - Terminal Success Animation
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

// Neural Network Interactive Widget Logic
function initNeuralPlayground() {
  const nnNodes = document.querySelectorAll('.nn-node');
  const nnLines = document.querySelectorAll('.synapse-line');
  const triggerBtn = document.getElementById('nn-trigger-btn');
  const backpropBtn = document.getElementById('nn-backprop-btn');
  const logPanel = document.getElementById('nn-log-text');
  
  if (!logPanel) return;

  function updateLog(message) {
    logPanel.textContent = `[SYSTEM] ${message}`;
  }

  // Connect SVG synapses dynamic attributes
  const linesGroup = {
    // Hidden layer activations triggered by Input layer
    'i1': ['line-i1-h1', 'line-i1-h2', 'line-i1-h3'],
    'i2': ['line-i2-h1', 'line-i2-h2', 'line-i2-h3', 'line-i2-h4'],
    'i3': ['line-i3-h2', 'line-i3-h3', 'line-i3-h4'],
    
    // Output activations triggered by Hidden layer
    'h1': ['line-h1-o1'],
    'h2': ['line-h2-o1', 'line-h2-o2'],
    'h3': ['line-h3-o1', 'line-h3-o2'],
    'h4': ['line-h4-o2'],
  };

  const hiddenToOutputs = ['line-h1-o1', 'line-h2-o1', 'line-h2-o2', 'line-h3-o1', 'line-h3-o2', 'line-h4-o2'];

  nnNodes.forEach(node => {
    node.addEventListener('click', () => {
      const nodeId = node.getAttribute('data-id');
      activateNodeSequence(nodeId);
    });
  });

  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      // Trigger random inputs sequentially
      let count = 0;
      updateLog("Starting batch inference simulation...");
      const interval = setInterval(() => {
        const inputs = ['i1', 'i2', 'i3'];
        const randomInput = inputs[Math.floor(Math.random() * inputs.length)];
        const inputNode = document.querySelector(`.nn-node[data-id="${randomInput}"]`);
        
        if (inputNode) {
          inputNode.classList.add('active');
          setTimeout(() => inputNode.classList.remove('active'), 500);
          activateNodeSequence(randomInput, true);
        }
        
        count++;
        if (count >= 3) {
          clearInterval(interval);
          setTimeout(() => {
            updateLog("Batch inference completed. Model prediction accuracy stable.");
          }, 1500);
        }
      }, 600);
    });
  }

  if (backpropBtn) {
    backpropBtn.addEventListener('click', () => {
      updateLog("Initiating backward propagation. Calculating loss gradients...");
      
      // Flash output nodes
      const o1 = document.querySelector('.nn-node[data-id="o1"]');
      const o2 = document.querySelector('.nn-node[data-id="o2"]');
      o1.classList.add('active');
      o2.classList.add('active');
      
      // Pulse synapses backward
      hiddenToOutputs.forEach(lineId => {
        const line = document.getElementById(lineId);
        if (line) {
          line.classList.add('active-purple');
          setTimeout(() => line.classList.remove('active-purple'), 1200);
        }
      });
      
      setTimeout(() => {
        o1.classList.remove('active');
        o2.classList.remove('active');
        
        // Pulse hidden to input
        ['line-i1-h1', 'line-i1-h2', 'line-i1-h3', 'line-i2-h1', 'line-i2-h2', 'line-i2-h3', 'line-i2-h4', 'line-i3-h2', 'line-i3-h3', 'line-i3-h4'].forEach(lineId => {
          const line = document.getElementById(lineId);
          if (line) {
            line.classList.add('active-purple');
            setTimeout(() => line.classList.remove('active-purple'), 1000);
          }
        });
        
        // Highlight inputs
        document.querySelectorAll('.nn-layer:first-child .nn-node').forEach(node => {
          node.classList.add('active');
          setTimeout(() => node.classList.remove('active'), 600);
        });
        
        updateLog("Gradient descent optimization complete. System loss minimized to 0.0194.");
      }, 800);
    });
  }

  function activateNodeSequence(nodeId, silentLog = false) {
    const nodeEl = document.querySelector(`.nn-node[data-id="${nodeId}"]`);
    if (!nodeEl) return;
    
    // Pulse clicked node
    nodeEl.classList.add('active');
    setTimeout(() => nodeEl.classList.remove('active'), 500);

    if (!silentLog) {
      updateLog(`Manual node activation: ${nodeId.toUpperCase()}. Propagating signals...`);
    }

    // Is it input layer?
    if (nodeId.startsWith('i')) {
      const activeLines = linesGroup[nodeId] || [];
      activeLines.forEach(lineId => {
        const line = document.getElementById(lineId);
        if (line) {
          line.classList.add('active');
          setTimeout(() => line.classList.remove('active'), 1000);
        }
      });

      // Activate Hidden Layer nodes shortly after
      setTimeout(() => {
        // Find which hidden nodes are connected to this input and light them up
        let targets = [];
        if (nodeId === 'i1') targets = ['h1', 'h2', 'h3'];
        if (nodeId === 'i2') targets = ['h1', 'h2', 'h3', 'h4'];
        if (nodeId === 'i3') targets = ['h2', 'h3', 'h4'];
        
        targets.forEach(hId => {
          const hNode = document.querySelector(`.nn-node[data-id="${hId}"]`);
          if (hNode) {
            hNode.classList.add('active');
            setTimeout(() => hNode.classList.remove('active'), 500);
            
            // Forward from hidden to output
            const nextLines = linesGroup[hId] || [];
            nextLines.forEach(lineId => {
              const line = document.getElementById(lineId);
              if (line) {
                setTimeout(() => {
                  line.classList.add('active');
                  setTimeout(() => line.classList.remove('active'), 800);
                }, 100);
              }
            });
          }
        });
        
        // Finally activate Output Layer nodes
        setTimeout(() => {
          const outputs = ['o1', 'o2'];
          outputs.forEach(oId => {
            const oNode = document.querySelector(`.nn-node[data-id="${oId}"]`);
            if (oNode) {
              oNode.classList.add('active');
              setTimeout(() => oNode.classList.remove('active'), 500);
            }
          });
          if (!silentLog) {
            updateLog(`Forward propagation finished. Output: Y = [${(Math.random() * 0.3 + 0.7).toFixed(3)}, ${(Math.random() * 0.1).toFixed(3)}]`);
          }
        }, 600);

      }, 400);
    }
    
    // Is it hidden layer?
    else if (nodeId.startsWith('h')) {
      const activeLines = linesGroup[nodeId] || [];
      activeLines.forEach(lineId => {
        const line = document.getElementById(lineId);
        if (line) {
          line.classList.add('active');
          setTimeout(() => line.classList.remove('active'), 800);
        }
      });
      
      setTimeout(() => {
        let targets = [];
        if (nodeId === 'h1') targets = ['o1'];
        if (nodeId === 'h2') targets = ['o1', 'o2'];
        if (nodeId === 'h3') targets = ['o1', 'o2'];
        if (nodeId === 'h4') targets = ['o2'];
        
        targets.forEach(oId => {
          const oNode = document.querySelector(`.nn-node[data-id="${oId}"]`);
          if (oNode) {
            oNode.classList.add('active');
            setTimeout(() => oNode.classList.remove('active'), 500);
          }
        });
      }, 300);
    }
  }
}

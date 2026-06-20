/**
 * Sadda Adda Café Premium Interactive JS Engine
 * Features: custom cursor, particle engine, typewriter text, masonry lightbox, menu filters, Shopping Cart (localStorage)
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  initLoader();
  initCustomCursor();
  initParticles();
  initTypewriter();
  initMobileMenu();
  initScrollReveal();
  initGalleryFilter();
  initLightbox();
  initMenuFilters();
  initCartSystem();
  initContactForm();
  stickyHeader();
  initWhatsAppFloatingButton();
  initClickSounds();
});

// 1. Premium Loader Custom Handler
function initLoader() {
  const loader = document.getElementById('loader-screen');
  if (loader) {
    // Force a 1.2s aesthetic display duration or trigger on window load
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 800);
    });
    // Fallback if window already loaded
    if (document.readyState === 'complete') {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 1000);
    }
  }
}

// 2. Custom Gaming Cursor Engine
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');
  
  if (!cursor || !follower) return;

  // Track coordinates
  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Exact inner dot tracking
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Smooth lag/easing for follower ring
  function updateFollower() {
    const ease = 0.15; // smooth lag factor
    followerX += (mouseX - followerX) * ease;
    followerY += (mouseY - followerY) * ease;
    
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    
    requestAnimationFrame(updateFollower);
  }
  updateFollower();

  // Add hover effect states for a, button, input elements
  const hoverables = document.querySelectorAll('a, button, .qty-btn, select, input, textarea, .gallery-item, .dish-card');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
}

// 3. Floating Background Interactive Particles Canvas
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(65, Math.floor((width * height) / 25000)); // Adaptive count

  const colors = [
    'rgba(157, 78, 221, 0.45)', // Purple glow
    'rgba(0, 180, 216, 0.45)',  // Blue glow
    'rgba(255, 0, 127, 0.35)',  // Pink glow
  ];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 2.8 + 1;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.5 + 0.2;
      this.alphaSpeed = Math.random() * 0.005 + 0.002;
      this.alphaDirection = 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Handle bounce boundary
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Fade pulsation
      this.alpha += this.alphaSpeed * this.alphaDirection;
      if (this.alpha > 0.85 || this.alpha < 0.15) {
        this.alphaDirection *= -1;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color.replace('0.45', this.alpha).replace('0.35', this.alpha);
      ctx.shadowBlur = Math.random() * 8 + 4;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  // Create pool
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Resize listener
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);
    // Remove shadow blur configuration from canvas context to avoid heavy overhead
    ctx.shadowBlur = 0;
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// 4. Cool Dynamic Typing/Spelling Animation
function initTypewriter() {
  const target = document.querySelector('.typed-text');
  if (!target) return;
  
  const words = JSON.parse(target.getAttribute('data-words') || '["SADDA ADDA", "BURGER LAND", "GAMERS HANGOUT"]');
  let wordIndex = 0;
  let letterIndex = 0;
  let isDeleting = false;
  let currentText = '';

  function type() {
    const fullWord = words[wordIndex];
    
    if (isDeleting) {
      currentText = fullWord.substring(0, currentText.length - 1);
    } else {
      currentText = fullWord.substring(0, currentText.length + 1);
    }

    target.textContent = currentText;

    let typeSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && currentText === fullWord) {
      // Pause at complete word
      typeSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && currentText === '') {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 400; // Small delay before starting next word
    }

    setTimeout(type, typeSpeed);
  }
  
  // Launch loop
  setTimeout(type, 500);
}

// 5. Mobile Navbar Menu Toggle
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
}

// 6. Intersection Scroll Reveal System (Parallax effect triggers)
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observerOptions = {
    root: null,
    threshold: 0.10, // reveal once 10% is in viewport
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // stop observing after animation
      }
    });
  }, observerOptions);

  reveals.forEach(el => {
    revealObserver.observe(el);
  });
}

// 7. Masonry Gallery Category Filtering
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length === 0 || galleryItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const categories = item.getAttribute('data-category').split(' ');
        if (filterVal === 'all' || categories.includes(filterVal)) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.85)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// 8. Gallery Lightbox Modal Popup System
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!lightbox || !lightboxClose) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-title')?.textContent || '';
      const category = item.querySelector('.gallery-category')?.textContent || '';

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxCaption) {
          lightboxCaption.innerHTML = `<span style="color:#00b4d8">${category}</span> - ${title}`;
        }
        lightbox.classList.add('active');
      }
    });
  });

  // Close triggers
  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
    }
  });
}

// 9. Interactive Menu Search and Category Filtering system
function initMenuFilters() {
  const searchBar = document.getElementById('menu-search');
  const categoryFilters = document.querySelectorAll('.menu-filter-btn');
  const sortSelect = document.getElementById('menu-sort');
  const productsGrid = document.getElementById('products-grid');

  if (!productsGrid) return; // Only on menu.html

  // Active filters tracker
  let searchTerm = '';
  let activeCategory = 'all';
  let activeSort = 'featured';

  function filterAndSortProducts() {
    const products = Array.from(productsGrid.querySelectorAll('.dish-card'));

    products.forEach(prod => {
      const name = prod.querySelector('.dish-title').textContent.toLowerCase();
      const desc = prod.querySelector('.dish-desc').textContent.toLowerCase();
      const cat = prod.getAttribute('data-category');
      
      const matchSearch = name.includes(searchTerm) || desc.includes(searchTerm);
      const matchCategory = activeCategory === 'all' || cat === activeCategory;

      if (matchSearch && matchCategory) {
        prod.style.display = 'block';
        setTimeout(() => {
          prod.style.opacity = '1';
          prod.style.transform = 'translateY(0)';
        }, 10);
      } else {
        prod.style.opacity = '0';
        prod.style.transform = 'translateY(15px)';
        setTimeout(() => {
          prod.style.display = 'none';
        }, 200);
      }
    });

    // Execute sorting
    setTimeout(() => {
      const visibleProducts = products.filter(p => p.style.display !== 'none');
      
      if (activeSort === 'low-to-high') {
        visibleProducts.sort((a, b) => parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price')));
      } else if (activeSort === 'high-to-low') {
        visibleProducts.sort((a, b) => parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price')));
      } else {
        // 'featured' resets back to original sorting sequence via item index
        visibleProducts.sort((a, b) => parseInt(a.getAttribute('data-index')) - parseInt(b.getAttribute('data-index')));
      }

      // Re-append in correct DOM order
      visibleProducts.forEach(el => productsGrid.appendChild(el));
    }, 220);
  }

  if (searchBar) {
    searchBar.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      filterAndSortProducts();
    });
  }

  if (categoryFilters) {
    categoryFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-filter');
        filterAndSortProducts();
      });
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      filterAndSortProducts();
    });
  }
}

// 10. Robust LocalStorage Shopping Cart Engine
function initCartSystem() {
  const getCart = () => JSON.parse(localStorage.getItem('sadda_adda_cart') || '[]');
  const saveCart = (cart) => {
    localStorage.setItem('sadda_adda_cart', JSON.stringify(cart));
    updateCartCountBadge();
  };

  // Update navbar count indicator badge
  function updateCartCountBadge() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
  updateCartCountBadge();

  // Add event listener to standard "Add to Cart" triggers
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-add-cart');
    if (!btn) return;

    const id = btn.getAttribute('data-id');
    const name = btn.getAttribute('data-name');
    const price = parseFloat(btn.getAttribute('data-price'));
    const img = btn.getAttribute('data-img');

    if (!id || !name) return;

    let cart = getCart();
    const existing = cart.find(item => item.id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, img, quantity: 1 });
    }

    saveCart(cart);

    // Visual sweet button feedback
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="lucide-check text-xs"></i> Added!';
    btn.style.backgroundColor = '#00b4d8';
    btn.style.borderColor = '#00b4d8';
    btn.style.boxShadow = '0 0 15px rgba(0, 180, 216, 0.7)';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.backgroundColor = '';
      btn.style.borderColor = '';
      btn.style.boxShadow = '';
    }, 1500);
  });

  // Cart page specific calculations and markup rendering
  const cartGrid = document.getElementById('cart-items-grid');
  if (cartGrid) {
    renderCartPage();
  }

  function renderCartPage() {
    const cart = getCart();
    const emptyState = document.getElementById('cart-empty');
    const summaryPanel = document.getElementById('cart-summary');
    
    if (cart.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (summaryPanel) summaryPanel.style.display = 'none';
      cartGrid.innerHTML = '';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (summaryPanel) summaryPanel.style.display = 'block';

    cartGrid.innerHTML = cart.map(item => `
      <div class="cart-item-row reveal active" data-id="${item.id}">
        <img class="cart-item-img" src="${item.img}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>₹${item.price.toFixed(2)}</p>
        </div>
        <div>
          <div class="qty-adjuster">
            <button class="qty-btn qty-minus" data-id="${item.id}">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="cart-item-total text-right">
          ₹${(item.price * item.quantity).toFixed(2)}
        </div>
        <div class="text-center">
          <button class="cart-item-remove" data-id="${item.id}">
            <i class="lucide-trash-2 w-5 h-5"></i>
          </button>
        </div>
      </div>
    `).join('');

    calculateCartTotals();
    bindCartAdjustmentActions();
  }

  function calculateCartTotals() {
    const cart = getCart();
    const subtotalEl = document.getElementById('summary-subtotal');
    const discountEl = document.getElementById('summary-discount');
    const totalEl = document.getElementById('summary-total');

    if (!subtotalEl || !totalEl) return;

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    // Custom discount if subtotal exceeds ₹500
    const discount = subtotal > 499 ? subtotal * 0.1 : 0; 
    const finalTotal = subtotal - discount;

    subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `- ₹${discount.toFixed(2)}`;
    totalEl.textContent = `₹${finalTotal.toFixed(2)}`;
  }

  function bindCartAdjustmentActions() {
    // Plus/Minus Quantity adjustment
    const plusBtns = cartGrid.querySelectorAll('.qty-plus');
    const minusBtns = cartGrid.querySelectorAll('.qty-minus');
    const removeBtns = cartGrid.querySelectorAll('.cart-item-remove');

    plusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        let cart = getCart();
        const item = cart.find(i => i.id === id);
        if (item) {
          item.quantity += 1;
          saveCart(cart);
          renderCartPage();
        }
      });
    });

    minusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        let cart = getCart();
        const item = cart.find(i => i.id === id);
        if (item) {
          item.quantity -= 1;
          if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
          }
          saveCart(cart);
          renderCartPage();
        }
      });
    });

    removeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        let cart = getCart();
        cart = cart.filter(i => i.id !== id);
        saveCart(cart);
        renderCartPage();
      });
    });

    // Checkout Form processing placeholder interaction with real WhatsApp transmission
    const checkoutBtn = document.getElementById('btn-checkout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        let cart = getCart();
        if (!cart || cart.length === 0) {
          alert('⚠️ Your checkout list is empty! Add active dishes first.');
          return;
        }

        const total = cart.reduce((tot, item) => tot + (item.price * item.quantity), 0);
        
        // Show success visual trigger
        const originalText = checkoutBtn.textContent;
        checkoutBtn.innerHTML = '<i class="lucide-loader-2 animate-spin w-5 h-5 mr-2"></i> Formatting Order...';
        checkoutBtn.style.background = 'linear-gradient(135deg, #00b4d8, #0077b6)';
        
        setTimeout(() => {
          checkoutBtn.innerHTML = '<i class="lucide-party-popper w-5 h-5 mr-2"></i> Connecting WhatsApp...';
          checkoutBtn.style.background = 'linear-gradient(135deg, #2b9348, #55a630)';
          checkoutBtn.style.boxShadow = '0 0 25px rgba(85, 166, 48, 0.6)';
          
          // Structure beautiful order message template
          let orderItemsText = cart.map(item => `• *${item.name}* (Qty: ${item.quantity}) -> ₹${(item.price * item.quantity).toFixed(2)}`).join('\n');
          const finalTotalMessage = `🔥 *SADDA ADDA REWARI - NEW FEAST ORDER* 🔥\n\n` +
                                   `🍔 *Ordered Items:*\n${orderItemsText}\n\n` +
                                   `💰 *Grand Total:* ₹${total.toFixed(2)}\n` +
                                   `📍 *Location:* Sadda Adda Lounge, Ganpat Nagar, Rewari\n\n` +
                                   `⚡ _Aao Kabhi Adde Pe! Please confirm my order items!_`;
          
          const waOrderURL = `https://wa.me/919034341114?text=${encodeURIComponent(finalTotalMessage)}`;
          
          // Security dynamic routing
          alert(`🎉 Feasting order structured! Opening secure WhatsApp gateway to place order for ₹${total.toFixed(2)}.`);
          
          // Redirect securely to WhatsApp
          window.open(waOrderURL, '_blank');
          
          // Clear Cart data
          localStorage.removeItem('sadda_adda_cart');
          saveCart([]);
          
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 300);
        }, 1200);
      });
    }
  }
}

// 11. Premium Contact Form Validations, fully linked securely to WhatsApp Number
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Escape and sanitize inputs against injection vulnerabilities (XSS)
    const rawName = document.getElementById('form-name').value;
    const rawPhone = document.getElementById('form-phone').value;
    const rawEmail = document.getElementById('form-email').value;
    const rawMessage = document.getElementById('form-message').value;

    const name = rawName.replace(/[&<>"']/g, '').trim();
    const phone = rawPhone.replace(/[&<>"']/g, '').trim();
    const email = rawEmail.replace(/[&<>"']/g, '').trim();
    const message = rawMessage.replace(/[&<>"']/g, '').trim();

    if (!name || !phone || !email || !message) {
      alert('⚠️ Please complete all form inputs to send message.');
      return;
    }

    // Success response styling
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="lucide-sparkles mr-2 animate-pulse"></i> Preparing Dispatch...';
    submitBtn.style.background = 'linear-gradient(135deg, #00b4d8, #0077b6)';
    submitBtn.style.boxShadow = '0 0 25px rgba(0, 180, 216, 0.6)';

    // Compile beautiful Dispatch text template
    const dispatchMessageText = `🔥 *SADDA ADDA DISPATCH MESSAGE* 🔥\n\n` +
                                `👤 *Sender:* ${name}\n` +
                                `📞 *Phone:* ${phone}\n` +
                                `✉️ *Email:* ${email}\n` +
                                `💬 *Message:* ${message}\n\n` +
                                `📍 _Submitted from SADDA ADDA Web Gateway_`;

    const waURL = `https://wa.me/919034341114?text=${encodeURIComponent(dispatchMessageText)}`;

    setTimeout(() => {
      alert(`🤘 Greetings ${name}! Opening secure WhatsApp portal to deliver your message straight to Sadda Adda Rewari.`);
      window.open(waURL, '_blank');
      form.reset();

      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      submitBtn.style.boxShadow = '';
    }, 1000);
  });
}

// 12. Floating Action WhatsApp Button Injector (Secure dynamic inclusion everywhere)
function initWhatsAppFloatingButton() {
  if (document.getElementById('whatsapp-floating-btn')) return;

  const btn = document.createElement('a');
  btn.id = 'whatsapp-floating-btn';
  btn.className = 'whatsapp-float';
  btn.href = 'https://wa.me/919034341114';
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.title = 'Aao Kabhi Adde Pe! - WhatsApp Sadda Adda';
  btn.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';

  document.body.appendChild(btn);
}

// 12. Sticky Header scroll styling
function stickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// 13. Dynamic Web Audio API Synth Sound effect generator (Halka mild premium click)
function playClickSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Delectable futuristic premium high-pitch soft transient click sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, audioCtx.currentTime); // 650Hz initial pitch
    osc.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.08); // sweeps quickly down to 320Hz
    
    // Extremely subtle, quiet, non-obtrusive (halka halka click tone)
    gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08); // decays instantly
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.09);
  } catch (e) {
    // Fail silently is audio block states exist
  }
}

// Global click event dispatcher for interactive option click sounds
function initClickSounds() {
  document.addEventListener('click', (e) => {
    const el = e.target;
    // Activate sound whenever links, buttons, filters, categories or headers are tapped
    if (
      el.closest('a') || 
      el.closest('button') || 
      el.closest('.filter-btn') || 
      el.closest('.menu-filter-btn') || 
      el.closest('.hamburger') || 
      el.closest('.nav-link') ||
      el.closest('.dish-card')
    ) {
      playClickSound();
    }
  });
}


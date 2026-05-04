/* ========================================
   SHIV KHERA - MAIN JAVASCRIPT
   ======================================== */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  LoadingScreen.init();
  Navigation.init();
  ScrollProgress.init();
  BackToTop.init();
  Animations.init();
  TestimonialSlider.init();
  FAQ.init();
  
  // Initialize Three.js hero if on home page
  if (document.getElementById('hero-canvas')) {
    HeroAnimation.init();
  }
});

/* ========================================
   LOADING SCREEN
   ======================================== */
const LoadingScreen = {
  init() {
    this.screen = document.querySelector('.loading-screen');
    if (this.screen) {
      setTimeout(() => {
        this.screen.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }, 2500);
    }
  }
};

/* ========================================
   NAVIGATION
   ======================================== */
const Navigation = {
  init() {
    this.nav = document.querySelector('.nav');
    this.toggle = document.querySelector('.nav-toggle');
    this.links = document.querySelector('.nav-links');
    
    if (!this.nav) return;
    
    // Scroll effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }
    });
    
    // Mobile toggle
    if (this.toggle) {
      this.toggle.addEventListener('click', () => {
        this.links.classList.toggle('active');
        this.toggle.classList.toggle('active');
      });
    }
    
    // Close mobile menu on link click
    const linkItems = this.links?.querySelectorAll('a');
    linkItems?.forEach(link => {
      link.addEventListener('click', () => {
        this.links.classList.remove('active');
        this.toggle?.classList.remove('active');
      });
    });
  }
};

/* ========================================
   SCROLL PROGRESS
   ======================================== */
const ScrollProgress = {
  init() {
    this.bar = document.createElement('div');
    this.bar.className = 'scroll-progress';
    document.body.appendChild(this.bar);
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      this.bar.style.transform = `scaleX(${progress / 100})`;
    });
  }
};

/* ========================================
   BACK TO TOP
   ======================================== */
const BackToTop = {
  init() {
    this.button = document.createElement('button');
    this.button.className = 'back-to-top';
    this.button.innerHTML = '↑';
    this.button.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(this.button);
    
    this.button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        this.button.classList.add('visible');
      } else {
        this.button.classList.remove('visible');
      }
    });
  }
};

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */
const Animations = {
  init() {
    this.elements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    this.elements.forEach(el => observer.observe(el));
    
    // Counter animations
    this.initCounters();
  },
  
  initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.target);
          const duration = 2000;
          const increment = target / (duration / 16);
          let current = 0;
          
          const updateCounter = () => {
            current += increment;
            if (current < target) {
              counter.textContent = Math.floor(current).toLocaleString();
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target.toLocaleString();
            }
          };
          
          updateCounter();
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
  }
};

/* ========================================
   TESTIMONIAL SLIDER
   ======================================== */
const TestimonialSlider = {
  init() {
    this.track = document.querySelector('.testimonial-track');
    this.dots = document.querySelectorAll('.testimonial-dot');
    this.cards = document.querySelectorAll('.testimonial-card');
    
    if (!this.track || this.cards.length === 0) return;
    
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    
    // Set up dots
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Start autoplay
    this.startAutoPlay();
    
    // Pause on hover
    this.track.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.track.addEventListener('mouseleave', () => this.startAutoPlay());
  },
  
  goToSlide(index) {
    this.currentIndex = index;
    this.track.style.transform = `translateX(-${index * 100}%)`;
    
    this.dots.forEach(dot => dot.classList.remove('active'));
    this.dots[index]?.classList.add('active');
  },
  
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
    this.goToSlide(this.currentIndex);
  },
  
  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
  },
  
  stopAutoPlay() {
    clearInterval(this.autoPlayInterval);
  }
};

/* ========================================
   FAQ ACCORDION
   ======================================== */
const FAQ = {
  init() {
    this.items = document.querySelectorAll('.faq-item');
    
    this.items.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => this.toggle(item));
      }
    });
  },
  
  toggle(item) {
    const isActive = item.classList.contains('active');
    
    // Close all items
    this.items.forEach(i => i.classList.remove('active'));
    
    // Open clicked item if it wasn't active
    if (!isActive) {
      item.classList.add('active');
    }
  }
};

/* ========================================
   HERO ANIMATION (Three.js)
   ======================================== */
const HeroAnimation = {
  init() {
    this.canvas = document.getElementById('hero-canvas');
    if (!this.canvas) return;
    
    // Scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Camera position
    this.camera.position.z = 30;
    
    // Create particles
    this.particles = [];
    const particleCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;
      
      // Color (white to gray gradient)
      const colorValue = 0.5 + Math.random() * 0.5;
      colors[i] = colorValue;
      colors[i + 1] = colorValue;
      colors[i + 2] = colorValue;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
    
    // Add geometric shapes
    this.shapes = [];
    const shapeGeometries = [
      new THREE.IcosahedronGeometry(2, 0),
      new THREE.OctahedronGeometry(2, 0),
      new THREE.TetrahedronGeometry(2, 0)
    ];
    
    const shapeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    
    for (let i = 0; i < 15; i++) {
      const geometry = shapeGeometries[Math.floor(Math.random() * shapeGeometries.length)];
      const shape = new THREE.Mesh(geometry, shapeMaterial);
      
      shape.position.x = (Math.random() - 0.5) * 80;
      shape.position.y = (Math.random() - 0.5) * 80;
      shape.position.z = (Math.random() - 0.5) * 40 - 10;
      
      shape.rotation.x = Math.random() * Math.PI;
      shape.rotation.y = Math.random() * Math.PI;
      
      shape.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01
        }
      };
      
      this.scene.add(shape);
      this.shapes.push(shape);
    }
    
    // Mouse interaction
    this.mouseX = 0;
    this.mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Handle resize
    window.addEventListener('resize', () => this.onResize());
    
    // Start animation
    this.animate();
  },
  
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  },
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Rotate particle system
    this.particleSystem.rotation.y += 0.0005;
    this.particleSystem.rotation.x += 0.0002;
    
    // Mouse influence
    this.particleSystem.rotation.y += this.mouseX * 0.001;
    this.particleSystem.rotation.x += this.mouseY * 0.001;
    
    // Animate shapes
    this.shapes.forEach(shape => {
      shape.rotation.x += shape.userData.rotationSpeed.x;
      shape.rotation.y += shape.userData.rotationSpeed.y;
    });
    
    this.renderer.render(this.scene, this.camera);
  }
};

/* ========================================
   FORM HANDLING
   ======================================== */
document.querySelectorAll('.contact-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    submitBtn.textContent = 'Message Sent!';
    submitBtn.style.background = '#ffffff';
    submitBtn.style.color = '#0a0a0a';
    
    form.reset();
    
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = '';
      submitBtn.style.color = '';
    }, 3000);
  });
});

/* ========================================
   NEWSLETTER FORM
   ======================================== */
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    submitBtn.textContent = 'Subscribed!';
    form.reset();
    
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 3000);
  });
});

/* ========================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

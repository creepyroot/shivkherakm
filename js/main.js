/**
 * Shiv Khera - Main JavaScript
 * 3D Effects, Animations, and Interactions
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Loader.init();
    Navigation.init();
    ThreeHero.init();
    ScrollAnimations.init();
    Counters.init();
    MobileMenu.init();
});

/**
 * Loading Screen Module
 */
const Loader = {
    init() {
        this.loader = document.querySelector('.loader');
        if (this.loader) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.loader.classList.add('hidden');
                }, 1500);
            });
        }
    }
};

/**
 * Navigation Module
 */
const Navigation = {
    init() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        if (this.navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    this.navbar.classList.add('scrolled');
                } else {
                    this.navbar.classList.remove('scrolled');
                }
            });
        }
        
        // Active link highlighting
        this.highlightActiveLink();
    },
    
    highlightActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 200;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
};

/**
 * Three.js Hero Background
 */
const ThreeHero = {
    init() {
        this.canvas = document.querySelector('#hero-canvas');
        if (!this.canvas) return;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create particles
        this.createParticles();
        this.createGeometries();
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xc9a962, 1);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
        
        this.camera.position.z = 50;
        
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
    
    createParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 200;
            positions[i + 1] = (Math.random() - 0.5) * 200;
            positions[i + 2] = (Math.random() - 0.5) * 200;
            
            colors[i] = 0.8;
            colors[i + 1] = 0.7;
            colors[i + 2] = 0.4;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);
    },
    
    createGeometries() {
        this.geometries = [];
        
        // Create floating geometric shapes
        const geometriesTypes = [
            new THREE.IcosahedronGeometry(2, 0),
            new THREE.OctahedronGeometry(2, 0),
            new THREE.TetrahedronGeometry(2, 0)
        ];
        
        const material = new THREE.MeshPhongMaterial({
            color: 0xc9a962,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        for (let i = 0; i < 15; i++) {
            const geometry = geometriesTypes[Math.floor(Math.random() * geometriesTypes.length)];
            const mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.x = (Math.random() - 0.5) * 100;
            mesh.position.y = (Math.random() - 0.5) * 100;
            mesh.position.z = (Math.random() - 0.5) * 50 - 25;
            
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.5 + 0.5,
                floatOffset: Math.random() * Math.PI * 2
            };
            
            this.scene.add(mesh);
            this.geometries.push(mesh);
        }
    },
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Rotate particles
        if (this.particles) {
            this.particles.rotation.y = time * 0.05;
            this.particles.rotation.x = this.mouseY * 0.1;
            this.particles.rotation.y += this.mouseX * 0.1;
        }
        
        // Animate geometries
        this.geometries.forEach((mesh, index) => {
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;
            mesh.position.y += Math.sin(time * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 0.02;
        });
        
        this.renderer.render(this.scene, this.camera);
    }
};

/**
 * Scroll Animations Module
 */
const ScrollAnimations = {
    init() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, this.observerOptions);
        
        // Observe elements
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        animateElements.forEach(el => this.observer.observe(el));
    }
};

/**
 * Counter Animation Module
 */
const Counters = {
    init() {
        this.counters = document.querySelectorAll('.stat-number[data-count]');
        
        if (this.counters.length === 0) return;
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => this.observer.observe(counter));
    },
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString() + '+';
            }
        };
        
        updateCounter();
    }
};

/**
 * Mobile Menu Module
 */
const MobileMenu = {
    init() {
        this.toggle = document.querySelector('.mobile-toggle');
        this.menu = document.querySelector('.nav-menu');
        
        if (this.toggle && this.menu) {
            this.toggle.addEventListener('click', () => {
                this.menu.classList.toggle('active');
                this.toggle.classList.toggle('active');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
                    this.menu.classList.remove('active');
                    this.toggle.classList.remove('active');
                }
            });
        }
    }
};

/**
 * Smooth Scroll for Anchor Links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Form Handling
 */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Show success message (in real app, send to server)
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

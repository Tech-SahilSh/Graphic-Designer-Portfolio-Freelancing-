// --- 1. CURSOR ---
const cursor = document.getElementById('cursor');
const hoverElements = document.querySelectorAll('.interactive-hover, a, button');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

// --- 2. SMOKE ANIMATION ---
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * height; 
    }
    reset() {
        this.x = Math.random() * (width * 0.6);
        this.y = -100;
        this.vx = (Math.random() * 0.4) + 0.1;
        this.vy = (Math.random() * 0.8) + 0.2;
        this.size = Math.random() * 300 + 150;
        this.color = Math.random() > 0.5 ? '#cc0000' : '#660000'; 
        this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y > height + 100 || this.x > width + 100) { this.reset(); }
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1; 
    }
}
for (let i = 0; i < 25; i++) particles.push(new Particle());

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
animate();

// --- 3. SCROLL REVEAL ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-row, .project-card, .review-card, .about-content-wrapper, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// --- 4. MOBILE MENU TOGGLE ---
const drawer = document.getElementById('mobileDrawer');
const overlay = document.getElementById('drawerOverlay');
const hamburger = document.querySelector('.hamburger-btn i');

function toggleMenu() {
    drawer.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (drawer.classList.contains('active')) {
        hamburger.classList.remove('fa-bars');
        hamburger.classList.add('fa-times');
    } else {
        hamburger.classList.remove('fa-times');
        hamburger.classList.add('fa-bars');
    }
}

overlay.addEventListener('click', toggleMenu);

// --- 5. 3D TILT FOR REVIEWS ---
const tiltCards = document.querySelectorAll('.review-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPct = (x / rect.width) - 0.5;
        const yPct = (y / rect.height) - 0.5;
        const xRot = yPct * -15;
        const yRot = xPct * 15;
        card.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale(1.05)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// Make toggleMenu globally accessible
window.toggleMenu = toggleMenu;
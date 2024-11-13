// Add animation to links when they enter viewport
document.addEventListener('DOMContentLoaded', () => {
    new ParticleNetwork();
    
    const links = document.querySelectorAll('.link-card');
    
    links.forEach((link, index) => {
        setTimeout(() => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                link.style.transition = 'opacity 0.5s, transform 0.5s';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            });
        }, index * 100);
    });

    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || getSystemTheme();
    setTheme(initialTheme);

    // Theme toggle button
    const themeButton = document.getElementById('themeButton');
    themeButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
});

// Add hover animation
document.querySelectorAll('.link-card').forEach(card => {
    card.addEventListener('mouseover', () => {
        card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseout', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Theme handling
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update button icon
    const themeButton = document.getElementById('themeButton');
    themeButton.innerHTML = theme === 'dark' ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
}

// Check system preference
function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 
        'dark' : 'light';
}

// Replace createFloatingCircles with this new code in main.js
class ParticleNetwork {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0, radius: 100 };
        
        this.init();
        this.animate();
        this.addListeners();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 9000);
        
        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1 + 1,
                // Reduced velocity range from 2 to 0.5
                vx: Math.random() * 0.5 - 0.25,
                vy: Math.random() * 0.5 - 0.25
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw darker particles
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            this.ctx.fill();
            
            // Connect particles
            this.particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - distance/100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
            
            // Enhanced mouse interaction with stronger glow
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                // Stronger glow effect
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
                const gradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.radius * 6
                );
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
                
                // Brighter particles near mouse
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * (1 - distance/this.mouse.radius)})`;
                this.ctx.fill();
                
                // Brighter connections to mouse
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 * (1 - distance/this.mouse.radius)})`;
                this.ctx.lineWidth = 2;
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }

    addListeners() {
        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('touchmove', (e) => {
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        });
    }
}
// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Initialize functionality
    initParticles();
    initTiltEffect();
    initDecoderEffect();
    initResumeDownload();
    initServicesVideo();

    // Animate Bento Cards on Load
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});


// Particle System
// Particle System
function initParticles() {
    const canvas = document.getElementById('particles-js');
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
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? '#ff0080' : '#00fff2'; // Neon Pink or Cyan
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Draw connections
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - distance / 1500})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}



// 3D Tilt Effect
function initTiltEffect() {
    const cards = document.querySelectorAll('.glass-card, .project-card, .service-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// Decoder Text Effect (Hacker Style)
function initDecoderEffect() {
    const texts = document.querySelectorAll('h1, h2');
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

    texts.forEach(element => {
        const originalText = element.innerText;
        element.setAttribute('data-value', originalText);

        element.addEventListener('mouseover', event => {
            let iterations = 0;

            // Clear any existing interval to prevent overlapping animations
            if (element.dataset.interval) {
                clearInterval(parseInt(element.dataset.interval));
            }

            const interval = setInterval(() => {
                event.target.innerText = event.target.innerText
                    .split('')
                    .map((letter, index) => {
                        if (index < iterations) {
                            return event.target.dataset.value[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iterations >= event.target.dataset.value.length) {
                    clearInterval(interval);
                }

                iterations += 1 / 3;
            }, 30);

            element.dataset.interval = interval.toString();
        });
    });
}




// Resume Download Functionality
function initResumeDownload() {
    const downloadBtn = document.getElementById('download-resume');

    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', () => {
        // Add pulse animation
        downloadBtn.classList.add('pulse-animation');

        // Create download link
        const link = document.createElement('a');
        link.href = 'data/Anirban_Resume.pdf';
        link.download = 'Anirban_Midya_Resume.pdf';
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Remove pulse animation
        setTimeout(() => {
            downloadBtn.classList.remove('pulse-animation');
        }, 2000);

        // Show success feedback
        const originalText = downloadBtn.querySelector('span:last-child').textContent;
        downloadBtn.querySelector('span:last-child').textContent = 'Downloaded!';

        setTimeout(() => {
            downloadBtn.querySelector('span:last-child').textContent = originalText;
        }, 2000);
    });
}

// Services Video Functionality
// Services Video Functionality
// Services Video Functionality
function initServicesVideo() {
    const serviceItems = document.querySelectorAll('.services-card li');
    const videoContainer = document.getElementById('service-video-container');
    const videoPlayer = document.getElementById('service-player');
    const videoSource = videoPlayer.querySelector('source');
    const placeholder = document.getElementById('service-placeholder');

    if (!videoContainer || !videoPlayer) return;

    let currentIndex = 0;
    let playbackTimeout;
    let isManualMode = false;

    // Define text colors for highlighting based on hover classes
    const colors = ['text-neon-pink', 'text-neon-purple', 'text-neon-cyan', 'text-white'];

    function playService(index, manual = false) {
        // Clear any existing timeout
        if (playbackTimeout) clearTimeout(playbackTimeout);
        isManualMode = manual;

        // Remove active styles from all
        serviceItems.forEach((item) => {
            item.classList.remove('font-bold', 'text-neon-pink', 'text-neon-purple', 'text-neon-cyan', 'text-white');
            // Re-add hover transition just in case
            item.classList.add('transition-colors');
        });

        // Activate current item
        const currentItem = serviceItems[index];
        currentItem.classList.add('font-bold');

        // Apply specific color based on index or dataset could be better, but array works simpler here since list is static order
        if (colors[index]) {
            currentItem.classList.add(colors[index]);
        }

        const videoPath = currentItem.dataset.video;
        if (videoPath) {
            if (placeholder) placeholder.style.display = 'none';
            videoContainer.classList.remove('hidden');

            videoSource.src = videoPath;
            videoPlayer.load();
            videoPlayer.play().catch(e => console.log('Auto-play prevented:', e));

            // If not manual, set timeout to switch after 5 seconds
            if (!manual) {
                playbackTimeout = setTimeout(() => {
                    playNext();
                }, 5000);
            }
        }
    }

    function playNext() {
        currentIndex = (currentIndex + 1) % serviceItems.length;
        playService(currentIndex, false); // Always revert to auto loop
    }

    // Initialize first video auto-play
    setTimeout(() => {
        playService(0, false);
    }, 1000); // Small delay after load

    // Listen for video end to loop to next
    videoPlayer.addEventListener('ended', () => {
        // If the video ended naturally
        // If manual mode: it means full video was watched, now go to next in auto loop
        // If auto mode: it means video was < 5s, so go to next immediately
        playNext();
    });

    // Manual click override
    serviceItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            playService(currentIndex, true); // True for manual mode
        });
    });
}

// Console welcome message
console.log(`
🚀 Welcome to Anirban Midya's Portfolio!
🎨 Built with HTML, Tailwind CSS, and Vanilla JavaScript
✨ Featuring glassmorphism design and smooth animations
📱 Fully responsive and optimized for all devices

Feel free to explore the code and reach out if you have any questions!
Email: anirbanmidya12@gmail.com
`);

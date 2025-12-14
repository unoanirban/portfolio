// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Initialize functionality
    initGalaxyBackground();
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
// Galaxy 3D Particle System
function initGalaxyBackground() {
    const canvas = document.getElementById('particles-js');
    if (!canvas) return;

    // --- CONFIGURATION ---
    const PARTICLE_COUNT = 4000; // Increased for better density
    const PARTICLE_SIZE = 0.15;
    const TRANSITION_SPEED = 0.08;

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25; // Closer camera for better immersive feel

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize for high DPI

    // --- PARTICLE SYSTEM STATE ---
    let particles;
    let targetPositions = [];

    // Geometry & Material
    const geometry = new THREE.BufferGeometry();
    // Using a texture-less point material for performance, but custom shader could be nicer. 
    // Stick to PointsMaterial with vertex colors for now.
    const material = new THREE.PointsMaterial({
        size: PARTICLE_SIZE,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    });

    // Initialize arrays
    const posArray = new Float32Array(PARTICLE_COUNT * 3);
    const colArray = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 60; // Spread out initially
        colArray[i] = 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colArray, 3));
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- MATH / SHAPES ---
    function getSpherePoint() {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = 18 + Math.random() * 2; // Increased radius + noise
        return {
            x: r * Math.sin(phi) * Math.cos(theta),
            y: r * Math.sin(phi) * Math.sin(theta),
            z: r * Math.cos(phi)
        };
    }

    function getHeartPoint() {
        let t = Math.random() * Math.PI * 2;
        let u = Math.random() * Math.PI;
        const r = 1.2; // Scaled up
        const x = r * 16 * Math.pow(Math.sin(t), 3) * Math.sin(u);
        const y = r * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * Math.sin(u);
        const z = r * 8 * Math.cos(u);
        return { x, y: y + 3, z };
    }

    function getSaturnPoint() {
        const isRing = Math.random() > 0.6; // More ring particles
        if (!isRing) {
            const p = getSpherePoint();
            return { x: p.x * 0.5, y: p.y * 0.5, z: p.z * 0.5 };
        } else {
            const angle = Math.random() * Math.PI * 2;
            const r = 16 + Math.random() * 8; // Larger rings
            return {
                x: r * Math.cos(angle),
                y: (Math.random() - 0.5) * 2,
                z: r * Math.sin(angle)
            };
        }
    }

    function getFlowerPoint() {
        const k = 4; // Petals
        const theta = Math.random() * Math.PI * 2;
        const r = 20 * Math.cos(k * theta); // Larger flower
        const z = (Math.random() - 0.5) * 6;
        return {
            x: r * Math.cos(theta),
            y: r * Math.sin(theta),
            z: z
        };
    }

    const shapes = [
        { name: "Sphere", func: getSpherePoint },
        { name: "Heart", func: getHeartPoint },
        { name: "Saturn", func: getSaturnPoint },
        { name: "Flower", func: getFlowerPoint }
    ];

    let currentShapeIndex = 0;

    // --- TARGET UPDATES ---
    function updateTargets(index = -1) {
        if (index !== -1) currentShapeIndex = index;
        const shapeFunc = shapes[currentShapeIndex].func;

        targetPositions = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            targetPositions.push(shapeFunc());
        }

        // Dynamic Coloring based on shape
        const colorAttr = geometry.attributes.color;
        // Palettes: [Pink/Purple], [Red/Pink], [Cyan/Blue], [Green/Gold]
        const hueBase = [0.8, 0.95, 0.5, 0.2][currentShapeIndex] || 0.6;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const c = new THREE.Color();
            const h = hueBase + (Math.random() * 0.15);
            c.setHSL(h % 1, 0.8, 0.6);
            colorAttr.setXYZ(i, c.r, c.g, c.b);
        }
        colorAttr.needsUpdate = true;
    }

    updateTargets(0); // Init

    // --- INTERACTION LOGIC ---
    let mousePos = new THREE.Vector3(1000, 1000, 0);

    // Mouse Move (Raycasting approach for accurate 3D position)
    window.addEventListener('mousemove', (event) => {
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;

        const vector = new THREE.Vector3(x, y, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const newPos = camera.position.clone().add(dir.multiplyScalar(distance));

        mousePos.lerp(newPos, 0.2); // Smooth follow
    });

    // Hover Sections -> Shape Change
    const behaviors = [
        { selector: '.hero-card', shape: 0 },   // Sphere
        { selector: '.socials-card', shape: 1 }, // Heart
        { selector: '.projects-card', shape: 2 }, // Saturn
        { selector: '.services-card', shape: 3 }, // Flower
        { selector: '.skills-card', shape: 0 },
        { selector: '.mail-card', shape: 1 },
        { selector: '.schedule-card', shape: 2 }
    ];

    behaviors.forEach(b => {
        const el = document.querySelector(b.selector);
        if (el) {
            el.addEventListener('mouseenter', () => {
                if (currentShapeIndex !== b.shape) updateTargets(b.shape);
            });
        }
    });

    // --- ANIMATION LOOP ---
    function animate() {
        requestAnimationFrame(animate);

        const positions = geometry.attributes.position.array;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            const px = positions[i3];
            const py = positions[i3 + 1];
            const pz = positions[i3 + 2];

            const tx = targetPositions[i].x;
            const ty = targetPositions[i].y;
            const tz = targetPositions[i].z;

            // 1. Seek Target
            let vx = (tx - px) * TRANSITION_SPEED;
            let vy = (ty - py) * TRANSITION_SPEED;
            let vz = (tz - pz) * TRANSITION_SPEED;

            // 2. Mouse Repulsion/Attraction
            // Let's do a gentle "swirl" or "push" effect
            const dx = px - mousePos.x;
            const dy = py - mousePos.y;
            const dz = pz - mousePos.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < 12) { // Increased interaction radius
                const force = (12 - dist) * 1.5;
                // Add some curl noise or just radial push
                vx += (dx / dist) * force * 0.2;
                vy += (dy / dist) * force * 0.2;
                vz += (dz / dist) * force * 0.2;
            }

            positions[i3] += vx;
            positions[i3 + 1] += vy;
            positions[i3 + 2] += vz;
        }

        geometry.attributes.position.needsUpdate = true;

        // Rotations
        particles.rotation.y += 0.002;
        particles.rotation.z += 0.0005;

        renderer.render(scene, camera);
    }

    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
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

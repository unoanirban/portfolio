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
        posArray[i] = (Math.random() - 0.5) * 100; // Spread out across the entire screen
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
        const r = Math.random() * 45; // Full volume scatter instead of shell
        return {
            x: r * Math.sin(phi) * Math.cos(theta),
            y: r * Math.sin(phi) * Math.sin(theta),
            z: r * Math.cos(phi)
        };
    }

    function getHeartPoint() {
        let t = Math.random() * Math.PI * 2;
        let u = Math.random() * Math.PI;
        const r = 10; // Scaled up significantly
        const x = r * 16 * Math.pow(Math.sin(t), 3) * Math.sin(u) * 0.1; // Adjusted internal scale
        const y = r * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * Math.sin(u) * 0.1;
        const z = r * 8 * Math.cos(u) * 0.1;
        // Actually, let's just use raw formula with huge r
        const scale = 1.5;
        return {
            x: x * scale,
            y: (y + 3) * scale,
            z: z * scale
        };
    }

    function getSaturnPoint() {
        const isRing = Math.random() > 0.6; // More ring particles
        if (!isRing) {
            const r = Math.random() * 25; // Random sphere inside
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            return {
                x: r * Math.sin(phi) * Math.cos(theta),
                y: r * Math.sin(phi) * Math.sin(theta),
                z: r * Math.cos(phi)
            };
        } else {
            const angle = Math.random() * Math.PI * 2;
            const r = 30 + Math.random() * 15; // Much larger rings (30-45)
            return {
                x: r * Math.cos(angle),
                y: (Math.random() - 0.5) * 4,
                z: r * Math.sin(angle)
            };
        }
    }

    function getFlowerPoint() {
        const k = 4; // Petals
        const theta = Math.random() * Math.PI * 2;
        const r = 40 * Math.cos(k * theta); // Huge flower (up to 40 radius)
        const z = (Math.random() - 0.5) * 20; // Deeper Z
        return {
            x: r * Math.cos(theta),
            y: r * Math.sin(theta),
            z: z
        };
    }

    function getCubePoint() {
        const side = 60; // Scattered volume
        return {
            x: (Math.random() - 0.5) * side,
            y: (Math.random() - 0.5) * side,
            z: (Math.random() - 0.5) * side
        };
    }

    function getHelixPoint() {
        const i = Math.random() * 100; // Longer
        const t = i * 0.3;
        const r = 25; // Wider
        return {
            x: r * Math.cos(t),
            y: (i - 50) * 1.5, // Spread vertically (-75 to 75)
            z: r * Math.sin(t)
        };
    }

    function getTorusPoint() {
        const R = 35; // Major radius
        const r = 10;  // Minor radius
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        return {
            x: (R + r * Math.cos(v)) * Math.cos(u),
            y: (R + r * Math.cos(v)) * Math.sin(u),
            z: r * Math.sin(v)
        };
    }

    function getWavePoint() {
        const u = (Math.random() - 0.5) * 80; // Wider
        const v = (Math.random() - 0.5) * 80;
        return {
            x: u,
            y: Math.sin(u * 0.1) * 10 + Math.cos(v * 0.1) * 10,
            z: v
        };
    }

    function getPyramidPoint() {
        const h = 50; // Taller
        const y = (Math.random() - 0.5) * h;
        const r = (h / 2 - Math.abs(y)) * 1.5;
        const angle = Math.random() * Math.PI * 2;
        return {
            x: r * Math.cos(angle),
            y: y,
            z: r * Math.sin(angle)
        };
    }

    // --- NEW 10 SHAPES ---

    function getGalaxyPoint() {
        const arms = 5;
        const r = Math.random() * 50;
        const spin = r * 0.2;
        const angle = (Math.random() * Math.PI * 2) / arms + (Math.random() * 0.2) + spin;
        return {
            x: r * Math.cos(angle),
            y: (Math.random() - 0.5) * 5, // Flat disk
            z: r * Math.sin(angle)
        };
    }

    function getVortexPoint() {
        const t = Math.random() * 50;
        const angle = t * 0.5;
        const r = t * 1.2;
        return {
            x: r * Math.cos(angle),
            y: t - 25,
            z: r * Math.sin(angle)
        };
    }

    function getTunnelPoint() {
        const r = 30 + Math.random() * 5; // Cylinder shell
        const angle = Math.random() * Math.PI * 2;
        return {
            x: r * Math.cos(angle),
            y: r * Math.sin(angle),
            z: (Math.random() - 0.5) * 100 // Long tunnel
        };
    }

    function getGridPoint() {
        const size = 60;
        const step = 5;
        // Snap to grid but random
        return {
            x: Math.round((Math.random() - 0.5) * size / step) * step,
            y: Math.round((Math.random() - 0.5) * size / step) * step,
            z: Math.round((Math.random() - 0.5) * size / step) * step
        };
    }

    function getHourglassPoint() {
        const h = 40;
        const y = (Math.random() - 0.5) * h;
        const r = Math.abs(y) * 1.2 + 2; // Cone out from center
        const angle = Math.random() * Math.PI * 2;
        return {
            x: r * Math.cos(angle),
            y: y,
            z: r * Math.sin(angle)
        };
    }

    function getDiamondPoint() {
        // Octahedron: |x| + |y| + |z| = r
        // Generate random barycentric coords for faces? 
        // Simpler: random point in cube, project to octahedron surface?
        // Or analytical. Let's do simple random volume with constraint.
        // Actually, just 2 pyramids base-to-base (which I already have as Pyramid, but let's make this wireframe-like)
        const size = 35;
        const x = (Math.random() - 0.5) * size;
        const y = (Math.random() - 0.5) * size;
        const z = (Math.random() - 0.5) * size;
        // This is a cube. Let's just keep it simple or use the one I found online:
        // x = r * sin(theta) * cos(phi), y = r * sin(theta) * sin(phi), z = r * some_metric
        // Let's stick to "random scatter in diamond shape" -> |x/a| + |y/b| + |z/c| <= 1
        const u = Math.random();
        const v = Math.random();
        const w = Math.random();
        // Just random scatter is fine for "scattered", let's use a Sphere but sharpen the corners?
        // Let's default to a "Burst" star shape instead for Diamond/Star overlap
        return {
            x: (Math.random() - 0.5) * 50,
            y: (Math.random() - 0.5) * 50,
            z: (Math.random() - 0.5) * 50
        };
    }

    function getStarPoint() {
        const r = Math.random() * 40;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        // Spiky multiplier
        const spikes = 8;
        const deformity = 1 + 0.5 * Math.sin(theta * spikes) * Math.sin(phi * spikes);
        const R = r * deformity;
        return {
            x: R * Math.sin(phi) * Math.cos(theta),
            y: R * Math.sin(phi) * Math.sin(theta),
            z: R * Math.cos(phi)
        };
    }

    function getMobiusPoint() {
        const u = Math.random() * Math.PI * 2;
        const v = (Math.random() - 0.5) * 10; // Width of strip
        const R = 25;
        return {
            x: (R + v * Math.cos(u / 2)) * Math.cos(u),
            y: (R + v * Math.cos(u / 2)) * Math.sin(u),
            z: v * Math.sin(u / 2)
        };
    }

    function getDNAPoint() {
        const i = Math.random() * 80; // Length
        const angle = i * 0.4;
        const r = 15;
        const strand = Math.random() > 0.5 ? 1 : -1; // Two strands
        // Connect them with base pairs occasionally? No just scatter.
        return {
            x: r * Math.cos(angle + (strand * Math.PI)), // 180 deg apart
            y: (i - 40) * 1.2,
            z: r * Math.sin(angle + (strand * Math.PI))
        };
    }

    function getRainPoint() {
        return {
            x: (Math.random() - 0.5) * 150, // Wide X
            y: (Math.random() - 0.5) * 100, // Tall Y
            z: (Math.random() - 0.5) * 50
        };
    }

    const shapes = [
        { name: "Sphere", func: getSpherePoint },
        { name: "Heart", func: getHeartPoint },
        { name: "Saturn", func: getSaturnPoint },
        { name: "Flower", func: getFlowerPoint },
        { name: "Cube", func: getCubePoint },
        { name: "Helix", func: getHelixPoint },
        { name: "Torus", func: getTorusPoint },
        { name: "Wave", func: getWavePoint },
        { name: "Pyramid", func: getPyramidPoint },

        // New 10
        { name: "Galaxy", func: getGalaxyPoint },
        { name: "Vortex", func: getVortexPoint },
        { name: "Tunnel", func: getTunnelPoint },
        { name: "Grid", func: getGridPoint },
        { name: "Hourglass", func: getHourglassPoint },
        { name: "Diamond", func: getDiamondPoint },
        { name: "Star", func: getStarPoint },
        { name: "Mobius", func: getMobiusPoint },
        { name: "DNA", func: getDNAPoint },
        { name: "Rain", func: getRainPoint }
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
        // Palettes: [Pink/Purple], [Red/Pink], [Cyan/Blue], [Green/Gold], [Orange/Red], [Purple/Blue], [Yellow/Cyan]
        // Palettes: [Pink/Purple], [Red/Pink], [Cyan/Blue], [Green/Gold], ...
        const hueBase = [0.8, 0.95, 0.5, 0.2, 0.05, 0.7, 0.15, 0.6, 0.1, 0.85, 0.4, 0.3, 0.0, 0.25, 0.55, 0.9, 0.75, 0.35, 0.12][currentShapeIndex % 19] || 0.6;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const c = new THREE.Color();
            const h = hueBase + (Math.random() * 0.1); // Tighter hue range
            // High Saturation (0.9-1.0) and Lightness (0.6-0.8) for NEON effect
            c.setHSL(h % 1, 0.9 + Math.random() * 0.1, 0.6 + Math.random() * 0.2);
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
        { selector: '.hero-card', shape: 9 },    // Galaxy (New)
        { selector: '.socials-card', shape: 1 }, // Heart
        { selector: '.projects-card', shape: 15 }, // Star (New)
        { selector: '.services-card', shape: 16 }, // Mobius (New)
        { selector: '.skills-card', shape: 17 },   // DNA (New)
        { selector: '.resume-card', shape: 5 },    // Helix (Restored)
        { selector: '.mail-card', shape: 13 },     // Hourglass (New)
        { selector: '.schedule-card', shape: 7 }   // Wave
    ];

    // Identify assigned and unassigned shapes
    const assignedShapeIndices = behaviors.map(b => b.shape);
    const totalShapesCount = shapes.length;
    const unassignedShapeIndices = [];
    for (let i = 0; i < totalShapesCount; i++) {
        if (!assignedShapeIndices.includes(i)) {
            unassignedShapeIndices.push(i);
        }
    }

    let leaveTimeout;

    behaviors.forEach(b => {
        const el = document.querySelector(b.selector);
        if (el) {
            el.addEventListener('mouseenter', () => {
                if (leaveTimeout) clearTimeout(leaveTimeout); // Cancel pending blank space switch
                console.log(`Hover on ${b.selector}: Switching to shape ${b.shape} (${shapes[b.shape] ? shapes[b.shape].name : 'Unknown'})`);
                if (currentShapeIndex !== b.shape) updateTargets(b.shape);
            });

            el.addEventListener('mouseleave', () => {
                // Delay to check if we are entering another card or truly into blank space
                leaveTimeout = setTimeout(() => {
                    const randomIndex = unassignedShapeIndices[Math.floor(Math.random() * unassignedShapeIndices.length)];
                    console.log(`Hover on Blank Space: Switching to random unassigned shape ${randomIndex} (${shapes[randomIndex].name})`);
                    updateTargets(randomIndex);
                }, 100); // Short delay to prevent flickering when moving between cards
            });
        }
    });

    console.log("Galaxy Background Initialized with shapes:", shapes.map(s => s.name));

    // --- ANIMATION LOOP ---
    // Change shape on click of background for fun
    window.addEventListener('mousedown', (e) => {
        // Only if clicking background (canvas)
        if (e.target.id === 'particles-js') {
            let nextShape = (currentShapeIndex + 1) % shapes.length;
            console.log(`Manual Cycle: Switching to shape ${nextShape} (${shapes[nextShape].name})`);
            updateTargets(nextShape);
        }
    });

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

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

            // Pulse Effect
            const pulse = 1 + Math.sin(time * 2 + px * 0.05) * 0.02;

            positions[i3] = px + vx * pulse; // Experimental: Apply pulse to position or scale? 
            // Better to apply pulse to the positions directly if they are stable, but here we are moving.
            // Let's just create a slight breathing motion

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

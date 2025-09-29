// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initThemeToggle();
    initMobileMenu();
    initSmoothScrolling();
    initRotatingText();
    initSkillWidgets();
    initProjectCards();
    initServiceCards();
    initResumeDownload();
    initScrollAnimations();
    initActiveNavigation();
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Check for saved theme preference or default to dark mode
    const currentTheme = localStorage.getItem('theme') || 'dark';
    body.classList.toggle('dark', currentTheme === 'dark');
    updateThemeIcon(currentTheme === 'dark');

    themeToggle.addEventListener('click', () => {
        const isDark = body.classList.contains('dark');
        body.classList.toggle('dark');
        
        const newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(!isDark);
        
        // Add transition effect
        body.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 500);
    });

    function updateThemeIcon(isDark) {
        if (isDark) {
            // Moon icon for dark mode
            themeIcon.innerHTML = '<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>';
        } else {
            // Sun icon for light mode
            themeIcon.innerHTML = '<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>';
        }
    }
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('show');
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('show');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('show');
        }
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Rotating Text Animation (Telegram-style typing effect)
function initRotatingText() {
    const rotatingText = document.getElementById('rotating-text');
    const texts = ['Student', 'Robotics Enthusiast', 'Listener'];
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let typeSpeed = 150;

    function typeText() {
        const fullText = texts[currentIndex];
        
        if (isDeleting) {
            currentText = fullText.substring(0, currentText.length - 1);
            typeSpeed = 75;
        } else {
            currentText = fullText.substring(0, currentText.length + 1);
            typeSpeed = 150;
        }
        
        rotatingText.textContent = currentText;
        
        if (!isDeleting && currentText === fullText) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentText === '') {
            isDeleting = false;
            currentIndex = (currentIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before starting new word
        }
        
        setTimeout(typeText, typeSpeed);
    }
    
    typeText();
}

// Skills Widget Functionality
function initSkillWidgets() {
    const skillWidgets = document.querySelectorAll('.skill-widget');
    
    skillWidgets.forEach(widget => {
        const skillContent = widget.querySelector('.skill-content');
        let isExpanded = false;
        
        // Add neon glow on hover
        widget.addEventListener('mouseenter', () => {
            widget.classList.add('neon-glow');
        });
        
        widget.addEventListener('mouseleave', () => {
            widget.classList.remove('neon-glow');
        });
        
        // Toggle skill content on click
        widget.addEventListener('click', () => {
            if (!isExpanded) {
                // Expand with Telegram-style animation
                skillContent.classList.remove('hidden');
                skillContent.classList.add('uncover-animation');
                isExpanded = true;
                
                // Reset skill card animations
                const skillCards = skillContent.querySelectorAll('.skill-card');
                skillCards.forEach((card, index) => {
                    card.style.animationDelay = `${index * 0.1}s`;
                    card.classList.remove('slideInUp');
                    // Trigger reflow
                    card.offsetHeight;
                    card.classList.add('slideInUp');
                });
            } else {
                // Collapse with vanish animation
                skillContent.classList.add('vanish-animation');
                setTimeout(() => {
                    skillContent.classList.add('hidden');
                    skillContent.classList.remove('vanish-animation', 'uncover-animation');
                    isExpanded = false;
                }, 500);
            }
        });
    });
    
    // Reset widgets on page refresh
    window.addEventListener('beforeunload', () => {
        skillWidgets.forEach(widget => {
            const skillContent = widget.querySelector('.skill-content');
            skillContent.classList.add('hidden');
        });
    });
}

// Project Cards Functionality
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    // GitHub repository URLs (placeholders)
    const projectUrls = {
        '1': 'https://github.com/unoanirban/pose_detection_python',
        '2': 'https://github.com/unoanirban/quadruped_simulation',
        '3': 'https://github.com/unoanirban/handwritten-digit-recognition',
        '4': 'https://github.com/unoanirban/project4'
    };
    
    projectCards.forEach(card => {
        const projectId = card.dataset.project;
        
        card.addEventListener('click', () => {
            // Telegram-style vanish animation
            card.classList.add('vanish-animation');
            
            setTimeout(() => {
                // Redirect to GitHub repo
                window.open(projectUrls[projectId], '_blank');
                
                // Reset animation
                card.classList.remove('vanish-animation');
            }, 500);
        });
    });
}

function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    let currentActiveCard = null;
    let currentPlayingVideo = null;

    serviceCards.forEach(card => {
        const serviceVideo = card.querySelector('.service-video');
        const video = serviceVideo.querySelector('video');
        const textContents = card.querySelectorAll('h3, p');

        // Function to reset any card to its initial state
        function resetCard(cardToReset) {
            const resetText = cardToReset.querySelectorAll('h3, p');
            const resetVideoContainer = cardToReset.querySelector('.service-video');
            const resetVideo = resetVideoContainer.querySelector('video');

            resetText.forEach(el => {
                el.style.display = 'block';
                el.style.opacity = '1';
            });

            resetVideo.pause();
            resetVideo.currentTime = 0;
            resetVideoContainer.classList.add('hidden');
            resetVideoContainer.classList.remove('show');
            cardToReset.classList.remove('active');
        }

        card.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling to document click

            // If clicking the currently active card again → toggle it off
            if (card === currentActiveCard) {
                resetCard(card);
                currentActiveCard = null;
                currentPlayingVideo = null;
                return;
            }

            // If another card is active → reset it
            if (currentActiveCard && currentActiveCard !== card) {
                resetCard(currentActiveCard);
            }

            // Hide text
            textContents.forEach(el => {
                el.style.transition = 'opacity 0.3s ease';
                el.style.opacity = '0';
            });

            setTimeout(() => {
                textContents.forEach(el => el.style.display = 'none');
                serviceVideo.classList.remove('hidden');
                serviceVideo.classList.add('show');
                card.classList.add('active');

                video.currentTime = 0;
                video.play();

                currentActiveCard = card;
                currentPlayingVideo = video;
            }, 250);
        });

        // Optional: Handle video end (not needed if it loops)
        video.addEventListener('ended', () => {
            resetCard(card);
            currentActiveCard = null;
            currentPlayingVideo = null;
        });
    });

    // Click outside → reset current card
    document.addEventListener('click', () => {
        if (currentActiveCard) {
            const card = currentActiveCard;
            const video = currentPlayingVideo;
            const textContents = card.querySelectorAll('h3, p');
            const serviceVideo = card.querySelector('.service-video');

            textContents.forEach(el => {
                el.style.display = 'block';
                el.style.opacity = '1';
            });

            video.pause();
            video.currentTime = 0;
            serviceVideo.classList.add('hidden');
            serviceVideo.classList.remove('show');
            card.classList.remove('active');

            currentActiveCard = null;
            currentPlayingVideo = null;
        }
    });
}


// Resume Download Functionality
function initResumeDownload() {
    const downloadBtn = document.getElementById('download-resume');
    
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

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Parallax effect for background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-section');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Active Navigation Highlighting
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-100px 0px -50% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section's nav link
                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Utility Functions

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth reveal animation for elements
function revealElement(element, delay = 0) {
    setTimeout(() => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    }, delay);
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Reveal elements with stagger effect
    const elementsToReveal = document.querySelectorAll('.glass-card, .project-card, .service-card');
    elementsToReveal.forEach((element, index) => {
        revealElement(element, index * 100);
    });
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.classList.add('paused');
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('paused');
    }
});

// Error handling for missing assets
function handleMissingAssets() {
    const images = document.querySelectorAll('img');
    const videos = document.querySelectorAll('video');
    
    images.forEach(img => {
        img.addEventListener('error', () => {
            img.style.display = 'none';
            console.warn(`Image not found: ${img.src}`);
        });
    });
    
    videos.forEach(video => {
        video.addEventListener('error', () => {
            const parent = video.closest('.service-video');
            if (parent) {
                parent.innerHTML = '<p class="text-sm opacity-60">Video not available</p>';
            }
            console.warn(`Video not found: ${video.src}`);
        });
    });
}

// Initialize error handling
handleMissingAssets();

// Performance optimization
const debouncedScrollHandler = debounce(() => {
    // Handle scroll-based animations
    const scrollTop = window.pageYOffset;
    
    // Update header opacity based on scroll
    const header = document.querySelector('header');
    const opacity = Math.min(scrollTop / 100, 1);
    header.style.backgroundColor = `rgba(255, 255, 255, ${opacity * 0.1})`;
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('show');
    }
});

// Touch gesture support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
});

function handleSwipeGesture() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - could trigger some action
        } else {
            // Swipe down - could trigger some action
        }
    }
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



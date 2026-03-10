document.addEventListener('DOMContentLoaded', () => {

    // Typing Text Effect with Highlight Cursor
    const containerElement = document.querySelector('.typing-container');
    const textElement = document.querySelector('.typing-text');
    const words = ["Student.", "Developer.", "Homelab Enthusiast.", "Leader.", "Problem Solver."];
    let wordIndex = 0;
    let charIndex = 0;
    let highlightProgress = 0;
    let phase = 'typing'; // 'typing', 'pausing', 'highlighting', 'clearing'

    function runAnimation() {
        const currentWord = words[wordIndex];

        switch (phase) {
            case 'typing':
                if (charIndex < currentWord.length) {
                    textElement.textContent = currentWord.substring(0, charIndex + 1);
                    containerElement.style.setProperty('--highlight-progress', '0%');
                    charIndex++;
                    setTimeout(runAnimation, 80);
                } else {
                    // Done typing, pause before highlight
                    phase = 'pausing';
                    highlightProgress = 0;
                    setTimeout(runAnimation, 400);
                }
                break;

            case 'pausing':
                // Start highlighting
                textElement.classList.add('highlight');
                containerElement.classList.add('show-cursor');
                phase = 'highlighting';
                runAnimation();
                break;

            case 'highlighting':
                const totalLetters = currentWord.length;
                const lettersHighlighted = Math.floor(highlightProgress);

                if (lettersHighlighted < totalLetters) {
                    const percent = ((lettersHighlighted + 1) / totalLetters) * 100;
                    containerElement.style.setProperty('--highlight-progress', percent + '%');
                    highlightProgress++;
                    setTimeout(runAnimation, 40);
                } else {
                    // Ensure we hit exactly 100%
                    containerElement.style.setProperty('--highlight-progress', '100%');
                    phase = 'clearing';
                    setTimeout(runAnimation, 200);
                }
                break;

            case 'clearing':
                // Clear and start next word
                textElement.classList.remove('highlight');
                containerElement.classList.remove('show-cursor');
                textElement.textContent = '';
                containerElement.style.setProperty('--highlight-progress', '0%');
                charIndex = 0;
                highlightProgress = 0;
                wordIndex = (wordIndex + 1) % words.length;
                phase = 'typing';
                setTimeout(runAnimation, 300);
                break;
        }
    }

    // Start typing effect
    if (textElement) {
        runAnimation();
    }

    // Stop cursor blinking while mouse is moving
    let mouseIdleTimer;
    document.addEventListener('mousemove', () => {
        document.body.classList.add('mouse-active');
        clearTimeout(mouseIdleTimer);
        mouseIdleTimer = setTimeout(() => {
            document.body.classList.remove('mouse-active');
        }, 500);
    });


    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
        observer.observe(section);
    });

    // Mouse Parallax for Hero 3D Shapes & Shards
    const hero = document.querySelector('.hero');
    const cube = document.querySelector('.cube-wrapper:not(.small)');
    const smallCube = document.querySelector('.cube-wrapper.small');
    const sphere = document.querySelector('.sphere-wrapper:not(.small)');
    const smallSphere = document.querySelector('.sphere-wrapper.small');
    const shards = document.querySelectorAll('.shard');
    const pyramid = document.querySelector('.pyramid-wrapper');
    const hexagon = document.querySelector('.hexagon');
    const orbitContainer = document.querySelector('.orbit-container');

    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;

            if (cube) {
                cube.style.transform = `translate(${x * 60}px, ${y * 60}px) rotateX(${y * 45}deg) rotateY(${x * 45}deg)`;
            }

            if (smallCube) {
                smallCube.style.transform = `translate(${x * -40}px, ${y * -40}px) rotateX(${y * -30}deg) rotateY(${x * -30}deg)`;
            }

            if (sphere) {
                sphere.style.transform = `translate(${x * -50}px, ${y * -50}px)`;
            }

            if (smallSphere) {
                smallSphere.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
            }

            if (pyramid) {
                pyramid.style.transform = `translate(${x * 70}px, ${y * 70}px) rotateX(${y * 25}deg) rotateY(${x * 25}deg)`;
            }

            if (hexagon) {
                hexagon.style.transform = `translate(${x * -45}px, ${y * -45}px) rotate(${x * 20}deg)`;
            }

            if (orbitContainer) {
                orbitContainer.style.transform = `translate(${x * 25}px, ${y * 25}px)`;
            }

            shards.forEach((shard, index) => {
                const speed = (index + 1) * 12;
                const rotateAmount = (index % 2 === 0 ? 1 : -1) * speed;
                shard.style.transform = `translate(${x * speed}px, ${y * speed}px) rotate(${x * rotateAmount}deg)`;
            });
        });
    }

});

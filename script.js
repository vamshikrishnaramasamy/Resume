document.addEventListener('DOMContentLoaded', () => {

    // Typing Text Effect with Highlight Delete
    const textElement = document.querySelector('.typing-text');
    const words = ["Student.", "Developer.", "Homelab Enthusiast.", "Leader.", "Problem Solver."];
    let wordIndex = 0;
    let charIndex = 0;
    let phase = 'typing'; // 'typing', 'pausing', 'highlighting', 'deleting'

    function runAnimation() {
        const currentWord = words[wordIndex];

        switch (phase) {
            case 'typing':
                if (charIndex < currentWord.length) {
                    textElement.textContent = currentWord.substring(0, charIndex + 1);
                    charIndex++;
                    setTimeout(runAnimation, 80);
                } else {
                    // Done typing, pause before highlight
                    phase = 'pausing';
                    setTimeout(runAnimation, 500);
                }
                break;

            case 'pausing':
                // Add highlight
                textElement.classList.add('highlight');
                phase = 'highlighting';
                setTimeout(runAnimation, 500);
                break;

            case 'highlighting':
                // Remove highlight and clear text
                textElement.classList.remove('highlight');
                textElement.textContent = '';
                charIndex = 0;
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

});

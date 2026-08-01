document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const loaderCount = document.querySelector('.loader-count');
    const progressBar = document.querySelector('.scroll-progress span');
    const sectionWipe = document.querySelector('.section-wipe');
    const header = document.querySelector('.site-header');
    const navLinks = [...document.querySelectorAll('nav a')];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    body.classList.add('is-loading');

    let count = 0;
    const loaderTimer = window.setInterval(() => {
        count += Math.ceil((100 - count) * 0.14);
        if (count >= 99) count = 100;
        loaderCount.textContent = String(count).padStart(3, '0');

        if (count === 100) {
            window.clearInterval(loaderTimer);
            window.setTimeout(() => {
                body.classList.remove('is-loading');
                body.classList.add('loaded');
            }, reducedMotion ? 0 : 220);
        }
    }, reducedMotion ? 1 : 36);

    const timeElement = document.querySelector('#local-time');
    const updateClock = () => {
        const time = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Los_Angeles',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(new Date());
        timeElement.textContent = `PT ${time}`;
    };
    updateClock();
    window.setInterval(updateClock, 1000);

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    document.querySelectorAll('.reveal, .motion-mask').forEach((element) => revealObserver.observe(element));

    const sections = [...document.querySelectorAll('main section[id]')];
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));

    let lastScroll = window.scrollY;
    let ticking = false;
    const hero = document.querySelector('.hero');
    const heroStage = document.querySelector('.hero-scroll');

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (!target || reducedMotion || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            event.preventDefault();
            sectionWipe.classList.remove('is-active');
            void sectionWipe.offsetWidth;
            sectionWipe.classList.add('is-active');

            window.setTimeout(() => target.scrollIntoView({ behavior: 'auto' }), 350);
            window.setTimeout(() => sectionWipe.classList.remove('is-active'), 820);
        });
    });

    if (!reducedMotion) {
        hero.addEventListener('pointermove', (event) => {
            const x = (event.clientX / window.innerWidth - 0.5) * 24;
            const y = (event.clientY / window.innerHeight - 0.5) * 24;
            hero.style.setProperty('--pointer-x', `${x}px`);
            hero.style.setProperty('--pointer-y', `${y}px`);
        });

        hero.addEventListener('pointerleave', () => {
            hero.style.setProperty('--pointer-x', '0px');
            hero.style.setProperty('--pointer-y', '0px');
        });
    }

    const updateOnScroll = () => {
        const currentScroll = window.scrollY;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.transform = `scaleX(${scrollable > 0 ? currentScroll / scrollable : 0})`;
        const heroRange = Math.max(heroStage.offsetHeight - window.innerHeight, 1);
        const heroProgress = Math.max(0, Math.min(1, -heroStage.getBoundingClientRect().top / heroRange));
        hero.style.setProperty('--hero-y', `${heroProgress * -54}px`);
        hero.style.setProperty('--hero-x-a', `${heroProgress * window.innerWidth * -0.13}px`);
        hero.style.setProperty('--hero-x-b', `${heroProgress * window.innerWidth * 0.11}px`);
        hero.style.setProperty('--hero-scale', String(1 - heroProgress * 0.08));
        hero.style.setProperty('--hero-name-opacity', String(1 - heroProgress * 0.62));
        hero.style.setProperty('--grid-y', `${heroProgress * 40}px`);
        hero.style.setProperty('--hero-rotate', `${heroProgress * 42}deg`);

        if (currentScroll > lastScroll && currentScroll > 180) {
            header.classList.add('is-hidden');
        } else {
            header.classList.remove('is-hidden');
        }

        if (!reducedMotion) {
            document.querySelectorAll('.image-parallax').forEach((frame) => {
                const rect = frame.getBoundingClientRect();
                const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const offset = Math.max(-7, Math.min(0, -7 + progress * 7));
                frame.style.setProperty('--parallax', `${offset}%`);
            });
        }

        lastScroll = currentScroll;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }, { passive: true });

    updateOnScroll();
});

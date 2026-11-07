(() => {
    'use strict';

    const initialize = () => {
        const root = document.documentElement;
        const main = document.querySelector('#main');
        if (!main) return;

        const header = document.querySelector('.site-header');
        const heroStage = main.querySelector('.hero-stage');
        const progressLine = document.querySelector('.page-progress');
        const motionButton = document.querySelector('#motion-toggle');
        const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
        const desktopPointer = matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)');
        const navLinks = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
        const navSections = navLinks.map((link) => ({
            link,
            section: document.getElementById(link.hash.slice(1))
        })).filter(({ section }) => section);

        const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));
        const tracks = [];
        const makeTrack = (element, property, restingValue = 0) => {
            if (!element) return null;
            const track = { element, property, value: restingValue, target: restingValue, written: null };
            tracks.push(track);
            return track;
        };
        const heroTrack = makeTrack(heroStage, '--hero-progress');
        const caseTracks = [...main.querySelectorAll('.case-art')].map((element) => ({
            track: makeTrack(element, '--case-progress', .5),
            section: element.closest('.case') || element
        }));
        const readingTracks = [...main.querySelectorAll('.reading-line')].map((element) => makeTrack(element, '--read-progress', 1));

        let userPaused = false;
        let motionPaused = reducedMotion.matches;
        let frame = 0;
        let previousTime = 0;
        let measurementNeeded = true;
        let hitTestNeeded = false;
        let refitNeeded = false;
        let initialized = false;
        let viewportHeight = window.innerHeight;

        // Only one inert, viewport-sized lens exists; the real page is never copied.
        const secretStage = document.createElement('div');
        secretStage.className = 'secret-stage';
        secretStage.setAttribute('aria-hidden', 'true');
        secretStage.inert = true;
        const secretCopy = document.createElement('div');
        secretCopy.className = 'secret-copy';
        secretStage.append(secretCopy);
        document.body.append(secretStage);

        const pointer = { x: 0, y: 0, present: false };
        const lens = { x: 0, y: 0, radius: 0, targetRadius: 0, source: null, textWidth: 0, textHeight: 0 };

        const schedule = () => {
            if (!frame && !document.hidden) frame = requestAnimationFrame(render);
        };
        const requestMeasurement = () => {
            measurementNeeded = true;
            hitTestNeeded = pointer.present;
            schedule();
        };

        const closeLens = (immediate = false) => {
            pointer.present = false;
            lens.targetRadius = 0;
            if (immediate) {
                lens.radius = 0;
                refitNeeded = true;
                secretStage.style.setProperty('--lens-r', '0px');
            }
            schedule();
        };

        const setSecretSource = (source) => {
            if (source === lens.source) return;
            // Start a new reveal at the new target. Never carry an open circle
            // across the page while its contents already belong elsewhere.
            lens.x = pointer.x;
            lens.y = pointer.y;
            lens.radius = 0;
            lens.source = source;
            refitNeeded = true;
            secretCopy.replaceChildren();
            if (!source) return;

            if (source.classList.contains('hero-name')) {
                const name = document.createElement('span');
                name.className = 'secret-name';
                const aside = document.createElement('span');
                aside.className = 'secret-aside';
                const asideStart = source.dataset.alt.indexOf('(');
                name.textContent = source.dataset.alt.slice(0, asideStart).trim();
                aside.textContent = source.dataset.alt.slice(asideStart);
                secretCopy.append(name, aside);
            } else {
                secretCopy.textContent = source.dataset.alt;
            }
        };

        const inspectPointer = () => {
            hitTestNeeded = false;
            if (!pointer.present || motionPaused || !desktopPointer.matches) {
                lens.targetRadius = 0;
                return;
            }
            const hit = document.elementFromPoint(pointer.x, pointer.y);
            const interactive = hit?.closest('a, button, input, textarea, select, [role="button"], [contenteditable="true"]');
            const source = hit?.closest('[data-alt]');
            if (!source || !main.contains(source) || !source.dataset.alt.trim()) {
                lens.targetRadius = 0;
                return;
            }
            // A heading inside a link can reveal text without blocking the link.
            if (interactive && !interactive.contains(source)) {
                lens.targetRadius = 0;
                return;
            }
            for (let element = source; element && element !== main; element = element.parentElement) {
                const style = getComputedStyle(element);
                if (style.visibility !== 'visible' || Number(style.opacity) < .25 ||
                    element.getAnimations().some(({ playState }) => playState === 'running')) {
                    lens.targetRadius = 0;
                    return;
                }
            }
            const textRange = document.createRange();
            const movingLine = Array.from(source.querySelectorAll('.line-mask > span, .letter-inner'))
                .some(line => line.getAnimations().some(({ playState }) => playState === 'running'));
            const textNodes = document.createTreeWalker(source, NodeFilter.SHOW_TEXT);
            let overText = false;
            while (!movingLine && !overText && textNodes.nextNode()) {
                textRange.selectNodeContents(textNodes.currentNode);
                overText = Array.from(textRange.getClientRects()).some(rect =>
                    pointer.x >= rect.left && pointer.x <= rect.right &&
                    pointer.y >= rect.top && pointer.y <= rect.bottom
                );
            }
            if (!overText) {
                lens.targetRadius = 0;
                return;
            }
            setSecretSource(source);
            if (!lens.radius) {
                lens.x = pointer.x;
                lens.y = pointer.y;
            }
            lens.targetRadius = Math.min(210, window.innerWidth * .19);
        };

        const positionSecret = () => {
            if (!lens.source || (!lens.radius && !lens.targetRadius)) return;
            // Mask wrappers include clipping padding and moving children. Anchor to
            // the rendered line itself, not the wrapper's unanimated border box.
            const anchor = lens.source.querySelector('.line-mask > span, .letter-inner') || lens.source;
            const anchorRect = anchor.getBoundingClientRect();
            const radius = Math.min(210, window.innerWidth * .19);
            // A square inside the settled circle gives every line breathing room.
            // Use settled size during the animation so text never reflows mid-reveal.
            const half = Math.floor((radius - 18) / Math.SQRT2);
            const name = lens.source.classList.contains('hero-name');
            if (refitNeeded) {
                refitNeeded = false;
                const typography = getComputedStyle(anchor);
                const sourceSize = parseFloat(typography.fontSize);
                const fontSize = Math.min(sourceSize, name ? 56 : 42);
                const lineHeight = parseFloat(typography.lineHeight) / sourceSize;
                Object.assign(secretCopy.style, {
                    width: `${Math.min(lens.source.clientWidth, half * 2)}px`,
                    fontFamily: typography.fontFamily,
                    fontWeight: typography.fontWeight,
                    fontSize: `${fontSize}px`,
                    lineHeight: String(Math.max(1.12, lineHeight || 1.12)),
                    letterSpacing: `${(parseFloat(typography.letterSpacing) || 0) * fontSize / sourceSize}px`,
                    overflowWrap: 'anywhere'
                });
                lens.textWidth = secretCopy.offsetWidth;
                lens.textHeight = secretCopy.offsetHeight;
            }
            // Keep the source alignment wherever it fits. Shift only as far as
            // needed to keep the replacement inside both the circle and viewport.
            const x = clamp(anchorRect.left, Math.max(12, lens.x - half),
                Math.min(window.innerWidth - 12, lens.x + half) - lens.textWidth);
            const y = clamp(anchorRect.top, Math.max(12, lens.y - half),
                Math.min(window.innerHeight - 12, lens.y + half) - lens.textHeight);
            secretCopy.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
        };

        const measure = () => {
            measurementNeeded = false;
            viewportHeight = window.innerHeight;
            const scrollTop = Math.max(0, window.scrollY);
            const scrollable = Math.max(1, root.scrollHeight - viewportHeight);
            if (progressLine) progressLine.style.transform = `scaleX(${clamp(scrollTop / scrollable)})`;
            header?.classList.toggle('is-scrolled', scrollTop > 24);

            if (heroTrack) {
                const rect = heroStage.getBoundingClientRect();
                heroTrack.target = motionPaused ? 0 : clamp(-rect.top / Math.max(1, rect.height - viewportHeight));
            }
            caseTracks.forEach(({ track, section }) => {
                const rect = section.getBoundingClientRect();
                track.target = motionPaused ? .5 : clamp((viewportHeight - rect.top) / (viewportHeight + rect.height));
                if (rect.bottom < 0 || rect.top > viewportHeight) track.value = track.target;
            });
            readingTracks.forEach((track) => {
                const rect = track.element.getBoundingClientRect();
                track.target = motionPaused ? 1 : clamp((viewportHeight * .82 - rect.top) / (viewportHeight * .37));
                if (rect.bottom < 0 || rect.top > viewportHeight) track.value = track.target;
            });

            // Use the same reading line for every nav item, independent of section height.
            const readingPosition = viewportHeight * .32;
            let currentSection = null;
            navSections.forEach(({ section }) => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= readingPosition && rect.bottom > readingPosition) currentSection = section;
            });
            navSections.forEach(({ link, section }) => {
                const active = section === currentSection;
                link.classList.toggle('active', active);
                if (active) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
        };

        function render(time) {
            frame = 0;
            if (document.hidden) {
                previousTime = 0;
                return;
            }
            const elapsed = previousTime ? clamp(time - previousTime, 1, 64) : 16.67;
            previousTime = time;
            if (measurementNeeded) measure();
            if (hitTestNeeded) inspectPointer();

            let unsettled = false;
            const scrollEase = 1 - Math.exp(-elapsed / 85);
            tracks.forEach((track) => {
                const difference = track.target - track.value;
                if (motionPaused || !initialized || Math.abs(difference) < .0002) track.value = track.target;
                else {
                    track.value += difference * scrollEase;
                    unsettled = true;
                }
                const written = track.value.toFixed(5);
                if (written !== track.written) {
                    track.element.style.setProperty(track.property, written);
                    track.written = written;
                }
            });

            const positionEase = 1 - Math.exp(-elapsed / 65);
            const radiusEase = 1 - Math.exp(-elapsed / (lens.targetRadius ? 85 : 45));
            if (lens.targetRadius) {
                // Inset the center near viewport edges just enough to keep the
                // copy on screen. The pointer still sits inside the circle.
                const inset = Math.floor((lens.targetRadius - 18) / Math.SQRT2) + 12;
                const x = clamp(pointer.x, inset, window.innerWidth - inset);
                const y = clamp(pointer.y, inset, Math.max(inset, window.innerHeight - inset));
                lens.x += (x - lens.x) * positionEase;
                lens.y += (y - lens.y) * positionEase;
                if (Math.abs(x - lens.x) < .1) lens.x = x;
                if (Math.abs(y - lens.y) < .1) lens.y = y;
                unsettled ||= lens.x !== x || lens.y !== y;
            }
            lens.radius += (lens.targetRadius - lens.radius) * radiusEase;
            if (Math.abs(lens.targetRadius - lens.radius) < .1) lens.radius = lens.targetRadius;

            if (lens.radius || lens.targetRadius) {
                positionSecret();
                secretStage.style.setProperty('--lens-x', `${lens.x.toFixed(2)}px`);
                secretStage.style.setProperty('--lens-y', `${lens.y.toFixed(2)}px`);
            }
            secretStage.style.setProperty('--lens-r', `${lens.radius.toFixed(2)}px`);
            unsettled ||= Math.abs(lens.targetRadius - lens.radius) > .1;
            initialized = true;
            if (unsettled) schedule();
            else previousTime = 0;
        }

        const revealTargets = [...main.querySelectorAll('.enter, .line-reveal')];
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(({ target, isIntersecting }) => {
                    if (!isIntersecting) return;
                    target.classList.add('in-view');
                    revealObserver.unobserve(target);
                });
            }, { threshold: .08, rootMargin: '0px 0px -4% 0px' });
            revealTargets.forEach((target) => revealObserver.observe(target));
        } else {
            revealTargets.forEach((target) => target.classList.add('in-view'));
        }

        const applyMotionPreference = () => {
            motionPaused = userPaused || reducedMotion.matches;
            root.classList.toggle('motion-paused', motionPaused);
            document.body.classList.toggle('motion-paused', motionPaused);
            if (motionButton) {
                const label = motionButton.querySelector('[data-motion-label]') || motionButton.querySelector('span') || motionButton;
                const text = reducedMotion.matches ? 'Reduced motion' : motionPaused ? 'Resume motion' : 'Pause motion';
                label.textContent = text;
                motionButton.setAttribute('aria-pressed', String(motionPaused));
                motionButton.setAttribute('aria-label', text);
                motionButton.disabled = reducedMotion.matches;
            }
            if (motionPaused) {
                revealTargets.forEach((target) => target.classList.add('in-view'));
                closeLens(true);
            }
            requestMeasurement();
        };

        motionButton?.addEventListener('click', () => {
            userPaused = !userPaused;
            applyMotionPreference();
        });
        reducedMotion.addEventListener('change', applyMotionPreference);
        desktopPointer.addEventListener('change', () => closeLens(true));

        window.addEventListener('scroll', () => {
            if (pointer.present || lens.radius) closeLens(true);
            requestMeasurement();
        }, { passive: true });
        window.addEventListener('resize', () => {
            closeLens(true);
            refitNeeded = true;
            requestMeasurement();
        }, { passive: true });
        window.addEventListener('pointermove', (event) => {
            if (event.pointerType !== 'mouse' || motionPaused || !desktopPointer.matches || event.buttons) return;
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            if (!pointer.present && lens.radius < 1) {
                lens.x = pointer.x;
                lens.y = pointer.y;
            }
            pointer.present = true;
            hitTestNeeded = true;
            schedule();
        }, { passive: true });
        root.addEventListener('pointerleave', () => closeLens());
        main.addEventListener('transitionend', ({ target, propertyName }) => {
            if (pointer.present && (propertyName === 'opacity' || propertyName === 'transform') &&
                target.closest('.enter, .line-reveal')) {
                hitTestNeeded = true;
                schedule();
            }
        });
        main.addEventListener('animationend', ({ target }) => {
            if (pointer.present && target.closest('.hero-name')) {
                hitTestNeeded = true;
                schedule();
            }
        });
        window.addEventListener('pointerdown', () => closeLens(true), { passive: true });
        window.addEventListener('pointercancel', () => closeLens(true));
        window.addEventListener('blur', () => closeLens(true));
        document.addEventListener('keydown', () => closeLens(true));
        document.addEventListener('visibilitychange', () => {
            root.classList.toggle('page-hidden', document.hidden);
            if (document.hidden) {
                closeLens(true);
                if (frame) cancelAnimationFrame(frame);
                frame = 0;
                previousTime = 0;
            } else requestMeasurement();
        });

        // Links keep their native URL, focus, keyboard, and browser-history behavior.
        main.addEventListener('click', (event) => {
            if (event.target.closest('a, button')) closeLens(true);
        });

        if ('ResizeObserver' in window) {
            const resizeObserver = new ResizeObserver(requestMeasurement);
            resizeObserver.observe(main);
        }
        document.fonts?.ready.then(() => {
            refitNeeded = true;
            requestMeasurement();
        });
        window.addEventListener('pageshow', requestMeasurement);
        applyMotionPreference();
        root.classList.add('motion-ready');
        requestMeasurement();
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
    else initialize();
})();

// Local portfolio terminal: deliberately client-only, with no network calls.
document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('#terminal-input');
    const run = document.querySelector('#terminal-run');
    const body = document.querySelector('.terminal-body');
    if (!input || !run || !body) return;
    const responses = {
        status: 'all services healthy · 12 running · last check just now',
        uptime: '18 days, 04:12 · load average 0.18, 0.21, 0.19',
        ls: 'api/  ollama/  portfolio/  proxy/  backups/',
        help: 'status  uptime  ls  help  clear',
    };
    const execute = () => {
        const command = input.value.trim().toLowerCase();
        if (!command) return;
        if (command === 'clear') {
            [...body.querySelectorAll('.terminal-history')].forEach((line) => line.remove());
        } else {
            const line = document.createElement('div');
            line.className = 'terminal-history terminal-output';
            line.textContent = responses[command] || `command not found: ${command} · try help`;
            body.insertBefore(line, body.querySelector('.terminal-command'));
        }
        input.value = '';
        input.focus();
    };
    run.addEventListener('click', execute);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') execute();
    });
});

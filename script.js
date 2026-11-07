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
        const lens = { x: 0, y: 0, radius: 0, targetRadius: 0, source: null, width: 0, height: 0 };

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
                secretStage.style.setProperty('--lens-r', '0px');
            }
            schedule();
        };

        const setSecretSource = (source) => {
            if (source === lens.source) return;
            lens.source = source;
            lens.width = 0;
            lens.height = 0;
            refitNeeded = true;
            secretCopy.replaceChildren();
            if (!source) return;

            if (source.classList.contains('hero-name')) {
                const name = document.createElement('span');
                name.className = 'secret-name';
                name.textContent = 'Vamshi';
                const aside = document.createElement('span');
                aside.className = 'secret-aside';
                aside.textContent = '(My full name is too long)';
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
            const source = !interactive && hit?.closest('[data-alt]');
            if (!source || !main.contains(source) || !source.dataset.alt.trim()) {
                lens.targetRadius = 0;
                return;
            }
            const sourceStyle = getComputedStyle(source);
            if (sourceStyle.visibility === 'hidden' || Number(sourceStyle.opacity) < .08) {
                lens.targetRadius = 0;
                return;
            }
            setSecretSource(source);
            lens.targetRadius = Math.min(210, window.innerWidth * .19);
        };

        const positionSecret = () => {
            if (!lens.source || (!lens.radius && !lens.targetRadius)) return;
            // Mask wrappers include clipping padding and moving children. Anchor to
            // the rendered line itself, not the wrapper's unanimated border box.
            const anchor = lens.source.querySelector('.line-mask > span, .letter-inner') || lens.source;
            const rect = lens.source.getBoundingClientRect();
            const anchorRect = anchor.getBoundingClientRect();
            const typography = getComputedStyle(anchor);
            const sourceStyle = getComputedStyle(lens.source);
            const originX = anchorRect.left + (parseFloat(typography.paddingLeft) || 0);
            const originY = anchorRect.top + (parseFloat(typography.paddingTop) || 0);
            secretCopy.style.transform = `translate3d(${originX.toFixed(2)}px, ${originY.toFixed(2)}px, 0)`;
            if (!refitNeeded && Math.abs(rect.width - lens.width) < .5 && Math.abs(rect.height - lens.height) < .5) return;
            refitNeeded = false;
            lens.width = rect.width;
            lens.height = rect.height;
            if (rect.width < 1 || rect.height < 1) return;

            const fontSize = parseFloat(typography.fontSize) || 16;
            const lineHeight = parseFloat(typography.lineHeight);
            const letterSpacing = parseFloat(typography.letterSpacing) || 0;
            Object.assign(secretCopy.style, {
                width: `${rect.width}px`,
                height: 'auto',
                boxSizing: 'border-box',
                fontFamily: typography.fontFamily,
                fontWeight: typography.fontWeight,
                fontStyle: typography.fontStyle,
                fontStretch: typography.fontStretch,
                fontFeatureSettings: typography.fontFeatureSettings,
                fontVariationSettings: typography.fontVariationSettings,
                lineHeight: Number.isFinite(lineHeight) ? String(lineHeight / fontSize) : '1.15',
                textAlign: sourceStyle.textAlign,
                textTransform: lens.source.classList.contains('hero-name') ? 'none' : typography.textTransform,
                whiteSpace: 'normal',
                overflowWrap: 'normal',
                wordBreak: 'normal'
            });

            // Keep the same font metrics and baseline. Shrinking a longer joke to
            // fit the old box made the reveal appear to jump away from the text.
            const applySize = (size) => {
                secretCopy.style.fontSize = `${size}px`;
                secretCopy.style.letterSpacing = `${letterSpacing * size / fontSize}px`;
            };
            applySize(fontSize);
            secretCopy.querySelector('.secret-name')?.style.setProperty('line-height', 'inherit');
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
            const radiusEase = 1 - Math.exp(-elapsed / 100);
            lens.x += (pointer.x - lens.x) * positionEase;
            lens.y += (pointer.y - lens.y) * positionEase;
            lens.radius += (lens.targetRadius - lens.radius) * radiusEase;
            if (Math.abs(lens.targetRadius - lens.radius) < .1) lens.radius = lens.targetRadius;
            if (Math.abs(pointer.x - lens.x) < .1) lens.x = pointer.x;
            if (Math.abs(pointer.y - lens.y) < .1) lens.y = pointer.y;

            if (lens.radius || lens.targetRadius) {
                positionSecret();
                secretStage.style.setProperty('--lens-x', `${lens.x.toFixed(2)}px`);
                secretStage.style.setProperty('--lens-y', `${lens.y.toFixed(2)}px`);
                unsettled ||= Math.abs(pointer.x - lens.x) > .1 || Math.abs(pointer.y - lens.y) > .1;
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

        window.addEventListener('scroll', requestMeasurement, { passive: true });
        window.addEventListener('resize', () => {
            refitNeeded = true;
            requestMeasurement();
        }, { passive: true });
        window.addEventListener('pointermove', (event) => {
            if (event.pointerType === 'touch' || motionPaused || !desktopPointer.matches) return;
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

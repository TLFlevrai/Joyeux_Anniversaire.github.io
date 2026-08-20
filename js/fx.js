// ============================================================
//  FX CANVAS : moteur d'effets au clic (cœurs, emojis, bursts)
//  Un seul canvas accéléré GPU remplace des dizaines d'éléments
//  DOM animés (transform/opacity) et des centaines de timers.
//  Le rendu est identique (glyphes emoji + pastilles + anneaux)
//  mais se fait sur un unique calque composité, bien moins coûteux.
//  Choix Canvas2D plutôt que WebGL : le rendu texte/emoji est
//  nativement accéléré GPU et un atelier de glyphes WebGL
//  n'apporterait aucun gain mesurable ici.
// ============================================================
window.LV = window.LV || {};

LV.fx = {
    init: function() {
        const canvas = document.createElement('canvas');
        canvas.id = 'fx-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let W = 0, H = 0, dpr = 1;
        const particles = [];
        let animId = null;
        const EMOJI_FONT = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Symbol", sans-serif';

        // Plafond de particules et DPR selon le preset graphique :
        // legacy-plus = ultra-léger, legacy = léger, normal = équilibré,
        // max_graph = beauté (DPR plein écran, plus de particules)
        function presetCap() {
            const p = window.__graphPreset || 'normal';
            if (p === 'legacy-plus') return 50;
            if (p === 'legacy') return 80;
            if (p === 'max_graph') return 160;
            return 120;
        }
        function presetDpr() {
            const p = window.__graphPreset || 'normal';
            if (p === 'legacy-plus' || p === 'legacy') return 1;
            return Math.min(window.devicePixelRatio || 1, 2);
        }

        // Cache de glyphes (rendus une seule fois, redessinés en drawImage)
        const glyphCache = {};
        let glyphCacheCount = 0;

        function resize() {
            dpr = presetDpr();
            W = canvas.width = Math.round(window.innerWidth * dpr);
            H = canvas.height = Math.round(window.innerHeight * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        window.addEventListener('resize', resize);
        // Changement de preset en cours d'utilisation : ajuste DPR/plafonds
        window.addEventListener('presetchange', resize);
        resize();

        // ---- petites mathématiques d'animation ----
        function easeOut(t) { return 1 - (1 - t) * (1 - t); }
        function easeOutBack(t) {
            const c = 1.70158, c3 = c + 1;
            return 1 + c3 * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
        }
        function lerp(a, b, t) { return a + (b - a) * t; }
        function rand(a, b) { return a + Math.random() * (b - a); }

        function start() {
            if (!animId) animId = requestAnimationFrame(frame);
        }

        function push(p) {
            if (particles.length >= presetCap()) return;
            particles.push(p);
            start();
        }

        function frame() {
            const dt = 1 / 60;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, H);
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.t += dt;
                const q = (p.t - (p.delay || 0)) / p.dur;
                if (q < 0) continue;
                if (step(p, Math.min(1, q))) render(p);
                else particles.splice(i, 1);
            }
            if (particles.length) {
                animId = requestAnimationFrame(frame);
            } else {
                animId = null;
                ctx.clearRect(0, 0, W, H);
            }
        }

        function step(p, q) {
            switch (p.kind) {
                case 'pop':
                    p.y = p.y0 - p.rise * easeOut(q);
                    p.rot = lerp(p.rot0, p.rot1, q);
                    if (q < 0.2) p.scale = lerp(p.s0, p.peak, easeOutBack(q / 0.2));
                    else p.scale = lerp(p.peak, p.s1, easeOut((q - 0.2) / 0.8));
                    p.alpha = q < 0.2 ? lerp(1, 0.8, q / 0.2) : lerp(0.8, 0, (q - 0.2) / 0.8);
                    break;
                case 'flee':
                case 'dot': {
                    const tm = Math.max(0, p.t - (p.delay || 0));
                    p.x = p.x0 + p.vx * tm;
                    p.y = p.y0 + p.vy * tm + 0.5 * p.grav * tm * tm;
                    p.rot = p.rot0 + p.rot1 * q;
                    p.scale = lerp(p.s0, p.s1, easeOut(q));
                    p.alpha = 1 - q;
                    break;
                }
                case 'ring':
                    p.scale = lerp(p.r0, p.r1, easeOut(q));
                    p.alpha = 1 - q;
                    break;
            }
            return p.alpha > 0.01 && q < 1;
        }

        // Glyphe pré-rendu sur un canvas hors-écran (taille quantifiée,
        // cache borné : évite la re-rasterisation à chaque frame)
        function glyphSprite(glyph, size) {
            const key = glyph + '@' + (Math.round(size / 6) * 6);
            let s = glyphCache[key];
            if (!s) {
                if (glyphCacheCount > 60) {
                    for (const k in glyphCache) delete glyphCache[k];
                    glyphCacheCount = 0;
                }
                const c = document.createElement('canvas');
                c.width = Math.ceil(size * 2);
                c.height = Math.ceil(size * 2);
                const g = c.getContext('2d');
                g.font = size + 'px ' + EMOJI_FONT;
                g.textAlign = 'center';
                g.textBaseline = 'middle';
                g.fillText(glyph, c.width / 2, c.height / 2);
                s = { c: c, half: c.width / 2 };
                glyphCache[key] = s;
                glyphCacheCount++;
            }
            return s;
        }

        function render(p) {
            ctx.globalAlpha = p.alpha;
            if (p.kind === 'ring') {
                ctx.strokeStyle = p.color;
                ctx.lineWidth = p.lineWidth;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.scale, 0, 6.2831853);
                ctx.stroke();
                return;
            }
            ctx.setTransform(dpr, 0, 0, dpr, p.x, p.y);
            if (p.kind === 'dot') {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(0, 0, p.r * p.scale, 0, 6.2831853);
                ctx.fill();
            } else {
                ctx.rotate(p.rot * Math.PI / 180);
                const sp = glyphSprite(p.glyph, p.size);
                const t = p.size * 2 * p.scale;
                ctx.drawImage(sp.c, -sp.half * p.scale, -sp.half * p.scale, t, t);
            }
        }

        // ---- émetteurs d'effets (parallèle aux versions DOM d'origine) ----

        // POP : un emoji qui bondit puis s'élève en fondu
        function emitPop(x, y, glyph, sizePx, opts) {
            opts = opts || {};
            push({
                kind: 'pop', x: x, x0: x, y: y, y0: y, glyph: glyph, size: sizePx,
                rise: opts.rise !== undefined ? opts.rise : 160,
                rot0: opts.rot0 !== undefined ? opts.rot0 : rand(-20, 0),
                rot1: opts.rot1 !== undefined ? opts.rot1 : 30,
                s0: opts.s0 !== undefined ? opts.s0 : 0.3,
                peak: opts.peak !== undefined ? opts.peak : 1.4,
                s1: opts.s1 !== undefined ? opts.s1 : 0.6,
                dur: opts.dur !== undefined ? opts.dur : 1.15,
                alpha: 1, scale: 0.3, rot: 0, t: 0, delay: 0
            });
        }

        // FLEE : emoji projeté (explosion / fontaine / anneau / burst)
        function emitFlee(x, y, glyph, sizePx, angle, speed, dur, opts) {
            opts = opts || {};
            push({
                kind: 'flee', x: x, x0: x, y: y, y0: y, glyph: glyph, size: sizePx,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                grav: opts.grav || 0,
                rot0: opts.rot0 !== undefined ? opts.rot0 : 0,
                rot1: opts.rot1 !== undefined ? opts.rot1 : rand(-90, 90),
                s0: opts.s0 !== undefined ? opts.s0 : 0.6,
                s1: opts.s1 !== undefined ? opts.s1 : 1.2,
                dur: dur, alpha: 1, scale: 0.6, rot: 0, t: 0, delay: opts.delay || 0
            });
        }

        // DOT : pastille de couleur projetée
        function emitDot(x, y, color, r, angle, speed, dur, opts) {
            opts = opts || {};
            push({
                kind: 'dot', x: x, x0: x, y: y, y0: y, color: color, r: r,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                grav: opts.grav || 0,
                rot0: 0, rot1: 0,
                s0: opts.s0 !== undefined ? opts.s0 : 0.5,
                s1: opts.s1 !== undefined ? opts.s1 : 1.4,
                dur: dur, alpha: 1, scale: 0.5, rot: 0, t: 0, delay: opts.delay || 0
            });
        }

        // RING : anneau qui s'étend en fondu
        function emitRing(x, y, r1, color, dur, lineWidth) {
            push({
                kind: 'ring', x: x, y: y, r0: 10, r1: r1, color: color,
                dur: dur || 0.85, alpha: 1, scale: 10,
                lineWidth: lineWidth || 2, t: 0, delay: 0
            });
        }

        // EXPLOSION : emojis projetés dans toutes les directions
        function emitBurst(x, y, items) {
            const density = window.__graphDensity || 1;
            const n = Math.max(4, Math.round(9 * density));
            for (let i = 0; i < n; i++) {
                const angle = (i / n) * Math.PI * 2 + rand(0, 0.6);
                const dist = rand(55, 140);
                emitFlee(x, y, items[Math.floor(Math.random() * items.length)], rand(17.6, 38.4),
                    angle, dist / 0.8, 0.8,
                    { rot1: rand(-90, 90), s0: 0.5, s1: rand(0.5, 1.3) });
            }
        }

        // FONTAINE : emojis qui jaillissent vers le haut en cascade
        function emitFountain(x, y, items) {
            const density = window.__graphDensity || 1;
            const n = Math.max(3, Math.round(7 * density));
            for (let i = 0; i < n; i++) {
                emitFlee(x + rand(-13, 13), y,
                    items[Math.floor(Math.random() * items.length)], rand(12.8, 24),
                    -Math.PI / 2 + rand(-0.5, 0.5), rand(70, 150), 1.3,
                    { grav: 90, rot1: rand(-70, 70), s0: 0.35, s1: rand(0.35, 0.9), delay: i * 0.07 });
            }
        }

        // ANNEAU : emojis éclatent en cercle
        function emitRingEffect(x, y, items) {
            const density = window.__graphDensity || 1;
            const n = Math.max(5, Math.round(10 * density));
            for (let i = 0; i < n; i++) {
                const angle = (i / n) * Math.PI * 2;
                const radius = rand(70, 100);
                emitFlee(x, y, items[Math.floor(Math.random() * items.length)], 13.6,
                    angle, radius / 0.7, 0.7,
                    { rot1: rand(-45, 45), s0: 0.85, s1: 0.85 });
            }
        }

        // ONDE : anneaux d'eau + cœur central qui monte
        function emitRipple(x, y) {
            const colors = ['#ff8aa8', '#7bbf7e', '#ffd166'];
            for (let i = 0; i < 2; i++) {
                emitRing(x, y, (4.5 + i * 2.5) * 10, colors[i], 0.85);
            }
            emitPop(x, y, '💗', 25.6, { rise: 48, s0: 1, peak: 1, s1: 1.5, dur: 0.6, rot0: 0, rot1: 0 });
        }

        // BURST DU VERROUILLAGE : emojis + pastilles colorées
        function emitLockBurst(x, y) {
            const density = window.__graphDensity || 1;
            const mobile = !!window.__isMobile;
            const n = Math.max(5, Math.round((mobile ? 10 : 14) * density));
            const emojis = ['🎵', '🎶', '🎹', '🎼', '💚', '💕', '🧸', '🌺'];
            const colors = ['#ff8aa8', '#7bbf7e', '#ffd166', '#9bcb9e', '#ffb6c9', '#b58fd6'];
            for (let i = 0; i < n; i++) {
                const angle = (i / n) * Math.PI * 2 + rand(0, 0.7);
                const dist = (mobile ? 34 : 45) + rand(0, mobile ? 55 : 75);
                const speed = dist / 0.7;
                if (Math.random() < 0.35) {
                    emitFlee(x, y, emojis[Math.floor(Math.random() * emojis.length)], rand(16, 33.6),
                        angle, speed, 0.7,
                        { rot1: rand(-90, 90), s0: 0.5, s1: rand(0.5, 1.4) });
                } else {
                    emitDot(x, y, colors[Math.floor(Math.random() * colors.length)], rand(2.5, 6), angle, speed, 0.7);
                }
            }
        }

        // ---- API publique ----
        function activeCount() { return particles.length; }
        function setLayer(z) { canvas.style.zIndex = z; }

        LV.fx.emitPop = emitPop;
        LV.fx.emitBurst = emitBurst;
        LV.fx.emitFountain = emitFountain;
        LV.fx.emitRingEffect = emitRingEffect;
        LV.fx.emitRipple = emitRipple;
        LV.fx.emitLockBurst = emitLockBurst;
        LV.fx.active = activeCount;
        LV.fx.setLayer = setLayer;

        // Vue principale par défaut (le verrouillage repasse au-dessus via z-index)
        setLayer('9998');
    }
};
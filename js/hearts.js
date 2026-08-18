// ============================================================
//  CŒURS AU CLIC : compteur + apparition d'emojis + bouton +1
// ============================================================
window.LV = window.LV || {};

LV.hearts = {
    init: function() {
        const heartCountEl = document.getElementById('heartCount');
        let heartCount = 0;

        // Limite les éléments spawnés au clic (perf : évite la saturation du DOM)
        let activeSpawns = 0;
        const MAX_ACTIVE_SPAWNS = 40;

        // Incrémente le compteur de cœurs (avec petite animation "pop")
        function addOne() {
            heartCount += 1;
            heartCountEl.textContent = heartCount;
            heartCountEl.style.transform = 'scale(1.5)';
            setTimeout(() => { heartCountEl.style.transform = 'scale(1)'; }, 200);
        }

        function spawnItemAtCursor(x, y, items = ['💚', '💕', '💗', '🌺', '🧸']) {
            // Incrémenter le compteur à chaque clic (même si le spawn visuel est limité)
            addOne();

            if (activeSpawns >= MAX_ACTIVE_SPAWNS) return;
            activeSpawns++;
            const el = document.createElement('span');
            el.textContent = items[Math.floor(Math.random() * items.length)];
            el.style.position = 'fixed';
            el.style.left = (x - 16 + (Math.random() - 0.5) * 40) + 'px';
            el.style.top = (y - 16 + (Math.random() - 0.5) * 40) + 'px';
            el.style.fontSize = (1.6 + Math.random() * 2.2) + 'rem';
            el.style.pointerEvents = 'none';
            el.style.zIndex = '9998';
            el.style.transition = 'all 1.2s cubic-bezier(.34, 1.56, .64, 1)';
            el.style.opacity = '1';
            el.style.transform = 'scale(0.3) rotate(-20deg)';
            document.body.appendChild(el);

            requestAnimationFrame(() => {
                el.style.transform = 'scale(1.4) rotate(10deg) translateY(-80px)';
                el.style.opacity = '0.8';
            });

            setTimeout(() => {
                el.style.transform = 'scale(0.6) rotate(30deg) translateY(-160px)';
                el.style.opacity = '0';
            }, 200);

            setTimeout(() => {
                el.remove();
                activeSpawns--;
            }, 1400);
        }

        // Spawn visuel uniquement (n'incrémente pas le compteur)
        function spawnVisualOnly(x, y, items = ['💚', '💕', '💗']) {
            if (activeSpawns >= MAX_ACTIVE_SPAWNS) return;
            activeSpawns++;
            const el = document.createElement('span');
            el.textContent = items[Math.floor(Math.random() * items.length)];
            el.style.position = 'fixed';
            el.style.left = (x - 16 + (Math.random() - 0.5) * 40) + 'px';
            el.style.top = (y - 16 + (Math.random() - 0.5) * 40) + 'px';
            el.style.fontSize = (1.6 + Math.random() * 2.2) + 'rem';
            el.style.pointerEvents = 'none';
            el.style.zIndex = '9998';
            el.style.transition = 'all 1.2s cubic-bezier(.34, 1.56, .64, 1)';
            el.style.opacity = '1';
            el.style.transform = 'scale(0.3) rotate(-20deg)';
            document.body.appendChild(el);

            requestAnimationFrame(() => {
                el.style.transform = 'scale(1.4) rotate(10deg) translateY(-80px)';
                el.style.opacity = '0.8';
            });

            setTimeout(() => {
                el.style.transform = 'scale(0.6) rotate(30deg) translateY(-160px)';
                el.style.opacity = '0';
            }, 200);

            setTimeout(() => {
                el.remove();
                activeSpawns--;
            }, 1400);
        }

        // ============================================================
        //  EFFETS DE CLIC VARIÉS : chaque clic pioche un style au hasard
        // ============================================================
        const CLICK_ITEMS = ['💚', '💕', '💗', '🌺', '🧸'];

        function makeParticle(x, y, size) {
            const el = document.createElement('span');
            el.textContent = CLICK_ITEMS[Math.floor(Math.random() * CLICK_ITEMS.length)];
            el.style.position = 'fixed';
            el.style.left = (x - size * 8) + 'px';
            el.style.top = (y - size * 8) + 'px';
            el.style.fontSize = size + 'rem';
            el.style.pointerEvents = 'none';
            el.style.zIndex = '9998';
            el.style.opacity = '1';
            return el;
        }

        // 1. Pop unique (effet d'origine) : un emoji bondit puis s'élève
        //    (spawnItemAtCursor existant, compteur +1 inclus)

        // 2. Explosion : emojis projetés dans toutes les directions
        function spawnBurstEffect(x, y) {
            if (activeSpawns >= MAX_ACTIVE_SPAWNS) return;
            activeSpawns++;
            const n = 9;
            for (let i = 0; i < n; i++) {
                const el = makeParticle(x, y, 1.1 + Math.random() * 1.3);
                const angle = (i / n) * Math.PI * 2 + Math.random() * 0.6;
                const dist = 55 + Math.random() * 85;
                el.style.transition = 'transform 0.8s cubic-bezier(.17,.89,.32,1.15), opacity 0.8s ease';
                document.body.appendChild(el);
                requestAnimationFrame(() => {
                    el.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) rotate(${(Math.random() - 0.5) * 180}deg) scale(${0.5 + Math.random() * 0.8})`;
                    el.style.opacity = '0';
                });
                setTimeout(() => el.remove(), 830);
            }
            setTimeout(() => activeSpawns--, 840);
        }

        // 3. Fontaine : petits emojis qui jaillissent vers le haut en cascade
        function spawnFountainEffect(x, y) {
            if (activeSpawns >= MAX_ACTIVE_SPAWNS) return;
            activeSpawns++;
            const n = 7;
            for (let i = 0; i < n; i++) {
                setTimeout(() => {
                    const el = makeParticle(x + (Math.random() - 0.5) * 26, y, 0.8 + Math.random() * 0.7);
                    el.style.transition = 'transform 1.3s cubic-bezier(.25,.46,.45,.94), opacity 1.3s ease';
                    document.body.appendChild(el);
                    requestAnimationFrame(() => {
                        el.style.transform = `translate(${(Math.random() - 0.5) * 120}px, ${-55 - Math.random() * 140}px) rotate(${(Math.random() - 0.5) * 140}deg) scale(${0.35 + Math.random() * 0.55})`;
                        el.style.opacity = '0';
                    });
                    setTimeout(() => el.remove(), 1350);
                }, i * 70);
            }
            setTimeout(() => activeSpawns--, 950);
        }

        // 4. Anneau : cœur éclatent en cercle autour du curseur
        function spawnRingEffect(x, y) {
            if (activeSpawns >= MAX_ACTIVE_SPAWNS) return;
            activeSpawns++;
            const n = 10;
            for (let i = 0; i < n; i++) {
                const el = makeParticle(x, y, 0.85);
                const angle = (i / n) * Math.PI * 2;
                const radius = 70 + Math.random() * 30;
                el.style.transition = 'transform 0.7s cubic-bezier(.17,.89,.32,1.12), opacity 0.7s ease';
                document.body.appendChild(el);
                requestAnimationFrame(() => {
                    el.style.transform = `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px) rotate(${(Math.random() - 0.5) * 90}deg)`;
                    el.style.opacity = '0';
                });
                setTimeout(() => el.remove(), 750);
            }
            setTimeout(() => activeSpawns--, 760);
        }

        // 5. Onde : anneaux d'eau + cœur central qui monte
        function spawnRippleEffect(x, y) {
            if (activeSpawns >= MAX_ACTIVE_SPAWNS) return;
            activeSpawns++;
            const ringColors = ['#ff8aa8', '#7bbf7e', '#ffd166'];
            for (let i = 0; i < 2; i++) {
                const ring = document.createElement('div');
                ring.style.position = 'fixed';
                ring.style.left = (x - 10) + 'px';
                ring.style.top = (y - 10) + 'px';
                ring.style.width = '20px';
                ring.style.height = '20px';
                ring.style.borderRadius = '50%';
                ring.style.border = '2px solid ' + ringColors[i];
                ring.style.pointerEvents = 'none';
                ring.style.zIndex = '9997';
                ring.style.transition = 'transform 0.85s cubic-bezier(.22,1,.36,1), opacity 0.85s ease';
                document.body.appendChild(ring);
                requestAnimationFrame(() => {
                    ring.style.transform = 'scale(' + (4.5 + i * 2.5) + ')';
                    ring.style.opacity = '0';
                });
                setTimeout(() => ring.remove(), 880);
            }
            const heart = makeParticle(x, y, 1.6);
            heart.textContent = '💗';
            heart.style.transition = 'transform 0.6s cubic-bezier(.34,1.56,.64,1), opacity 0.6s ease';
            document.body.appendChild(heart);
            requestAnimationFrame(() => {
                heart.style.transform = 'translateY(-48px) scale(1.5)';
                heart.style.opacity = '0';
            });
            setTimeout(() => heart.remove(), 650);
            setTimeout(() => activeSpawns--, 890);
        }

        // Pioche aléatoire parmi les styles (compteur +1 à chaque clic)
        function spawnClickEffect(x, y) {
            addOne();
            const r = Math.random();
            if (r < 0.30) {
                // Pop unique : même mouvement que l'effet d'origine,
                // sans re-compter (le compteur est déjà incrémenté)
                spawnVisualOnly(x, y, CLICK_ITEMS);
            } else if (r < 0.55) {
                spawnBurstEffect(x, y);
            } else if (r < 0.78) {
                spawnFountainEffect(x, y);
            } else if (r < 0.92) {
                spawnRingEffect(x, y);
            } else {
                spawnRippleEffect(x, y);
            }
        }

        // API partagée (utilisée par confetti et lock-screen)
        LV.hearts.spawnItemAtCursor = spawnItemAtCursor;
        LV.hearts.spawnVisualOnly = spawnVisualOnly;
        LV.hearts.spawnClickEffect = spawnClickEffect;
        LV.hearts.addOne = addOne;

        // Clic sur la page (sauf boutons, carte, et bouton musique)
        document.addEventListener('click', function(e) {
            if (window.__pageLocked) return;
            if (e.target.closest('.btn') || e.target.closest('.card') || e.target.closest('.music-btn')) return;
            console.log('Page clicked at:', e.clientX, e.clientY);
            spawnClickEffect(e.clientX, e.clientY);
            if (Math.random() < 0.15) LV.confetti.launch(12);
        });

        // Clic sur la carte (hors boutons)
        document.querySelector('.card').addEventListener('click', function(e) {
            if (window.__pageLocked) return;
            if (e.target.closest('.btn')) return;
            console.log('Card clicked at:', e.clientX, e.clientY);
            spawnClickEffect(e.clientX, e.clientY);
        });

        // Bouton "+1 cœur"
        document.getElementById('heartBtn').addEventListener('click', function(e) {
            e.preventDefault();
            const rect = this.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            // Spawn a single heart at button center (matching "+1 cœur")
            spawnItemAtCursor(cx, cy, ['💚', '💕', '💗']);

            // Also spawn a few more around for visual effect (but don't increment counter extra)
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.5;
                const dist = 40 + Math.random() * 60;
                const x = cx + Math.cos(angle) * dist;
                const y = cy + Math.sin(angle) * dist - 20;
                spawnVisualOnly(x, y, ['💚', '💕', '💗']);
            }

            LV.confetti.launch(25);
            this.style.transform = 'scale(0.92)';
            setTimeout(() => { this.style.transform = ''; }, 150);
        });
    }
};

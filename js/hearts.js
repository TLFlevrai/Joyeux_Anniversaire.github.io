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

        // API partagée (utilisée par confetti et lock-screen)
        LV.hearts.spawnItemAtCursor = spawnItemAtCursor;
        LV.hearts.spawnVisualOnly = spawnVisualOnly;
        LV.hearts.addOne = addOne;

        // Clic sur la page (sauf boutons, carte, et bouton musique)
        document.addEventListener('click', function(e) {
            if (window.__pageLocked) return;
            if (e.target.closest('.btn') || e.target.closest('.card') || e.target.closest('.music-btn')) return;
            console.log('Page clicked at:', e.clientX, e.clientY);
            spawnItemAtCursor(e.clientX, e.clientY);
            if (Math.random() < 0.15) LV.confetti.launch(12);
        });

        // Clic sur la carte (hors boutons)
        document.querySelector('.card').addEventListener('click', function(e) {
            if (window.__pageLocked) return;
            if (e.target.closest('.btn')) return;
            console.log('Card clicked at:', e.clientX, e.clientY);
            spawnItemAtCursor(e.clientX, e.clientY);
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

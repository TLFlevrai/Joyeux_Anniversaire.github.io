// ============================================================
//  CŒURS AU CLIC : compteur + effets d'emojis (canvas GPU)
//  Les effets visuels (pop, explosion, fontaine, anneau, onde)
//  sont rendus par LV.fx sur un unique canvas, au lieu de
//  dizaines d'éléments DOM animés + timers.
// ============================================================
window.LV = window.LV || {};

LV.hearts = {
    init: function() {
        const heartCountEl = document.getElementById('heartCount');
        let heartCount = 0;

        // Limite souple des particules du calque cœurs, selon le preset :
        // le moteur fx a son propre plafond (120) ; ici on bride plus tôt
        // en mode léger pour garder des effets réactifs et économes
        function fxMax() {
            const p = window.__graphPreset || 'normal';
            if (p === 'legacy-plus') return 30;
            if (p === 'legacy') return 45;
            if (p === 'max_graph') return 90;
            return 60;
        }

        // Incrémente le compteur de cœurs (avec petite animation "pop")
        function addOne() {
            heartCount += 1;
            heartCountEl.textContent = heartCount;
            heartCountEl.style.transform = 'scale(1.5)';
            setTimeout(() => { heartCountEl.style.transform = 'scale(1)'; }, 200);
        }

        // Pop unique : un emoji bondit puis s'élève (compteur +1 inclus)
        function spawnItemAtCursor(x, y, items = ['💚', '💕', '💗', '🌺', '🧸']) {
            addOne();
            if (LV.fx.active() >= fxMax()) return;
            LV.fx.emitPop(
                x + (Math.random() - 0.5) * 40,
                y + (Math.random() - 0.5) * 40,
                items[Math.floor(Math.random() * items.length)],
                (1.6 + Math.random() * 2.2) * 16
            );
        }

        // Spawn visuel uniquement (n'incrémente pas le compteur)
        function spawnVisualOnly(x, y, items = ['💚', '💕', '💗']) {
            if (LV.fx.active() >= fxMax()) return;
            LV.fx.emitPop(
                x + (Math.random() - 0.5) * 40,
                y + (Math.random() - 0.5) * 40,
                items[Math.floor(Math.random() * items.length)],
                (1.6 + Math.random() * 2.2) * 16
            );
        }

        // ============================================================
        //  EFFETS DE CLIC VARIÉS : chaque clic pioche un style au hasard
        // ============================================================
        const CLICK_ITEMS = ['💚', '💕', '💗', '🌺', '🧸'];

        // 1. Pop unique (effet d'origine) : emoji qui monte (compteur +1 inclus)

        // 2. Explosion : emojis projetés dans toutes les directions
        function spawnBurstEffect(x, y) {
            if (LV.fx.active() >= fxMax()) return;
            LV.fx.emitBurst(x, y, CLICK_ITEMS);
        }

        // 3. Fontaine : petits emojis qui jaillissent vers le haut en cascade
        function spawnFountainEffect(x, y) {
            if (LV.fx.active() >= fxMax()) return;
            LV.fx.emitFountain(x, y, CLICK_ITEMS);
        }

        // 4. Anneau : cœurs éclatent en cercle autour du curseur
        function spawnRingEffect(x, y) {
            if (LV.fx.active() >= fxMax()) return;
            LV.fx.emitRingEffect(x, y, CLICK_ITEMS);
        }

        // 5. Onde : anneaux d'eau + cœur central qui monte
        function spawnRippleEffect(x, y) {
            if (LV.fx.active() >= fxMax()) return;
            LV.fx.emitRipple(x, y);
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
            if (e.target.closest('.btn') || e.target.closest('.card') || e.target.closest('.music-btn') ||
                e.target.closest('.main-music-ctrl') || e.target.closest('.main-msg-zone')) return;
            if (document.querySelector('.modal-overlay.active')) return;
            spawnClickEffect(e.clientX, e.clientY);
            if (Math.random() < 0.15) LV.confetti.launch(12);
        });

        // Clic sur la carte (hors boutons)
        document.querySelector('.card').addEventListener('click', function(e) {
            if (window.__pageLocked) return;
            if (e.target.closest('.btn') || e.target.closest('.main-msg-zone')) return;
            spawnClickEffect(e.clientX, e.clientY);
        });

        // Bouton "+1 cœur" fusionné avec les confettis (bouton "Célébrer" dans confetti.js)
    }
};
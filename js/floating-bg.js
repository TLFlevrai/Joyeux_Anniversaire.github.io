// ============================================================
//  FONDS FLOTTANT : CŒURS + NOUNOURS + HIBISCUS
// ============================================================
window.LV = window.LV || {};

LV.floatingBg = {
    init: function() {
        const container = document.getElementById('floatingBg');
        const symbols = ['💚', '💕', '🧸', '🌺', '💗', '🍀', '✨', '🎵', '🎶', '🎹', '🎼', '💜'];
        const density = window.__graphDensity || 1;
        const count = Math.round(26 * density);

        for (let i = 0; i < count; i++) {
            const el = document.createElement('span');
            el.className = 'floating-item';
            el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            el.style.left = Math.random() * 100 + '%';
            el.style.top = Math.random() * 100 + '%';
            el.style.fontSize = (1.4 + Math.random() * 2.2) + 'rem';
            el.style.animationDuration = (16 + Math.random() * 18) + 's';
            el.style.animationDelay = (-Math.random() * 30) + 's';
            el.style.opacity = 0.35 + Math.random() * 0.3;
            container.appendChild(el);
        }
    // Helper partagé : fige/relance le fond flottant (utilisé pendant
        // les modales pour éviter les re-blur plein écran invisibles)
        LV.floatingBg.setPaused = function(paused) {
            const items = container.querySelectorAll('.floating-item');
            for (let i = 0; i < items.length; i++) {
                items[i].style.animationPlayState = paused ? 'paused' : '';
            }
        };
    }
};

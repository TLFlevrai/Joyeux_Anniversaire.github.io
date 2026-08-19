// ============================================================
//  MAIN : lancement des modules après chargement du DOM
// ============================================================
document.addEventListener('DOMContentLoaded', function() {

    // Ordre important : lock-screen (verrouillage) avant music (autoplay)
    LV.title.init();
    LV.debug.init();
    LV.floatingBg.init();
    LV.confetti.init();
    LV.reveal.init();
    LV.hearts.init();
    LV.lockScreen.init();
    LV.music.init();

    // Accessibilité : libellés ARIA sur les boutons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.setAttribute('aria-label', btn.textContent.trim());
    });

    // Son de clic sur tous les boutons
    const clickSfx = document.getElementById('clickSfx');
    if (clickSfx) {
        document.querySelectorAll('.btn, .lock-ctrl-btn, .carousel-btn, .modal-close').forEach(function(btn) {
            btn.addEventListener('click', function() {
                clickSfx.currentTime = 0;
                clickSfx.play().catch(function() {});
            });
        });
    }
});

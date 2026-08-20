// ============================================================
//  MAIN : lancement des modules après chargement du DOM
// ============================================================
document.addEventListener('DOMContentLoaded', function() {

    // Ordre important : fx (canvas d'effets) avant hearts/lock-screen,
    // lock-screen (verrouillage) avant music (autoplay)
    LV.fx.init();
    LV.title.init();
    LV.debug.init();
    LV.floatingBg.init();
    LV.confetti.init();
    LV.reveal.init();
    LV.hearts.init();
    LV.lockScreen.init();
    LV.music.init();

    // ===== MESSAGE D'ANNIVERSAIRE : alternance "le monde" / "mon monde" =====
    const worldWord = document.getElementById('worldWord');
    const birthdayLine = document.getElementById('birthdayLine');
    let isMon = false;

    // Force l'état initial (au cas où)
    worldWord.textContent = 'le monde';
    worldWord.style.transform = 'rotateX(0deg)';
    worldWord.style.opacity = '1';

    function flipWorldWord() {
        isMon = !isMon;
        const newWord = isMon ? 'mon monde' : 'le monde';

        // Animation premium : flip 3D + fondu
        worldWord.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
        worldWord.style.transform = 'rotateX(90deg)';
        worldWord.style.opacity = '0';

        setTimeout(() => {
            worldWord.textContent = newWord;
            worldWord.style.transform = 'rotateX(0deg)';
            worldWord.style.opacity = '1';

            // Légère pulsation de la ligne entière
            birthdayLine.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            birthdayLine.style.transform = 'scale(1.02)';
            setTimeout(() => { birthdayLine.style.transform = 'scale(1)'; }, 400);
        }, 300);
    }

    // Premier changement après 2s, puis toutes les 2s
    setTimeout(flipWorldWord, 2000);
    setInterval(flipWorldWord, 2000);

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

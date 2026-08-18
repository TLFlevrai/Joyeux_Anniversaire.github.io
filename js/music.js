// ============================================================
//  LECTEUR DE MUSIQUE
// ============================================================
window.LV = window.LV || {};

LV.music = {
    init: function() {
        const audio = document.getElementById('bgMusic');
        const musicBtn = document.getElementById('musicBtn');
        let isPlaying = false;
        let hasUserInteracted = false;

        function tryAutoPlay() {
            if (window.__pageLocked) return;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                    updateButton();
                    console.log('Audio autoplay success');
                }).catch(err => {
                    isPlaying = false;
                    updateButton();
                    console.log('Audio autoplay blocked:', err.name);
                });
            }
        }

        function updateButton() {
            if (isPlaying) {
                musicBtn.textContent = '⏸️';
                musicBtn.classList.remove('paused');
                musicBtn.setAttribute('aria-label', 'Pause music');
                musicBtn.title = 'Pause music';
            } else {
                musicBtn.textContent = '▶️';
                musicBtn.classList.add('paused');
                musicBtn.setAttribute('aria-label', 'Play music');
                musicBtn.title = 'Play music';
            }
        }

        function toggleMusic() {
            if (isPlaying) {
                audio.pause();
                isPlaying = false;
            } else {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        isPlaying = true;
                    }).catch(err => {
                        isPlaying = false;
                        console.log('Audio play failed:', err.name);
                    });
                }
            }
            updateButton();
        }

        musicBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            hasUserInteracted = true;
            toggleMusic();
        });

        // Démarre la musique au déblocage du site (appelé par l'écran de verrouillage)
        window.__startMusic = function() {
            if (!isPlaying && !window.__pageLocked) {
                tryAutoPlay();
            }
        };

        // Attendre que l'audio soit prêt
        audio.addEventListener('canplaythrough', tryAutoPlay, { once: true });

        // Fallback: tenter au premier clic utilisateur n'importe où
        function handleFirstInteraction() {
            if (window.__pageLocked) return;
            if (!hasUserInteracted) {
                hasUserInteracted = true;
                if (!isPlaying) {
                    tryAutoPlay();
                }
            }
        }

        // Écouter plusieurs types d'interactions pour maximiser les chances
        ['click', 'keydown', 'touchstart'].forEach(evt => {
            document.addEventListener(evt, handleFirstInteraction, { passive: true });
        });

        // Log erreurs audio
        audio.addEventListener('error', (e) => {
            console.error('Audio error:', audio.error);
            updateButton();
        });

        // Gérer la fin de lecture (boucle)
        audio.addEventListener('ended', () => {
            if (isPlaying) {
                audio.currentTime = 0;
                audio.play().catch(err => {
                    console.log('Loop play failed:', err.name);
                    isPlaying = false;
                    updateButton();
                });
            }
        });

        // Mettre à jour l'état si l'audio est mis en pause par le navigateur
        audio.addEventListener('pause', () => {
            if (isPlaying) {
                isPlaying = false;
                updateButton();
            }
        });

        audio.addEventListener('play', () => {
            if (!isPlaying) {
                isPlaying = true;
                updateButton();
            }
        });
    }
};

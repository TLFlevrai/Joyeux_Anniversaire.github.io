// ============================================================
//  LECTEUR DE MUSIQUE (3 titres, aléatoire sans répétition)
// ============================================================
window.LV = window.LV || {};

LV.music = {
    init: function() {
        const audio = document.getElementById('bgMusic');
        const musicBtn = document.getElementById('musicBtn');
        const musicSkipBtn = document.getElementById('musicSkipBtn');
        const mainVolume = document.getElementById('mainVolume');
        const mainProgress = document.getElementById('mainProgress');
        const mainProgressFill = document.getElementById('mainProgressFill');
        const mainSongList = document.getElementById('mainSongList');
        let isPlaying = false;
        let hasUserInteracted = false;
        let currentIdx = null;

        const MAIN_SONGS = [
            { src: 'assets/audio/universfield-calm-piano-background-352250.mp3', name: 'Universfield', emoji: '🎹' },
            { src: 'assets/audio/Who%20Knows%20Instrumental.m4a', name: 'Who Knows', emoji: '🎶' },
            { src: 'assets/audio/MONDE%20Instrumental.m4a', name: 'MONDE', emoji: '🌍' }
        ];
        let songPool = [];

        // Pioche aléatoire sans rejouer un titre déjà passé tant que
        // tous les titres n'ont pas été entendus
        function pickSong() {
            if (songPool.length === 0) {
                songPool = MAIN_SONGS.map(function(_, i) { return i; });
            }
            const i = Math.floor(Math.random() * songPool.length);
            return songPool.splice(i, 1)[0];
        }

        function playSongFromPool(forcedIdx) {
            let idx = forcedIdx;
            if (idx === undefined) {
                idx = pickSong();
            } else {
                // Choix direct dans la liste : le titre compte comme entendu
                const pi = songPool.indexOf(idx);
                if (pi !== -1) songPool.splice(pi, 1);
            }
            currentIdx = idx;
            const abs = new URL(MAIN_SONGS[idx].src, window.location.href).href;
            if (audio.src !== abs) audio.src = abs;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                }).catch(err => {
                    isPlaying = false;
                    // Titre non entendu : il reste à jouer plus tard
                    if (forcedIdx === undefined) songPool.push(idx);
                    console.log('Audio play blocked:', err.name);
                });
            }
            updateButton();
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
            updateSongList();
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

        // ===== BARRE DE PROGRESSION (état d'avancement du titre) =====
        function updateProgress() {
            const dur = audio.duration;
            const cur = audio.currentTime;
            const pct = (dur && isFinite(dur) && dur > 0 && cur > 0) ? Math.min(100, (cur / dur) * 100) : 0;
            mainProgressFill.style.width = pct + '%';
            mainProgress.style.setProperty('--pct', pct + '%');
        }
        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', updateProgress);

        // ===== LISTE DES CHANSONS (sélection directe au clic sur la barre) =====
        function buildSongList() {
            mainSongList.innerHTML = '';
            MAIN_SONGS.forEach(function(song, i) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'main-song-item';
                btn.setAttribute('role', 'menuitem');
                btn.innerHTML = '<span class="song-emoji">' + song.emoji +
                    '</span><span class="song-name">' + song.name +
                    '</span><span class="song-state"></span>';
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    hasUserInteracted = true;
                    playSongFromPool(i);
                    closeSongList();
                });
                mainSongList.appendChild(btn);
            });
        }

        function updateSongList() {
            mainSongList.querySelectorAll('.main-song-item').forEach(function(btn, i) {
                const isCurrent = (i === currentIdx);
                btn.classList.toggle('active', isCurrent);
                btn.querySelector('.song-state').textContent = isCurrent ? (isPlaying ? 'en cours' : 'pause') : '';
            });
        }

        function openSongList() {
            mainSongList.classList.add('open');
            mainSongList.setAttribute('aria-hidden', 'false');
            updateSongList();
        }

        function closeSongList() {
            mainSongList.classList.remove('open');
            mainSongList.setAttribute('aria-hidden', 'true');
        }

        mainProgress.addEventListener('click', function(e) {
            e.stopPropagation();
            if (mainSongList.classList.contains('open')) {
                closeSongList();
            } else {
                openSongList();
            }
        });
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.main-song-list') && !e.target.closest('.main-music-ctrl')) {
                closeSongList();
            }
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainSongList.classList.contains('open')) closeSongList();
        });

        buildSongList();

        musicBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            hasUserInteracted = true;
            var sfx = document.getElementById('clickMusicSfx');
            if (sfx) { sfx.currentTime = 0; sfx.play().catch(function() {}); }
            toggleMusic();
        });

        // Skip : titre suivant (aléatoire, sans répétition tant que tout n'a pas été entendu)
        musicSkipBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            hasUserInteracted = true;
            var sfx = document.getElementById('clickMusicSfx');
            if (sfx) { sfx.currentTime = 0; sfx.play().catch(function() {}); }
            playSongFromPool();
        });

        // Volume propre à la musique principale
        audio.volume = mainVolume ? mainVolume.value / 100 : 1;
        if (mainVolume) {
            mainVolume.addEventListener('input', function() {
                audio.volume = mainVolume.value / 100;
            });
            mainVolume.addEventListener('change', function() {
                audio.volume = mainVolume.value / 100;
            });
        }

        // Démarre la musique au déblocage du site (appelé par l'écran de verrouillage)
        window.__startMusic = function() {
            if (!isPlaying && !window.__pageLocked) {
                playSongFromPool();
            }
        };

        // Fallback: tenter au premier clic utilisateur n'importe où
        function handleFirstInteraction() {
            if (window.__pageLocked) return;
            if (!hasUserInteracted) {
                hasUserInteracted = true;
                if (!isPlaying) {
                    playSongFromPool();
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

        // Fin naturelle d'un titre : on enchaîne sur le suivant de la rotation
        audio.addEventListener('ended', () => {
            if (isPlaying) {
                isPlaying = false;
                playSongFromPool();
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

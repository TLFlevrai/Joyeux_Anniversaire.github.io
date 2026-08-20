// ============================================================
//  LECTEUR DE MUSIQUE (9 titres, aléatoire sans répétition)
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
        const mainNowPlaying = document.getElementById('mainNowPlaying');
        let isPlaying = false;
        let hasUserInteracted = false;
        let currentIdx = null;

const MAIN_SONGS = [
            { src: 'assets/audio/music/universfield-calm-piano-background-352250.mp3', name: 'Universfield', emoji: '🎹' },
            { src: 'assets/audio/music/Who%20Knows%20Instrumental.m4a', name: 'Who Knows - INSTRU', emoji: '🎶' },
            { src: 'assets/audio/music/MONDE%20Instrumental.m4a', name: 'MONDE - INSTRU', emoji: '🌍' },
            { src: 'assets/audio/music/ROTOROTO%20-%20REKO.m4a', name: 'Rotoroto', emoji: '🎧' },
            { src: 'assets/audio/music/Rotoroto%20instrumental.m4a', name: 'Rotoroto - INSTRU', emoji: '🎵' },
            { src: 'assets/audio/music/Best%20Part.m4a', name: 'Best Part', emoji: '🎤' },
            { src: 'assets/audio/music/Who%20Knows.m4a', name: 'Who Knows', emoji: '🎙️' },
            { src: 'assets/audio/music/MONDE.m4a', name: 'MONDE', emoji: '💜' },
            { src: 'assets/audio/music/HATRAIZA_AZA%20AVELA.m4a', name: 'Hatraiza Az Avela', emoji: '🌟' },
            { src: 'assets/audio/music/Elle%20Pleut.m4a', name: 'Elle Pleut', emoji: '💧' },
            { src: 'assets/audio/music/Elle%20pleut%20instrumental.m4a', name: 'Elle Pleut - INSTRU', emoji: '🎼' },
            { src: 'assets/audio/music/Always.m4a', name: 'Always', emoji: '🎵' },
            { src: 'assets/audio/music/Always%20Instrumental.m4a', name: 'Always - INSTRU', emoji: '🎶' },
            { src: 'assets/audio/music/Congratulations.m4a', name: 'Congratulations', emoji: '🎉' },
            { src: 'assets/audio/music/Congratulations%20Instrumental.m4a', name: 'Congratulations - INSTRU', emoji: '🎊' },
            { src: 'assets/audio/music/Emily%27s%20Song.m4a', name: 'Emily\'s Song', emoji: '🎤' },
            { src: 'assets/audio/music/Emily%27s%20Song%20Instrumental.m4a', name: 'Emily\'s Song - INSTRU', emoji: '🎶' },
            { src: 'assets/audio/music/Superpowers.m4a', name: 'Superpowers', emoji: '🦸' },
            { src: 'assets/audio/music/Superpowers%20Instrumental.m4a', name: 'Superpowers - INSTRU', emoji: '⚡' }
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
            // Historique pour le bouton "précédent" du lecteur mobile
            if (currentIdx !== null) {
                trackHistory.push(currentIdx);
                if (trackHistory.length > 20) trackHistory.shift();
            }
            currentIdx = idx;
            const abs = new URL(MAIN_SONGS[idx].src, window.location.href).href;
            if (audio.src !== abs) audio.src = abs;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                    updateButton();
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
            updateNowPlaying();
            updateMiniPlayer();
            updateMobilePlayer();
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
                        updateButton();
                    }).catch(err => {
                        isPlaying = false;
                        console.log('Audio play failed:', err.name);
                    });
                }
            }
            updateButton();
        }

        function updateNowPlaying() {
            const name = (currentIdx !== null) ? MAIN_SONGS[currentIdx].name : 'Prêt à jouer';
            mainNowPlaying.querySelector('.now-playing-name').textContent = name;
            mainNowPlaying.querySelector('.eq').classList.toggle('eq-on', isPlaying);
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
        audio.addEventListener('timeupdate', updatePlayerProgress);
        audio.addEventListener('loadedmetadata', updatePlayerProgress);

        // ===== BARRE DE PROGRESSION : clic / glisser pour se déplacer dans le morceau =====
        let mainSeeking = false;
        function mainSeekTo(e) {
            const rect = mainProgress.getBoundingClientRect();
            const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
            const dur = audio.duration;
            if (dur && isFinite(dur) && dur > 0) {
                audio.currentTime = ratio * dur;
                updateProgress();
            }
        }
        mainProgress.addEventListener('pointerdown', function(e) {
            e.stopPropagation();
            e.preventDefault();
            mainSeeking = true;
            try { mainProgress.setPointerCapture(e.pointerId); } catch (err) {}
            mainSeekTo(e);
        });
        mainProgress.addEventListener('pointermove', function(e) {
            if (mainSeeking) mainSeekTo(e);
        });
        function mainStopSeek() { mainSeeking = false; }
        mainProgress.addEventListener('pointerup', mainStopSeek);
        mainProgress.addEventListener('pointercancel', mainStopSeek);

        const mainSongItems = document.getElementById('mainSongItems');
        const mainSongSearch = document.getElementById('mainSongSearch');
        const mainSongEmpty = mainSongList.querySelector('.song-search-empty');

        // ===== LECTEUR MOBILE TYPE SPOTIFY/DEEZER (mini barre + plein écran) =====
        const miniPlayer = document.getElementById('miniPlayer');
        const miniCover = document.getElementById('miniCover');
        const miniTitle = document.getElementById('miniTitle');
        const miniSub = document.getElementById('miniSub');
        const miniPlayBtn = document.getElementById('miniPlay');
        const miniProgressLine = document.getElementById('miniProgressLine');
        const mobilePlayer = document.getElementById('mobilePlayer');
        const mpCover = document.getElementById('mpCover');
        const mpName = document.getElementById('mpName');
        const mpArtist = document.getElementById('mpArtist');
        const mpProgress = document.getElementById('mpProgress');
        const mpProgressFill = document.getElementById('mpProgressFill');
        const mpTimeCur = document.getElementById('mpTimeCur');
        const mpTimeDur = document.getElementById('mpTimeDur');
        const mpPlayBtn = document.getElementById('mpPlay');
        const mpPrevBtn = document.getElementById('mpPrev');
        const mpNextBtn = document.getElementById('mpNext');
        const mpList = document.getElementById('mpList');
        const trackHistory = [];
        const durCache = {};

        function fmtTime(t) {
            if (!isFinite(t) || t < 0) return '0:00';
            const m = Math.floor(t / 60);
            const s = Math.floor(t % 60);
            return m + ':' + (s < 10 ? '0' : '') + s;
        }
        function currentSong() { return currentIdx !== null ? MAIN_SONGS[currentIdx] : null; }

        function updateMiniPlayer(lockedOverride) {
            const song = currentSong();
            if (!song) { miniPlayer.hidden = true; return; }
            // La barre appartient à la carte : masquée derrière le verrouillage
            const locked = (lockedOverride !== undefined) ? lockedOverride : !!window.__pageLocked;
            miniPlayer.hidden = locked;
            miniTitle.textContent = song.name;
            miniCover.textContent = song.emoji;
            miniPlayBtn.textContent = isPlaying ? '⏸️' : '▶️';
            miniPlayBtn.classList.toggle('playing', isPlaying);
        }

        function updateMobilePlayer() {
            const song = currentSong();
            if (!song) return;
            mpCover.textContent = song.emoji;
            mpName.textContent = song.name;
            mpPlayBtn.textContent = isPlaying ? '❚❚' : '▶';
            mpPlayBtn.classList.toggle('playing', isPlaying);
            mpList.querySelectorAll('.mp-song').forEach(function(btn, i) {
                const isCurrent = (i === currentIdx);
                btn.classList.toggle('current', isCurrent);
                btn.querySelector('.mp-song-state').textContent = isCurrent ? (isPlaying ? '▶' : '❚❚') : '';
            });
        }

        function updatePlayerProgress() {
            const dur = audio.duration;
            const cur = audio.currentTime;
            const pct = (dur && isFinite(dur) && dur > 0 && cur > 0) ? Math.min(100, (cur / dur) * 100) : 0;
            mpProgressFill.style.width = pct + '%';
            miniProgressLine.style.width = pct + '%';
            mpTimeCur.textContent = fmtTime(cur);
            mpTimeDur.textContent = fmtTime(dur);
        }

        // Durée des titres (métadonnées chargées une fois, en arrière-plan)
        function fetchDuration(i, cb) {
            if (durCache[i]) { cb(durCache[i]); return; }
            try {
                const probe = new Audio(MAIN_SONGS[i].src);
                probe.preload = 'metadata';
                probe.addEventListener('loadedmetadata', function() {
                    durCache[i] = probe.duration;
                    cb(probe.duration);
                }, { once: true });
                probe.addEventListener('error', function() { cb(0); }, { once: true });
            } catch (e) { cb(0); }
        }

        function buildMobileList() {
            mpList.innerHTML = '';
            MAIN_SONGS.forEach(function(song, i) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'mp-song';
                btn.innerHTML = '<span class="mp-song-state"></span>' +
                    '<span class="mp-song-emoji">' + song.emoji + '</span>' +
                    '<span class="mp-song-name">' + song.name + '</span>' +
                    '<span class="mp-song-dur">—</span>';
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var sfx = document.getElementById('clickMusicSfx');
                    if (sfx) { sfx.currentTime = 0; sfx.play().catch(function() {}); }
                    hasUserInteracted = true;
                    playSongFromPool(i);
                });
                mpList.appendChild(btn);
                // Durée affichée dès que les métadonnées arrivent
                setTimeout(function() {
                    fetchDuration(i, function(d) {
                        if (d > 0) btn.querySelector('.mp-song-dur').textContent = fmtTime(d);
                    });
                }, i * 80);
            });
            updateMobilePlayer();
        }

        function openMobilePlayer() {
            mobilePlayer.classList.add('open');
            mobilePlayer.setAttribute('aria-hidden', 'false');
            // Fond figé derrière le lecteur plein écran (perf)
            if (LV.floatingBg && LV.floatingBg.setPaused) LV.floatingBg.setPaused(true);
            updateMobilePlayer();
            updatePlayerProgress();
        }
        function closeMobilePlayer() {
            mobilePlayer.classList.remove('open');
            mobilePlayer.setAttribute('aria-hidden', 'true');
            if (!window.__pageLocked && LV.floatingBg && LV.floatingBg.setPaused) {
                LV.floatingBg.setPaused(false);
            }
        }

        function playPrevious() {
            hasUserInteracted = true;
            const cur = audio.currentTime;
            // Plus de 3 s : on revient au début du titre ; sinon titre précédent
            if (cur > 3 || trackHistory.length === 0) {
                audio.currentTime = 0;
                updatePlayerProgress();
                return;
            }
            const idx = trackHistory.pop();
            playSongFromPool(idx);
        }

        // Ne jamais déclencher les effets de clic de la page depuis le lecteur
        if (miniPlayer) miniPlayer.addEventListener('click', function(e) { e.stopPropagation(); });
        if (mobilePlayer) mobilePlayer.addEventListener('click', function(e) { e.stopPropagation(); });

        if (miniPlayer) {
            document.getElementById('miniPlayerMain').addEventListener('click', function(e) {
                e.stopPropagation();
                var sfx = document.getElementById('clickMusicSfx');
                if (sfx) { sfx.currentTime = 0; sfx.play().catch(function() {}); }
                openMobilePlayer();
            });
            miniPlayBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                var sfx = document.getElementById('clickMusicSfx');
                if (sfx) { sfx.currentTime = 0; sfx.play().catch(function() {}); }
                toggleMusic();
            });
        }

        document.getElementById('mpClose').addEventListener('click', function(e) {
            e.stopPropagation();
            var sfx = document.getElementById('clickMusicSfx');
            if (sfx) { sfx.currentTime = 0; sfx.play().catch(function() {}); }
            closeMobilePlayer();
        });
        mpPlayBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var sfx = document.getElementById('clickMusicSfx');
            if (sfx) { sfx.currentTime = 0; sfx.play().catch(function() {}); }
            toggleMusic();
        });
        mpNextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var sfx = document.getElementById('clickMusicSfx');
            if (sfx) { sfx.currentTime = 0; sfx.play().catch(function() {}); }
            hasUserInteracted = true;
            playSongFromPool();
        });
        mpPrevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var sfx = document.getElementById('clickMusicSfx');
            if (sfx) { sfx.currentTime = 0; sfx.play().catch(function() {}); }
            playPrevious();
        });

        // Barre de progression du lecteur plein écran : clic / glisser
        let mpSeeking = false;
        function mpSeekTo(e) {
            const rect = mpProgress.getBoundingClientRect();
            const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
            const dur = audio.duration;
            if (dur && isFinite(dur) && dur > 0) {
                audio.currentTime = ratio * dur;
                updatePlayerProgress();
            }
        }
        mpProgress.addEventListener('pointerdown', function(e) {
            e.stopPropagation();
            e.preventDefault();
            mpSeeking = true;
            try { mpProgress.setPointerCapture(e.pointerId); } catch (err) {}
            mpSeekTo(e);
        });
        mpProgress.addEventListener('pointermove', function(e) {
            if (mpSeeking) mpSeekTo(e);
        });
        function mpStopSeek() { mpSeeking = false; }
        mpProgress.addEventListener('pointerup', mpStopSeek);
        mpProgress.addEventListener('pointercancel', mpStopSeek);

        // Le lecteur suit l'état verrouillé ⇄ déverrouillé (barre = carte)
        window.addEventListener('lockchange', function(e) {
            const locked = !!(e.detail && e.detail.locked);
            if (locked) closeMobilePlayer();
            updateMiniPlayer(locked);
        });

        // ===== LISTE DES CHANSONS (sélection directe au clic sur le titre) =====
        function buildSongList() {
            mainSongItems.innerHTML = '';
            MAIN_SONGS.forEach(function(song, i) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'main-song-item';
                btn.setAttribute('role', 'menuitem');
                btn.dataset.name = song.name.toLowerCase();
                btn.innerHTML = '<span class="song-emoji">' + song.emoji +
                    '</span><span class="song-name">' + song.name +
                    '</span><span class="song-state"></span>';
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    var sfx = document.getElementById('clickMusicSfx');
                    if (sfx) { sfx.currentTime = 0; sfx.play().catch(function() {}); }
                    hasUserInteracted = true;
                    playSongFromPool(i);
                    closeSongList();
                });
                mainSongItems.appendChild(btn);
            });
        }

        function filterSongList() {
            const q = mainSongSearch.value.trim().toLowerCase();
            let shown = 0;
            mainSongItems.querySelectorAll('.main-song-item').forEach(function(btn) {
                const match = !q || btn.dataset.name.indexOf(q) !== -1;
                btn.style.display = match ? '' : 'none';
                if (match) shown++;
            });
            mainSongEmpty.hidden = shown > 0;
        }

        function updateSongList() {
            mainSongItems.querySelectorAll('.main-song-item').forEach(function(btn, i) {
                const isCurrent = (i === currentIdx);
                btn.classList.toggle('active', isCurrent);
                btn.querySelector('.song-state').textContent = isCurrent ? (isPlaying ? 'en cours' : 'pause') : '';
            });
        }

        function openSongList() {
            mainSongList.classList.add('open');
            mainSongList.setAttribute('aria-hidden', 'false');
            mainSongSearch.value = '';
            mainSongEmpty.hidden = true;
            mainSongItems.querySelectorAll('.main-song-item').forEach(function(btn) { btn.style.display = ''; });
            updateSongList();
            mainSongSearch.focus();
        }

        mainSongSearch.addEventListener('input', filterSongList);
        mainSongSearch.addEventListener('click', function(e) { e.stopPropagation(); });

        function closeSongList() {
            mainSongList.classList.remove('open');
            mainSongList.setAttribute('aria-hidden', 'true');
        }

        mainNowPlaying.addEventListener('click', function(e) {
            e.stopPropagation();
            var sfx = document.getElementById('clickMusicSfx');
            if (sfx) { sfx.currentTime = 0; sfx.play().catch(function() {}); }
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
        updateNowPlaying();
        buildMobileList();
        updateMiniPlayer();

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

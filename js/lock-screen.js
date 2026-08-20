// ============================================================
//  ÉCRAN DE VERROUILLAGE : COMPTE À REBOURS
//      Déblocage automatique le 28 août à 00:00:01
//      Raccourci secret : Ctrl+G pour débloquer immédiatement
// ============================================================
window.LV = window.LV || {};

LV.lockScreen = {
    init: function() {
        window.__pageLocked = true;
        const IS_MOBILE = !!(window.__isMobile);

        const lockScreen = document.getElementById('lockScreen');
        const countdownEl = document.getElementById('countdown');
        const lockIcon = document.getElementById('lockIcon');
        const lockSubtitle = document.getElementById('lockSubtitle');
        const lockNote = document.getElementById('lockNote');
        const lockCornerEmoji = document.getElementById('lockCornerEmoji');
        const lockMessageZone = document.getElementById('lockMessageZone');
        const lockMessage = document.getElementById('lockMessage');
        const cdDays = document.getElementById('cdDays');
        const cdHours = document.getElementById('cdHours');
        const cdMinutes = document.getElementById('cdMinutes');
        const cdSeconds = document.getElementById('cdSeconds');
        const ringDays = document.querySelector('.progress-days');
        const ringHours = document.querySelector('.progress-hours');
        const ringMinutes = document.querySelector('.progress-minutes');
        const ringSeconds = document.querySelector('.progress-seconds');

        // Fin du compte à rebours : 28 août à 00:00:01
        const UNLOCK_DATE = new Date(2026, 7, 28, 0, 0, 1);
        let unlocked = false;

        function pad(n) {
            return String(n).padStart(2, '0');
        }

        // Chiffre animé avec effet flip 3D
        function setNum(numEl, value) {
            const text = pad(value);
            const front = numEl.querySelector('.num-front');
            const back = numEl.querySelector('.num-back');
            if (numEl.dataset.value === text) return;
            if (numEl.dataset.value === undefined) {
                front.textContent = text;
                back.textContent = text;
                numEl.dataset.value = text;
                return;
            }
            front.textContent = numEl.dataset.value;
            back.textContent = text;
            numEl.classList.add('flip');
            numEl.dataset.value = text;
            setTimeout(() => {
                numEl.style.transition = 'none';
                numEl.classList.remove('flip');
                front.textContent = text;
                void numEl.offsetWidth;
                numEl.style.transition = '';
            }, 360);
        }

        // Bordure de progression qui se vide (0 = vide, 1 = plein)
        function setProgress(el, fraction) {
            const f = Math.min(1, Math.max(0, fraction));
            el.style.clipPath = 'inset(0 0 ' + ((1 - f) * 100) + '% 0)';
        }

        // Texte dynamique sous le titre
        function updateSubtitle(days, hours, minutes, seconds) {
            let text;
            if (days > 1) text = `Plus que ${days} jours avant l'ouverture 🎁`;
            else if (days === 1) text = "Plus qu'un jour avant l'ouverture 🎁";
            else if (hours > 1) text = `Plus que ${hours} heures avant l'ouverture 🎁`;
            else if (hours === 1) text = "Plus qu'une heure avant l'ouverture 🎁";
            else if (minutes > 1) text = `Plus que ${minutes} minutes avant l'ouverture 🎁`;
            else if (minutes === 1) text = "Plus qu'une minute avant l'ouverture 🎁";
            else text = "Le site s'ouvre dans quelques secondes…";
            lockSubtitle.textContent = text;
        }

        function updateCountdown() {
            const diff = Math.max(0, UNLOCK_DATE - Date.now());
            const totalSeconds = Math.floor(diff / 1000);
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            setNum(cdDays, days);
            setNum(cdHours, hours);
            setNum(cdMinutes, minutes);
            setNum(cdSeconds, seconds);

            setProgress(ringDays, days / 30);
            setProgress(ringHours, hours / 24);
            setProgress(ringMinutes, minutes / 60);
            setProgress(ringSeconds, seconds / 60);

            updateSubtitle(days, hours, minutes, seconds);
            countdownEl.classList.toggle('countdown--final', totalSeconds <= 60);

            if (diff === 0 && !unlocked) unlockPage();
        }

        function unlockPage() {
            if (unlocked) return;
            unlocked = true;
            window.__pageLocked = false;
            document.body.style.overflow = '';
            window.dispatchEvent(new CustomEvent('lockchange', { detail: { locked: false } }));

            // Son de transition
            const transSfx = document.getElementById('transitionSfx');
            if (transSfx) { transSfx.currentTime = 0; transSfx.play().catch(function() {}); }

            // Le cadenas devient une fête
            lockIcon.textContent = '🎉';
            lockIcon.classList.add('lock-icon--pop');

            // Couper la musique du timer à l'ouverture (la carte joue la sienne)
            const lm = document.getElementById('lockMusic');
            if (lm && !lm.paused) {
                lm.pause();
                lockMusicPlaying = false;
                updateLockMusicBtn();
            }

            // Reprendre les animations du fond
            document.querySelectorAll('.floating-item').forEach(el => {
                el.style.animationPlayState = '';
            });

            lockScreen.classList.add('lock-screen--hidden');
            lockScreen.setAttribute('aria-hidden', 'true');
            if (LV.fx && LV.fx.setLayer) LV.fx.setLayer('9998');
            setTimeout(() => {
                lockScreen.style.display = 'none';
                if (window.__startMusic) window.__startMusic();
            }, 900);

            // Petite pluie de célébration à l'ouverture
            LV.confetti.launch(120);
            setTimeout(() => LV.confetti.launch(80), 350);
            const vw = window.innerWidth / 2;
            const vh = window.innerHeight / 2;
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    LV.hearts.spawnVisualOnly(
                        vw + (Math.random() - 0.5) * 320,
                        vh + (Math.random() - 0.5) * 320,
                        ['💚', '💕', '💗', '🌺', '🧸']
                    );
                }, i * 90);
            }
        }

        // ===== BASCULE Ctrl+G : compte à rebours ⇄ carte principale =====
        function setLockScreenVisible(visible) {
            if (visible) {
                lockScreen.classList.remove('lock-screen--hidden');
                lockScreen.setAttribute('aria-hidden', 'false');
            } else {
                lockScreen.classList.add('lock-screen--hidden');
                lockScreen.setAttribute('aria-hidden', 'true');
            }
            // Le calque d'effets doit couvrir le verrouillage (20010) mais rester
            // sous les confettis (9999) sur la carte : z-index dynamique
            if (LV.fx && LV.fx.setLayer) LV.fx.setLayer(visible ? '20010' : '9998');
            // Informe les modules (mini-player mobile, etc.) de l'état verrouillé
            window.dispatchEvent(new CustomEvent('lockchange', { detail: { locked: !!visible } }));
        }

        function showMainView() {
            window.__pageLocked = false;
            setLockScreenVisible(false);
            document.body.style.overflow = '';
            // Reprendre le fond flottant (mis en pause derrière le verrouillage)
            if (LV.floatingBg && LV.floatingBg.setPaused) LV.floatingBg.setPaused(false);
            stopLockMusic();
            if (window.__startMusic) window.__startMusic();
        }

        function showLockView() {
            const bg = document.getElementById('bgMusic');
            if (bg && !bg.paused) bg.pause();
            window.__pageLocked = true;
            setLockScreenVisible(true);
            document.body.style.overflow = 'hidden';
            // Fond figé derrière l'écran opaque (perf) ; relancé par showMainView
            if (LV.floatingBg && LV.floatingBg.setPaused) LV.floatingBg.setPaused(true);
            startLockMusic();
        }

        function toggleLockView() {
            if (unlocked) return;
            if (lockScreen.classList.contains('lock-screen--hidden')) showLockView();
            else showMainView();
        }

        // Raccourci secret : Ctrl+G bascule entre le compte à rebours et la carte
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && (e.key === 'g' || e.key === 'G')) {
                e.preventDefault();
                toggleLockView();
            }
        });

        // Mini-cœurs qui montent en continu derrière le compteur
        const lockContent = lockScreen.querySelector('.lock-content');
        const lockDensity = window.__graphDensity || 1;
        const lockHearts = ['💚', '💕', '💗', '🧸', '🎵', '🎹', '🎶'];
        const lockFloatingCount = Math.max(2, Math.round((IS_MOBILE ? 6 : 8) * lockDensity));
        for (let i = 0; i < lockFloatingCount; i++) {
            const h = document.createElement('span');
            h.className = 'lock-floating';
            h.textContent = lockHearts[Math.floor(Math.random() * lockHearts.length)];
            h.style.left = Math.random() * 100 + '%';
            h.style.top = Math.random() * 100 + '%';
            h.style.fontSize = (1.3 + Math.random() * 1.6) + 'rem';
            h.style.animationDuration = (12 + Math.random() * 14) + 's';
            h.style.animationDelay = (-Math.random() * 20) + 's';
            h.style.opacity = 0.35 + Math.random() * 0.25;
            lockScreen.insertBefore(h, lockContent);
        }

        // Note du bas : 3 emojis tirés au sort parmi le fond, à chaque chargement
        const BG_EMOJIS = ['💚', '💕', '🧸', '🌺', '💗', '🍀', '✨', '🎵', '🎶', '🎹', '🎼', '💜'];
        const shuffledNote = [...BG_EMOJIS].sort(() => Math.random() - 0.5);
        lockNote.textContent = shuffledNote.slice(0, 3).join(' ');

        // Grand emoji en haut à gauche, aléatoire à chaque chargement
        const CORNER_CHOICES = ['🧸', '🌺', '🎵', '🎹', '💚', '❤️'];
        lockCornerEmoji.textContent = CORNER_CHOICES[Math.floor(Math.random() * CORNER_CHOICES.length)];
        lockCornerEmoji.style.setProperty('--corner-rot', (Math.random() * 24 - 12) + 'deg');

        // Mot du moment : message aléatoire sous les emojis (avec emoji assorti)
        const LOCK_MESSAGES = [
            { emoji: '🎂', text: "Savais-tu ? Le gâteau d'anniversaire le plus ancien a plus de 4000 ans : les Grecs le dédiaient à Artémis !" },
            { emoji: '🎂', text: 'Savais-tu ? Le mot « anniversaire » vient du latin anniversarius, qui signifie « qui revient chaque année ».' },
            { emoji: '🎹', text: 'Le pianiste attend le 28 août pour jouer "Joyeux anniversaire". Il répète encore. Il revient le 28 août à 00:00:01.' },
            { emoji: '🎹', text: 'La playlist d\'anniversaire est en préparation. Le piano a demandé à être prévenu avant de jouer.' },
            { emoji: '🎹', text: 'Savais-tu ? Le piano possède 88 touches : 52 blanches et 36 noires.' },
            { emoji: '🎵', text: 'Savais-tu ? Le mot "musique" vient du grec "mousikē", l\'art des Muses.' },
            { emoji: '🎶', text: 'Chaque seconde qui passe nous rapproche un peu plus de notre destination : le 28 août.' },
            { emoji: '🎶', text: 'Une chanson peut durer trois minutes. Il faudrait donc 3523 chansons avant d\'arriver au 28 août.' },
            { emoji: '🕯️', text: "Savais-tu ? Les bougies sur les gâteaux viennent des Grecs, qui pensaient qu'elles portaient les vœux jusqu'aux dieux." },
            { emoji: '🕯️', text: 'Les bougies attendent leur moment. Le gâteau aussi. Et le moment a un nom : 28 août.' },
            { emoji: '🕯️', text: 'Même les bougies savent quelle date approche.' },
            { emoji: '🌌', text: 'Tous les éléments composant l\'univers, les galaxies, les amas de poussière, les astres, s\'éloignent les uns des autres inexorablement... un peu comme nous.' },
            { emoji: '🌙', text: 'La Lune fait le tour de la Terre. La Terre fait le tour du Soleil. Et toi, tu attends juste le 28 août.' },
            { emoji: '🌺', text: "Savais-tu ? Chaque fleur d'hibiscus ne vit qu'un jour : elle s'ouvre le matin et se fane le soir… mais une nouvelle repousse dès le lendemain." },
            { emoji: '🌺', text: 'Savais-tu ? Il existe plus de 200 espèces d\'hibiscus dans le monde… mais aucune n\'est assez belle pour toi.' },
            { emoji: '🌺', text: 'Savais-tu ? Il existe plus de 200 espèces d\'hibiscus dans le monde…' },
            { emoji: '📅', text: 'Savais-tu ? Le 28 août est la 240ᵉ journée de l\'année — un chiffre qui se lit "2-4-0", comme "2 fois 120", soit 240 raisons de fêter ton anniversaire.' },
            { emoji: '📢', text: 'Communiqué officiel : merci de ne pas oublier le 28 août. Merci.' },
            { emoji: '👀', text: 'Tu regardes probablement ce message en te demandant pourquoi il existe. Excellente question.' },
            { emoji: '💀', text: 'Update #23 : Work in Progress… or Work without Progress? 💀' },
            { emoji: '💻', text: 'Pour une expérience optimale, veuillez lancer le site avec un ordinateur.' },
            { emoji: '🚨', text: 'ALERTE : le 28 août se rapproche dangereusement.' },
            { emoji: '🦇', text: 'Batman est passé par là.' },
            { emoji: '⏳', text: 'Chaque seconde passée est une seconde de moins avant le 28 août. Le compte à rebours est officiellement lancé. Enfin, presque.' },
            { emoji: '⏳', text: 'Chaque seconde qui passe nous rapproche un peu plus de notre destination : le 28 août.' },
            { emoji: '⭐', text: 'Et quand deux étoiles sont trop proches et que l\'une d\'entre elles explose, il arrive qu\'elle condamne l\'autre étoile à errer sans trajectoire dans l\'univers. On les appelle les étoiles vagabondes.' },
            { emoji: '🧸', text: 'Savais-tu ? Les nounours ont été inventés en 1902… et ils fêtent déjà 124 ans cette année !' }
        ];

        // Calcul du nombre de chansons de 3 minutes avant le 28 août 00:00:01
        (function() {
            const now = Date.now();
            const diffMs = UNLOCK_DATE - now;
            if (diffMs > 0) {
                const totalMinutes = Math.floor(diffMs / 60000);
                const songsCount = Math.floor(totalMinutes / 3);
                LOCK_MESSAGES.push({
                    emoji: '🎶',
                    text: 'Une chanson peut durer trois minutes. Il faudrait donc ' + songsCount + ' chansons avant d\'arriver au 28 août.'
                });
            }
        })();

        let currentPick = LOCK_MESSAGES[Math.floor(Math.random() * LOCK_MESSAGES.length)];
        const mainMessage = document.getElementById('mainMessage');
        const mainMessageZone = document.getElementById('mainMessageZone');
        const mainCommentsBtn = document.getElementById('mainCommentsBtn');

        // Affiche le mot du moment sur les deux écrans (verrouillage + carte)
        function renderMessage() {
            const text = currentPick.emoji + '  ' + currentPick.text;
            lockMessage.textContent = text;
            if (mainMessage) mainMessage.textContent = text;
        }
        renderMessage();

        function cycleLockMessage() {
            let next;
            do {
                next = LOCK_MESSAGES[Math.floor(Math.random() * LOCK_MESSAGES.length)];
            } while (next === currentPick);
            currentPick = next;
            // Toujours retirer la classe opposée avant de poser l'autre,
            // sinon l'animation du cycle précédent bloque le suivant
            lockMessage.classList.remove('lock-message--in');
            lockMessage.classList.add('lock-message--out');
            setTimeout(() => {
                renderMessage();
                lockMessage.classList.remove('lock-message--out');
                void lockMessage.offsetWidth;
                lockMessage.classList.add('lock-message--in');
            }, 260);
        }
        lockMessageZone.addEventListener('click', cycleLockMessage);
        if (mainMessageZone) mainMessageZone.addEventListener('click', cycleLockMessage);

// ===== MUSIQUE DU TIMER (9 titres, aléatoire sans répétition) =====
        const LOCK_SONGS = [
            { src: 'assets/audio/music/Best%20Part%20Instrumental.m4a', name: 'Best Part - INSTRU', emoji: '🎹' },
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
            { src: 'assets/audio/music/Always%20Instrumental.m4a', name: 'Always - INSTRU', emoji: '🎶' },
            { src: 'assets/audio/music/Always.m4a', name: 'Always', emoji: '🎵' },
            { src: 'assets/audio/music/Congratulations%20Instrumental.m4a', name: 'Congratulations - INSTRU', emoji: '🎊' },
            { src: 'assets/audio/music/Congratulations.m4a', name: 'Congratulations', emoji: '🎉' },
            { src: 'assets/audio/music/Emily%27s%20Song%20Instrumental.m4a', name: 'Emily\'s Song - INSTRU', emoji: '🎶' },
            { src: 'assets/audio/music/Emily%27s%20Song.m4a', name: 'Emily\'s Song', emoji: '🎤' },
            { src: 'assets/audio/music/Superpowers%20Instrumental.m4a', name: 'Superpowers - INSTRU', emoji: '⚡' },
            { src: 'assets/audio/music/Superpowers.m4a', name: 'Superpowers', emoji: '🦸' }
        ];
        const lockMusic = document.getElementById('lockMusic');
        const lockMusicBtn = document.getElementById('lockMusicBtn');
        const lockSkipBtn = document.getElementById('lockSkipBtn');
        const lockVolume = document.getElementById('lockVolume');
        const lockProgress = document.getElementById('lockProgress');
        const lockProgressFill = document.getElementById('lockProgressFill');
        const lockSongList = document.getElementById('lockSongList');
        const lockNowPlaying = document.getElementById('lockNowPlaying');
        let lockMusicPlaying = false;
        let lockSongPool = [];
        let lockCurrentIdx = null;

        // Pioche aléatoire sans rejouer un titre déjà passé tant que
        // tous les titres n'ont pas été entendus
        function pickLockSong() {
            if (lockSongPool.length === 0) {
                lockSongPool = LOCK_SONGS.map(function(_, i) { return i; });
            }
            const i = Math.floor(Math.random() * lockSongPool.length);
            return lockSongPool.splice(i, 1)[0];
        }

        function playLockSong(forcedIdx) {
            let idx = forcedIdx;
            if (idx === undefined) {
                idx = pickLockSong();
            } else {
                // Choix direct dans la liste : le titre compte comme entendu
                const pi = lockSongPool.indexOf(idx);
                if (pi !== -1) lockSongPool.splice(pi, 1);
            }
            lockCurrentIdx = idx;
            const abs = new URL(LOCK_SONGS[idx].src, window.location.href).href;
            if (lockMusic.src !== abs) lockMusic.src = abs;
            const p = lockMusic.play();
            if (p && p.catch) {
                p.then(function() {
                    lockMusicPlaying = true;
                    updateLockMusicBtn();
                }).catch(function() {
                    lockMusicPlaying = false;
                    // Titre non entendu (autoplay bloqué) : il reste à jouer plus tard
                    if (forcedIdx === undefined) lockSongPool.push(idx);
                });
            } else {
                lockMusicPlaying = true;
                updateLockMusicBtn();
            }
        }

        function updateLockMusicBtn() {
            lockMusicBtn.textContent = lockMusicPlaying ? '⏸️' : '▶️';
            lockMusicBtn.setAttribute('aria-label', lockMusicPlaying ? 'Pause musique' : 'Lecture musique');
            updateLockSongList();
            updateLockNowPlaying();
        }

        function updateLockNowPlaying() {
            const name = (lockCurrentIdx !== null) ? LOCK_SONGS[lockCurrentIdx].name : 'Prêt à jouer';
            lockNowPlaying.querySelector('.now-playing-name').textContent = name;
            lockNowPlaying.querySelector('.eq').classList.toggle('eq-on', lockMusicPlaying);
        }

        function startLockMusic() {
            if (lockMusicPlaying) return;
            playLockSong();
        }

        function stopLockMusic() {
            if (lockMusicPlaying || !lockMusic.paused) {
                lockMusic.pause();
                lockMusicPlaying = false;
                updateLockMusicBtn();
            }
        }

        // ===== BARRE DE PROGRESSION (état d'avancement du titre) =====
        function updateLockProgress() {
            const dur = lockMusic.duration;
            const cur = lockMusic.currentTime;
            const pct = (dur && isFinite(dur) && dur > 0 && cur > 0) ? Math.min(100, (cur / dur) * 100) : 0;
            lockProgressFill.style.width = pct + '%';
            lockProgress.style.setProperty('--pct', pct + '%');
        }
        lockMusic.addEventListener('timeupdate', updateLockProgress);
        lockMusic.addEventListener('loadedmetadata', updateLockProgress);

        // ===== BARRE DE PROGRESSION : clic / glisser pour se déplacer dans le morceau =====
        let lockSeeking = false;
        function lockSeekTo(e) {
            const rect = lockProgress.getBoundingClientRect();
            const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
            const dur = lockMusic.duration;
            if (dur && isFinite(dur) && dur > 0) {
                lockMusic.currentTime = ratio * dur;
                updateLockProgress();
            }
        }
        lockProgress.addEventListener('pointerdown', function(e) {
            e.stopPropagation();
            e.preventDefault();
            lockSeeking = true;
            try { lockProgress.setPointerCapture(e.pointerId); } catch (err) {}
            lockSeekTo(e);
        });
        lockProgress.addEventListener('pointermove', function(e) {
            if (lockSeeking) lockSeekTo(e);
        });
        function lockStopSeek() { lockSeeking = false; }
        lockProgress.addEventListener('pointerup', lockStopSeek);
        lockProgress.addEventListener('pointercancel', lockStopSeek);

        // ===== LISTE DES CHANSONS (sélection directe au clic sur le titre) =====
        const lockSongItems = document.getElementById('lockSongItems');
        const lockSongSearch = document.getElementById('lockSongSearch');
        const lockSongEmpty = lockSongList.querySelector('.song-search-empty');

        function buildLockSongList() {
            lockSongItems.innerHTML = '';
            // Séparer voix (sans INSTRU) et instrumentales (avec INSTRU)
            const vocals = [];
            const instrumentals = [];
            LOCK_SONGS.forEach(function(song, i) {
                if (song.name.includes('INSTRU')) instrumentals.push({ song, i });
                else vocals.push({ song, i });
            });
            vocals.sort((a, b) => a.song.name.localeCompare(b.song.name));
            instrumentals.sort((a, b) => a.song.name.localeCompare(b.song.name));

            function renderGroup(group, container) {
                group.forEach(function(item) {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'lock-song-item';
                    btn.setAttribute('role', 'menuitem');
                    btn.dataset.name = item.song.name.toLowerCase();
                    btn.innerHTML = '<span class="song-emoji">' + item.song.emoji +
                        '</span><span class="song-name">' + item.song.name +
                        '</span><span class="song-state"></span>';
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        var sfx = document.getElementById('clickMusicSfx');
                        if (sfx) { sfx.currentTime = 0; sfx.play().catch(function() {}); }
                        playLockSong(item.i);
                        closeLockSongList();
                    });
                    container.appendChild(btn);
                });
            }

            // Deux colonnes : voix à gauche, instrumentales à droite
            lockSongItems.style.display = 'grid';
            lockSongItems.style.gridTemplateColumns = '1fr 1fr';
            lockSongItems.style.gap = '8px';
            lockSongItems.style.maxHeight = '180px';
            lockSongItems.style.overflowY = 'auto';
            lockSongItems.style.padding = '4px';
            lockSongItems.style.borderLeft = '1px solid rgba(99, 114, 104, 0.18)';
            lockSongItems.style.paddingLeft = '12px';

            const leftCol = document.createElement('div');
            leftCol.style.display = 'flex';
            leftCol.style.flexDirection = 'column';
            leftCol.style.gap = '4px';
            const rightCol = document.createElement('div');
            rightCol.style.display = 'flex';
            rightCol.style.flexDirection = 'column';
            rightCol.style.gap = '4px';

            renderGroup(vocals, leftCol);
            renderGroup(instrumentals, rightCol);

            lockSongItems.appendChild(leftCol);
            lockSongItems.appendChild(rightCol);
        }

        function filterLockSongList() {
            const q = lockSongSearch.value.trim().toLowerCase();
            let shown = 0;
            lockSongItems.querySelectorAll('.lock-song-item').forEach(function(btn) {
                const match = !q || btn.dataset.name.indexOf(q) !== -1;
                btn.style.display = match ? '' : 'none';
                if (match) shown++;
            });
            lockSongEmpty.hidden = shown > 0;
        }

        function updateLockSongList() {
            lockSongItems.querySelectorAll('.lock-song-item').forEach(function(btn, i) {
                const isCurrent = (i === lockCurrentIdx);
                btn.classList.toggle('active', isCurrent);
                btn.querySelector('.song-state').textContent = isCurrent ? (lockMusicPlaying ? 'en cours' : 'pause') : '';
            });
        }

        function openLockSongList() {
            lockSongList.classList.add('open');
            lockSongList.setAttribute('aria-hidden', 'false');
            lockSongSearch.value = '';
            lockSongEmpty.hidden = true;
            lockSongItems.querySelectorAll('.lock-song-item').forEach(function(btn) { btn.style.display = ''; });
            updateLockSongList();
            lockSongSearch.focus();
        }

        lockSongSearch.addEventListener('input', filterLockSongList);
        lockSongSearch.addEventListener('click', function(e) { e.stopPropagation(); });

        function closeLockSongList() {
            lockSongList.classList.remove('open');
            lockSongList.setAttribute('aria-hidden', 'true');
        }

        lockNowPlaying.addEventListener('click', function(e) {
            e.stopPropagation();
            var sfx = document.getElementById('clickMusicSfx');
            if (sfx) { sfx.currentTime = 0; sfx.play().catch(function() {}); }
            if (lockSongList.classList.contains('open')) {
                closeLockSongList();
            } else {
                openLockSongList();
            }
        });
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.lock-song-list') && !e.target.closest('.lock-now-playing')) {
                closeLockSongList();
            }
        });

        buildLockSongList();
        updateLockNowPlaying();

        lockMusic.volume = 0.30;
        lockVolume.value = 30;

        // Lancement automatique sur l'écran du compte à rebours
        startLockMusic();
        // Si le navigateur bloque l'autoplay : premier geste utilisateur = la chanson démarre
        ['pointerdown', 'keydown', 'touchstart'].forEach(function(evtName) {
            document.addEventListener(evtName, function() {
                if (!lockMusicPlaying && !lockScreen.classList.contains('lock-screen--hidden')) {
                    startLockMusic();
                }
            }, { passive: true, once: true });
        });

        lockMusicBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var sfx = document.getElementById('clickMusicSfx');
            if (sfx) { sfx.currentTime = 0; sfx.play().catch(function() {}); }
            if (lockMusicPlaying) {
                lockMusic.pause();
                lockMusicPlaying = false;
                updateLockMusicBtn();
            } else {
                const p = lockMusic.play();
                if (p && p.catch) p.catch(function() {});
                lockMusicPlaying = true;
                updateLockMusicBtn();
            }
        });

        // Skip : titre suivant (aléatoire, sans répétition tant que tout n'a pas été entendu)
        lockSkipBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var sfx = document.getElementById('clickMusicSfx');
            if (sfx) { sfx.currentTime = 0; sfx.play().catch(function() {}); }
            playLockSong();
        });

        // Fin naturelle d'un titre : on enchaîne sur le suivant de la rotation
        lockMusic.addEventListener('ended', function() {
            if (lockMusicPlaying) {
                lockMusicPlaying = false;
                playLockSong();
            }
        });

        lockVolume.addEventListener('input', function() {
            lockMusic.volume = lockVolume.value / 100;
        });
        lockVolume.addEventListener('change', function() {
            lockMusic.volume = lockVolume.value / 100;
        });

        // ===== POP-UP : TOUS LES MESSAGES DU MOT DU MOMENT =====
        const lockCommentsBtn = document.getElementById('lockCommentsBtn');
        const lockCommentsModal = document.getElementById('lockCommentsModal');
        const lockCommentsList = document.getElementById('lockCommentsList');
        const lockCommentsClose = document.getElementById('lockCommentsClose');

        LOCK_MESSAGES.forEach(function(m) {
            const li = document.createElement('li');
            li.textContent = m.emoji + '  ' + m.text;
            lockCommentsList.appendChild(li);
        });

        function openComments() {
            lockCommentsModal.classList.add('open');
            lockCommentsModal.setAttribute('aria-hidden', 'false');
            // Fond figé pendant la modale : plus de re-blur plein écran (perf)
            if (LV.floatingBg && LV.floatingBg.setPaused) LV.floatingBg.setPaused(true);
        }
        function closeComments() {
            lockCommentsModal.classList.remove('open');
            lockCommentsModal.setAttribute('aria-hidden', 'true');
            // On ne reprend le fond que si la carte est visible (sinon il reste
            // volontairement en pause derrière le verrouillage)
            if (!window.__pageLocked && LV.floatingBg && LV.floatingBg.setPaused) {
                LV.floatingBg.setPaused(false);
            }
        }
        lockCommentsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openComments();
        });
        if (mainCommentsBtn) {
            mainCommentsBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                openComments();
            });
        }
        lockCommentsClose.addEventListener('click', function(e) {
            e.stopPropagation();
            closeComments();
        });
        lockCommentsModal.addEventListener('click', function(e) {
            if (e.target === lockCommentsModal) closeComments();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lockCommentsModal.classList.contains('open')) closeComments();
            if (e.key === 'Escape' && lockSongList.classList.contains('open')) closeLockSongList();
        });

        // ===== EFFET DE CLIC (particules + emojis, différent du menu principal) =====

        // Debug : le panneau s'ouvre aussi via le cadenas du compte à rebours
        if (lockIcon && window.__toggleDebug) {
            lockIcon.addEventListener('click', function(e) {
                e.stopPropagation();
                window.__toggleDebug();
            });
        }

        function spawnLockBurst(x, y) {
            // Limite douce : le moteur canvas a son propre plafond de particules
            if (LV.fx.active() >= 90) return;
            LV.fx.emitLockBurst(x, y);
        }

        lockScreen.addEventListener('click', function(e) {
            if (!unlocked &&
                !e.target.closest('.lock-message-zone') &&
                !e.target.closest('.lock-controls') &&
                !e.target.closest('.lock-comments-modal') &&
                !e.target.closest('.lock-progress-wrap') &&
                !e.target.closest('.lock-song-list') &&
                !e.target.closest('.lock-now-playing') &&
                !e.target.closest('.lock-icon')) spawnLockBurst(e.clientX, e.clientY);
        });

        // Bloquer le scroll tant que le site est verrouillé
        document.body.style.overflow = 'hidden';
        // Pause des animations du fond derrière l'écran (perf)
        document.querySelectorAll('.floating-item').forEach(el => {
            el.style.animationPlayState = 'paused';
        });

        // Le site démarre verrouillé : le calque d'effets passe au-dessus
        // de l'écran de verrouillage
        if (LV.fx && LV.fx.setLayer) LV.fx.setLayer('20010');

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
};

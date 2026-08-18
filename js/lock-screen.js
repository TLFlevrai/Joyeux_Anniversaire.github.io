// ============================================================
//  ÉCRAN DE VERROUILLAGE : COMPTE À REBOURS
//      Déblocage automatique le 28 août à 00:00:01
//      Raccourci secret : Ctrl+G pour débloquer immédiatement
// ============================================================
window.LV = window.LV || {};

LV.lockScreen = {
    init: function() {
        window.__pageLocked = true;

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

            // Le cadenas devient une fête
            lockIcon.textContent = '🎉';
            lockIcon.classList.add('lock-icon--pop');

            // Reprendre les animations du fond
            document.querySelectorAll('.floating-item').forEach(el => {
                el.style.animationPlayState = '';
            });

            lockScreen.classList.add('lock-screen--hidden');
            lockScreen.setAttribute('aria-hidden', 'true');
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

        // Raccourci secret : Ctrl+G débloque immédiatement
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && (e.key === 'g' || e.key === 'G')) {
                e.preventDefault();
                unlockPage();
            }
        });

        // Mini-cœurs qui montent en continu derrière le compteur
        const lockHearts = ['💚', '💕', '💗', '🧸', '🎵', '🎹', '🎶'];
        const lockContent = lockScreen.querySelector('.lock-content');
        for (let i = 0; i < 8; i++) {
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
            { emoji: '🧸', text: 'Savais-tu ? Les nounours ont été inventés en 1902… et ils fêtent déjà 124 ans cette année !' },
            { emoji: '🎂', text: "Savais-tu ? Le gâteau d'anniversaire le plus ancien a plus de 4000 ans : les Grecs le dédiaient à Artémis !" },
            { emoji: '🕯️', text: "Savais-tu ? Les bougies sur les gâteaux viennent des Grecs, qui pensaient qu'elles portaient les vœux jusqu'aux dieux." },
            { emoji: '🎹', text: 'Le pianiste attend le 28 août pour jouer "Joyeux anniversaire". Il répète encore. Il revient le 28 août à 00:00:01.' },
            { emoji: '🌺', text: "Savais-tu ? Chaque fleur d'hibiscus ne vit qu'un jour : elle s'ouvre le matin et se fane le soir… mais une nouvelle repousse dès le lendemain." },
            { emoji: '🌺', text: 'Savais-tu ? Il existe plus de 200 espèces d\'hibiscus dans le monde… mais aucune n\'est assez belle pour toi.' },
            { emoji: '🌺', text: 'Savais-tu ? Il existe plus de 200 espèces d\'hibiscus dans le monde…' },
            { emoji: '🎹', text: 'Savais-tu ? Le piano possède 88 touches : 52 blanches et 36 noires.' },
            { emoji: '🎵', text: 'Savais-tu ? Le mot "musique" vient du grec "mousikē", l\'art des Muses.' },
            { emoji: '📅', text: 'Savais-tu ? Le 28 août est la 240ᵉ journée de l\'année — un chiffre qui se lit "2-4-0", comme "2 fois 120", soit 240 raisons de fêter ton anniversaire.' },
            { emoji: '🎹', text: 'La playlist d\'anniversaire est en préparation. Le piano a demandé à être prévenu avant de jouer.' },
            { emoji: '⏳', text: 'Chaque seconde passée est une seconde de moins avant le 28 août. Le compte à rebours est officiellement lancé. Enfin, presque.' },
            { emoji: '🕯️', text: 'Même les bougies savent quelle date approche.' },
            { emoji: '🌌', text: 'Tous les éléments composant l\'univers, les galaxies, les amas de poussière, les astres, s\'éloignent les uns des autres inexorablement... un peu comme nous.' },
            { emoji: '⭐', text: 'Et quand deux étoiles sont trop proches et que l\'une d\'entre elles explose, il arrive qu\'elle condamne l\'autre étoile à errer sans trajectoire dans l\'univers. On les appelle les étoiles vagabondes.' }
        ];
        let currentPick = LOCK_MESSAGES[Math.floor(Math.random() * LOCK_MESSAGES.length)];
        lockMessage.textContent = currentPick.emoji + '  ' + currentPick.text;

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
                lockMessage.textContent = next.emoji + '  ' + next.text;
                lockMessage.classList.remove('lock-message--out');
                void lockMessage.offsetWidth;
                lockMessage.classList.add('lock-message--in');
            }, 260);
        }
        lockMessageZone.addEventListener('click', cycleLockMessage);

        // ===== EFFET DE CLIC (particules + emojis, différent du menu principal) =====
        let activeBursts = 0;
        const MAX_ACTIVE_BURSTS = 6;

        function spawnLockBurst(x, y) {
            if (activeBursts >= MAX_ACTIVE_BURSTS) return;
            activeBursts++;
            const colors = ['#ff8aa8', '#7bbf7e', '#ffd166', '#9bcb9e', '#ffb6c9', '#b58fd6'];
            const burstEmojis = ['🎵', '🎶', '🎹', '🎼', '💚', '💕', '🧸', '🌺'];
            const count = 14;
            for (let i = 0; i < count; i++) {
                const el = document.createElement('span');
                const angle = (i / count) * Math.PI * 2 + Math.random() * 0.7;
                const dist = 45 + Math.random() * 75;
                const dx = Math.cos(angle) * dist;
                const dy = Math.sin(angle) * dist;
                if (Math.random() < 0.35) {
                    el.textContent = burstEmojis[Math.floor(Math.random() * burstEmojis.length)];
                    el.style.fontSize = (1 + Math.random() * 1.1) + 'rem';
                } else {
                    el.style.width = (5 + Math.random() * 7) + 'px';
                    el.style.height = el.style.width;
                    el.style.borderRadius = '50%';
                    el.style.background = colors[Math.floor(Math.random() * colors.length)];
                }
                el.style.position = 'fixed';
                el.style.left = (x - 8) + 'px';
                el.style.top = (y - 8) + 'px';
                el.style.pointerEvents = 'none';
                el.style.zIndex = '5';
                el.style.transition = 'transform 0.7s cubic-bezier(.15,.85,.35,1), opacity 0.7s ease';
                lockScreen.appendChild(el);
                requestAnimationFrame(() => {
                    el.style.transform = `translate(${dx}px, ${dy}px) rotate(${(Math.random() - 0.5) * 180}deg) scale(${0.5 + Math.random() * 0.9})`;
                    el.style.opacity = '0';
                });
                setTimeout(() => el.remove(), 750);
            }
            setTimeout(() => activeBursts--, 760);
        }

        lockScreen.addEventListener('click', function(e) {
            if (!unlocked && !e.target.closest('.lock-message-zone')) spawnLockBurst(e.clientX, e.clientY);
        });

        // Bloquer le scroll tant que le site est verrouillé
        document.body.style.overflow = 'hidden';
        // Pause des animations du fond derrière l'écran (perf)
        document.querySelectorAll('.floating-item').forEach(el => {
            el.style.animationPlayState = 'paused';
        });

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
};

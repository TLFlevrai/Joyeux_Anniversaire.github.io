// ============================================================
//  MAIN - Tout s'exécute après le chargement du DOM
// ============================================================
document.addEventListener('DOMContentLoaded', function() {

// ============================================================
//  DEBUG MODE
// ============================================================
let debugMode = false;
const debugIndicator = document.createElement('div');
debugIndicator.id = 'debug-indicator';
debugIndicator.textContent = 'DEBUG_MODE';
debugIndicator.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    background: rgba(255, 0, 0, 0.8);
    color: #fff;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    font-family: monospace;
    z-index: 10001;
    pointer-events: none;
    display: none;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
`;
document.body.appendChild(debugIndicator);

function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|dtim|dvce|dvst|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(8|o|ts)|mime|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30[0-2]|n50[0-2]|n70[0-2]|n710|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|64|\-[a-w])|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|vo)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|84|85|86|87|88|90|91|92|93|94|95|96|97|98|99|a0|a1|a2|a3|a4|a5|a6|a7|a8|a9|aa|ab|ac|ad|ae|af|ag|ah|ai|aj|ak|al|am|an|ao|ap|aq|ar|as|at|au|av|aw|ax|ay|az|b0|b1|b2|b3|b4|b5|b6|b7|b8|b9|ba|bb|bc|bd|be|bf|bg|bh|bi|bj|bk|bl|bm|bn|bo|bp|bq|br|bs|bt|bu|bv|bw|bx|by|bz|c0|c1|c2|c3|c4|c5|c6|c7|c8|c9|ca|cb|cc|cd|ce|cf|cg|ch|ci|cj|ck|cl|cm|cn|co|cp|cq|cr|cs|ct|cu|cv|cw|cx|cy|cz|d0|d1|d2|d3|d4|d5|d6|d7|d8|d9|da|db|dc|dd|de|df|dg|dh|di|dj|dk|dl|dm|dn|do|dp|dq|dr|ds|dt|du|dv|dw|dx|dy|dz|e0|e1|e2|e3|e4|e5|e6|e7|e8|e9|ea|eb|ec|ed|ee|ef|eg|eh|ei|ej|ek|el|em|en|eo|ep|eq|er|es|et|eu|ev|ew|ex|ey|ez|f0|f1|f2|f3|f4|f5|f6|f7|f8|f9|fa|fb|fc|fd|fe|ff|fg|fh|fi|fj|fk|fl|fm|fn|fo|fp|fq|fr|fs|ft|fu|fv|fw|fx|fy|fz|g0|g1|g2|g3|g4|g5|g6|g7|g8|g9|ga|gb|gc|gd|ge|gf|gg|gh|gi|gj|gk|gl|gm|gn|go|gp|gq|gr|gs|gt|gu|gv|gw|gx|gy|gz|h0|h1|h2|h3|h4|h5|h6|h7|h8|h9|ha|hb|hc|hd|he|hf|hg|hh|hi|hj|hk|hl|hm|hn|ho|hp|hq|hr|hs|ht|hu|hv|hw|hx|hy|hz|i0|i1|i2|i3|i4|i5|i6|i7|i8|i9|ia|ib|ic|id|ie|if|eg|eh|ei|ej|ek|el|em|en|eo|ep|eq|er|es|et|eu|ev|ew|ex|ey|ez|f0|f1|f2|f3|f4|f5|f6|f7|f8|f9|fa|fb|fc|fd|fe|ff|fg|fh|fi|fj|fk|fl|fm|fn|fo|fp|fq|fr|fs|ft|fu|fv|fw|fx|fy|fz|g0|g1|g2|g3|g4|g5|g6|g7|g8|g9|ga|gb|gc|gd|ge|gf|gg|gh|gi|gj|gk|gl|gm|gn|go|gp|gq|gr|gs|gt|gu|gv|gw|gx|gy|gz|h0|h1|h2|h3|h4|h5|h6|h7|h8|h9|ha|hb|hc|hd|he|hf|hg|hh|hi|hj|hk|hl|hm|hn|ho|hp|hq|hr|hs|ht|hu|hv|hw|hx|hy|hz)/i.test(ua.substr(0, 4))) {
        return '📱 Mobile';
    }
    return '💻 Desktop';
}

function toggleDebugMode() {
    debugMode = !debugMode;
    debugIndicator.style.display = debugMode ? 'block' : 'none';
    if (debugMode) {
        document.addEventListener('click', debugClick, true);
        const deviceType = getDeviceType();
        debugIndicator.textContent = `DEBUG_MODE | ${deviceType}`;
        console.log('Debug mode: ON | Device:', deviceType);
    } else {
        document.removeEventListener('click', debugClick, true);
        debugIndicator.textContent = 'DEBUG_MODE';
        console.log('Debug mode: OFF');
    }
}

// Ctrl+V pour activer/désactiver le debug mode
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        toggleDebugMode();
    }
});

// ============================================================
//  DEBUG: Détection de tous les clics (seulement si debugMode = true)
// ============================================================
function debugClick(e) {
    if (!debugMode) return;
    console.log('=== CLIC DÉTECTÉ ===', {
        x: e.clientX,
        y: e.clientY,
        target: e.target.tagName,
        targetClass: e.target.className,
        targetId: e.target.id,
        isBtn: !!e.target.closest('.btn'),
        isCard: !!e.target.closest('.card'),
        isMusicBtn: !!e.target.closest('.music-btn'),
        isFloatingBg: !!e.target.closest('.floating-bg'),
    });
    
    // Indicateur visuel temporaire
    const indicator = document.createElement('div');
    indicator.textContent = `🖱️ Click: ${e.clientX}, ${e.clientY}`;
    indicator.style.cssText = `
        position: fixed;
        left: ${e.clientX + 10}px;
        top: ${e.clientY - 20}px;
        background: rgba(0,0,0,0.8);
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        pointer-events: none;
        animation: fadeOut 1s forwards;
    `;
    document.body.appendChild(indicator);
    setTimeout(() => indicator.remove(), 1000);
}

// Animation CSS pour l'indicateur
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);

// ============================================================
//  1.  FONDS FLOTTANT : CŒURS + NOUNOURS + HIBISCUS
// ============================================================
    const container = document.getElementById('floatingBg');
    const symbols = ['💚', '💕', '🧸', '🌺', '💗', '🍀', '✨', '🎵', '🎶', '🎹', '🎼', '💜'];
    const count = 26;

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

// ============================================================
//  2.  RÉVÉLATION DU MESSAGE SECRET
// ============================================================
const revealBtn = document.getElementById('revealBtn');
const hiddenMsg = document.getElementById('hiddenMessage');
let isMsgOpen = false;

revealBtn.addEventListener('click', function(e) {
    e.preventDefault();
    isMsgOpen = !isMsgOpen;
    if (isMsgOpen) {
        hiddenMsg.classList.add('open');
        revealBtn.textContent = '💌 Refermer le message';
        revealBtn.classList.add('btn-pink');
        launchConfetti(30);
    } else {
        hiddenMsg.classList.remove('open');
        revealBtn.textContent = '💌 Lire le message secret';
        revealBtn.classList.remove('btn-pink');
    }
});

// ============================================================
//  3.  CONFETTIS (canvas)
// ============================================================
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let W, H;
let particles = [];
let animId = null;

function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiParticle {
    constructor(x, y) {
        this.x = x || Math.random() * W;
        this.y = y || Math.random() * H - H;
        this.w = 6 + Math.random() * 10;
        this.h = 4 + Math.random() * 8;
        this.color = ['#ff8aa8', '#ffb6c9', '#9ed0a2', '#7bbf7e', '#ffd166', '#ff6b8a', '#a8d8ac', '#d9c9e6'][Math.floor(Math.random() * 8)];
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() * 3 + 2);
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 10;
        this.gravity = 0.06 + Math.random() * 0.04;
        this.friction = 0.99;
        this.life = 1;
        this.decay = 0.005 + Math.random() * 0.008;
    }

    update() {
        this.x += this.vx;
        this.vy += this.gravity;
        this.y += this.vy;
        this.vx *= this.friction;
        this.rotation += this.rotSpeed;
        this.life -= this.decay;
        return this.life > 0 && this.y < H + 50;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.life * 0.9;
        ctx.fillStyle = this.color;
        ctx.shadowColor = 'rgba(0,0,0,0.05)';
        ctx.shadowBlur = 8;
        ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
        ctx.restore();
    }
}

function launchConfetti(count = 80) {
    // Plafond de particules simultanées (perf)
    count = Math.min(count, Math.max(0, 260 - particles.length));
    if (count <= 0) return;
    const originX = Math.random() * W * 0.6 + W * 0.2;
    const originY = Math.random() * H * 0.3;
    for (let i = 0; i < count; i++) {
        particles.push(new ConfettiParticle(
            originX + (Math.random() - 0.5) * 100,
            originY + (Math.random() - 0.5) * 60
        ));
    }
    if (!animId) animateConfetti();
}

function animateConfetti() {
    ctx.clearRect(0, 0, W, H);
    let alive = false;
    for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].update()) {
            particles[i].draw(ctx);
            alive = true;
        } else {
            particles.splice(i, 1);
        }
    }
    if (alive || particles.length > 0) {
        animId = requestAnimationFrame(animateConfetti);
    } else {
        animId = null;
        ctx.clearRect(0, 0, W, H);
    }
}

document.getElementById('confettiBtn').addEventListener('click', function(e) {
    e.preventDefault();
    launchConfetti(100);
    // Spawn visual hearts only (don't increment counter multiple times)
    for (let i = 0; i < 8; i++) {
        setTimeout(() => spawnVisualOnly(e.clientX, e.clientY, ['🧸', '💚', '💕', '🌺', '💗']), i * 60);
    }
    // Increment counter once for the confetti button click
    heartCount += 1;
    heartCountEl.textContent = heartCount;
    heartCountEl.style.transform = 'scale(1.5)';
    setTimeout(() => { heartCountEl.style.transform = 'scale(1)'; }, 200);
});

// ============================================================
//  4.  APPARITION D'ÉLÉMENTS AU CLIC (cœurs, nounours, hibiscus)
// ============================================================
const heartCountEl = document.getElementById('heartCount');
let heartCount = 0;

// Limite les éléments spawnés au clic (perf : évite la saturation du DOM)
let activeSpawns = 0;
const MAX_ACTIVE_SPAWNS = 40;

function spawnItemAtCursor(x, y, items = ['💚', '💕', '💗', '🌺', '🧸']) {
    // Incrémenter le compteur à chaque clic (même si le spawn visuel est limité)
    heartCount += 1;
    heartCountEl.textContent = heartCount;
    heartCountEl.style.transform = 'scale(1.5)';
    setTimeout(() => { heartCountEl.style.transform = 'scale(1)'; }, 200);

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

// Clic sur la page (sauf boutons, carte, et bouton musique)
document.addEventListener('click', function(e) {
    if (window.__pageLocked) return;
    if (e.target.closest('.btn') || e.target.closest('.card') || e.target.closest('.music-btn')) return;
    console.log('Page clicked at:', e.clientX, e.clientY);
    spawnItemAtCursor(e.clientX, e.clientY);
    if (Math.random() < 0.15) launchConfetti(12);
});

// Clic sur la carte (hors boutons)
document.querySelector('.card').addEventListener('click', function(e) {
    if (window.__pageLocked) return;
    if (e.target.closest('.btn')) return;
    console.log('Card clicked at:', e.clientX, e.clientY);
    spawnItemAtCursor(e.clientX, e.clientY);
});

// ============================================================
//  5.  BOUTON "+1 cœur"
// ============================================================
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
    
    launchConfetti(25);
    this.style.transform = 'scale(0.92)';
    setTimeout(() => { this.style.transform = ''; }, 150);
});

// Visual-only spawn (doesn't increment counter)
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

// ============================================================
//  6.  CONFETTIS AU CHARGEMENT
// ============================================================
window.addEventListener('load', function() {
    if (window.__pageLocked) return;
    setTimeout(() => launchConfetti(55), 400);
    setTimeout(() => launchConfetti(40), 900);
});

// ============================================================
//  7.  ACCESSIBILITÉ
// ============================================================
document.querySelectorAll('.btn').forEach(btn => {
    btn.setAttribute('aria-label', btn.textContent.trim());
});

// ============================================================
//  8.  ÉCRAN DE VERROUILLAGE : COMPTE À REBOURS
//      Déblocage automatique le 28 août à 00:00:01
//      Raccourci secret : Ctrl+G pour débloquer immédiatement
// ============================================================
window.__pageLocked = true;

(function initLockScreen() {
    const lockScreen = document.getElementById('lockScreen');
    const countdownEl = document.getElementById('countdown');
    const lockIcon = document.getElementById('lockIcon');
    const lockSubtitle = document.getElementById('lockSubtitle');
    const lockNote = document.getElementById('lockNote');
    const lockCornerEmoji = document.getElementById('lockCornerEmoji');
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
        launchConfetti(120);
        setTimeout(() => launchConfetti(80), 350);
        const vw = window.innerWidth / 2;
        const vh = window.innerHeight / 2;
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                spawnVisualOnly(
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
        if (!unlocked) spawnLockBurst(e.clientX, e.clientY);
    });

    // Bloquer le scroll tant que le site est verrouillé
    document.body.style.overflow = 'hidden';
    // Pause des animations du fond derrière l'écran (perf)
    document.querySelectorAll('.floating-item').forEach(el => {
        el.style.animationPlayState = 'paused';
    });

    updateCountdown();
    setInterval(updateCountdown, 1000);
})();

// ============================================================
//  9.  LECTEUR DE MUSIQUE
// ============================================================
(function initMusicPlayer() {
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
})();

console.log('🌺 Joyeux anniversaire ! Plein de 💚, de 🧸 et d\'🌺 ! 🌺');
});
// ============================================================
//  1.  FONDS FLOTTANT : CŒURS + NOUNOURS + HIBISCUS
// ============================================================
(function createFloatingItems() {
    const container = document.getElementById('floatingBg');
    const symbols = ['💚', '💕', '🧸', '🌺', '💗', '🍀', '✨', '🌺', '💜'];
    const count = 30;

    for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.className = 'floating-item';
        el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.fontSize = (1.4 + Math.random() * 2.6) + 'rem';
        el.style.animationDuration = (14 + Math.random() * 24) + 's';
        el.style.animationDelay = (Math.random() * 22) + 's';
        el.style.opacity = 0.15 + Math.random() * 0.4;
        container.appendChild(el);
    }
})();

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
    for (let i = 0; i < 8; i++) {
        setTimeout(() => spawnItemAtCursor(e.clientX, e.clientY, ['🧸', '💚', '💕', '🌺', '💗']), i * 60);
    }
});

// ============================================================
//  4.  APPARTION D'ÉLÉMENTS AU CLIC (hibiscus inclus)
// ============================================================
const heartCountEl = document.getElementById('heartCount');
let heartCount = 0;

function spawnItemAtCursor(x, y, items = ['💚', '💕', '💗', '🌺', '🧸']) {
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
    }, 1400);

    // Incrémenter le compteur seulement si c'est un cœur
    if (['💚', '💕', '💗'].includes(el.textContent)) {
        heartCount += 1;
        heartCountEl.textContent = heartCount;
        heartCountEl.style.transform = 'scale(1.5)';
        setTimeout(() => { heartCountEl.style.transform = 'scale(1)'; }, 200);
    }
}

// Clic sur la page (sauf boutons et carte)
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn') || e.target.closest('.card')) return;
    spawnItemAtCursor(e.clientX, e.clientY);
    if (Math.random() < 0.15) launchConfetti(12);
});

// Clic sur la carte (hors boutons)
document.querySelector('.card').addEventListener('click', function(e) {
    if (e.target.closest('.btn')) return;
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
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
        const dist = 40 + Math.random() * 60;
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist - 20;
        spawnItemAtCursor(x, y, ['💚', '💕', '💗']);
    }
    launchConfetti(25);
    this.style.transform = 'scale(0.92)';
    setTimeout(() => { this.style.transform = ''; }, 150);
});

// ============================================================
//  6.  CONFETTIS AU CHARGEMENT
// ============================================================
window.addEventListener('load', function() {
    setTimeout(() => launchConfetti(55), 400);
    setTimeout(() => launchConfetti(40), 900);
});

// ============================================================
//  7.  ACCESSIBILITÉ
// ============================================================
document.querySelectorAll('.btn').forEach(btn => {
    btn.setAttribute('aria-label', btn.textContent.trim());
});

console.log('🌺 Joyeux anniversaire ! Plein de 💚, de 🧸 et d\'🌺 ! 🌺');
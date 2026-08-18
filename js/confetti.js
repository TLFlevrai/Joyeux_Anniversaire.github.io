// ============================================================
//  CONFETTIS : moteur canvas + pluie au chargement + bouton
// ============================================================
window.LV = window.LV || {};

LV.confetti = {
    init: function() {
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

        // API partagée (utilisée par reveal, hearts, lock-screen)
        LV.confetti.launch = launchConfetti;

        // Bouton confettis
        document.getElementById('confettiBtn').addEventListener('click', function(e) {
            e.preventDefault();
            launchConfetti(100);
            // Spawn visual hearts only (don't increment counter multiple times)
            for (let i = 0; i < 8; i++) {
                setTimeout(() => LV.hearts.spawnVisualOnly(e.clientX, e.clientY, ['🧸', '💚', '💕', '🌺', '💗']), i * 60);
            }
            // Increment counter once for the confetti button click
            LV.hearts.addOne();
        });

        // Confettis au chargement (si le site n'est pas verrouillé)
        window.addEventListener('load', function() {
            if (window.__pageLocked) return;
            setTimeout(() => launchConfetti(55), 400);
            setTimeout(() => launchConfetti(40), 900);
        });
    }
};

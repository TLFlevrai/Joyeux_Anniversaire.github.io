// ============================================================
//  DÉTECTION DE PUISSANCE & PRESETS GRAPHIQUES
//  Presets : legacy-plus (ultra-léger) | legacy (compatibilité)
//            | normal (équilibré) | max_graph (ultime)
//  L'appareil est évalué automatiquement (cœurs, RAM, DPR, écran).
//  L'utilisateur peut forcer un preset via l'indicateur en haut à droite.
// ============================================================
window.LV = window.LV || {};

LV.performance = {
    preset: 'normal',
    density: 1,

    // Score de puissance : cœurs CPU + mémoire + densité d'écran
    detect: function() {
        const nav = navigator;
        const cores = nav.hardwareConcurrency || 1;
        const memory = nav.deviceMemory || 0;
        const dpr = window.devicePixelRatio || 1;
        const isMobile = !!window.__isMobile;
        const pixels = (screen.width || 0) * (screen.height || 0);

        let score = 0;
        if (cores >= 8) score += 3;
        else if (cores >= 4) score += 2;
        else if (cores >= 2) score += 1;
        if (memory >= 8) score += 3;
        else if (memory >= 4) score += 2;
        else if (memory >= 2) score += 1;
        if (dpr >= 3) score += 2;
        else if (dpr >= 2) score += 1;
        if (pixels > 1500000) score += 1;
        if (isMobile) score -= 1;

        if (score >= 7) return 'max_graph';
        if (score >= (isMobile ? 4 : 3)) return 'normal';
        if (score >= 2) return 'legacy';
        return 'legacy-plus';
    },

    apply: function(preset) {
        this.preset = preset;
        const DENSITIES = { 'legacy-plus': 0.35, legacy: 0.5, normal: 1, max_graph: 1.5 };
        this.density = DENSITIES[preset] || 1;
        const html = document.documentElement;
        html.classList.remove('preset-legacy-plus', 'preset-legacy', 'preset-normal', 'preset-max_graph');
        html.classList.add('preset-' + preset);
        window.__graphPreset = preset;
        window.__graphDensity = this.density;
        this.updateIndicator();
        // Les moteurs (fx, confetti) ajustent DPR / plafonds en temps réel
        window.dispatchEvent(new CustomEvent('presetchange'));
    },

    setPreset: function(preset) {
        this.apply(preset);
        try { localStorage.setItem('graphPreset', preset); } catch (e) {}
        this.closeMenu();
    },

    init: function() {
        let saved = null;
        try { saved = localStorage.getItem('graphPreset'); } catch (e) {}
        const isKnown = saved === 'legacy-plus' || saved === 'legacy' || saved === 'normal' || saved === 'max_graph';
        const preset = isKnown ? saved : this.detect();
        // L'indicateur doit exister AVANT apply() : c'est lui qui affiche
        // le preset réel (détecté ou sauvegardé), sinon le badge reste "NORM"
        this.buildIndicator();
        this.apply(preset);
    },

    // ===== Indicateur discret en haut à droite + menu de choix =====
    buildIndicator: function() {
        const wrap = document.createElement('div');
        wrap.className = 'preset-indicator';
        wrap.innerHTML =
            '<button class="preset-badge" id="presetBadge" aria-label="Qualité graphique" title="Qualité graphique">' +
            '⚙ <span class="preset-badge-label" id="presetBadgeLabel">NORM</span></button>' +
            '<div class="preset-menu" id="presetMenu" role="menu" aria-hidden="true">' +
            '<div class="preset-menu-title">Qualité graphique</div>' +
            '<button class="preset-option" data-preset="legacy-plus">🪶 Legacy+ <em>compatibilité ultime</em></button>' +
            '<button class="preset-option" data-preset="legacy">🕊️ Legacy <em>compatibilité maximale</em></button>' +
            '<button class="preset-option" data-preset="normal">🌿 Normal <em>équilibre idéal</em></button>' +
            '<button class="preset-option" data-preset="max_graph">✨ Max Graph <em>beauté maximale</em></button>' +
            '<div class="preset-menu-note">Réglage choisi à tes risques et périls.</div>' +
            '</div>';
        document.body.appendChild(wrap);

        const badge = document.getElementById('presetBadge');
        const menu = document.getElementById('presetMenu');

        badge.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            menu.classList.toggle('open');
            menu.setAttribute('aria-hidden', menu.classList.contains('open') ? 'false' : 'true');
        });

        menu.querySelectorAll('.preset-option').forEach(function(opt) {
            opt.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                LV.performance.setPreset(opt.getAttribute('data-preset'));
            });
        });

        document.addEventListener('click', function() {
            LV.performance.closeMenu();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') LV.performance.closeMenu();
        });

        // Empêche le clic sur l'indicateur de déclencher les effets de la page
        wrap.addEventListener('click', function(e) { e.stopPropagation(); });
    },

    updateIndicator: function() {
        const label = document.getElementById('presetBadgeLabel');
        if (label) {
            const map = { 'legacy-plus': 'LITE+', legacy: 'LITE', normal: 'NORM', max_graph: 'MAX' };
            label.textContent = map[this.preset] || 'NORM';
        }
        const menu = document.getElementById('presetMenu');
        if (menu) {
            menu.querySelectorAll('.preset-option').forEach(function(opt) {
                opt.classList.toggle('active', opt.getAttribute('data-preset') === LV.performance.preset);
            });
        }
    },

    closeMenu: function() {
        const menu = document.getElementById('presetMenu');
        if (menu && menu.classList.contains('open')) {
            menu.classList.remove('open');
            menu.setAttribute('aria-hidden', 'true');
        }
    }
};

LV.performance.init();

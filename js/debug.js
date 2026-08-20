// ============================================================
//  DEBUG MODE : indicateur visuel + détection des clics (Ctrl+V)
// ============================================================
window.LV = window.LV || {};

LV.debug = {
    init: function() {
        let debugMode = false;

        // Styles du panneau debug (injectés une seule fois)
        if (!document.getElementById('debug-styles')) {
            const st = document.createElement('style');
            st.id = 'debug-styles';
            st.textContent = `
                #debug-panel {
                    position: fixed; top: 10px; left: 10px; z-index: 10001; pointer-events: none; display: none;
                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; font-size: 12px; line-height: 1.6;
                    background: rgba(13, 26, 18, 0.95); color: #e6f2e8; padding: 13px 15px; border-radius: 14px;
                    min-width: 268px; box-shadow: 0 10px 34px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.07);
                    border: 1px solid rgba(255, 255, 255, 0.09); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
                }
                #debug-panel .dbg-head {
                    font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
                    color: #9fd8a8; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;
                }
                #debug-panel .dbg-head::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #7be58a; box-shadow: 0 0 8px #7be58a; }
                #debug-panel .dbg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3px 16px; }
                #debug-panel .dbg-item { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
                #debug-panel .dbg-label { color: #8fb99a; font-size: 11px; }
                #debug-panel .dbg-value { font-weight: 600; color: #f2fbf4; font-variant-numeric: tabular-nums; }
                #debug-panel .dbg-chip { font-weight: 700; font-size: 10px; letter-spacing: 1px; padding: 2px 9px; border-radius: 30px; color: #fff; }
                #debug-panel .dbg-chip.legacy { background: #5d7268; }
                #debug-panel .dbg-chip.normal { background: linear-gradient(135deg, #4c9a55, #2f7a3c); }
                #debug-panel .dbg-chip.max_graph { background: linear-gradient(135deg, #e06d96, #b58fd6); }
                #debug-panel .dbg-fps { font-weight: 700; font-variant-numeric: tabular-nums; font-size: 12px; }
                #debug-panel .dbg-fps.good { color: #7be58a; }
                #debug-panel .dbg-fps.mid  { color: #ffd166; }
                #debug-panel .dbg-fps.low  { color: #ff7b7b; }
                #debug-panel .dbg-sep { height: 1px; background: rgba(255, 255, 255, 0.10); margin: 9px 0; }
            `;
            document.head.appendChild(st);
        }
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.innerHTML = `
            <div class="dbg-head">Debug — Ctrl+V pour quitter</div>
            <div class="dbg-grid">
                <div class="dbg-item"><span class="dbg-label">Catégorie</span><span class="dbg-chip" id="dbgPreset">—</span></div>
                <div class="dbg-item"><span class="dbg-label">Mode</span><span class="dbg-value" id="dbgMode">—</span></div>
                <div class="dbg-item"><span class="dbg-label">FPS</span><span class="dbg-fps" id="dbgFps">—</span></div>
                <div class="dbg-item"><span class="dbg-label">Densité</span><span class="dbg-value" id="dbgDensity">—</span></div>
            </div>
            <div class="dbg-sep"></div>
            <div class="dbg-grid">
                <div class="dbg-item"><span class="dbg-label">Cœurs</span><span class="dbg-value" id="dbgCores">—</span></div>
                <div class="dbg-item"><span class="dbg-label">RAM</span><span class="dbg-value" id="dbgRam">—</span></div>
                <div class="dbg-item"><span class="dbg-label">DPR</span><span class="dbg-value" id="dbgDpr">—</span></div>
                <div class="dbg-item"><span class="dbg-label">Écran</span><span class="dbg-value" id="dbgScreen">—</span></div>
            </div>`;
        document.body.appendChild(debugPanel);

        // ===== Compteur FPS (actif seulement en mode debug) =====
        let frameCount = 0;
        let fps = 0;
        let rafId = null;
        function fpsFrame() {
            frameCount++;
            rafId = requestAnimationFrame(fpsFrame);
        }
        function fpsStart() {
            if (rafId) return;
            frameCount = 0;
            fps = 0;
            fpsFrame();
        }
        function fpsStop() {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }
        let statsTimer = null;

        function updateDebugPanel() {
            if (!debugMode) return;
            const now = performance.now();
            if (!updateDebugPanel._last) updateDebugPanel._last = now;
            const elapsed = now - updateDebugPanel._last;
            fps = Math.round((frameCount * 1000) / Math.max(16, elapsed));
            frameCount = 0;
            updateDebugPanel._last = now;

            const nav = navigator;
            const preset = window.__graphPreset || 'normal';
            const chip = document.getElementById('dbgPreset');
            chip.textContent = preset.toUpperCase();
            chip.className = 'dbg-chip ' + preset;
            document.getElementById('dbgMode').textContent = window.__isMobile ? '📱 Mobile' : '💻 Desktop';
            const fpsEl = document.getElementById('dbgFps');
            fpsEl.textContent = fps;
            fpsEl.className = 'dbg-fps ' + (fps >= 50 ? 'good' : (fps >= 30 ? 'mid' : 'low'));
            document.getElementById('dbgDensity').textContent = '×' + (window.__graphDensity || 1);
            document.getElementById('dbgCores').textContent = nav.hardwareConcurrency || '?';
            document.getElementById('dbgRam').textContent = nav.deviceMemory ? nav.deviceMemory + ' Go' : '?';
            document.getElementById('dbgDpr').textContent = window.devicePixelRatio || 1;
            document.getElementById('dbgScreen').textContent = (screen.width || 0) + '×' + (screen.height || 0);
        }
        
        function getDeviceType() {
            const ua = navigator.userAgent;
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|dtim|dvce|dvst|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(8|o|ts)|mime|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30[0-2]|n50[0-2]|n70[0-2]|n710|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|64|\-[a-w])|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|vo)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|84|85|86|87|88|90|91|92|93|94|95|96|97|98|99|a0|a1|a2|a3|a4|a5|a6|a7|a8|a9|aa|ab|ac|ad|ae|af|ag|ah|ai|aj|ak|al|am|an|ao|ap|aq|ar|as|at|au|av|aw|ax|ay|az|b0|b1|b2|b3|b4|b5|b6|b7|b8|b9|ba|bb|bc|bd|be|bf|bg|bh|bi|bj|bk|bl|bm|bn|bo|bp|bq|br|bs|bt|bu|bv|bw|bx|by|bz|c0|c1|c2|c3|c4|c5|c6|c7|c8|c9|ca|cb|cc|cd|ce|cf|cg|ch|ci|cj|ck|cl|cm|cn|co|cp|cq|cr|cs|ct|cu|cv|cw|cx|cy|cz|d0|d1|d2|d3|d4|d5|d6|d7|d8|d9|da|db|dc|dd|de|df|dg|dh|di|dj|dk|dl|dm|dn|do|dp|dq|dr|ds|dt|du|dv|dw|dx|dy|dz|e0|e1|e2|e3|e4|e5|e6|e7|e8|e9|ea|eb|ec|ed|ee|ef|eg|eh|ei|ej|ek|el|em|en|eo|ep|eq|er|es|et|eu|ev|ew|ex|ey|ez|f0|f1|f2|f3|f4|f5|f6|f7|f8|f9|fa|fb|fc|fd|fe|ff|fg|fh|fi|fj|fk|fl|fm|fn|fo|fp|fq|fr|fs|ft|fu|fv|fw|fx|fy|fz|g0|g1|g2|g3|g4|g5|g6|g7|g8|g9|ga|gb|gc|gd|ge|gf|gg|gh|gi|gj|gk|gl|gm|gn|go|gp|gq|gr|gs|gt|gu|gv|gw|gx|gy|gz|h0|h1|h2|h3|h4|h5|h6|h7|h8|h9|ha|hb|hc|hd|he|hf|hg|hh|hi|hj|hk|hl|hm|hn|ho|hp|hq|hr|hs|ht|hu|hv|hw|hx|hy|hz|i0|i1|i2|i3|i4|i5|i6|i7|i8|i9|ia|ib|ic|id|ie|if|eg|eh|ei|ej|ek|el|em|en|eo|ep|eq|er|es|et|eu|ev|ew|ex|ey|ez|f0|f1|f2|f3|f4|f5|f6|f7|f8|f9|fa|fb|fc|fd|fe|ff|fg|fh|fi|fj|fk|fl|fm|fn|fo|fp|fq|fr|fs|ft|fu|fv|fw|fx|fy|fz|g0|g1|g2|g3|g4|g5|g6|g7|g8|g9|ga|gb|gc|gd|ge|gf|gg|gh|gi|gj|gk|gl|gm|gn|go|gp|gq|gr|gs|gt|gu|gv|gw|gx|gy|gz|h0|h1|h2|h3|h4|h5|h6|h7|h8|h9|ha|hb|hc|hd|he|hf|hg|hh|hi|hj|hk|hl|hm|hn|ho|hp|hq|hr|hs|ht|hu|hv|hw|hx|hy|hz)/i.test(ua.substr(0, 4))) {
                return 'ðŸ“± Mobile';
            }
            return 'ðŸ’» Desktop';
        }
        
        function toggleDebugMode() {
            debugMode = !debugMode;
            if (debugMode) {
                document.addEventListener('click', debugClick, true);
                fpsStart();
                debugPanel.style.display = 'block';
                updateDebugPanel._last = null;
                updateDebugPanel();
                statsTimer = setInterval(updateDebugPanel, 1000);
                console.log('Debug mode: ON');
            } else {
                document.removeEventListener('click', debugClick, true);
                fpsStop();
                if (statsTimer) { clearInterval(statsTimer); statsTimer = null; }
                debugPanel.style.display = 'none';
                console.log('Debug mode: OFF');
            }
        }
        
// Exposition globale : permet d'ouvrir le panneau depuis l'écran de verrouillage
        window.__toggleDebug = toggleDebugMode;

        // Ctrl+V pour activer/désactiver le debug mode
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'v') {
                e.preventDefault();
                toggleDebugMode();
            }
        });

        // Ctrl+Y : bascule le mode téléphone (interface mobile sur ordinateur)
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && (e.key === 'y' || e.key === 'Y')) {
                e.preventDefault();
                const nowMobile = document.documentElement.classList.toggle('mobile');
                window.__isMobile = nowMobile;
                console.log('Mode téléphone : ' + (nowMobile ? 'ACTIVÉ' : 'désactivé'));
            }
        });

        // Rafraîchit le panneau immédiatement quand l'utilisateur change de preset
        document.addEventListener('click', function(e) {
            if (!debugMode) return;
            if (e.target.closest('.preset-option')) {
                setTimeout(function() {
                    updateDebugPanel._last = null;
                    updateDebugPanel();
                }, 0);
            }
        }, true);
        
        // ============================================================
        //  DEBUG: DÃ©tection de tous les clics (seulement si debugMode = true)
        // ============================================================
        function debugClick(e) {
            if (!debugMode) return;
            console.log('=== CLIC DÃ‰TECTÃ‰ ===', {
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
            indicator.textContent = `ðŸ–±ï¸ Click: ${e.clientX}, ${e.clientY}`;
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
    }
};

// ============================================================
//  DÉTECTION MOBILE PARTAGÉE (utilisée par l'interface mobile)
// ============================================================
LV.debug.isMobile = function() {
    const ua = navigator.userAgent;
    const strong = /(android|iphone|ipod|ipad|iemobile|opera mini|windows phone|blackberry|bb10|kindle|silk|playbook)/i.test(ua);
    const weak = /(mobi|mobile)/i.test(ua);
    const coarse = !!(navigator.maxTouchPoints > 1 && window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    return strong || weak || coarse;
};
window.__isMobile = LV.debug.isMobile();
document.documentElement.classList.toggle('mobile', window.__isMobile);

// ============================================================
//  RÉVÉLATION DU MESSAGE SECRET
// ============================================================
window.LV = window.LV || {};

LV.reveal = {
    init: function() {
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
                LV.confetti.launch(30);
            } else {
                hiddenMsg.classList.remove('open');
                revealBtn.textContent = '💌 Lire le message secret';
                revealBtn.classList.remove('btn-pink');
            }
        });
    }
};

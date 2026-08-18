// ============================================================
//  TITRE DU SITE : aléatoire en plusieurs langues (50 % français)
// ============================================================
window.LV = window.LV || {};

LV.title = {
    init: function() {
        const TITLES = {
            fr: 'Joyeux Anniversaire',
            en: 'Happy Birthday',
            es: 'Feliz Cumpleaños',
            de: 'Alles Gute zum Geburtstag'
        };
        // 50 % de chances de tomber sur le français,
        // les 50 % restants sont répartis équitablement entre les autres langues
        const r = Math.random();
        let lang;
        if (r < 0.5) {
            lang = 'fr';
        } else if (r < 0.5 + 0.5 / 3) {
            lang = 'en';
        } else if (r < 0.5 + 2 * (0.5 / 3)) {
            lang = 'es';
        } else {
            lang = 'de';
        }
        document.title = TITLES[lang];
    }
};

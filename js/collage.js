// ============================================================
//  COLLAGE PHOTOS – Carrousel avec swipe
// ============================================================

// Liste des URLs des photos locales (assets/images)
const photoUrls = [
    'assets/images/gateau.jpg',
    'assets/images/gateau2.jpg',
    'assets/images/images.jpg',
    'assets/images/images (1).jpg',
    'assets/images/images (2).jpg',
    'assets/images/images (3).jpg'
];

let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

// Éléments DOM
const modal = document.getElementById('collageModal');
const container = document.getElementById('collageContainer');
const prevBtn = document.getElementById('prevPhoto');
const nextBtn = document.getElementById('nextPhoto');
const counter = document.getElementById('photoCounter');
const closeBtn = document.getElementById('closeModalBtn');
const photosBtn = document.getElementById('photosBtn');

// Créer les éléments <img> pour chaque photo (une seule fois : la modale
// re-randomise les rotations au lieu de re-décoder les images à chaque ouverture)
function renderCollage() {
    container.innerHTML = '';
    photoUrls.forEach((url, index) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Photo ${index+1}`;
        img.className = 'collage-photo';
        img.decoding = 'async';
        img.loading = 'lazy';
        img.dataset.index = index;
        container.appendChild(img);
    });
}

// Rotation et décalage aléatoires pour l'effet collage (frais à chaque ouverture)
function randomizeCollage() {
    container.querySelectorAll('.collage-photo').forEach(img => {
        const rot = (Math.random() - 0.5) * 12; // -6deg à +6deg
        const offsetX = (Math.random() - 0.5) * 30; // -15px à +15px
        const offsetY = (Math.random() - 0.5) * 30;
        img.style.setProperty('--rot', rot + 'deg');
        img.style.setProperty('--offsetX', offsetX + 'px');
        img.style.setProperty('--offsetY', offsetY + 'px');
        img.style.transform = `rotate(${rot}) translate(${offsetX}, ${offsetY}) scale(0.9)`;
    });
}

// Mettre à jour l'affichage en fonction de l'index courant
function updateCarousel(newIndex) {
    const images = container.querySelectorAll('.collage-photo');
    if (images.length === 0) return;

    // Retirer toutes les classes
    images.forEach(img => {
        img.classList.remove('active', 'prev', 'next');
    });

    // Index valide
    const total = images.length;
    const idx = ((newIndex % total) + total) % total;
    currentIndex = idx;

    // Photo active
    images[idx].classList.add('active');
    // Photo précédente (si existe)
    const prevIdx = ((idx - 1) % total + total) % total;
    images[prevIdx].classList.add('prev');
    // Photo suivante
    const nextIdx = (idx + 1) % total;
    images[nextIdx].classList.add('next');

    // Mise à jour du compteur
    counter.textContent = `${idx+1} / ${total}`;
}

// Navigation
function goToPrev() {
    updateCarousel(currentIndex - 1);
}
function goToNext() {
    updateCarousel(currentIndex + 1);
}

// Swipe (touch)
function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}
function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
        if (diff > 0) goToNext();
        else goToPrev();
    }
}

// Ouvrir / fermer la modale
function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    randomizeCollage(); // collage frais (rotations) sans re-décoder les images
    updateCarousel(0);
    // Fond figé derrière l'overlay : plus de re-blur plein écran (perf)
    if (LV.floatingBg && LV.floatingBg.setPaused) LV.floatingBg.setPaused(true);
}
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (LV.floatingBg && LV.floatingBg.setPaused) LV.floatingBg.setPaused(false);
}

// Événements
photosBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
prevBtn.addEventListener('click', goToPrev);
nextBtn.addEventListener('click', goToNext);

// Clic sur l'overlay pour fermer (optionnel)
modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
});

// Swipe sur le conteneur
container.addEventListener('touchstart', handleTouchStart);
container.addEventListener('touchend', handleTouchEnd);

// Gestion du clavier (flèches)
document.addEventListener('keydown', function(e) {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') goToPrev();
    else if (e.key === 'ArrowRight') goToNext();
    else if (e.key === 'Escape') closeModal();
});

// Initialisation silencieuse
renderCollage();
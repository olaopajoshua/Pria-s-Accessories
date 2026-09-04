/**
 * PRIA'S ACCESSORIES — HOMEPAGE JAVASCRIPT (index.html)
 * Loads featured bestsellers, dynamic client reviews, and 3D hero particle animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHomePage();
  if (typeof init3DCategoriesCarousel === 'function') {
    init3DCategoriesCarousel('home-categories-carousel');
  }
  if (typeof init3DReviewsCarousel === 'function') {
    init3DReviewsCarousel('home-reviews-carousel');
  }
  if (typeof initGoldParticles === 'function') {
    initGoldParticles('hero-particles-canvas');
  }
});

function initHomePage() {
  const grid = document.getElementById('home-featured-grid');
  if (!grid) return;

  // Retrieve products from global state or storage
  const products = (typeof state !== 'undefined' && state.products) 
    ? state.products 
    : JSON.parse(localStorage.getItem('prias_products_v1') || '[]');

  if (!products || products.length === 0) return;

  // Show top bestsellers
  const featured = products.filter(p => p.badges && p.badges.includes('bestseller')).slice(0, 4);
  const itemsToRender = featured.length >= 3 ? featured : products.slice(0, 4);

  if (typeof renderProductCardHTML === 'function') {
    grid.innerHTML = itemsToRender.map(product => renderProductCardHTML(product)).join('');
    if (typeof init3DCardTilt === 'function') setTimeout(init3DCardTilt, 50);
  }

  // Ensure reviews carousel is rendered
  if (typeof init3DReviewsCarousel === 'function') {
    init3DReviewsCarousel('home-reviews-carousel');
  }
}

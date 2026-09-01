/**
 * PRIA'S ACCESSORIES — PRODUCT DETAIL JAVASCRIPT (product.html)
 * Dynamic URL Parameter Product Resolution, WhatsApp Checkout & Related Pieces
 */

document.addEventListener('DOMContentLoaded', () => {
  initProductDetailPage();
});

function initProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const prodId = urlParams.get('id') || 'prod_1';

  const products = (typeof state !== 'undefined' && state.products)
    ? state.products
    : JSON.parse(localStorage.getItem('prias_products_v1') || '[]');

  if (!products || products.length === 0) return;

  const product = products.find(p => p.id === prodId) || products[0];
  if (!product) return;

  // Title & Breadcrumbs
  document.title = `${product.name} — Pria's Accessories`;
  const breadcrumbEl = document.getElementById('pdp-breadcrumb-name');
  if (breadcrumbEl) breadcrumbEl.textContent = product.name;

  // Main Image
  const mainImg = document.getElementById('pdp-main-img');
  if (mainImg) {
    mainImg.src = product.image;
    mainImg.alt = product.name;
    mainImg.onerror = () => { mainImg.src = 'assets/necklace-1.jpg'; };
  }

  // Info Elements
  const titleEl = document.getElementById('pdp-title');
  const catEl = document.getElementById('pdp-category');
  const priceEl = document.getElementById('pdp-price');
  const oldPriceEl = document.getElementById('pdp-old-price');
  const descEl = document.getElementById('pdp-desc');
  const badgesEl = document.getElementById('pdp-badges');
  const specsEl = document.getElementById('pdp-specs-list');

  if (titleEl) titleEl.textContent = product.name;
  if (catEl) catEl.textContent = product.category;
  if (priceEl && typeof formatNaira === 'function') priceEl.textContent = formatNaira(product.price);
  
  if (oldPriceEl && typeof formatNaira === 'function') {
    if (product.originalPrice && product.originalPrice > product.price) {
      oldPriceEl.textContent = formatNaira(product.originalPrice);
      oldPriceEl.style.display = 'inline';
    } else {
      oldPriceEl.style.display = 'none';
    }
  }
  
  if (descEl) descEl.textContent = product.description;

  // Badges
  if (badgesEl) {
    let bHtml = '';
    (product.badges || []).forEach(b => {
      if (b === 'bestseller') bHtml += `<span class="card-badge badge-bestseller">Bestseller</span>`;
      if (b === 'tarnish-free') bHtml += `<span class="card-badge badge-tarnish-free">100% Tarnish Free</span>`;
      if (b === 'new-in') bHtml += `<span class="card-badge" style="background:#2D68C4; color:#fff;">New Arrival</span>`;
      if (b === 'flash-deal') bHtml += `<span class="card-badge badge-flash">Flash Deal</span>`;
    });
    badgesEl.innerHTML = bHtml;
  }

  // Specifications
  if (specsEl) {
    const specs = product.specs || ['18k PVD Vacuum Gold Plating', '316L Surgical Stainless Steel', '100% Waterproof & Sweatproof'];
    specsEl.innerHTML = specs.map(s => `
      <div class="pdp-spec-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${s}</span>
      </div>
    `).join('');
  }

  // Setup Buttons
  const btnWA = document.getElementById('pdp-btn-wa');
  const btnBag = document.getElementById('pdp-btn-bag');

  if (btnWA && typeof orderSingleWhatsApp === 'function') {
    btnWA.onclick = () => orderSingleWhatsApp(product.id);
  }
  if (btnBag && typeof addToCart === 'function') {
    btnBag.onclick = () => addToCart(product.id);
  }

  // Related Products
  const relatedGrid = document.getElementById('pdp-related-grid');
  if (relatedGrid && typeof renderProductCardHTML === 'function') {
    const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);
    const fallback = related.length > 0 ? related : products.filter(p => p.id !== product.id).slice(0, 3);
    relatedGrid.innerHTML = fallback.map(p => renderProductCardHTML(p)).join('');
  }
}

/**
 * PRIA'S ACCESSORIES — CORE STATE ENGINE & STOREFRONT FOUNDATION (app.js)
 * Global State, Catalog Data, Multi-Item Inquiry Bag, WhatsApp Checkout,
 * Wishlist, QuickView Modal & Universal Utilities.
 */

// ==========================================================================
// 1. DEFAULT DATA & STATE
// ==========================================================================

const DEFAULT_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Golden Grace Herringbone Necklace',
    category: 'necklaces',
    price: 8500,
    originalPrice: 11000,
    image: 'assets/necklace-1.jpg',
    description: 'Ultra-sleek 18k PVD gold plated flat snake chain. Engineered with surgical-grade 316L stainless steel for an unyielding shine that survives sweat, showers, and perfumes.',
    badges: ['bestseller', 'tarnish-free'],
    inStock: true,
    rating: 5.0,
    reviewsCount: 48,
    specs: [
      '18k PVD Real Gold Vacuum Plating',
      '316L Surgical Stainless Steel Core',
      '100% Waterproof & Sweat-Resistant',
      'Length: 40cm + 5cm Adjustable Extender',
      'Reinforced Luxury Lobster Clasp'
    ]
  },
  {
    id: 'prod_2',
    name: 'Classic Sculpted Gold Hoops',
    category: 'earrings',
    price: 4500,
    originalPrice: 6000,
    image: 'assets/earrings-1.jpg',
    description: 'Organic sculpted hollow hoops that deliver a bold, high-fashion statement with all-day featherlight comfort. Completely hypoallergenic and nickel-free.',
    badges: ['bestseller', 'tarnish-free'],
    inStock: true,
    rating: 5.0,
    reviewsCount: 36,
    specs: [
      'Hypoallergenic & Lead-Free Titanium Posts',
      '18k PVD Vacuum Gold Plated',
      'Secure Click-Top Closure',
      'Weight: Ultra-Light 6g per pair',
      'Waterproof & Non-Fading'
    ]
  },
  {
    id: 'prod_3',
    name: 'Luxe Solitaire Crystal Ring',
    category: 'rings',
    price: 6000,
    originalPrice: 8000,
    image: 'assets/ring-1.jpg',
    description: 'A brilliant round-cut 2-carat cubic zirconia solitaire prong-set on a polished 18k gold band. Captures the light with exquisite brilliance from every angle.',
    badges: ['tarnish-free', 'bestseller'],
    inStock: true,
    rating: 4.9,
    reviewsCount: 29,
    specs: [
      'AAA+ Flawless Cubic Zirconia',
      '18k PVD Gold Filled Band',
      'Zero Green Skin Guarantee',
      'Available Sizes: 6, 7, 8 & Adjustable'
    ]
  },
  {
    id: 'prod_4',
    name: 'Chic Quilted Mini Crossbody Bag',
    category: 'bags',
    price: 18500,
    originalPrice: 24000,
    image: 'assets/bag-1.jpg',
    description: 'Structured quilted vegan leather mini bag accented with heavy champagne gold chain hardware and a precision turn-lock closure in warm blush terracotta.',
    badges: ['new-in'],
    inStock: true,
    rating: 4.9,
    reviewsCount: 19,
    specs: [
      'Premium Quilted Vegan Leather',
      'Polished Champagne Gold Chain Hardware',
      'Comfortably fits iPhone Pro Max & Essentials',
      'Dimensions: 19cm x 13cm x 7cm'
    ]
  },
  {
    id: 'prod_5',
    name: 'Elegance Chrono Gold Mesh Watch',
    category: 'watches',
    price: 22000,
    originalPrice: 28000,
    image: 'assets/watch-1.jpg',
    description: 'A refined women’s timepiece featuring an emerald green sunray dial, gold baton indices, and a comfortable Milanese stainless steel mesh strap.',
    badges: ['bestseller'],
    inStock: true,
    rating: 5.0,
    reviewsCount: 42,
    specs: [
      'Precision Japanese Quartz Movement',
      'Emerald Green Sunray Dial',
      '3ATM Splash & Rain Resistant',
      'Adjustable Stainless Steel Milanese Mesh'
    ]
  },
  {
    id: 'prod_6',
    name: 'Butterfly Charm Layered Necklace',
    category: 'necklaces',
    price: 7500,
    originalPrice: 9500,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    description: 'Two-tier gold chain necklace featuring delicate pave crystal-studded butterfly pendants. Designed to sit effortlessly across collarbones.',
    badges: ['flash-deal', 'tarnish-free'],
    inStock: true,
    rating: 4.8,
    reviewsCount: 22,
    specs: [
      '18k PVD Vacuum Gold Plating',
      'Double Strand Micro Curb Chain',
      'Lobster Clasp with 5cm Extension',
      'Sweatproof & Anti-Tarnish'
    ]
  },
  {
    id: 'prod_7',
    name: 'Textured Croissant Dome Ring',
    category: 'rings',
    price: 5000,
    originalPrice: 6500,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    description: 'French minimalist ribbed croissant dome ring. Hollow interior ensures substantial luxury presence without heavy finger drag.',
    badges: ['bestseller', 'tarnish-free'],
    inStock: true,
    rating: 5.0,
    reviewsCount: 31,
    specs: [
      '18k PVD Real Gold Finish',
      'Hollow Stainless Steel Core',
      'Smooth Ergonomic Comfort Fit',
      'Waterproof Daily Wear'
    ]
  },
  {
    id: 'prod_8',
    name: 'Pearl Drop Baroque Earrings',
    category: 'earrings',
    price: 5500,
    originalPrice: 7000,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    description: 'Freshwater baroque cultured pearls suspended from sculpted organic gold nuggets. Each pair exhibits subtle natural individuality.',
    badges: ['new-in'],
    inStock: true,
    rating: 4.9,
    reviewsCount: 15,
    specs: [
      'Genuine Freshwater Baroque Pearl',
      '18k Gold Plated Hypoallergenic Studs',
      'Lightweight and Elegant Drop (2.8cm)',
      'Comfort Butterfly Backings'
    ]
  },
  {
    id: 'prod_9',
    name: 'Hexagon Oversized UV Shades',
    category: 'accessories',
    price: 9000,
    originalPrice: 12000,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    description: 'Geometric oversized designer sunglasses with gradient tea lenses and bevelled champagne gold metal temples.',
    badges: ['new-in'],
    inStock: true,
    rating: 4.9,
    reviewsCount: 18,
    specs: [
      'UV400 Category 3 Eye Protection',
      'Reinforced Gold Metal Frame',
      'Gradient Warm Tea Lenses',
      'Includes Hard Case & Microfiber Cloth'
    ]
  },
  {
    id: 'prod_10',
    name: 'Bellagio Crystal Ankle-Strap Stiletto Heels',
    category: 'shoes',
    price: 34500,
    originalPrice: 42000,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
    description: 'Bespoke champagne metallic stiletto heels with precision crystal-embellished ankle wrap and padded memory cushion insole.',
    badges: ['new-in', 'bestseller'],
    inStock: true,
    rating: 5.0,
    reviewsCount: 14,
    specs: [
      'Genuine Metallic Foil & Satin Finish',
      'Memory Foam Cushioned Insole (9.5cm Heel)',
      'Crystal-Embellished Reinforced Straps',
      'Includes Signature Dustbag & Extra Heel Tips'
    ]
  },
  {
    id: 'prod_11',
    name: 'Raw Virgin Vietnamese Bone Straight HD Lace Wig',
    category: 'wigs',
    price: 88000,
    originalPrice: 110000,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    description: '100% single-donor Vietnamese raw virgin hair. 13x4 invisible HD melted lace with pre-plucked hairline and natural density.',
    badges: ['bestseller'],
    inStock: true,
    rating: 5.0,
    reviewsCount: 31,
    specs: [
      '100% Unprocessed Single-Donor Raw Hair',
      'Ultra-Thin Invisible HD Swiss Lace 13x4',
      'Pre-Plucked Natural Hairline with Baby Hairs',
      'Full 250% Density • Tangle & Shed-Free'
    ]
  }
];

const DELIVERY_RATES = {
  'lagos-mainland': { label: 'Lagos Mainland (Ikeja, Yaba, Surulere, Festac)', fee: 1500, timeline: 'Same-Day / Next Morning' },
  'lagos-island': { label: 'Lagos Island (VI, Lekki Phase 1, Ikoyi, Ajah)', fee: 2500, timeline: 'Same-Day / Next Day' },
  'abuja': { label: 'Abuja Express Dispatch', fee: 3500, timeline: '24 to 48 Hours' },
  'portharcourt': { label: 'Port Harcourt & South-South', fee: 3500, timeline: '24 to 48 Hours' },
  'interstate': { label: 'Other States (Nationwide Interstate Waybill)', fee: 4000, timeline: '2 to 3 Business Days' },
  'pickup': { label: 'Lagos Studio Pickup (Free)', fee: 0, timeline: 'Ready in 2 hours' }
};

const DEFAULT_REVIEWS = [
  {
    id: 'rev_1',
    name: 'Temi O.',
    location: 'Yaba, Lagos',
    product: 'Golden Grace Herringbone',
    rating: 5,
    text: '"I have worn the herringbone necklace daily for over three months through gym sessions and daily showers in Lagos. Zero discoloration and the shine looks untouched."',
    verified: true,
    status: 'approved',
    date: '3 weeks ago'
  },
  {
    id: 'rev_2',
    name: 'Adaeze A.',
    location: 'Lekki, Lagos',
    product: 'Lagos Statement Chunky Chain',
    rating: 5,
    text: '"Direct WhatsApp ordering was effortless. Sent my bag link, confirmed delivery to Lekki Phase 1, and the package arrived the same afternoon. The velvet pouch is lovely."',
    verified: true,
    status: 'approved',
    date: '1 month ago'
  },
  {
    id: 'rev_3',
    name: 'Ngozi K.',
    location: 'Maitama, Abuja',
    product: 'Aura Bold Solitaire Ring',
    rating: 5,
    text: '"The solitaire ring has substantial weight and high clarity. Getting genuine waterproof quality at this price point is rare in Nigeria. Highly recommend."',
    verified: true,
    status: 'approved',
    date: '2 months ago'
  },
  {
    id: 'rev_4',
    name: 'Folake B.',
    location: 'Ikeja GRA, Lagos',
    product: 'Sculpted Golden Croissant Hoops',
    rating: 5,
    text: '"The croissant hoops are my favorite everyday earrings now. Very lightweight on the ears yet look so rich and expensive. Everyone compliments them."',
    verified: true,
    status: 'approved',
    date: '2 weeks ago'
  },
  {
    id: 'rev_5',
    name: 'Chisom E.',
    location: 'GRA, Port Harcourt',
    product: 'Milano Emerald Luxury Mesh Watch',
    rating: 5,
    text: '"The emerald watch is stunning in person. Delivery to Port Harcourt took only 48 hours via GIG logistics. Packaged securely with care instructions."',
    verified: true,
    status: 'approved',
    date: '3 weeks ago'
  },
  {
    id: 'rev_6',
    name: 'Zainab M.',
    location: 'Wuse II, Abuja',
    product: 'Petite Quilted Leatherette Crossbody',
    rating: 5,
    text: '"The quilted mini bag and gold chain combo is a showstopper. Perfect size for evenings and brunches. Pria’s accessories never disappoints."',
    verified: true,
    status: 'approved',
    date: '1 month ago'
  }
];

const DEFAULT_CATEGORIES = [
  { id: 'necklaces', name: 'Necklaces & Chains' },
  { id: 'earrings', name: 'Sculpted Earrings' },
  { id: 'rings', name: 'Solitaire & Stacking Rings' },
  { id: 'watches', name: 'Luxury Watches' },
  { id: 'bags', name: 'Mini Bags & Clutches' },
  { id: 'shoes', name: 'Designer Shoes & Heels' },
  { id: 'wigs', name: 'Luxury Virgin Hair & Wigs' },
  { id: 'accessories', name: 'Accessories & Shades' }
];

const state = {
  products: [],
  categories: [],
  cart: [],
  wishlist: [],
  reviews: [],
  settings: {
    whatsappNumber: '2348123456789',
    storeName: "Pria's Accessories",
    announcement: "FLASH DEAL: 20% OFF WATERPROOF ESSENTIALS • SAME-DAY LAGOS DISPATCH",
    adminPin: '1234'
  },
  currentFilter: 'all',
  searchQuery: '',
  sortBy: 'featured',
  selectedDelivery: 'lagos-mainland',
  editingProductId: null,
  activeQuickViewId: null
};

// ==========================================================================
// 2. INITIALIZATION ACROSS PAGES
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initAppState();
  setupUniversalListeners();
  renderCart();
  updateCartCounters();
  updateWishlistCounters();
  applyStoreSettings();
  setTimeout(() => init3DCardTilt(), 150);
});

function initAppState() {
  const savedProducts = localStorage.getItem('prias_products_v1');
  state.products = savedProducts ? JSON.parse(savedProducts) : [...DEFAULT_PRODUCTS];

  const savedCategories = localStorage.getItem('prias_categories_v1');
  state.categories = savedCategories ? JSON.parse(savedCategories) : [...DEFAULT_CATEGORIES];

  const savedCart = localStorage.getItem('prias_cart_v1');
  state.cart = savedCart ? JSON.parse(savedCart) : [];

  const savedWishlist = localStorage.getItem('prias_wishlist_v1');
  state.wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];

  const savedReviews = localStorage.getItem('prias_reviews_v1');
  state.reviews = savedReviews ? JSON.parse(savedReviews) : [...DEFAULT_REVIEWS];

  const savedSettings = localStorage.getItem('prias_settings_v1');
  if (savedSettings) {
    state.settings = { ...state.settings, ...JSON.parse(savedSettings) };
  }
}

function saveProducts() {
  localStorage.setItem('prias_products_v1', JSON.stringify(state.products));
}

function saveCategories() {
  localStorage.setItem('prias_categories_v1', JSON.stringify(state.categories));
}

function addCategory(name) {
  if (!name || !name.trim()) return null;
  const cleanName = name.trim();
  const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ('cat_' + Date.now());
  
  const existing = state.categories.find(c => c.id === slug || c.name.toLowerCase() === cleanName.toLowerCase());
  if (existing) return existing;

  const newCat = { id: slug, name: cleanName };
  state.categories.push(newCat);
  saveCategories();
  return newCat;
}

function deleteCategory(categoryId) {
  state.categories = state.categories.filter(c => c.id !== categoryId);
  saveCategories();
}

function getStoreWhatsAppNumber() {
  if (typeof state !== 'undefined' && state.settings && state.settings.whatsappNumber) {
    return state.settings.whatsappNumber.replace(/[^0-9]/g, '');
  }
  try {
    const saved = localStorage.getItem('prias_settings_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.whatsappNumber) return parsed.whatsappNumber.replace(/[^0-9]/g, '');
    }
  } catch(e) {}
  return '2348123456789';
}

function saveCart() {
  localStorage.setItem('prias_cart_v1', JSON.stringify(state.cart));
  updateCartCounters();
}

function saveWishlist() {
  localStorage.setItem('prias_wishlist_v1', JSON.stringify(state.wishlist));
  updateWishlistCounters();
}

function saveReviews() {
  localStorage.setItem('prias_reviews_v1', JSON.stringify(state.reviews));
}

function addReview(reviewData) {
  // Reviews dropped by clients default to 'pending' for store admin approval
  reviewData.status = reviewData.status || 'pending';
  reviewData.id = reviewData.id || `rev_${Date.now()}`;
  state.reviews.unshift(reviewData);
  saveReviews();
  return reviewData;
}

function approveReview(reviewId) {
  const r = state.reviews.find(item => item.id === reviewId);
  if (r) {
    r.status = 'approved';
    saveReviews();
    return true;
  }
  return false;
}

function rejectReview(reviewId) {
  const r = state.reviews.find(item => item.id === reviewId);
  if (r) {
    r.status = 'pending';
    saveReviews();
    return true;
  }
  return false;
}

function deleteReview(reviewId) {
  const idx = state.reviews.findIndex(item => item.id === reviewId);
  if (idx > -1) {
    state.reviews.splice(idx, 1);
    saveReviews();
    return true;
  }
  return false;
}

function getApprovedReviews() {
  return state.reviews.filter(r => r.status === 'approved' || typeof r.status === 'undefined');
}

function renderReviewsGrid(containerId, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const approvedList = getApprovedReviews();
  const list = limit ? approvedList.slice(0, limit) : approvedList;

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; color: var(--text-muted);">
        <p>Verified reviews are currently being updated by our concierge team.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(r => {
    const starCount = Math.min(5, Math.max(1, parseInt(r.rating, 10) || 5));
    const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);
    return `
      <div class="review-card">
        <div class="review-stars-row">
          <span class="star-rating">${stars}</span>
          ${r.verified !== false ? '<span class="review-verified-pill">Verified Purchase</span>' : ''}
        </div>
        <p class="review-text">${r.text.startsWith('"') ? r.text : `"${r.text}"`}</p>
        <div class="review-footer">
          <div style="display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 0.35rem;">
            <strong>${r.name}</strong>
            ${r.product ? `<span style="font-size:0.75rem; color:var(--accent-gold-dark); font-weight:700;">${r.product}</span>` : ''}
          </div>
          <span>${r.location || 'Lagos, Nigeria'} &bull; ${r.date || 'Recent'}</span>
        </div>
      </div>
    `;
  }).join('');
  setTimeout(() => init3DCardTilt(), 50);
}

// 3D Rotating Motion Graphics Review Carousel
let carouselTimer = null;
let currentCarouselIndex = 0;

function init3DReviewsCarousel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const approved = getApprovedReviews();
  if (approved.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:var(--text-muted);">No approved reviews yet.</p>';
    return;
  }

  currentCarouselIndex = 0;

  // Build the 3D Stage HTML
  container.innerHTML = `
    <div class="reviews-3d-stage" id="carousel-3d-stage">
      <div class="reviews-3d-carousel" id="carousel-3d-track">
        ${approved.map((r, i) => {
          const starCount = Math.min(5, Math.max(1, parseInt(r.rating, 10) || 5));
          const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);
          return `
            <div class="review-3d-card" data-index="${i}" onclick="jumpToCarouselIndex(${i})">
              <div class="review-stars-row" style="margin-bottom: 0.85rem;">
                <span class="star-rating">${stars}</span>
                ${r.verified !== false ? '<span class="review-verified-pill">Verified Client</span>' : ''}
              </div>
              <p class="review-text" style="font-size: 1.05rem; line-height: 1.7; min-height: 75px;">
                ${r.text.startsWith('"') ? r.text : `"${r.text}"`}
              </p>
              <div class="review-footer" style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                  <div>
                    <strong style="font-size: 1.05rem; color: var(--text-primary);">${r.name}</strong>
                    <div style="font-size: 0.82rem; color: var(--text-secondary);">${r.location || 'Lagos, Nigeria'} &bull; ${r.date || 'Recent'}</div>
                  </div>
                  ${r.product ? `<span style="font-size: 0.78rem; font-weight: 700; color: var(--accent-gold-dark); background: rgba(184, 145, 90, 0.12); padding: 0.25rem 0.65rem; border-radius: var(--radius-xs);">${r.product}</span>` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="carousel-controls">
        <button class="carousel-nav-btn" onclick="prevCarouselSlide()" aria-label="Previous Testimonial">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:18px;height:18px;"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div class="carousel-dots" id="carousel-dots-wrap">
          ${approved.map((_, i) => `<span class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="jumpToCarouselIndex(${i})"></span>`).join('')}
        </div>

        <button class="carousel-nav-btn" onclick="nextCarouselSlide()" aria-label="Next Testimonial">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:18px;height:18px;"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  `;

  updateCarouselCards(approved.length);
  startCarouselTimer(approved.length);
}

function updateCarouselCards(totalCount) {
  const cards = document.querySelectorAll('.review-3d-card');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!cards.length) return;

  cards.forEach((card, i) => {
    card.classList.remove('active', 'prev', 'next', 'hidden-left', 'hidden-right');
    const diff = (i - currentCarouselIndex + totalCount) % totalCount;

    if (diff === 0) {
      card.classList.add('active');
    } else if (diff === 1) {
      card.classList.add('next');
    } else if (diff === totalCount - 1) {
      card.classList.add('prev');
    } else if (diff > 1 && diff < totalCount / 2) {
      card.classList.add('hidden-right');
    } else {
      card.classList.add('hidden-left');
    }
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentCarouselIndex);
  });
}

function nextCarouselSlide() {
  const approved = getApprovedReviews();
  if (approved.length <= 1) return;
  currentCarouselIndex = (currentCarouselIndex + 1) % approved.length;
  updateCarouselCards(approved.length);
}

function prevCarouselSlide() {
  const approved = getApprovedReviews();
  if (approved.length <= 1) return;
  currentCarouselIndex = (currentCarouselIndex - 1 + approved.length) % approved.length;
  updateCarouselCards(approved.length);
}

function jumpToCarouselIndex(index) {
  const approved = getApprovedReviews();
  if (approved.length <= 1) return;
  currentCarouselIndex = index;
  updateCarouselCards(approved.length);
}

function startCarouselTimer(totalCount) {
  stopCarouselTimer();
  if (totalCount > 1) {
    carouselTimer = setInterval(nextCarouselSlide, 2000);
  }
}

function stopCarouselTimer() {
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = null;
  }
}

// Interactive 3D Card Parallax Tilt & Light Specular Sheen
function init3DCardTilt() {
  const cards = document.querySelectorAll('.product-card, .review-card, .guarantee-card');
  cards.forEach(card => {
    if (card.dataset.tiltInit === 'true') return;
    card.dataset.tiltInit = 'true';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// 3D Ambient Gold Dust Floating Particles Canvas
function initGoldParticles(canvasId = 'hero-particles-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  
  function resize() {
    if (!canvas.parentElement) return;
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  const count = window.innerWidth < 768 ? 24 : 45;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.8 + 0.6,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35 - 0.1,
      alpha: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * 0.02 + 0.006
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.alpha += Math.sin(Date.now() * p.pulse) * 0.005;
      if (p.alpha < 0.1) p.alpha = 0.1;
      if (p.alpha > 0.75) p.alpha = 0.75;
      
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(197, 155, 39, ${p.alpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(223, 186, 94, 0.4)';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

function saveSettings() {
  localStorage.setItem('prias_settings_v1', JSON.stringify(state.settings));
}

function formatNaira(amount) {
  return '₦' + Number(amount || 0).toLocaleString('en-NG');
}

// ==========================================================================
// 3. PRODUCT CARD COMPONENT
// ==========================================================================

function renderProductCardHTML(product) {
  const isWishlisted = state.wishlist && state.wishlist.includes(product.id);
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  let badgesHtml = '';
  (product.badges || []).forEach(b => {
    if (b === 'bestseller') badgesHtml += `<span class="card-badge badge-bestseller">Bestseller</span>`;
    if (b === 'tarnish-free') badgesHtml += `<span class="card-badge badge-tarnish-free">100% Tarnish Free</span>`;
    if (b === 'flash-deal') badgesHtml += `<span class="card-badge badge-flash">Flash Deal</span>`;
    if (b === 'new-in') badgesHtml += `<span class="card-badge" style="background:#2D68C4; color:#fff;">New Arrival</span>`;
  });

  return `
    <article class="product-card" data-id="${product.id}">
      <div class="card-image-wrap" onclick="window.location.href='product.html?id=${product.id}'">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='assets/necklace-1.jpg'" />
        <div class="card-badges">
          ${badgesHtml}
        </div>
        <div class="quick-view-btn" onclick="event.stopPropagation(); openQuickView('${product.id}')">
          <span>Quick Preview &bull; 1-Click Buy</span>
        </div>
      </div>

      <div class="card-details">
        <span class="card-category">${product.category}</span>
        <a href="product.html?id=${product.id}" class="card-title">${product.name}</a>
        
        <div class="card-price-row">
          <span class="card-price">${formatNaira(product.price)}</span>
          ${product.originalPrice && product.originalPrice > product.price ? `
            <span class="card-old-price">${formatNaira(product.originalPrice)}</span>
            <span class="card-discount-pill">-${discount}%</span>
          ` : ''}
        </div>

        <div class="card-actions">
          <button class="btn-card-wa" onclick="orderSingleWhatsApp('${product.id}')" title="Inquire on WhatsApp">
            <svg class="ui-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>WhatsApp</span>
          </button>
          
          <button class="btn-card-bag" onclick="addToCart('${product.id}')" title="Add to Bag">
            <span>+ Bag</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

// ==========================================================================
// 4. MULTI-ITEM INQUIRY BAG & WHATSAPP GENERATOR
// ==========================================================================

function addToCart(productId, qty = 1) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const existing = state.cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty
    });
  }

  saveCart();
  renderCart();
  openCartDrawer();
  showToast(`Added "${product.name}" to your bag`, 'success');
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
  showToast('Item removed from bag');
}

function updateCartQuantity(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    renderCart();
  }
}

function openCartDrawer() {
  const backdrop = document.getElementById('cart-drawer-backdrop') || document.getElementById('inquiry-drawer-backdrop');
  if (backdrop) {
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const backdrop = document.getElementById('cart-drawer-backdrop') || document.getElementById('inquiry-drawer-backdrop');
  if (backdrop) {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function updateCartCounters() {
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count-badge').forEach(badge => {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'flex' : 'none';
  });
}

function updateWishlistCounters() {
  const total = state.wishlist.length;
  document.querySelectorAll('.wishlist-count-badge').forEach(badge => {
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
  });
}

function toggleWishlist(productId, btnElement) {
  const index = state.wishlist.indexOf(productId);
  const product = state.products.find(p => p.id === productId);
  const name = product ? product.name : 'Piece';

  if (index > -1) {
    state.wishlist.splice(index, 1);
    if (btnElement) btnElement.classList.remove('active');
    showToast(`Removed from saved list`);
  } else {
    state.wishlist.push(productId);
    if (btnElement) btnElement.classList.add('active');
    showToast(`Saved "${name}" to Wishlist`, 'success');
  }

  saveWishlist();
}

function setDeliveryZone(zoneKey) {
  state.selectedDelivery = zoneKey;
  renderCart();
}

function renderCart() {
  const listEl = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('cart-subtotal');
  const deliveryEl = document.getElementById('cart-delivery-fee');
  const totalEl = document.getElementById('cart-grand-total');
  const emptyEl = document.getElementById('cart-empty-state');
  const bodyEl = document.getElementById('cart-items-container');

  if (!listEl) return;

  if (state.cart.length === 0) {
    if (emptyEl) emptyEl.style.display = 'block';
    if (bodyEl) bodyEl.style.display = 'none';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (bodyEl) bodyEl.style.display = 'block';

  listEl.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='assets/necklace-1.jpg'" />
      <div class="cart-item-info">
        <div>
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${formatNaira(item.price)}</div>
        </div>
        <div class="cart-item-controls">
          <div class="qty-btn-group">
            <button class="qty-btn" onclick="updateCartQuantity('${item.id}', -1)" aria-label="Decrease quantity">&minus;</button>
            <span class="qty-num">${item.quantity}</span>
            <button class="qty-btn" onclick="updateCartQuantity('${item.id}', 1)" aria-label="Increase quantity">&plus;</button>
          </div>
          <button class="btn-remove-item" onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryInfo = DELIVERY_RATES[state.selectedDelivery] || DELIVERY_RATES['lagos-mainland'];
  const deliveryFee = deliveryInfo.fee;
  const grandTotal = subtotal + deliveryFee;

  if (subtotalEl) subtotalEl.textContent = formatNaira(subtotal);
  if (deliveryEl) deliveryEl.textContent = deliveryFee === 0 ? 'FREE' : formatNaira(deliveryFee);
  if (totalEl) totalEl.textContent = formatNaira(grandTotal);
}

function checkoutWhatsApp() {
  if (state.cart.length === 0) {
    showToast('Your inquiry bag is empty');
    return;
  }

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryInfo = DELIVERY_RATES[state.selectedDelivery] || DELIVERY_RATES['lagos-mainland'];
  const deliveryFee = deliveryInfo.fee;
  const grandTotal = subtotal + deliveryFee;
  const phone = getStoreWhatsAppNumber();

  let msg = `Hello Pria's Accessories, I would like to place an order for the following:\n\n`;
  state.cart.forEach((item) => {
    msg += `• ${item.name} (Qty: ${item.quantity}) - ${formatNaira(item.price * item.quantity)}\n`;
  });
  msg += `\nSubtotal: ${formatNaira(subtotal)}`;
  msg += `\nDelivery: ${deliveryInfo.label} (${formatNaira(deliveryFee)})`;
  msg += `\nTotal: ${formatNaira(grandTotal)}\n\n`;
  msg += `Please confirm availability so I can share my delivery address. Thank you!`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function orderSingleWhatsApp(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  const phone = getStoreWhatsAppNumber();
  const msg = `Hello Pria's Accessories, I'm interested in ordering "${product.name}" (${formatNaira(product.price)}). Is this available for delivery?`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ==========================================================================
// 5. QUICK VIEW LIGHTBOX MODAL
// ==========================================================================

function openQuickView(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  state.activeQuickViewId = productId;

  const imgEl = document.getElementById('qv-image');
  const catEl = document.getElementById('qv-category');
  const titleEl = document.getElementById('qv-title');
  const priceEl = document.getElementById('qv-price');
  const oldPriceEl = document.getElementById('qv-old-price');
  const descEl = document.getElementById('qv-desc');
  const specsEl = document.getElementById('qv-specs-list');

  if (imgEl) {
    imgEl.src = product.image;
    imgEl.onerror = () => { imgEl.src = 'assets/necklace-1.jpg'; };
  }
  if (catEl) catEl.textContent = product.category;
  if (titleEl) titleEl.textContent = product.name;
  if (priceEl) priceEl.textContent = formatNaira(product.price);
  if (oldPriceEl) {
    if (product.originalPrice && product.originalPrice > product.price) {
      oldPriceEl.textContent = formatNaira(product.originalPrice);
      oldPriceEl.style.display = 'inline';
    } else {
      oldPriceEl.style.display = 'none';
    }
  }
  if (descEl) descEl.textContent = product.description;
  
  if (specsEl) {
    const specs = product.specs || ['18k PVD Vacuum Gold Plating', '316L Stainless Steel', '100% Waterproof & Tarnish-Free'];
    specsEl.innerHTML = specs.map(s => `
      <div class="modal-spec-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${s}</span>
      </div>
    `).join('');
  }

  const modal = document.getElementById('quickview-modal-backdrop');
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  const modal = document.getElementById('quickview-modal-backdrop');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function quickViewAddToBag() {
  if (state.activeQuickViewId) {
    addToCart(state.activeQuickViewId);
    closeQuickView();
  }
}

function quickViewOrderWhatsApp() {
  if (state.activeQuickViewId) {
    orderSingleWhatsApp(state.activeQuickViewId);
  }
}

// ==========================================================================
// 6. TOAST NOTIFICATIONS & STORE SETTINGS
// ==========================================================================

function showToast(message, type = 'default') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-message ${type === 'success' ? 'success' : ''}`;
  toast.innerHTML = `
    <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success' ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>' : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'}
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function applyStoreSettings() {
  const waNumber = getStoreWhatsAppNumber();

  // 1. Update Announcement
  const announceEl = document.getElementById('announcement-text-dynamic');
  if (announceEl && state.settings && state.settings.announcement) {
    announceEl.textContent = state.settings.announcement;
  }

  // 2. Dynamically replace phone number in ALL wa.me links across the entire page
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    try {
      const rawHref = link.getAttribute('href');
      if (rawHref) {
        const textMatch = rawHref.match(/[?&]text=([^&]+)/);
        if (textMatch) {
          link.href = `https://wa.me/${waNumber}?text=${textMatch[1]}`;
        } else {
          link.href = `https://wa.me/${waNumber}`;
        }
      }
    } catch (err) {
      link.href = link.href.replace(/wa\.me\/\d+/, `wa.me/${waNumber}`);
    }
  });

  // 3. Update any onclick handlers with wa.me
  document.querySelectorAll('[onclick*="wa.me"]').forEach(el => {
    const attr = el.getAttribute('onclick');
    if (attr) {
      el.setAttribute('onclick', attr.replace(/wa\.me\/\d+/, `wa.me/${waNumber}`));
    }
  });
}

function openMobileNav() {
  const backdrop = document.getElementById('mobile-nav-backdrop');
  if (backdrop) {
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileNav() {
  const backdrop = document.getElementById('mobile-nav-backdrop');
  if (backdrop) {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function setupUniversalListeners() {
  // ESC key to close drawer or modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeQuickView();
      closeMobileNav();
    }
  });

  // Close modals on backdrop click
  const drawerBackdrop = document.getElementById('cart-drawer-backdrop') || document.getElementById('inquiry-drawer-backdrop');
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) closeCartDrawer();
    });
  }

  const qvBackdrop = document.getElementById('quickview-modal-backdrop');
  if (qvBackdrop) {
    qvBackdrop.addEventListener('click', (e) => {
      if (e.target === qvBackdrop) closeQuickView();
    });
  }

  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', (e) => {
      if (e.target === mobileNavBackdrop) closeMobileNav();
    });
  }

  // Close open custom dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-dropdown-container')) {
      document.querySelectorAll('.custom-dropdown-container.open').forEach(c => c.classList.remove('open'));
    }
  });

  initAllCustomDropdowns();
}

// ==========================================================================
// UNIVERSAL CUSTOM LUXURY FLOATING DROPDOWN BUILDER
// ==========================================================================
function createCustomDropdown(selectEl) {
  if (!selectEl || selectEl.dataset.customDropdownApplied) return;
  selectEl.dataset.customDropdownApplied = 'true';

  // Visually hide native select while preserving value and form integrity
  selectEl.style.position = 'absolute';
  selectEl.style.opacity = '0';
  selectEl.style.pointerEvents = 'none';
  selectEl.style.width = '1px';
  selectEl.style.height = '1px';
  selectEl.style.margin = '-1px';
  selectEl.style.overflow = 'hidden';
  selectEl.style.clip = 'rect(0, 0, 0, 0)';

  const container = document.createElement('div');
  container.className = 'custom-dropdown-container';
  if (selectEl.id) container.id = 'custom-dropdown-' + selectEl.id;

  const trigger = document.createElement('div');
  trigger.className = 'custom-dropdown-trigger';
  trigger.setAttribute('tabindex', '0');

  const labelSpan = document.createElement('span');
  labelSpan.className = 'custom-dropdown-label';
  
  const chevron = document.createElement('span');
  chevron.className = 'chevron-icon';
  chevron.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:16px;height:16px;display:block;"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

  trigger.appendChild(labelSpan);
  trigger.appendChild(chevron);

  const menu = document.createElement('div');
  menu.className = 'custom-dropdown-menu';

  function populateOptions() {
    menu.innerHTML = '';
    const options = Array.from(selectEl.options);
    const selectedOpt = selectEl.options[selectEl.selectedIndex] || options[0];
    labelSpan.textContent = selectedOpt ? selectedOpt.text : 'Select...';

    options.forEach((opt, idx) => {
      const item = document.createElement('div');
      item.className = 'custom-dropdown-item' + (opt.selected || idx === selectEl.selectedIndex ? ' selected' : '');
      item.textContent = opt.text;
      item.setAttribute('data-value', opt.value);
      
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        selectEl.selectedIndex = idx;
        selectEl.value = opt.value;
        labelSpan.textContent = opt.text;

        menu.querySelectorAll('.custom-dropdown-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');

        container.classList.remove('open');
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
      });

      menu.appendChild(item);
    });
  }

  populateOptions();

  // Toggle dropdown on trigger click
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = container.classList.contains('open');
    document.querySelectorAll('.custom-dropdown-container.open').forEach(c => {
      if (c !== container) c.classList.remove('open');
    });
    if (isOpen) {
      container.classList.remove('open');
    } else {
      populateOptions(); // sync up-to-date options
      container.classList.add('open');
    }
  });

  // Keyboard accessibility
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      trigger.click();
    } else if (e.key === 'Escape') {
      container.classList.remove('open');
    }
  });

  container.appendChild(trigger);
  container.appendChild(menu);

  if (selectEl.parentNode) {
    selectEl.parentNode.insertBefore(container, selectEl.nextSibling);
  }

  // Expose a refresher on the selectEl
  selectEl._refreshCustomDropdown = populateOptions;
}

function initAllCustomDropdowns() {
  document.querySelectorAll('select.luxury-select, select.delivery-calc-select, select.delivery-select, select#catalog-sort, select#review-product-select, select#faq-calc-state, select#faq-calc-lga, select#faq-delivery-zone-select, select#form-prod-category, select#admin-review-status-filter, select#checkout-delivery-zone').forEach(createCustomDropdown);
}

// Auto-run on DOM ready and window load
document.addEventListener('DOMContentLoaded', () => {
  setupUniversalListeners();
  initAllCustomDropdowns();
});

window.addEventListener('load', () => {
  initAllCustomDropdowns();
});


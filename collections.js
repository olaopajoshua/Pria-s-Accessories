/**
 * PRIA'S ACCESSORIES — COLLECTIONS JAVASCRIPT (collections.html)
 * Live Filtering, Search, Sorting and Dynamic Catalog Rendering
 */

document.addEventListener('DOMContentLoaded', () => {
  initCollectionsPage();
});

function initCollectionsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category');
  const searchParam = urlParams.get('search');

  if (typeof state !== 'undefined') {
    if (catParam) state.currentFilter = catParam;
    if (searchParam) state.searchQuery = searchParam;
  }

  renderCategoryFilterButtons();

  // Setup Search Input
  const searchInput = document.getElementById('catalog-search');
  if (searchInput) {
    if (searchParam) searchInput.value = searchParam;
    searchInput.addEventListener('input', (e) => {
      if (typeof state !== 'undefined') state.searchQuery = e.target.value.trim();
      renderCollectionsGrid();
    });
  }

  // Setup Sort Select
  const sortSelect = document.getElementById('catalog-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      if (typeof state !== 'undefined') state.sortBy = e.target.value;
      renderCollectionsGrid();
    });
  }

  renderCollectionsGrid();
}

function renderCategoryFilterButtons() {
  const container = document.getElementById('collections-filter-tabs');
  if (!container) return;

  const categories = (typeof state !== 'undefined' && state.categories && state.categories.length)
    ? state.categories
    : (typeof DEFAULT_CATEGORIES !== 'undefined' ? DEFAULT_CATEGORIES : []);

  const currentFilter = (typeof state !== 'undefined') ? state.currentFilter : 'all';

  let html = `<button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all" onclick="setFilter('all', this)">All Pieces</button>`;

  categories.forEach(cat => {
    const isActive = currentFilter === cat.id;
    html += `<button class="filter-btn ${isActive ? 'active' : ''}" data-filter="${cat.id}" onclick="setFilter('${cat.id}', this)">${cat.name}</button>`;
  });

  container.innerHTML = html;
}

function setFilter(category, btnElement) {
  if (typeof state !== 'undefined') state.currentFilter = category;

  renderCategoryFilterButtons();
  renderCollectionsGrid();
}

function renderCollectionsGrid() {
  const grid = document.getElementById('collections-page-grid');
  const countEl = document.getElementById('collections-active-count');
  if (!grid) return;

  const currentProducts = (typeof state !== 'undefined' && state.products)
    ? state.products
    : JSON.parse(localStorage.getItem('prias_products_v1') || '[]');

  const currentFilter = (typeof state !== 'undefined') ? state.currentFilter : 'all';
  const searchQuery = (typeof state !== 'undefined') ? (state.searchQuery || '').toLowerCase() : '';
  const sortBy = (typeof state !== 'undefined') ? state.sortBy : 'featured';

  // 1. Filter by category
  let filtered = currentProducts.filter(p => {
    if (currentFilter === 'all') return true;
    return p.category === currentFilter;
  });

  // 2. Filter by search
  if (searchQuery) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchQuery) ||
      (p.description && p.description.toLowerCase().includes(searchQuery)) ||
      p.category.toLowerCase().includes(searchQuery)
    );
  }

  // 3. Sort
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    filtered.sort((a, b) => (b.badges && b.badges.includes('new-in') ? 1 : 0) - (a.badges && a.badges.includes('new-in') ? 1 : 0));
  } else if (sortBy === 'featured') {
    filtered.sort((a, b) => (b.badges && b.badges.includes('bestseller') ? 1 : 0) - (a.badges && a.badges.includes('bestseller') ? 1 : 0));
  }

  // 4. Update count status
  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} piece${filtered.length === 1 ? '' : 's'}`;
  }

  // 5. Render cards
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 1rem;">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3 style="font-family: var(--font-sans); font-size: 1.25rem; margin-bottom: 0.5rem;">No Pieces Found</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">Try adjusting your search query or switching category filters.</p>
        <button class="filter-btn active" onclick="setFilter('all', document.querySelector('.filter-btn[data-filter=\\'all\\']'))">View All Pieces</button>
      </div>
    `;
    return;
  }

  if (typeof renderProductCardHTML === 'function') {
    grid.innerHTML = filtered.map(p => renderProductCardHTML(p)).join('');
  }
}

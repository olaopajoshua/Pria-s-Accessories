/**
 * PRIA'S ACCESSORIES — STORE OWNER ADMIN JAVASCRIPT (admin.html & admin.js)
 * Modern Drag & Drop Image Uploader, Secure Session Lock, Inventory CRUD & Review Moderation
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminPage();
  setupDropzoneEvents();
});

function initAdminPage() {
  checkAdminSession();
  initLogin3DCard();
}

function checkAdminSession() {
  const isAuth = sessionStorage.getItem('prias_admin_auth');
  const loginScreen = document.getElementById('admin-login-screen');
  const dashScreen = document.getElementById('admin-dashboard-screen');

  if (isAuth === 'true') {
    if (loginScreen) loginScreen.style.display = 'none';
    if (dashScreen) dashScreen.style.display = 'block';
    renderAdminDashboard();
    fetchAdminCloudReviews();
  } else {
    if (loginScreen) loginScreen.style.display = 'flex';
    if (dashScreen) dashScreen.style.display = 'none';
    const input = document.getElementById('admin-page-pin-input');
    if (input) input.focus();
  }
}

function handleAdminLogin(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('admin-page-pin-input');
  const enteredPin = input ? input.value.trim() : '';
  const correctPin = (typeof state !== 'undefined' && state.settings && state.settings.adminPin) ? state.settings.adminPin : '1234';

  if (enteredPin === correctPin) {
    sessionStorage.setItem('prias_admin_auth', 'true');
    if (typeof showToast === 'function') showToast('Welcome to Store Manager Dashboard', 'success');
    checkAdminSession();
  } else {
    // Interactive haptic shake on incorrect passcode
    const card = document.getElementById('admin-login-card');
    if (card) {
      card.classList.remove('shake-error');
      void card.offsetWidth; // Trigger reflow for re-animation
      card.classList.add('shake-error');
    }
    if (typeof showToast === 'function') showToast('Incorrect security passcode. Please try again.');
    if (input) {
      input.value = '';
      input.focus();
    }
  }
}

function togglePinVisibility() {
  const input = document.getElementById('admin-page-pin-input');
  const eyeIcon = document.getElementById('eye-icon');
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (eyeIcon) {
      eyeIcon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      `;
    }
  } else {
    input.type = 'password';
    if (eyeIcon) {
      eyeIcon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      `;
    }
  }
}

function initLogin3DCard() {
  const wrapper = document.getElementById('login-3d-wrapper');
  const card = document.getElementById('admin-login-card');
  const glare = document.getElementById('card-glare');
  if (!wrapper || !card) return;

  // Disable 3D tilt on touchscreens to ensure rock-solid stability
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    card.style.transform = 'none';
    return;
  }

  wrapper.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.opacity = '1';
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 65%)`;
    }
  });

  wrapper.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    if (glare) {
      glare.style.opacity = '0';
      glare.style.transition = 'opacity 0.5s ease';
    }
  });

  wrapper.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease-out';
    if (glare) glare.style.transition = 'none';
  });
}

function handleAdminLogout() {
  sessionStorage.removeItem('prias_admin_auth');
  if (typeof showToast === 'function') showToast('Dashboard session locked');
  checkAdminSession();
}

// Session Lock Exit Modal
function promptExitLock() {
  const modal = document.getElementById('modal-lock-session');
  if (modal) modal.classList.add('active');
}

function closeExitLockModal() {
  const modal = document.getElementById('modal-lock-session');
  if (modal) modal.classList.remove('active');
}

function lockSessionAndExit() {
  sessionStorage.removeItem('prias_admin_auth');
  window.location.href = 'index.html';
}

function renderAdminDashboard() {
  const products = (typeof state !== 'undefined' && state.products)
    ? state.products
    : JSON.parse(localStorage.getItem('prias_products_v1') || '[]');

  const reviews = (typeof state !== 'undefined' && state.reviews)
    ? state.reviews
    : JSON.parse(localStorage.getItem('prias_reviews_v1') || '[]');

  const settings = (typeof state !== 'undefined' && state.settings)
    ? state.settings
    : JSON.parse(localStorage.getItem('prias_settings_v1') || '{}');

  const pendingCount = reviews.filter(r => r.status === 'pending').length;

  const totalEl = document.getElementById('stat-total-products');
  const dealsEl = document.getElementById('stat-active-deals');
  const bestEl = document.getElementById('stat-bestsellers');
  const outEl = document.getElementById('stat-out-of-stock');
  const pendingEl = document.getElementById('stat-pending-reviews');
  const pendingBadgeEl = document.getElementById('admin-pending-badge');

  if (totalEl) totalEl.textContent = products.length;
  if (dealsEl) dealsEl.textContent = products.filter(p => p.badges && p.badges.includes('flash-deal')).length;
  if (bestEl) bestEl.textContent = products.filter(p => p.badges && p.badges.includes('bestseller')).length;
  if (outEl) outEl.textContent = products.filter(p => !p.inStock).length;
  if (pendingEl) pendingEl.textContent = pendingCount;
  if (pendingBadgeEl) pendingBadgeEl.textContent = pendingCount;

  const tbody = document.getElementById('admin-inventory-table-body');
  if (tbody) {
    tbody.innerHTML = products.map(product => `
      <tr>
        <td>
          <img src="${product.image}" alt="${product.name}" class="table-prod-img" onerror="this.src='assets/necklace-1.jpg'" />
        </td>
        <td>
          <strong style="font-size: 0.95rem; color: var(--admin-text-main);">${product.name}</strong><br />
          <span style="font-size: 0.72rem; color: var(--admin-accent-gold-dark); text-transform: uppercase; font-weight: 700;">${product.category}</span>
        </td>
        <td><strong>${typeof formatNaira === 'function' ? formatNaira(product.price) : '₦' + product.price}</strong></td>
        <td>
          <span style="color: var(--admin-text-muted); font-size: 0.85rem;">
            ${product.originalPrice ? (typeof formatNaira === 'function' ? formatNaira(product.originalPrice) : '₦' + product.originalPrice) : '—'}
          </span>
        </td>
        <td>
          <button 
            type="button"
            onclick="toggleProductStock('${product.id}')"
            class="status-pill ${product.inStock ? 'approved' : 'pending'}"
            style="cursor: pointer; border: none;"
            title="Click to toggle stock status"
          >
            ${product.inStock ? 'In Stock' : 'Out of Stock'}
          </button>
        </td>
        <td>
          ${(product.badges || []).map(b => `<span style="background:var(--admin-surface-subtle); color:#14110F; border:1px solid var(--admin-border); padding: 0.2rem 0.5rem; border-radius:4px; margin-right:4px; font-size:0.68rem; font-weight:700;">${b}</span>`).join('')}
        </td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            <button class="action-btn edit" onclick="editProduct('${product.id}')">Edit</button>
            <button class="action-btn delete" onclick="deleteProduct('${product.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  renderAdminReviews();
  renderAdminCategories();

  const storeNameInput = document.getElementById('admin-setting-store-name');
  const waNumberInput = document.getElementById('admin-setting-wa-number');
  const pinInput = document.getElementById('admin-setting-new-pin');

  if (storeNameInput) storeNameInput.value = settings.storeName || "Pria's Accessories";
  if (waNumberInput) waNumberInput.value = settings.whatsappNumber || "2348123456789";
  if (pinInput) pinInput.value = settings.adminPin || "1234";

  if (typeof initAllCustomDropdowns === 'function') {
    initAllCustomDropdowns();
  }
}

function switchAdminTab(tabName) {
  const catalogSection = document.getElementById('admin-section-catalog');
  const reviewsSection = document.getElementById('admin-section-reviews');
  const categoriesSection = document.getElementById('admin-section-categories');
  const syncSection = document.getElementById('admin-section-sync');
  const catalogBtn = document.getElementById('tab-btn-catalog');
  const reviewsBtn = document.getElementById('tab-btn-reviews');
  const categoriesBtn = document.getElementById('tab-btn-categories');
  const syncBtn = document.getElementById('tab-btn-sync');

  if (catalogSection) catalogSection.style.display = 'none';
  if (reviewsSection) reviewsSection.style.display = 'none';
  if (categoriesSection) categoriesSection.style.display = 'none';
  if (syncSection) syncSection.style.display = 'none';

  if (catalogBtn) catalogBtn.classList.remove('active');
  if (reviewsBtn) reviewsBtn.classList.remove('active');
  if (categoriesBtn) categoriesBtn.classList.remove('active');
  if (syncBtn) syncBtn.classList.remove('active');

  if (tabName === 'catalog') {
    if (catalogSection) catalogSection.style.display = 'block';
    if (catalogBtn) catalogBtn.classList.add('active');
  } else if (tabName === 'categories') {
    if (categoriesSection) categoriesSection.style.display = 'block';
    if (categoriesBtn) categoriesBtn.classList.add('active');
    renderAdminCategories();
    setTimeout(() => {
      const input = document.getElementById('new-cat-name');
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  } else if (tabName === 'sync') {
    if (syncSection) syncSection.style.display = 'block';
    if (syncBtn) syncBtn.classList.add('active');
    renderCloudSyncSettings();
  } else {
    if (reviewsSection) reviewsSection.style.display = 'block';
    if (reviewsBtn) reviewsBtn.classList.add('active');
    renderAdminReviews();
    fetchAdminCloudReviews();
  }
}

function renderAdminCategories() {
  const categories = (typeof state !== 'undefined' && state.categories && state.categories.length)
    ? state.categories
    : (typeof DEFAULT_CATEGORIES !== 'undefined' ? DEFAULT_CATEGORIES : []);

  const products = (typeof state !== 'undefined' && state.products)
    ? state.products
    : [];

  const catSelect = document.getElementById('form-prod-category');
  if (catSelect) {
    const currentVal = catSelect.value || (categories[0] ? categories[0].id : 'necklaces');
    catSelect.innerHTML = categories.map(c => `
      <option value="${c.id}" ${currentVal === c.id ? 'selected' : ''}>${c.name}</option>
    `).join('');
    if (typeof catSelect._refreshCustomDropdown === 'function') {
      catSelect._refreshCustomDropdown();
    }
  }

  const catListContainer = document.getElementById('admin-categories-list');
  const catBadge = document.getElementById('admin-cat-badge');
  const catCount = document.getElementById('cat-list-count');

  if (catBadge) catBadge.textContent = categories.length;
  if (catCount) catCount.textContent = categories.length;

  if (catListContainer) {
    catListContainer.innerHTML = categories.map(cat => {
      const pieceCount = products.filter(p => p.category === cat.id).length;

      return `
        <div style="background: var(--admin-surface-subtle); border: 1px solid var(--admin-border); border-radius: var(--admin-radius-sm); padding: 0.9rem 1.15rem; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <strong style="font-size: 0.95rem; color: var(--admin-text-main);">${cat.name}</strong>
            <div style="font-size: 0.75rem; color: var(--admin-text-muted); margin-top: 0.15rem;">
              Slug: <code>${cat.id}</code> &bull; <strong>${pieceCount} piece${pieceCount === 1 ? '' : 's'} in catalog</strong>
            </div>
          </div>
          <div>
            <button type="button" class="action-btn delete" onclick="handleDeleteCategory('${cat.id}')" title="Delete category">
              Delete
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
}

function handleAdminAddCategory(e) {
  if (e) e.preventDefault();
  const nameInput = document.getElementById('new-cat-name');
  const name = nameInput ? nameInput.value.trim() : '';

  if (!name) {
    if (typeof showToast === 'function') showToast('Please enter category name');
    return;
  }

  if (typeof addCategory === 'function') {
    const created = addCategory(name);
    if (nameInput) nameInput.value = '';
    renderAdminDashboard();
    if (typeof showToast === 'function') showToast(`Category "${created.name}" created & live!`, 'success');
  }
}

function promptAddCategoryInline() {
  const name = prompt('Enter new category name (e.g. Designer Heels, Luxury Wigs, Perfumes):');
  if (name && name.trim()) {
    const created = addCategory(name.trim());
    renderAdminDashboard();
    const catSelect = document.getElementById('form-prod-category');
    if (catSelect) {
      catSelect.value = created.id;
      if (typeof catSelect._refreshCustomDropdown === 'function') catSelect._refreshCustomDropdown();
    }
    if (typeof showToast === 'function') showToast(`Category "${created.name}" created & selected!`, 'success');
  }
}

function handleDeleteCategory(catId) {
  const categories = (typeof state !== 'undefined' && state.categories) ? state.categories : [];
  const cat = categories.find(c => c.id === catId);
  const catName = cat ? cat.name : catId;

  if (confirm(`Are you sure you want to delete the category "${catName}"?`)) {
    if (typeof deleteCategory === 'function') {
      deleteCategory(catId);
      renderAdminDashboard();
      if (typeof showToast === 'function') showToast(`Category "${catName}" deleted`);
    }
  }
}

function renderAdminReviews() {
  const tbody = document.getElementById('admin-reviews-table-body');
  if (!tbody) return;

  const reviews = (typeof state !== 'undefined' && state.reviews)
    ? state.reviews
    : JSON.parse(localStorage.getItem('prias_reviews_v1') || '[]');

  const filterSelect = document.getElementById('admin-review-status-filter');
  const filterVal = filterSelect ? filterSelect.value : 'all';

  let list = reviews;
  if (filterVal === 'pending') {
    list = reviews.filter(r => r.status === 'pending');
  } else if (filterVal === 'approved') {
    list = reviews.filter(r => r.status === 'approved' || typeof r.status === 'undefined');
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding: 3rem 1rem; color: var(--admin-text-muted);">
          <p style="margin-bottom: 1rem; font-size: 0.92rem;">No reviews found in this filter view.</p>
          <button type="button" class="btn-primary-luxury" onclick="openAdminAddReviewModal()" style="font-size: 0.82rem; padding: 0.55rem 1.1rem;">
            + Add Client Review
          </button>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(r => {
    const isApproved = r.status === 'approved';
    const isPending = r.status === 'pending';
    const starCount = Math.min(5, Math.max(1, parseInt(r.rating, 10) || 5));
    const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);

    return `
      <tr style="${isPending ? 'background: rgba(197, 155, 39, 0.05);' : ''}">
        <td>
          <strong>${r.name}</strong><br />
          <span style="font-size: 0.78rem; color: var(--admin-text-muted);">${r.location || 'Nigeria'}</span>
        </td>
        <td>
          <span style="color: #D4AF37; font-size: 0.95rem; letter-spacing: 1px;">${stars}</span>
        </td>
        <td>
          <span style="font-size: 0.85rem; font-weight: 600; color: var(--admin-accent-gold-dark);">${r.product || 'Verified Purchase'}</span>
        </td>
        <td style="max-width: 320px;">
          <p style="font-size: 0.85rem; line-height: 1.5; color: var(--admin-text-main); margin: 0 0 0.25rem 0;">${r.text}</p>
          <span style="font-size: 0.72rem; color: var(--admin-text-muted);">${r.date || 'Recent'}</span>
        </td>
        <td>
          <span class="status-pill ${isApproved ? 'approved' : 'pending'}" style="${isPending ? 'background: rgba(224, 150, 20, 0.15); color: #B26B00; font-weight: 700; border: 1px solid rgba(224, 150, 20, 0.35);' : ''}">
            ${isApproved ? 'Live on Store' : 'Pending Approval'}
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
            ${!isApproved ? `
              <button class="action-btn approve" onclick="handleApproveReview('${r.id}')" title="Publish to storefront" style="background: #1B9E4B; color: #FFFFFF; font-weight: 700;">
                ✓ Approve &amp; Publish
              </button>
            ` : `
              <button class="action-btn edit" onclick="handleRejectReview('${r.id}')" title="Move to pending">
                Unpublish
              </button>
            `}
            <button class="action-btn delete" onclick="handleDeleteReview('${r.id}')" title="Delete permanently">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

async function syncReviewToSupabase(review) {
  try {
    const enteredPasscode = (typeof state !== 'undefined' && state.settings && state.settings.adminPin) ? state.settings.adminPin : '1234';
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-passcode': enteredPasscode
      },
      body: JSON.stringify({
        action: 'save_review',
        review: review,
        passcode: enteredPasscode
      })
    });
    const result = await res.json().catch(() => ({}));
    return result.success;
  } catch (err) {
    console.warn('Supabase review sync notice:', err);
    return false;
  }
}

async function deleteReviewFromSupabase(reviewId) {
  try {
    const enteredPasscode = (typeof state !== 'undefined' && state.settings && state.settings.adminPin) ? state.settings.adminPin : '1234';
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-passcode': enteredPasscode
      },
      body: JSON.stringify({
        action: 'delete_review',
        reviewId: reviewId,
        passcode: enteredPasscode
      })
    });
    const result = await res.json().catch(() => ({}));
    return result.success;
  } catch (err) {
    console.warn('Supabase review delete notice:', err);
    return false;
  }
}

function handleApproveReview(reviewId) {
  if (typeof approveReview === 'function') {
    approveReview(reviewId);
    renderAdminDashboard();
    const r = (state.reviews || []).find(item => item.id === reviewId);
    if (r) syncReviewToSupabase(r);
    if (typeof showToast === 'function') showToast('Review approved & synced to cloud storefront', 'success');
  }
}

function handleRejectReview(reviewId) {
  if (typeof rejectReview === 'function') {
    rejectReview(reviewId);
    renderAdminDashboard();
    const r = (state.reviews || []).find(item => item.id === reviewId);
    if (r) syncReviewToSupabase(r);
    if (typeof showToast === 'function') showToast('Review moved to pending status & synced');
  }
}

function handleDeleteReview(reviewId) {
  if (confirm('Permanently delete this customer review?')) {
    if (typeof deleteReview === 'function') {
      deleteReview(reviewId);
      renderAdminDashboard();
      deleteReviewFromSupabase(reviewId);
      if (typeof showToast === 'function') showToast('Review deleted successfully');
    }
  }
}

function filterAdminReviewsTable(query) {
  const rows = document.querySelectorAll('#admin-reviews-table-body tr');
  const q = query.toLowerCase().trim();
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(q) ? '' : 'none';
  });
}

// Fetch all reviews (including pending) directly from Supabase via service role API
async function fetchAdminCloudReviews(showNotice = false) {
  try {
    const enteredPasscode = (typeof state !== 'undefined' && state.settings && state.settings.adminPin) ? state.settings.adminPin : '1234';
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-passcode': enteredPasscode
      },
      body: JSON.stringify({
        action: 'get_all_reviews_admin',
        passcode: enteredPasscode
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        state.reviews = data.reviews;
        localStorage.setItem('prias_reviews_v1', JSON.stringify(data.reviews));
        renderAdminReviews();

        const pendingCount = data.reviews.filter(r => r.status === 'pending').length;
        const pendingEl = document.getElementById('stat-pending-reviews');
        const pendingBadgeEl = document.getElementById('admin-pending-badge');
        if (pendingEl) pendingEl.textContent = pendingCount;
        if (pendingBadgeEl) pendingBadgeEl.textContent = pendingCount;

        if (showNotice && typeof showToast === 'function') {
          showToast(`Synced ${data.reviews.length} reviews from cloud database!`, 'success');
        }
      }
    }
  } catch (err) {
    console.warn('Admin cloud reviews fetch notice:', err);
  }
}

// Admin Add Review Modal Controls
function openAdminAddReviewModal() {
  const modal = document.getElementById('modal-admin-add-review');
  if (modal) modal.classList.add('active');
  const nameInput = document.getElementById('admin-rev-name');
  if (nameInput) setTimeout(() => nameInput.focus(), 100);
}

function closeAdminAddReviewModal() {
  const modal = document.getElementById('modal-admin-add-review');
  if (modal) modal.classList.remove('active');
  const form = document.getElementById('admin-add-review-form');
  if (form) form.reset();
}

async function handleAdminCreateReviewSubmit(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('admin-rev-name')?.value.trim();
  const location = document.getElementById('admin-rev-location')?.value.trim() || 'Nigeria';
  const product = document.getElementById('admin-rev-product')?.value.trim() || '';
  const rating = parseInt(document.getElementById('admin-rev-rating')?.value, 10) || 5;
  const text = document.getElementById('admin-rev-text')?.value.trim();
  const autoApprove = document.getElementById('admin-rev-auto-approve')?.checked;

  if (!name || !text) {
    if (typeof showToast === 'function') showToast('Please enter client name and testimonial text');
    return;
  }

  const reviewId = `rev_${Date.now()}`;
  const newRev = {
    id: reviewId,
    name: name,
    location: location,
    product: product,
    rating: rating,
    text: text,
    verified: true,
    status: autoApprove ? 'approved' : 'pending',
    date: 'Just now'
  };

  if (typeof state !== 'undefined' && state.reviews) {
    state.reviews.unshift(newRev);
    if (typeof saveReviews === 'function') saveReviews();
  }

  closeAdminAddReviewModal();
  renderAdminDashboard();
  renderAdminReviews();

  // Sync to Supabase cloud immediately
  const synced = await syncReviewToSupabase(newRev);
  if (synced) {
    if (typeof showToast === 'function') {
      showToast(autoApprove ? 'Review published live to cloud storefront!' : 'Review saved as pending in cloud database', 'success');
    }
  } else {
    if (typeof showToast === 'function') showToast('Review saved locally');
  }
}

async function toggleProductStock(productId) {
  if (typeof state === 'undefined') return;
  const p = state.products.find(item => item.id === productId);
  if (!p) return;
  p.inStock = !p.inStock;
  saveProducts();
  renderAdminDashboard();

  try {
    await saveProductToSupabase(p, true);
    if (typeof showToast === 'function') showToast(`"${p.name}" is now ${p.inStock ? 'In Stock' : 'Out of Stock'}`, 'success');
  } catch (e) {
    console.warn('Supabase stock toggle notice:', e);
  }
}

// ==========================================================================
// DRAG & DROP PHOTO DROPZONE ENGINE
// ==========================================================================
function setupDropzoneEvents() {
  const dropzone = document.getElementById('admin-dropzone');
  if (!dropzone) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-over');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-over');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  }, false);
}

function triggerFileSelect() {
  const fileInput = document.getElementById('admin-file-input');
  if (fileInput) fileInput.click();
}

function handleAdminFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    processImageFile(file);
  }
}

async function uploadToCloudinary(file) {
  const settings = (typeof state !== 'undefined' && state.settings) ? state.settings : {};
  const cloudName = settings.cloudinaryCloudName || 'ndtz6uub';
  const uploadPreset = settings.cloudinaryUploadPreset || 'prias_store';

  if (!cloudName || !uploadPreset) {
    return null;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'prias_accessories');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Cloudinary upload failed');
  }

  const data = await res.json();
  return data.secure_url;
}

async function processImageFile(file) {
  if (!file.type.startsWith('image/')) {
    if (typeof showToast === 'function') showToast('Please drop a valid image file (JPG, PNG, WebP)');
    return;
  }

  const settings = (typeof state !== 'undefined' && state.settings) ? state.settings : {};
  const hasCloudinary = Boolean(settings.cloudinaryCloudName && settings.cloudinaryUploadPreset);

  const emptyState = document.getElementById('dropzone-empty-state');
  const filledState = document.getElementById('dropzone-filled-state');
  
  // Show active progress state in dropzone
  if (emptyState) {
    emptyState.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:0.6rem; color:var(--admin-accent-gold-dark); padding:1rem 0;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:32px;height:32px;animation:spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
        <strong>${hasCloudinary ? 'Uploading photo to Cloudinary CDN...' : 'Optimizing photo for storefront...'}</strong>
        <span style="font-size:0.75rem; color:var(--admin-text-muted);">Processing high-resolution photography</span>
      </div>
    `;
  }

  // Attempt Cloudinary upload if credentials exist
  if (hasCloudinary) {
    try {
      const cdnUrl = await uploadToCloudinary(file);
      if (cdnUrl) {
        const hiddenInput = document.getElementById('form-prod-image-data');
        if (hiddenInput) hiddenInput.value = cdnUrl;

        displayDropzonePreview(cdnUrl, file.name || 'Cloudinary Image', 'Hosted on Cloudinary CDN');
        if (typeof showToast === 'function') showToast('Photo uploaded to Cloudinary CDN!', 'success');
        return;
      }
    } catch (err) {
      console.warn('Cloudinary upload issue, falling back to local optimization:', err);
      if (typeof showToast === 'function') showToast('Cloudinary: ' + err.message + ' (using local image)', 'warning');
    }
  }

  // Fallback: Local canvas image compression
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      const maxDim = 900;

      if (width > height && width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else if (height > maxDim) {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const optimizedData = canvas.toDataURL('image/jpeg', 0.85);
      
      const hiddenInput = document.getElementById('form-prod-image-data');
      if (hiddenInput) hiddenInput.value = optimizedData;

      displayDropzonePreview(optimizedData, file.name || 'Product Photo', `${Math.round(file.size / 1024)} KB (Local)`);
      if (typeof showToast === 'function') {
        if (!hasCloudinary) {
          showToast('Photo ready locally. Set up Cloudinary in Cloud Settings for instant CDN links!', 'info');
        } else {
          showToast('Photo optimized locally', 'success');
        }
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function displayDropzonePreview(dataUrl, name, size) {
  const emptyState = document.getElementById('dropzone-empty-state');
  const filledState = document.getElementById('dropzone-filled-state');
  const thumb = document.getElementById('dropzone-thumb');
  const filenameEl = document.getElementById('dropzone-filename');
  const filesizeEl = document.getElementById('dropzone-filesize');

  if (emptyState) emptyState.style.display = 'none';
  if (filledState) filledState.style.display = 'flex';
  if (thumb) thumb.src = dataUrl;
  if (filenameEl) filenameEl.textContent = name || 'Uploaded Photography';
  if (filesizeEl) filesizeEl.textContent = size || 'Ready for storefront';
}

function removeUploadedPhoto() {
  const hiddenInput = document.getElementById('form-prod-image-data');
  const fileInput = document.getElementById('admin-file-input');
  const emptyState = document.getElementById('dropzone-empty-state');
  const filledState = document.getElementById('dropzone-filled-state');

  if (hiddenInput) hiddenInput.value = '';
  if (fileInput) fileInput.value = '';
  if (filledState) filledState.style.display = 'none';
  if (emptyState) {
    emptyState.style.display = 'block';
    emptyState.innerHTML = `
      <svg class="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
      <div class="dropzone-text">
        <strong>Drag &amp; drop product photo here</strong>
        <span>or click to browse from device &bull; Cloudinary CDN auto-upload</span>
      </div>
    `;
  }
}

// ==========================================================================
// PRODUCT FORM SUBMIT / EDIT / DELETE
// ==========================================================================
async function saveProductToSupabase(productData, isEdit = false) {
  const currentPin = (typeof state !== 'undefined' && state.settings && state.settings.adminPin) ? state.settings.adminPin : '1234';

  const res = await fetch('/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      passcode: currentPin,
      action: 'save_product',
      product: productData
    })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Server error: ${res.status}`);
  }
}

async function deleteProductFromSupabase(productId) {
  const currentPin = (typeof state !== 'undefined' && state.settings && state.settings.adminPin) ? state.settings.adminPin : '1234';

  const res = await fetch('/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      passcode: currentPin,
      action: 'delete_product',
      productId: productId
    })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Server error: ${res.status}`);
  }
}

async function handleProductFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('form-prod-name').value.trim();
  const category = document.getElementById('form-prod-category').value;
  const price = Number(document.getElementById('form-prod-price').value);
  const origPriceVal = document.getElementById('form-prod-orig-price').value;
  const originalPrice = origPriceVal ? Number(origPriceVal) : null;
  const inStock = document.getElementById('form-prod-instock').checked;
  const imageData = document.getElementById('form-prod-image-data').value.trim();
  const desc = document.getElementById('form-prod-desc').value.trim();

  const badges = [];
  if (document.getElementById('badge-bestseller') && document.getElementById('badge-bestseller').checked) badges.push('bestseller');
  if (document.getElementById('badge-tarnish-free') && document.getElementById('badge-tarnish-free').checked) badges.push('tarnish-free');
  if (document.getElementById('badge-flash-deal') && document.getElementById('badge-flash-deal').checked) badges.push('flash-deal');
  if (document.getElementById('badge-new-in') && document.getElementById('badge-new-in').checked) badges.push('new-in');

  const defaultCategoryImg = category === 'earrings' ? 'assets/earrings-1.jpg' : category === 'rings' ? 'assets/ring-1.jpg' : 'assets/necklace-1.jpg';
  const finalImage = imageData || defaultCategoryImg;

  const isEdit = Boolean(state.editingProductId);
  let targetProduct = null;

  if (typeof state !== 'undefined') {
    if (isEdit) {
      targetProduct = state.products.find(item => item.id === state.editingProductId);
      if (targetProduct) {
        targetProduct.name = name;
        targetProduct.category = category;
        targetProduct.price = price;
        targetProduct.originalPrice = originalPrice;
        targetProduct.inStock = inStock;
        targetProduct.image = finalImage;
        targetProduct.description = desc;
        targetProduct.badges = badges;
      }
    } else {
      targetProduct = {
        id: 'prod_' + Date.now(),
        name,
        category,
        price,
        originalPrice,
        image: finalImage,
        description: desc || 'Premium 18k PVD gold plated tarnish-free jewelry.',
        badges,
        inStock,
        rating: 5.0,
        reviewsCount: 1,
        specs: ['18k PVD Real Gold Plating', '316L Stainless Steel', 'Waterproof & Sweatproof']
      };
      state.products.unshift(targetProduct);
    }

    saveProducts();
  }

  renderAdminDashboard();
  cancelEditProduct();

  // Push directly to live Supabase database
  if (targetProduct) {
    try {
      await saveProductToSupabase(targetProduct, isEdit);
      if (typeof showToast === 'function') {
        showToast(isEdit ? `"${name}" updated live in database!` : `"${name}" published live to storefront!`, 'success');
      }
    } catch (err) {
      console.error('Supabase live save error:', err);
      if (typeof showToast === 'function') {
        showToast('Saved to local storage (Supabase notice: ' + err.message + ')', 'warning');
      }
    }
  }
}

function editProduct(productId) {
  if (typeof state === 'undefined') return;
  const p = state.products.find(item => item.id === productId);
  if (!p) return;

  state.editingProductId = productId;
  document.getElementById('form-mode-title').textContent = `Editing: ${p.name}`;
  document.getElementById('btn-cancel-edit').style.display = 'inline-block';
  document.getElementById('btn-save-prod').innerHTML = '<span>Save Changes</span>';

  document.getElementById('form-prod-name').value = p.name;
  document.getElementById('form-prod-category').value = p.category;
  document.getElementById('form-prod-price').value = p.price;
  document.getElementById('form-prod-orig-price').value = p.originalPrice || '';
  document.getElementById('form-prod-instock').checked = p.inStock;
  document.getElementById('form-prod-image-data').value = p.image;
  document.getElementById('form-prod-desc').value = p.description || '';

  if (document.getElementById('badge-bestseller')) document.getElementById('badge-bestseller').checked = p.badges && p.badges.includes('bestseller');
  if (document.getElementById('badge-tarnish-free')) document.getElementById('badge-tarnish-free').checked = p.badges && p.badges.includes('tarnish-free');
  if (document.getElementById('badge-flash-deal')) document.getElementById('badge-flash-deal').checked = p.badges && p.badges.includes('flash-deal');
  if (document.getElementById('badge-new-in')) document.getElementById('badge-new-in').checked = p.badges && p.badges.includes('new-in');

  const catSelect = document.getElementById('form-prod-category');
  if (catSelect && typeof catSelect._refreshCustomDropdown === 'function') {
    catSelect._refreshCustomDropdown();
  }

  if (p.image) {
    displayDropzonePreview(p.image, p.name, 'Current Photo');
  }

  document.getElementById('admin-form-box').scrollIntoView({ behavior: 'smooth' });
}

function cancelEditProduct() {
  if (typeof state !== 'undefined') state.editingProductId = null;
  document.getElementById('form-mode-title').textContent = 'Add New Piece';
  document.getElementById('btn-cancel-edit').style.display = 'none';
  document.getElementById('btn-save-prod').innerHTML = '<span>Publish Piece to Storefront</span>';
  document.getElementById('admin-product-form').reset();
  document.getElementById('form-prod-instock').checked = true;
  if (document.getElementById('badge-tarnish-free')) document.getElementById('badge-tarnish-free').checked = true;
  
  const catSelect = document.getElementById('form-prod-category');
  if (catSelect && typeof catSelect._refreshCustomDropdown === 'function') {
    catSelect._refreshCustomDropdown();
  }

  removeUploadedPhoto();
}

async function deleteProduct(productId) {
  if (typeof state === 'undefined') return;
  const p = state.products.find(item => item.id === productId);
  if (!p) return;

  if (confirm(`Are you sure you want to delete "${p.name}"? This will remove it from the live store for all visitors.`)) {
    state.products = state.products.filter(item => item.id !== productId);
    saveProducts();
    renderAdminDashboard();

    try {
      await deleteProductFromSupabase(productId);
      if (typeof showToast === 'function') showToast(`"${p.name}" deleted from live database`, 'success');
    } catch (err) {
      console.error('Supabase delete error:', err);
      if (typeof showToast === 'function') showToast('Deleted locally (Database notice: ' + err.message + ')', 'warning');
    }
  }
}

function saveStoreSettings(e) {
  e.preventDefault();
  if (typeof state === 'undefined') return;

  const name = document.getElementById('admin-setting-store-name').value.trim();
  const phone = document.getElementById('admin-setting-wa-number').value.trim().replace(/[^0-9]/g, '');
  const pin = document.getElementById('admin-setting-new-pin').value.trim();

  state.settings.storeName = name || "Pria's Accessories";
  state.settings.whatsappNumber = phone || "2348123456789";
  state.settings.adminPin = pin || "1234";

  saveSettings();
  if (typeof applyStoreSettings === 'function') applyStoreSettings();
  if (typeof showToast === 'function') showToast('Store settings saved! WhatsApp number updated across all pages', 'success');
}

function filterAdminTable(query) {
  const rows = document.querySelectorAll('#admin-inventory-table-body tr');
  const q = query.toLowerCase().trim();
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(q) ? '' : 'none';
  });
}

function exportCatalogJSON() {
  if (typeof state === 'undefined') return;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.products, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `prias_catalog_backup_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  if (typeof showToast === 'function') showToast('Catalog backup exported', 'success');
}

function importCatalogJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (Array.isArray(parsed) && typeof state !== 'undefined') {
        state.products = parsed;
        saveProducts();
        renderAdminDashboard();
        if (typeof showToast === 'function') showToast('Catalog imported successfully', 'success');
      } else {
        if (typeof showToast === 'function') showToast('Invalid catalog backup file format');
      }
    } catch (err) {
      if (typeof showToast === 'function') showToast('Failed to parse JSON file');
    }
  };
  reader.readAsText(file);
}

function resetCatalogToDefault() {
  if (confirm('Reset catalog to default pieces? Custom pieces will be replaced.')) {
    if (typeof state !== 'undefined' && typeof DEFAULT_PRODUCTS !== 'undefined') {
      state.products = [...DEFAULT_PRODUCTS];
      saveProducts();
      renderAdminDashboard();
      if (typeof showToast === 'function') showToast('Catalog reset to defaults');
    }
  }
}

// ==========================================================================
// CLOUDINARY & SHARED CATALOG CLOUD PERSISTENCE ENGINE
// ==========================================================================

function renderCloudSyncSettings() {
  const settings = (typeof state !== 'undefined' && state.settings) ? state.settings : {};

  // 1. Cloudinary fields
  const cloudNameInput = document.getElementById('setting-cloud-name');
  const presetInput = document.getElementById('setting-upload-preset');
  const cloudBadge = document.getElementById('cloudinary-status-badge');

  const currentCloudName = settings.cloudinaryCloudName || 'ndtz6uub';
  const currentPreset = settings.cloudinaryUploadPreset || 'prias_store';

  if (cloudNameInput) cloudNameInput.value = currentCloudName;
  if (presetInput) presetInput.value = currentPreset;

  if (cloudBadge) {
    if (currentCloudName && currentPreset) {
      cloudBadge.className = 'status-pill approved';
      cloudBadge.textContent = 'Active (Connected)';
    } else {
      cloudBadge.className = 'status-pill pending';
      cloudBadge.textContent = 'Pending Setup';
    }
  }

  // 2. Cloud sync fields
  const providerSelect = document.getElementById('setting-sync-provider');
  const githubTokenInput = document.getElementById('setting-github-token');
  const jsonbinIdInput = document.getElementById('setting-jsonbin-id');
  const jsonbinKeyInput = document.getElementById('setting-jsonbin-key');
  const syncBadge = document.getElementById('cloud-sync-status-badge');
  const navSyncBadge = document.getElementById('admin-sync-badge');

  if (providerSelect) providerSelect.value = settings.cloudSyncProvider || 'supabase';
  if (githubTokenInput) githubTokenInput.value = settings.githubToken || '';
  if (jsonbinIdInput) jsonbinIdInput.value = settings.jsonbinId || '';
  if (jsonbinKeyInput) jsonbinKeyInput.value = settings.jsonbinKey || '';

  toggleSyncProviderFields();

  const isCloudActive = (settings.cloudSyncProvider === 'supabase') ||
                        (settings.cloudSyncProvider === 'github' && settings.githubToken) ||
                        (settings.cloudSyncProvider === 'jsonbin' && settings.jsonbinId && settings.jsonbinKey);

  if (syncBadge) {
    syncBadge.className = isCloudActive ? 'status-pill approved' : 'status-pill pending';
    syncBadge.textContent = (settings.cloudSyncProvider === 'supabase') ? 'Supabase Live Connected' : (isCloudActive ? 'Cloud Synced' : 'Local Storage Mode');
  }
  if (navSyncBadge) {
    navSyncBadge.textContent = (settings.cloudSyncProvider === 'supabase') ? 'Supabase Active' : (isCloudActive ? 'Cloud Active' : 'Ready');
    navSyncBadge.style.background = isCloudActive ? 'rgba(27, 158, 75, 0.15)' : 'rgba(184, 145, 90, 0.15)';
    navSyncBadge.style.color = isCloudActive ? '#1B9E4B' : '#8C662D';
  }
}

function toggleSyncProviderFields() {
  const provider = document.getElementById('setting-sync-provider')?.value || 'supabase';
  const supabaseBox = document.getElementById('sync-fields-supabase');
  const githubBox = document.getElementById('sync-fields-github');
  const jsonbinBox = document.getElementById('sync-fields-jsonbin');

  if (supabaseBox) supabaseBox.style.display = provider === 'supabase' ? 'block' : 'none';
  if (githubBox) githubBox.style.display = provider === 'github' ? 'block' : 'none';
  if (jsonbinBox) jsonbinBox.style.display = provider === 'jsonbin' ? 'block' : 'none';
}

function handleSaveCloudinarySettings(e) {
  e.preventDefault();
  if (typeof state === 'undefined') return;

  const cloudName = document.getElementById('setting-cloud-name')?.value.trim() || '';
  const uploadPreset = document.getElementById('setting-upload-preset')?.value.trim() || '';

  state.settings.cloudinaryCloudName = cloudName;
  state.settings.cloudinaryUploadPreset = uploadPreset;
  saveSettings();

  renderCloudSyncSettings();
  if (typeof showToast === 'function') showToast('Cloudinary credentials saved!', 'success');
}

async function testCloudinaryConnection() {
  const cloudName = document.getElementById('setting-cloud-name')?.value.trim() || state.settings?.cloudinaryCloudName;
  const uploadPreset = document.getElementById('setting-upload-preset')?.value.trim() || state.settings?.cloudinaryUploadPreset;

  if (!cloudName || !uploadPreset) {
    alert('Please enter both your Cloudinary Cloud Name and Upload Preset first.');
    return;
  }

  if (typeof showToast === 'function') showToast('Testing Cloudinary connection...');

  try {
    // 1x1 transparent test pixel
    const testBlob = new Blob([new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3b])], { type: 'image/gif' });
    const formData = new FormData();
    formData.append('file', testBlob);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'prias_test');

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      alert(`Cloudinary Connection Successful!\n\nCloud Name: ${cloudName}\nPreset: ${uploadPreset}\nTest Image: ${data.secure_url}`);
      state.settings.cloudinaryCloudName = cloudName;
      state.settings.cloudinaryUploadPreset = uploadPreset;
      saveSettings();
      renderCloudSyncSettings();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(`Cloudinary Test Failed:\n${err.error?.message || 'Check your Cloud Name and make sure your Upload Preset is set to "Unsigned".'}`);
    }
  } catch (err) {
    alert(`Connection Error: ${err.message}`);
  }
}

function handleSaveCloudSyncSettings(e) {
  e.preventDefault();
  if (typeof state === 'undefined') return;

  const provider = document.getElementById('setting-sync-provider')?.value || 'local';
  const githubToken = document.getElementById('setting-github-token')?.value.trim() || '';
  const jsonbinId = document.getElementById('setting-jsonbin-id')?.value.trim() || '';
  const jsonbinKey = document.getElementById('setting-jsonbin-key')?.value.trim() || '';

  state.settings.cloudSyncProvider = provider;
  state.settings.githubToken = githubToken;
  state.settings.jsonbinId = jsonbinId;
  state.settings.jsonbinKey = jsonbinKey;
  saveSettings();

  renderCloudSyncSettings();
  if (typeof showToast === 'function') showToast('Cloud sync settings updated', 'success');
}

async function pushCatalogToCloudNow() {
  const logEl = document.getElementById('sync-log-message');
  const timeEl = document.getElementById('sync-last-timestamp');

  if (logEl) logEl.textContent = 'Synchronizing catalog...';
  if (typeof showToast === 'function') showToast('Syncing catalog to cloud...');

  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        passcode: state.settings?.adminPin || '1234',
        products: state.products,
        githubToken: state.settings?.githubToken,
        jsonbinKey: state.settings?.jsonbinKey,
        jsonbinId: state.settings?.jsonbinId
      })
    });

    const result = await res.json();
    if (res.ok && result.success) {
      const now = new Date().toLocaleTimeString();
      if (timeEl) timeEl.textContent = 'Today at ' + now;
      if (logEl) logEl.textContent = `Live sync complete via ${(result.provider || 'cloud').toUpperCase()} (${result.count || state.products.length} pieces synchronized).`;
      if (typeof showToast === 'function') showToast('Catalog live & synchronized across all devices!', 'success');
      renderCloudSyncSettings();
    } else {
      if (logEl) logEl.textContent = 'Sync notice: ' + (result.error || result.message || 'Unknown response');
      if (typeof showToast === 'function') showToast(result.error || 'Check sync credentials', 'warning');
    }
  } catch (err) {
    if (logEl) logEl.textContent = 'Local Mode: /api/sync requires active deployment or internet connection.';
    console.warn('Sync attempt:', err);
  }
}

// Background auto-sync function triggered whenever products change
function syncCatalogToCloud() {
  const settings = (typeof state !== 'undefined' && state.settings) ? state.settings : {};
  const isCloudActive = (settings.cloudSyncProvider === 'github' && settings.githubToken) ||
                        (settings.cloudSyncProvider === 'jsonbin' && settings.jsonbinId && settings.jsonbinKey);

  if (isCloudActive) {
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        passcode: settings.adminPin || '1234',
        products: state.products,
        githubToken: settings.githubToken,
        jsonbinKey: settings.jsonbinKey,
        jsonbinId: settings.jsonbinId
      })
    }).catch(err => console.debug('Background auto-sync notification:', err));
  }
}

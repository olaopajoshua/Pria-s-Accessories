/**
 * PRIA'S ACCESSORIES — CONTACT & CLIENT REVIEWS LOGIC (contact.js)
 * Interactive 5-Star Rating Picker, Review Submission, LocalStorage Persistence,
 * WhatsApp Message Generator & Live Reviews Wall Renderer.
 */

let currentSelectedRating = 5;

document.addEventListener('DOMContentLoaded', () => {
  initRatingSelector();
  populateProductSelect();
});

// Initialize Star Rating Interaction
function initRatingSelector() {
  const starButtons = document.querySelectorAll('.star-pick-btn');
  starButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      currentSelectedRating = index + 1;
      updateStarUI(currentSelectedRating);
    });

    btn.addEventListener('mouseenter', () => {
      highlightStars(index + 1);
    });

    btn.addEventListener('mouseleave', () => {
      updateStarUI(currentSelectedRating);
    });
  });
}

function updateStarUI(rating) {
  const starButtons = document.querySelectorAll('.star-pick-btn');
  starButtons.forEach((btn, index) => {
    if (index < rating) {
      btn.classList.add('active');
      btn.textContent = '★';
    } else {
      btn.classList.remove('active');
      btn.textContent = '☆';
    }
  });
}

function highlightStars(count) {
  const starButtons = document.querySelectorAll('.star-pick-btn');
  starButtons.forEach((btn, index) => {
    btn.textContent = index < count ? '★' : '☆';
  });
}

// Populate Jewelry Pieces into Review Dropdown
function populateProductSelect() {
  const select = document.getElementById('review-product-select');
  if (!select) return;
  
  select.innerHTML = `
    <option value="">-- Select Purchased Piece (Optional) --</option>
    ${state.products.map(p => `<option value="${p.name}">${p.name} (${formatNaira(p.price)})</option>`).join('')}
  `;

  if (typeof createCustomDropdown === 'function') {
    createCustomDropdown(select);
  }
  if (typeof select._refreshCustomDropdown === 'function') {
    select._refreshCustomDropdown();
  }
}

// Handle Review Submission
function handleReviewSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('review-name-input');
  const locationInput = document.getElementById('review-location-input');
  const productSelect = document.getElementById('review-product-select');
  const textInput = document.getElementById('review-text-input');

  const name = nameInput ? nameInput.value.trim() : '';
  const location = locationInput ? locationInput.value.trim() : 'Lagos, Nigeria';
  const product = productSelect ? productSelect.value : '';
  const text = textInput ? textInput.value.trim() : '';

  if (!name) {
    showToast('Please enter your name');
    if (nameInput) nameInput.focus();
    return;
  }

  if (!text || text.length < 10) {
    showToast('Please share a few words about your experience (minimum 10 characters)');
    if (textInput) textInput.focus();
    return;
  }

  const newReview = {
    id: 'rev_' + Date.now(),
    name: name,
    location: location || 'Lagos, Nigeria',
    product: product,
    rating: currentSelectedRating,
    text: text,
    verified: true,
    status: 'pending',
    date: 'Just now'
  };

  addReview(newReview);
  showToast('Thank you! Your review has been submitted for moderation and will appear once approved.', 'success');

  // Reset Form
  if (nameInput) nameInput.value = '';
  if (locationInput) locationInput.value = '';
  if (productSelect) productSelect.value = '';
  if (textInput) textInput.value = '';
  currentSelectedRating = 5;
  updateStarUI(5);
}

// Handle Quick WhatsApp Inquiry Form
function handleQuickInquirySubmit(e) {
  e.preventDefault();
  const name = document.getElementById('inquiry-name-input') ? document.getElementById('inquiry-name-input').value.trim() : '';
  const msg = document.getElementById('inquiry-msg-input') ? document.getElementById('inquiry-msg-input').value.trim() : '';

  if (!msg) {
    showToast('Please type your inquiry message');
    return;
  }

  const phone = (typeof getStoreWhatsAppNumber === 'function') 
    ? getStoreWhatsAppNumber() 
    : ((typeof state !== 'undefined' && state.settings && state.settings.whatsappNumber) ? state.settings.whatsappNumber : '2348123456789');

  let waText = `Hello Pria's Accessories`;
  if (name) {
    waText += `, my name is ${name}.\n\n${msg}`;
  } else {
    waText += `,\n\n${msg}`;
  }

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(waText)}`, '_blank');
}

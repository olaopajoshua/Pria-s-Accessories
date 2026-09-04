/**
 * PRIA'S ACCESSORIES — FAQ JAVASCRIPT (faq.html)
 * Accordion Expand/Collapse Behavior and Nigeria States/LGAs Delivery Calculator
 */

document.addEventListener('DOMContentLoaded', () => {
  initFAQPage();
  initNigeriaDeliveryCalculator();
});

// Accordion Single-Open Logic
function initFAQPage() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close other accordions
        faqItems.forEach(otherItem => {
          if (otherItem !== item) otherItem.classList.remove('open');
        });

        if (isOpen) {
          item.classList.remove('open');
        } else {
          item.classList.add('open');
        }
      });
    }
  });
}

// ==========================================================================
// NIGERIA STATES & LOCAL GOVERNMENT AREAS (LGAs) DATASET
// ==========================================================================
const NIGERIA_LOCATIONS = {
  'Lagos': {
    zone: 'lagos',
    lgas: [
      { name: 'Ikeja (Mainland Hub)', tier: 'lagos-mainland' },
      { name: 'Yaba / Surulere', tier: 'lagos-mainland' },
      { name: 'Lekki Phase 1 & 2', tier: 'lagos-island' },
      { name: 'Victoria Island (VI) / Ikoyi', tier: 'lagos-island' },
      { name: 'Ajah / Sangotedo / Awoyaya', tier: 'lagos-island' },
      { name: 'Festac / Amuwo-Odofin', tier: 'lagos-mainland' },
      { name: 'Gbagada / Ogudu / Anthony', tier: 'lagos-mainland' },
      { name: 'Agege / Ogba / Berger', tier: 'lagos-mainland' },
      { name: 'Alimosho / Egbeda / Iyana Ipaja', tier: 'lagos-mainland' },
      { name: 'Ikorodu / Ketu / Mile 12', tier: 'lagos-mainland' },
      { name: 'Oshodi / Isolo / Ilupeju', tier: 'lagos-mainland' },
      { name: 'Apapa / Costain', tier: 'lagos-mainland' },
      { name: 'Shomolu / Bariga / Akoka', tier: 'lagos-mainland' },
      { name: 'Eti-Osa / Chevron / Ikate', tier: 'lagos-island' },
      { name: 'Ibeju-Lekki / Epe', tier: 'lagos-island' },
      { name: 'Badagry / Ojo', tier: 'lagos-mainland' }
    ]
  },
  'FCT Abuja': {
    zone: 'abuja',
    lgas: [
      { name: 'Abuja Municipal (AMAC - Central Area)', tier: 'abuja' },
      { name: 'Maitama / Wuse II / Asokoro / Garki', tier: 'abuja' },
      { name: 'Gwarinpa / Jabi / Utako / Katampe', tier: 'abuja' },
      { name: 'Bwari / Kubwa / Dutse', tier: 'abuja' },
      { name: 'Gwagwalada', tier: 'abuja' },
      { name: 'Kuje', tier: 'abuja' },
      { name: 'Lugbe / Airport Road', tier: 'abuja' },
      { name: 'Abaji / Kwali', tier: 'abuja' }
    ]
  },
  'Rivers': {
    zone: 'portharcourt',
    lgas: [
      { name: 'Port Harcourt City (Old GRA, New GRA)', tier: 'portharcourt' },
      { name: 'Obio-Akpor (Rumuokoro, Choba, Rumuola)', tier: 'portharcourt' },
      { name: 'Eleme / Oyigbo', tier: 'portharcourt' },
      { name: 'Ikwerre / Emohua', tier: 'portharcourt' },
      { name: 'Okrika / Ogu-Bolo', tier: 'portharcourt' },
      { name: 'Bonny Island', tier: 'portharcourt' },
      { name: 'Ahoada East / West', tier: 'portharcourt' },
      { name: 'Degema / Asari-Toru', tier: 'portharcourt' }
    ]
  },
  'Ogun': {
    zone: 'interstate',
    lgas: [
      { name: 'Abeokuta South / North', tier: 'interstate' },
      { name: 'Ado-Odo/Ota / Sango Ota', tier: 'interstate' },
      { name: 'Sagamu / Remo North', tier: 'interstate' },
      { name: 'Ijebu Ode / Ijebu North', tier: 'interstate' },
      { name: 'Ifo / Magboro / Arepo / Mowe', tier: 'interstate' },
      { name: 'Obafemi Owode', tier: 'interstate' },
      { name: 'Ikenne / Ilisan Remo', tier: 'interstate' }
    ]
  },
  'Oyo': {
    zone: 'interstate',
    lgas: [
      { name: 'Ibadan North (Bodija, UI, Agbowo)', tier: 'interstate' },
      { name: 'Ibadan South-West (Ring Road, Oluyole)', tier: 'interstate' },
      { name: 'Ibadan North-East / South-East', tier: 'interstate' },
      { name: 'Ibadan North-West (Dugbe, Eleyele)', tier: 'interstate' },
      { name: 'Akinyele / Moniya', tier: 'interstate' },
      { name: 'Ogbomosho North / South', tier: 'interstate' },
      { name: 'Oyo East / West / Atiba', tier: 'interstate' },
      { name: 'Iseyin / Saki West', tier: 'interstate' }
    ]
  },
  'Anambra': {
    zone: 'interstate',
    lgas: [
      { name: 'Awka South / North', tier: 'interstate' },
      { name: 'Onitsha North / South', tier: 'interstate' },
      { name: 'Nnewi North / South', tier: 'interstate' },
      { name: 'Idemili North / South (Ogidi, Obosi)', tier: 'interstate' },
      { name: 'Aguata / Ekwulobia', tier: 'interstate' },
      { name: 'Ihiala / Oyi / Ogbaru', tier: 'interstate' }
    ]
  },
  'Enugu': {
    zone: 'interstate',
    lgas: [
      { name: 'Enugu North (Independence Layout, New Haven)', tier: 'interstate' },
      { name: 'Enugu South / Enugu East', tier: 'interstate' },
      { name: 'Nsukka (University Town)', tier: 'interstate' },
      { name: 'Udi / Oji River', tier: 'interstate' },
      { name: 'Nkanu West / East', tier: 'interstate' }
    ]
  },
  'Edo': {
    zone: 'interstate',
    lgas: [
      { name: 'Oredo (Benin City Central, GRA)', tier: 'interstate' },
      { name: 'Ikpoba-Okha / Egor (Uselu)', tier: 'interstate' },
      { name: 'Ovia North-East / South-West', tier: 'interstate' },
      { name: 'Esan West (Ekpoma) / Central (Irrua)', tier: 'interstate' },
      { name: 'Etsako West (Auchi)', tier: 'interstate' }
    ]
  },
  'Delta': {
    zone: 'interstate',
    lgas: [
      { name: 'Warri South / North / South-West', tier: 'interstate' },
      { name: 'Uvwie (Effurun) / Sapele', tier: 'interstate' },
      { name: 'Oshimili South (Asaba Capital) / North', tier: 'interstate' },
      { name: 'Ughelli North / South', tier: 'interstate' },
      { name: 'Ika South (Agbor) / North-East', tier: 'interstate' }
    ]
  },
  'Kano': {
    zone: 'interstate',
    lgas: [
      { name: 'Kano Municipal / Fagge / Sabon Gari', tier: 'interstate' },
      { name: 'Dala / Gwale / Nassarawa / Tarauni', tier: 'interstate' },
      { name: 'Kumbotso / Ungogo / Bichi', tier: 'interstate' },
      { name: 'Wudil / Gezawa / Dawakin Kudu', tier: 'interstate' }
    ]
  },
  'Kaduna': {
    zone: 'interstate',
    lgas: [
      { name: 'Kaduna North (Barnawa, Malali, Ungwan Rimi)', tier: 'interstate' },
      { name: 'Kaduna South / Chikun / Igabi', tier: 'interstate' },
      { name: 'Zaria / Sabon Gari Zaria', tier: 'interstate' },
      { name: 'Jemaa (Kafanchan)', tier: 'interstate' }
    ]
  },
  'Kwara': {
    zone: 'interstate',
    lgas: [
      { name: 'Ilorin West (Fate, GRA, Mandate)', tier: 'interstate' },
      { name: 'Ilorin South / Ilorin East', tier: 'interstate' },
      { name: 'Offa / Oyun / Ifelodun', tier: 'interstate' }
    ]
  },
  'Osun': {
    zone: 'interstate',
    lgas: [
      { name: 'Osogbo / Olorunda', tier: 'interstate' },
      { name: 'Ife Central / East / North / South', tier: 'interstate' },
      { name: 'Ilesa East / West / Ede', tier: 'interstate' }
    ]
  },
  'Ondo': {
    zone: 'interstate',
    lgas: [
      { name: 'Akure South (Alagbaka, Oba Ile) / North', tier: 'interstate' },
      { name: 'Ondo West / East', tier: 'interstate' },
      { name: 'Owo / Ikare Akoko', tier: 'interstate' }
    ]
  },
  'Akwa Ibom': {
    zone: 'interstate',
    lgas: [
      { name: 'Uyo (Ewet Housing, Shelter Afrique)', tier: 'interstate' },
      { name: 'Eket / Ikot Ekpene / Oron', tier: 'interstate' }
    ]
  },
  'Cross River': {
    zone: 'interstate',
    lgas: [
      { name: 'Calabar Municipal / Calabar South', tier: 'interstate' },
      { name: 'Ikom / Ogoja / Obudu', tier: 'interstate' }
    ]
  },
  'Imo': {
    zone: 'interstate',
    lgas: [
      { name: 'Owerri Municipal / North / West', tier: 'interstate' },
      { name: 'Orlu / Okigwe / Mbaitoli', tier: 'interstate' }
    ]
  },
  'Abia': {
    zone: 'interstate',
    lgas: [
      { name: 'Aba South / North / Osisioma', tier: 'interstate' },
      { name: 'Umuahia North / South', tier: 'interstate' },
      { name: 'Ohafia / Bende', tier: 'interstate' }
    ]
  },
  'Plateau': {
    zone: 'interstate',
    lgas: [
      { name: 'Jos North / Jos South / Bassa', tier: 'interstate' },
      { name: 'Barkin Ladi / Mangu / Pankshin', tier: 'interstate' }
    ]
  },
  'Benue': {
    zone: 'interstate',
    lgas: [
      { name: 'Makurdi / Gboko / Otukpo', tier: 'interstate' }
    ]
  },
  'Kogi': {
    zone: 'interstate',
    lgas: [
      { name: 'Lokoja / Okene / Ajaokuta / Kabba', tier: 'interstate' }
    ]
  },
  'Nasarawa': {
    zone: 'interstate',
    lgas: [
      { name: 'Lafia / Karu (Mararaba) / Keffi', tier: 'interstate' }
    ]
  },
  'Niger': {
    zone: 'interstate',
    lgas: [
      { name: 'Minna (Chanchaga) / Suleja / Bida', tier: 'interstate' }
    ]
  },
  'Adamawa': {
    zone: 'interstate',
    lgas: [
      { name: 'Yola North / South (Jimeta) / Mubi', tier: 'interstate' }
    ]
  },
  'Bauchi': {
    zone: 'interstate',
    lgas: [
      { name: 'Bauchi Municipal / Katagum (Azare)', tier: 'interstate' }
    ]
  },
  'Bayelsa': {
    zone: 'interstate',
    lgas: [
      { name: 'Yenagoa / Ogbia / Sagbama', tier: 'interstate' }
    ]
  },
  'Borno': {
    zone: 'interstate',
    lgas: [
      { name: 'Maiduguri (MMC) / Jere / Biu', tier: 'interstate' }
    ]
  },
  'Ebonyi': {
    zone: 'interstate',
    lgas: [
      { name: 'Abakaliki / Afikpo North', tier: 'interstate' }
    ]
  },
  'Ekiti': {
    zone: 'interstate',
    lgas: [
      { name: 'Ado-Ekiti / Ikere / Ijero / Oye', tier: 'interstate' }
    ]
  },
  'Gombe': {
    zone: 'interstate',
    lgas: [
      { name: 'Gombe / Akko / Kaltungo', tier: 'interstate' }
    ]
  },
  'Jigawa': {
    zone: 'interstate',
    lgas: [
      { name: 'Dutse / Hadejia / Gumel / Kazaure', tier: 'interstate' }
    ]
  },
  'Katsina': {
    zone: 'interstate',
    lgas: [
      { name: 'Katsina / Daura / Funtua', tier: 'interstate' }
    ]
  },
  'Kebbi': {
    zone: 'interstate',
    lgas: [
      { name: 'Birnin Kebbi / Argungu / Yauri', tier: 'interstate' }
    ]
  },
  'Sokoto': {
    zone: 'interstate',
    lgas: [
      { name: 'Sokoto North / South / Wamakko', tier: 'interstate' }
    ]
  },
  'Taraba': {
    zone: 'interstate',
    lgas: [
      { name: 'Jalingo / Wukari / Bali', tier: 'interstate' }
    ]
  },
  'Yobe': {
    zone: 'interstate',
    lgas: [
      { name: 'Damaturu / Potiskum / Gashua', tier: 'interstate' }
    ]
  },
  'Zamfara': {
    zone: 'interstate',
    lgas: [
      { name: 'Gusau / Kaura Namoda / Talata Mafara', tier: 'interstate' }
    ]
  },
  'Studio Pickup': {
    zone: 'pickup',
    lgas: [
      { name: 'Lagos Studio Pickup Desk (Self-Pickup)', tier: 'pickup' }
    ]
  }
};

const DELIVERY_TIERS = {
  'lagos-mainland': {
    fee: '₦1,500',
    timeline: 'Same-Day (orders before 2 PM) or Next Morning',
    courier: 'Dedicated Lagos Dispatch Rider'
  },
  'lagos-island': {
    fee: '₦2,500',
    timeline: 'Same-Day (orders before 2 PM) or Next Day',
    courier: 'Dedicated Lagos Island Dispatch Rider'
  },
  'abuja': {
    fee: '₦3,500',
    timeline: '24 to 48 Hours Express Waybill',
    courier: 'GIG Logistics / Express Courier'
  },
  'portharcourt': {
    fee: '₦3,500',
    timeline: '24 to 48 Hours',
    courier: 'GIG Express Logistics'
  },
  'interstate': {
    fee: '₦4,000',
    timeline: '2 to 3 Business Days Tracked',
    courier: 'GIG Interstate Waybill Service'
  },
  'pickup': {
    fee: 'FREE (₦0)',
    timeline: 'Ready in 2 Hours (Mon–Sat 9AM–6PM)',
    courier: 'Lagos Studio Pickup Desk'
  }
};

let currentSelectedState = 'Lagos';
let currentSelectedLGA = 'Ikeja (Mainland Hub)';

function initNigeriaDeliveryCalculator() {
  const stateSelect = document.getElementById('faq-calc-state');
  if (!stateSelect) return;

  // Populate States
  const stateKeys = Object.keys(NIGERIA_LOCATIONS);
  stateSelect.innerHTML = stateKeys.map(stateName => `
    <option value="${stateName}" ${stateName === 'Lagos' ? 'selected' : ''}>${stateName}</option>
  `).join('');

  if (typeof createCustomDropdown === 'function') {
    createCustomDropdown(stateSelect);
  }

  handleFAQStateChange('Lagos');
}

function handleFAQStateChange(stateName) {
  currentSelectedState = stateName;
  const lgaSelect = document.getElementById('faq-calc-lga');
  if (!lgaSelect) return;

  const stateData = NIGERIA_LOCATIONS[stateName] || NIGERIA_LOCATIONS['Lagos'];
  const lgas = stateData.lgas;

  lgaSelect.innerHTML = lgas.map((lga, i) => `
    <option value="${lga.tier}" data-lga-name="${lga.name}" ${i === 0 ? 'selected' : ''}>${lga.name}</option>
  `).join('');

  if (typeof createCustomDropdown === 'function') {
    createCustomDropdown(lgaSelect);
  }
  if (typeof lgaSelect._refreshCustomDropdown === 'function') {
    lgaSelect._refreshCustomDropdown();
  }

  if (lgas.length > 0) {
    handleFAQLGAChange(lgas[0].tier);
  }
}

function handleFAQLGAChange(tierKey) {
  const lgaSelect = document.getElementById('faq-calc-lga');
  const selectedOption = lgaSelect ? lgaSelect.options[lgaSelect.selectedIndex] : null;
  const lgaName = selectedOption ? (selectedOption.getAttribute('data-lga-name') || selectedOption.text) : '';
  currentSelectedLGA = lgaName;

  const destPill = document.getElementById('faq-calc-dest-pill');
  if (destPill) {
    const cleanLga = lgaName.split('/')[0].split('(')[0].trim();
    destPill.innerHTML = `${currentSelectedState} &bull; ${cleanLga || 'Hub'}`;
  }

  const tier = DELIVERY_TIERS[tierKey] || DELIVERY_TIERS['lagos-mainland'];

  const feeEl = document.getElementById('faq-calc-fee');
  const timelineEl = document.getElementById('faq-calc-timeline-text');
  const courierEl = document.getElementById('faq-calc-courier');
  const waBtn = document.getElementById('faq-calc-whatsapp-btn');

  if (feeEl) feeEl.textContent = tier.fee;
  if (timelineEl) timelineEl.textContent = tier.timeline;
  if (courierEl) courierEl.textContent = tier.courier;

  if (waBtn) {
    const waNumber = (typeof getStoreWhatsAppNumber === 'function') 
      ? getStoreWhatsAppNumber() 
      : ((typeof state !== 'undefined' && state.settings && state.settings.whatsappNumber) ? state.settings.whatsappNumber : '2348123456789');
    const message = encodeURIComponent(`Hello Pria's Accessories, I'd like to confirm delivery to ${currentSelectedState} (${currentSelectedLGA}).`);
    waBtn.href = `https://wa.me/${waNumber}?text=${message}`;
  }
}


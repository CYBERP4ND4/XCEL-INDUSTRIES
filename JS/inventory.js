document.addEventListener('DOMContentLoaded', function () {
  var modal = document.getElementById('details-modal');
  if (!modal) return;

  var modalImage = modal.querySelector('.details-modal-image');
  var modalBrandLogo = modal.querySelector('.details-modal-brand-logo');
  var modalName = modal.querySelector('.details-modal-name');
  var modalDescription = modal.querySelector('.details-modal-description');
  var modalSpecs = modal.querySelector('.details-modal-specs');
  var modalPrice = modal.querySelector('.details-modal-price');

  var categoryLabels = {
    'sports-cars': 'sports car',
    'super-cars': 'super car',
    'luxury-cars': 'luxury car',
    'premium-suvs': 'premium SUV'
  };

  var bodyTypeLabels = {
    'sports-cars': 'Sports Car',
    'super-cars': 'Super Car',
    'luxury-cars': 'Luxury Car',
    'premium-suvs': 'Premium SUV'
  };

  var seatingByCategory = {
    'sports-cars': '2 Seats',
    'super-cars': '2 Seats',
    'luxury-cars': '5 Seats',
    'premium-suvs': '5-7 Seats'
  };

  var electricModels = ['tesla', 'taycan'];

  function getNameParts(card) {
    var nameEl = card.querySelector('.car-name');
    if (!nameEl) return { brand: '', model: '', year: '' };

    var parts = nameEl.innerHTML.split('<br>');
    var brand = (parts[0] || '').replace(/<[^>]+>/g, '').trim();
    var modelRaw = (parts[1] || '').replace(/<[^>]+>/g, '').trim();
    var yearMatch = modelRaw.match(/\((\d{4})\)/);
    var year = yearMatch ? yearMatch[1] : '';
    var model = modelRaw.replace(/\s*\(\d{4}\)/, '').trim();

    return { brand: brand, model: model, year: year };
  }

  function buildMileage(year, brand, model) {
    var age = 2026 - parseInt(year, 10);
    if (!age || age <= 0) return 'Brand New';

    var text = brand + model;
    var hash = 0;
    for (var i = 0; i < text.length; i++) {
      hash = (hash * 31 + text.charCodeAt(i)) % 4000;
    }

    var km = Math.round((age * 9000 + hash) / 100) * 100;
    return km.toLocaleString() + ' km';
  }

  function buildExtraSpecs(card) {
    var parts = getNameParts(card);
    var category = card.getAttribute('data-category');
    var fullName = (parts.brand + ' ' + parts.model).toLowerCase();
    var isElectric = electricModels.some(function (term) {
      return fullName.indexOf(term) !== -1;
    });

    return [
      { label: 'Body Type', value: bodyTypeLabels[category] || 'Vehicle' },
      { label: 'Fuel Type', value: isElectric ? 'Electric' : 'Gasoline' },
      { label: 'Seating', value: seatingByCategory[category] || '—' },
      { label: 'Mileage', value: buildMileage(parts.year, parts.brand, parts.model) },
      { label: 'Availability', value: 'In Stock' }
    ];
  }

  function buildDescription(card) {
    var nameEl = card.querySelector('.car-name');
    var specs = card.querySelectorAll('.spec-item');
    if (!nameEl || specs.length < 4) return '';

    var parts = nameEl.innerHTML.split('<br>');
    var brand = (parts[0] || '').replace(/<[^>]+>/g, '').trim();
    var modelRaw = (parts[1] || '').replace(/<[^>]+>/g, '').trim();
    var yearMatch = modelRaw.match(/\((\d{4})\)/);
    var year = yearMatch ? yearMatch[1] : '';
    var model = modelRaw.replace(/\s*\(\d{4}\)/, '').trim();

    var engine = specs[0].textContent.trim();
    var horsepower = specs[1].textContent.trim();
    var transmission = specs[2].textContent.trim();
    var drivetrain = specs[3].textContent.trim();

    var category = categoryLabels[card.getAttribute('data-category')] || 'vehicle';

    return 'The ' + year + ' ' + brand + ' ' + model + ' is a ' + category +
      ' powered by a ' + engine + ' engine making ' + horsepower +
      ', paired with a ' + transmission + ' transmission and ' + drivetrain + ' drivetrain.';
  }

  function openModal(card) {
    var image = card.querySelector('.car-image');
    var brandLogo = card.querySelector('.car-brand-logo');
    var name = card.querySelector('.car-name');
    var specs = card.querySelectorAll('.spec-item');
    var price = card.querySelector('.car-price');

    modalImage.src = image ? image.src : '';
    modalImage.alt = image ? image.alt : '';
    modalBrandLogo.src = brandLogo ? brandLogo.src : '';
    modalBrandLogo.alt = brandLogo ? brandLogo.alt : '';
    modalName.innerHTML = name ? name.innerHTML : '';
    modalDescription.textContent = buildDescription(card);
    modalPrice.textContent = price ? price.textContent : '';

    modalSpecs.innerHTML = '';
    specs.forEach(function (spec) {
      var item = document.createElement('li');
      item.className = 'spec-item';
      item.innerHTML = spec.innerHTML;
      modalSpecs.appendChild(item);
    });

    buildExtraSpecs(card).forEach(function (spec) {
      var item = document.createElement('li');
      item.className = 'spec-item';
      item.innerHTML = '<strong>' + spec.label + ':</strong>&nbsp;' + spec.value;
      modalSpecs.appendChild(item);
    });

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('.view-details-btn').forEach(function (btn) {
    btn.addEventListener('click', function (event) {
      event.preventDefault();
      var card = btn.closest('.car-card');
      if (card) openModal(card);
    });
  });

  modal.querySelectorAll('[data-modal-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  var sortSelect = document.getElementById('sort-select');
  var grids = Array.from(document.querySelectorAll('.car-grid'));
  var originalOrders = grids.map(function (grid) {
    return Array.from(grid.querySelectorAll('.car-card'));
  });

  function getPrice(card) {
    var priceEl = card.querySelector('.car-price');
    var digits = priceEl ? priceEl.textContent.replace(/[^\d]/g, '') : '';
    return digits ? parseInt(digits, 10) : 0;
  }

  function getYear(card) {
    var nameEl = card.querySelector('.car-name');
    var match = nameEl ? nameEl.textContent.match(/(\d{4})/) : null;
    return match ? parseInt(match[1], 10) : 0;
  }

  function applySort(mode) {
    grids.forEach(function (grid, i) {
      if (mode === 'default') {
        originalOrders[i].forEach(function (card) {
          grid.appendChild(card);
        });
        return;
      }

      var cards = Array.from(grid.querySelectorAll('.car-card'));

      cards.sort(function (a, b) {
        if (mode === 'price-asc') return getPrice(a) - getPrice(b);
        if (mode === 'price-desc') return getPrice(b) - getPrice(a);
        if (mode === 'year-asc') return getYear(a) - getYear(b);
        if (mode === 'year-desc') return getYear(b) - getYear(a);
        return 0;
      });

      cards.forEach(function (card) {
        grid.appendChild(card);
      });
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      applySort(sortSelect.value);
    });
  }
});
document.addEventListener('DOMContentLoaded', function () {
  var modal = document.getElementById('details-modal');
  if (!modal) return;

  var modalImage = modal.querySelector('.details-modal-image');
  var modalBrandLogo = modal.querySelector('.details-modal-brand-logo');
  var modalName = modal.querySelector('.details-modal-name');
  var modalSpecs = modal.querySelector('.details-modal-specs');
  var modalPrice = modal.querySelector('.details-modal-price');

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
    modalPrice.textContent = price ? price.textContent : '';

    modalSpecs.innerHTML = '';
    specs.forEach(function (spec) {
      var item = document.createElement('li');
      item.className = 'spec-item';
      item.innerHTML = spec.innerHTML;
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
});
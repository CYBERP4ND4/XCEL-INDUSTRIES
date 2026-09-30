document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('inquiry-form');
  var success = document.getElementById('inquiry-success');
  if (!form || !success) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
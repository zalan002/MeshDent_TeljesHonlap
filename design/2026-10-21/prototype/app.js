// Local design review only: no network requests, analytics or CRM submissions.
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#main-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll('.nav details[open]').forEach(el => el.removeAttribute('open'));
  if (navigation?.classList.contains('open')) {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  document.querySelectorAll('.nav details[open]').forEach(el => {
    if (!el.contains(event.target)) el.removeAttribute('open');
  });
});
const filters = [...document.querySelectorAll('[data-filter]')];
const works = [...document.querySelectorAll('[data-category]')];
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let count = 0;
  works.forEach(work => {
    work.hidden = button.dataset.filter !== 'all' && work.dataset.category !== button.dataset.filter;
    if (!work.hidden) count++;
  });
  const counter = document.querySelector('#gallery-count');
  if (counter) counter.textContent = `${count} referencia a válogatásban`;
}));
const lightbox = document.querySelector('#lightbox');
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
  if (!lightbox?.showModal) { window.open(button.dataset.image, '_blank', 'noopener'); return; }
  const img = lightbox.querySelector('img');
  img.src = button.dataset.image;
  img.alt = button.dataset.alt;
  lightbox.querySelector('h2').textContent = button.dataset.title;
  const source = lightbox.querySelector('a');
  source.href = button.dataset.source;
  lightbox.showModal();
}));
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
}));
const selectedTopic = new URLSearchParams(window.location.search).get('tema');
document.querySelectorAll('[data-contact-form]').forEach(form => {
  form.addEventListener('submit', event => event.preventDefault());
  const topic = form.querySelector('select');
  if (selectedTopic && [...topic.options].some(option => option.value === selectedTopic)) topic.value = selectedTopic;
  const callback = form.querySelector('[data-callback]');
  const phone = form.querySelector('input[type=tel]');
  const company = form.querySelector('[data-company]');
  const syncFields = () => {
    if (callback && phone) phone.required = callback.checked;
    if (company) company.hidden = topic.value === 'patient';
  };
  callback?.addEventListener('change', syncFields);
  topic.addEventListener('change', syncFields);
  syncFields();
  form.querySelector('[data-demo-submit]').addEventListener('click', () => {
    if (!form.reportValidity()) return;
    const output = form.querySelector('[role=status]');
    output.textContent = 'A mezők ellenőrzése sikeres. Ez látványterv: az üzenetet nem küldtük el és nem mentettük. Az éles oldalon itt a CRM által visszaigazolt eredmény jelenik meg.';
    output.focus();
  });
});
const cookieDialog = document.querySelector('#cookie-dialog');
document.querySelectorAll('[data-cookie-open]').forEach(button => button.addEventListener('click', () => cookieDialog?.showModal()));
document.querySelectorAll('[data-cookie-choice]').forEach(button => button.addEventListener('click', () => {
  cookieDialog.querySelector('[role=status]').textContent = 'A választás megjelenését mutatjuk. A prototípus nem használ mérési vagy reklámsütiket, és nem ment beállítást.';
}));

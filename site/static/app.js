/* Accessible navigation, gallery, opt-in measurement and verified contact submission. */
(() => {
  const config = window.MeshDentConfig || {};
  const menu = document.querySelector('.menu-button');
  const nav = document.querySelector('#main-nav');
  const closeMenu = () => { nav?.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.nav details[open]').forEach(el => el.removeAttribute('open'));
    if (nav?.classList.contains('open')) { closeMenu(); menu.focus(); }
  });
  document.addEventListener('click', event => {
    document.querySelectorAll('.nav details[open]').forEach(el => { if (!el.contains(event.target)) el.removeAttribute('open'); });
    if (nav?.classList.contains('open') && !event.target.closest('.site-header')) closeMenu();
  });
  const filters = [...document.querySelectorAll('[data-filter]')];
  const works = [...document.querySelectorAll('[data-category]')];
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    works.forEach(work => { work.hidden = button.dataset.filter !== 'all' && work.dataset.category !== button.dataset.filter; if (!work.hidden) count++; });
    document.querySelector('#gallery-count').textContent = `${count} referencia a válogatásban`;
  }));
  const lightbox = document.querySelector('#lightbox');
  document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
    if (!lightbox?.showModal) { window.open(button.dataset.image, '_blank', 'noopener'); return; }
    const image = lightbox.querySelector('img'); image.src = button.dataset.image; image.alt = button.dataset.alt;
    lightbox.querySelector('h2').textContent = button.dataset.title;
    lightbox.querySelector('a').href = button.dataset.source;
    lightbox.showModal();
  }));
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  }));

  const consentKey = 'meshdent-consent-v1';
  const lifetime = 180 * 86400000;
  let consent = { analytics: false, marketing: false };
  let remembered = false;
  try {
    const saved = JSON.parse(localStorage.getItem(consentKey));
    if (saved && saved.version === 1 && saved.savedAt <= Date.now() && Date.now() - saved.savedAt < lifetime) {
      consent = { analytics: saved.analytics === true, marketing: saved.marketing === true }; remembered = true;
    }
  } catch { /* Private browsing can disable local storage. */ }
  const dialog = document.querySelector('#cookie-dialog');
  const analyticsInput = dialog?.querySelector('[name=analytics]');
  const marketingInput = dialog?.querySelector('[name=marketing]');
  const measurementEnabled = Boolean(config.ga4Id || config.adsId);
  window.dataLayer = window.dataLayer || [];
  function tag() { window.dataLayer.push(arguments); }
  tag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  const configured = new Set();
  let loaded = false;
  const deleteCookies = category => {
    const names = document.cookie.split(';').map(x => x.trim().split('=')[0]);
    const domains = [null, location.hostname];
    const pieces = location.hostname.split('.');
    for (let i = 1; i < pieces.length - 1; i++) domains.push('.' + pieces.slice(i).join('.'));
    for (const name of names) {
      if (!(category === 'analytics' ? /^_ga(?:_|$)/ : /^_gcl_/).test(name)) continue;
      for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? '; Domain=' + domain : ''}`;
    }
  };
  const syncConsent = () => {
    if (analyticsInput) { analyticsInput.checked = consent.analytics; analyticsInput.disabled = !config.ga4Id; }
    if (marketingInput) { marketingInput.checked = consent.marketing; marketingInput.disabled = !config.adsId; }
    const analytics = consent.analytics && Boolean(config.ga4Id);
    const marketing = consent.marketing && Boolean(config.adsId);
    if (config.ga4Id) window['ga-disable-' + config.ga4Id] = !analytics;
    tag('consent', 'update', { analytics_storage: analytics ? 'granted' : 'denied', ad_storage: marketing ? 'granted' : 'denied', ad_user_data: marketing ? 'granted' : 'denied', ad_personalization: 'denied' });
    const ids = [analytics && config.ga4Id, marketing && config.adsId].filter(Boolean);
    if (ids.length && !loaded) {
      loaded = true; tag('js', new Date());
      const script = document.createElement('script'); script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ids[0]);
      document.head.append(script);
    }
    for (const id of ids) {
      if (configured.has(id)) continue;
      tag('config', id, { send_page_view: false, page_location: location.origin + location.pathname, page_referrer: '', allow_google_signals: false, allow_ad_personalization_signals: false });
      if (id === config.ga4Id) tag('event', 'page_view', { send_to: id, page_location: location.origin + location.pathname, page_referrer: '', page_title: document.title });
      configured.add(id);
    }
  };
  const track = (name, extra = {}) => {
    if (consent.analytics && config.ga4Id) tag('event', name, { send_to: config.ga4Id, page_location: location.origin + location.pathname, page_path: location.pathname, transport_type: 'beacon', ...extra });
  };
  const saveConsent = choice => {
    const previous = { ...consent };
    consent = { analytics: Boolean(config.ga4Id) && (choice === 'all' || choice === 'selected' && analyticsInput.checked), marketing: Boolean(config.adsId) && (choice === 'all' || choice === 'selected' && marketingInput.checked) };
    try { localStorage.setItem(consentKey, JSON.stringify({ version: 1, savedAt: Date.now(), ...consent })); } catch { /* Use the choice for this page. */ }
    if (!consent.analytics) deleteCookies('analytics');
    if (!consent.marketing) deleteCookies('marketing');
    syncConsent(); dialog?.close();
    // Unload already loaded tags when a category is withdrawn.
    if (previous.analytics && !consent.analytics || previous.marketing && !consent.marketing) location.reload();
  };
  document.querySelectorAll('[data-consent]').forEach(button => button.addEventListener('click', () => saveConsent(button.dataset.consent)));
  document.querySelectorAll('[data-cookie-open]').forEach(button => button.addEventListener('click', () => { syncConsent(); dialog?.showModal(); }));
  const status = measurementEnabled ? 'Az analitikai és hirdetési mérés csak a megfelelő hozzájárulással indul el. Döntését bármikor módosíthatja.' : 'Jelenleg nincs bekapcsolt analitikai vagy hirdetési mérés. Google mérési kódot és reklámsütit nem használunk.';
  document.querySelectorAll('[data-measurement-status], [data-consent-description]').forEach(el => { el.textContent = status; });
  syncConsent();
  if (measurementEnabled && !remembered) dialog?.showModal();
  document.querySelectorAll('a[href^="tel:"]').forEach(a => a.addEventListener('click', () => track('click_phone')));
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => a.addEventListener('click', () => track('click_email')));

  const measured = new Set();
  const recordLead = ({ formId, submission }) => {
    const key = formId + ':' + submission;
    if (!submission || measured.has(key)) return;
    measured.add(key);
    track('generate_lead', { form_id: formId });
    if (consent.marketing && config.adsId && config.adsLabel) tag('event', 'conversion', { send_to: config.adsId + '/' + config.adsLabel, transaction_id: submission, transport_type: 'beacon' });
  };
  window.addEventListener('meshdent-lead', event => recordLead(event.detail));
  document.querySelectorAll('[data-contact-form]').forEach(async form => {
    if (!config.contactEnabled) { form.remove(); return; }
    let createCrmSession;
    try { ({ createCrmSession } = await import('/crm-client.mjs')); } catch { return; }
    let session = createCrmSession({ key: config.contactForm, honeypot: 'website_fb81d63d' });
    form.hidden = false;
    document.querySelector('[data-contact-direct]')?.setAttribute('hidden', '');
    const output = form.querySelector('[role=status]');
    const submit = form.querySelector('[type=submit]');
    const idleLabel = submit.innerHTML;
    const topic = form.elements.topic;
    const selected = new URLSearchParams(location.search).get('tema');
    if ([...topic.options].some(option => option.value === selected)) topic.value = selected;
    let busy = false;
    form.addEventListener('focusin', () => { void session.prepare(); }, { once: true });
    form.addEventListener('submit', async event => {
      event.preventDefault(); if (busy || !form.reportValidity()) return;
      const phone = form.elements.phone.value.trim();
      const digits = phone.replace(/\D/g, '').length;
      if (digits < 7 || digits > 15 || !/^[+\d ()/.-]+$/.test(phone)) { output.textContent = 'Kérjük, adjon meg érvényes telefonszámot.'; output.dataset.error = 'true'; form.elements.phone.focus(); return; }
      if (form.elements.website_fb81d63d.value) return;
      busy = true; submit.disabled = true; submit.textContent = 'Küldés…'; output.textContent = 'Az üzenet küldése folyamatban.'; output.dataset.error = 'false';
      const message = form.elements.company.value.trim();
      const fields = { last_name: form.elements.last_name.value.trim(), email: form.elements.email.value.trim(), phone, company: topic.value === 'general' ? message : topic.selectedOptions[0].text + '\n\n' + message };
      const attribution = { page_url: location.origin + location.pathname, landing_url: location.origin + location.pathname };
      if (consent.marketing) for (const key of ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_id']) {
        const value = new URLSearchParams(location.search).get(key);
        if (value && /^[a-zA-Z0-9_.-]{1,200}$/.test(value)) attribution[key] = value;
      }
      try {
        const result = await session.submitFinal(fields, attribution);
        if (!result.ok) throw new Error(result.error);
        output.textContent = 'Köszönjük! Üzenetét rögzítettük, hamarosan jelentkezünk.';
        recordLead({ formId: 'labor-contact', submission: result.submission });
        form.reset(); session = createCrmSession({ key: config.contactForm, honeypot: 'website_fb81d63d' });
      } catch (error) {
        output.textContent = error.message || 'A küldés nem sikerült. Kérjük, keressen telefonon vagy e-mailben.';
        output.dataset.error = 'true';
      } finally { busy = false; submit.disabled = false; submit.innerHTML = idleLabel; output.focus(); }
    });
  });
})();

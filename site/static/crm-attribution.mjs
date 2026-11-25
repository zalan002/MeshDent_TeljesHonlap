// Session-scoped CRM attribution. Called after marketing consent on landing and on submission.
const key = 'meshdent-crm-source-v1';
const consentKey = 'meshdent-consent-v1';
const maxAge = 180 * 86400000;
const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'gclid', 'gbraid', 'wbraid'];
const valid = /^[A-Za-z0-9_.-]{1,200}$/;

export function forgetCrmSource() {
  try { sessionStorage.removeItem(key); } catch { /* Storage can be disabled. */ }
}

function allowed() {
  try {
    const c = JSON.parse(localStorage.getItem(consentKey));
    const age = Date.now() - c.savedAt;
    return c.version === 1 && c.marketing === true && age >= 0 && age < maxAge;
  } catch { return false; }
}

function sourceOnPage(url, referrer) {
  const fields = {};
  for (const k of campaignKeys) {
    const v = url.searchParams.get(k);
    if (v && valid.test(v)) fields[k] = v;
  }
  if (fields.gclid || fields.gbraid || fields.wbraid) {
    fields.utm_source = 'google';
    fields.utm_medium = 'cpc';
  }
  // A later non-Google click takes precedence over an earlier Google visit.
  const otherClick = ['fbclid', 'msclkid', 'ttclid', 'li_fat_id'].find(k => url.searchParams.has(k));
  if (otherClick && !fields.utm_source) {
    fields.utm_source = { fbclid: 'facebook', msclkid: 'bing', ttclid: 'tiktok', li_fat_id: 'linkedin' }[otherClick];
  }
  if (!Object.keys(fields).length && !referrer) return null;
  // Only the origin of an external referrer is needed. Never copy search strings.
  if (referrer) fields.landing_referrer = referrer.origin;
  fields.landing_url = url.origin + url.pathname;
  return fields;
}

export function buildAttributionPayload() {
  if (typeof window === 'undefined') return {};
  const url = new URL(window.location.href);
  const page = url.origin + url.pathname;
  const base = { landing_url: page, page_url: page };
  if (!allowed()) { forgetCrmSource(); return base; }
  let referrer;
  try {
    const ref = new URL(document.referrer);
    const localHosts = ['meshdent.hu', 'www.meshdent.hu'];
    const sameSite = ref.origin === url.origin || (localHosts.includes(ref.hostname) && localHosts.includes(url.hostname));
    if (!sameSite && /^https?:$/.test(ref.protocol)) referrer = ref;
  } catch { /* Direct visit. */ }
  let touch = sourceOnPage(url, referrer);
  try {
    if (touch) sessionStorage.setItem(key, JSON.stringify(touch));
    else touch = JSON.parse(sessionStorage.getItem(key));
  } catch { /* The current page still provides attribution without session storage. */ }
  return { ...base, ...touch, page_url: page };
}

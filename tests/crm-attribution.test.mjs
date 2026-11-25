import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAttributionPayload as capture } from '../site/static/crm-attribution.mjs';
const store = () => { const m = new Map(); return { getItem: k => m.get(k) ?? null, setItem: (k,v) => m.set(k,v), removeItem: k => m.delete(k) }; };
test('CRM source survives navigation and distinguishes paid, referral, another campaign and denied consent', () => {
  const origin = 'https://www.meshdent.hu';
  const go = (path, referrer='') => { globalThis.window = { location: { href: origin + path } }; globalThis.document = { referrer }; };
  const setConsent = (value, savedAt=Date.now()) => localStorage.setItem('meshdent-consent-v1', JSON.stringify({version:1, marketing:value, savedAt}));
  globalThis.localStorage = store(); globalThis.sessionStorage = store();
  try {
    go('/?gclid=google123&utm_campaign=labor');
    assert.equal(capture().gclid, undefined);
    setConsent(true);
    assert.equal(capture().utm_medium,'cpc');
    go('/kapcsolat', origin+'/');
    assert.deepEqual(capture(), {landing_url:origin+'/',page_url:origin+'/kapcsolat',utm_source:'google',utm_medium:'cpc',gclid:'google123',utm_campaign:'labor'});
    go('/FreedomaAir?gbraid=test-braid'); assert.equal(capture().utm_medium,'cpc');
    go('/kapcsolat?fbclid=mock-fb'); assert.equal(capture().utm_source,'facebook'); assert.equal(capture().gbraid,undefined);
    go('/', 'https://www.google.hu/search?q=private'); assert.equal(capture().landing_referrer,'https://www.google.hu'); assert.equal(capture().utm_medium,undefined);
    go('/?utm_source=google&utm_medium=organic'); assert.equal(capture().utm_medium,'organic');
    go('/?wbraid=test123'); assert.equal(capture().utm_source,'google');
    setConsent(false);go('/kapcsolat');assert.equal(capture().utm_source,undefined);assert.equal(sessionStorage.getItem('meshdent-crm-source-v1'),null);
    setConsent(true,Date.now()-181*86400000);go('/?gclid=expired');assert.equal(capture().gclid,undefined);
  } finally { for(const k of ['window','document','sessionStorage','localStorage']) delete globalThis[k]; }
});

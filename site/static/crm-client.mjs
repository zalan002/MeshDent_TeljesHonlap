/* Training Hungary public form protocol. No CRM secrets or field values enter analytics. */
export function createCrmSession({ key, honeypot }, { request = fetch, now = Date.now, delay = ms => new Promise(resolve => setTimeout(resolve, ms)) } = {}) {
  if (!/^[a-f0-9]{32}$/.test(key) || !/^website_[a-f0-9]+$/.test(honeypot)) throw new Error('Invalid public form configuration.');
  const api = 'https://partnercrm.leadgensolution.hu/api/public/forms/' + key;
  let tokenPromise = null, resume = null, partialPromise = null, finalPromise = null, complete = null, uncertain = false;
  const failure = (kind, error) => ({ ok: false, kind, error });
  const uncertainMessage = 'A CRM visszaigazolása nem érkezett meg. A beküldését már rögzíthették; kérjük, újabb beküldés helyett keresse a labort telefonon vagy e-mailben.';
  async function mint() {
    tokenPromise = (async () => {
      const response = await request(api, { method: 'GET', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(6000), cache: 'no-store' });
      const json = await response.json();
      if (!response.ok || typeof json.token !== 'string' || !json.token || !Number.isFinite(Number(json.ts))) throw new Error('Token unavailable');
      return { token: json.token, ts: String(json.ts), mintedAt: now() };
    })();
    try { return await tokenPromise; } catch { tokenPromise = null; return null; }
  }
  async function post(fields, attribution, extra, refreshed = false) {
    if (uncertain) return failure('uncertain', uncertainMessage);
    let token;
    try { token = await (tokenPromise || mint()); } catch { tokenPromise = null; }
    if (!token) return failure('network', 'A CRM most nem érhető el. Próbálja újra később, vagy keresse közvetlenül a labort.');
    if (now() - token.mintedAt > 23 * 60 * 60 * 1000) token = await mint();
    if (!token) return failure('network', 'Az űrlap most nem érhető el.');
    const wait = Math.max(0, 3800 - (now() - token.mintedAt)); if (wait) await delay(wait);
    const safeAttribution = {};
    for (const name of ['utm_source','utm_medium','utm_campaign','utm_id','gclid','gbraid','wbraid','landing_url','landing_referrer','page_url','page_referrer']) {
      if (typeof attribution[name] === 'string' && attribution[name].length <= 500) safeAttribution[name] = attribution[name];
    }
    let response, json;
    try {
      response = await request(api, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...fields, ...safeAttribution, [honeypot]: '', _token: token.token, _ts: token.ts, _channel: 'embed', _consent: 'true', ...extra }), signal: AbortSignal.timeout(20000) });
      json = await response.json();
    } catch { uncertain = true; return failure('uncertain', uncertainMessage); }
    if (response.ok && json?.ok === true) {
      if (extra._partial === '1') {
        if (typeof json.submission !== 'string' || typeof json.resume !== 'string' || !json.submission || !json.resume) { uncertain = true; return failure('uncertain', uncertainMessage); }
        resume = { submission: json.submission, token: json.resume };
      }
      return { ok: true, submission: resume?.submission };
    }
    if (response.status === 403 && !refreshed) { await mint(); return post(fields, attribution, extra, true); }
    if (response.status >= 500) { uncertain = true; return failure('uncertain', uncertainMessage); }
    return failure(response.status === 422 ? 'validation' : 'network', typeof json?.error === 'string' ? json.error : 'A beküldés sikertelen. Kérjük, próbálja újra később.');
  }
  function savePartial(fields, attribution = {}) {
    if (complete) return Promise.resolve(complete);
    if (resume) return Promise.resolve({ ok: true, submission: resume.submission });
    if (partialPromise) return partialPromise;
    partialPromise = post(fields, attribution, { _partial: '1' }).then(result => { if (!result.ok) partialPromise = null; return result; });
    return partialPromise;
  }
  function submitFinal(fields, attribution = {}) {
    if (complete) return Promise.resolve(complete);
    if (finalPromise) return finalPromise;
    finalPromise = (async () => {
      // Await the signed receipt. Never start a second record while partial capture is pending.
      const partial = await savePartial(fields, attribution);
      if (!partial.ok || !resume) return partial;
      const result = await post(fields, attribution, { _submission: resume.submission, _resume: resume.token });
      if (result.ok) complete = result;
      return result;
    })().finally(() => { finalPromise = null; });
    return finalPromise;
  }
  return { prepare: mint, savePartial, submitFinal };
}

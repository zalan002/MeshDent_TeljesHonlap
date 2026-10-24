// Consent-aware, PII-free attribution. Full URLs and free text never enter measurement.
export function buildAttributionPayload(): Record<string,string> {
  if (typeof window === 'undefined') return {};
  const result: Record<string,string> = { page_url:location.origin + location.pathname, landing_url:location.origin + location.pathname };
  try {
    const consent=JSON.parse(localStorage.getItem('meshdent-consent-v1') || '{}');
    if (consent.marketing === true && consent.version === 1 && Date.now()-consent.savedAt < 180*86400000) {
      for(const key of ['gclid','gbraid','wbraid','utm_source','utm_medium','utm_campaign','utm_id']) {
        const value=new URLSearchParams(location.search).get(key);
        if(value && /^[a-zA-Z0-9_.-]{1,200}$/.test(value)) result[key]=value;
      }
    }
  } catch { /* No attribution without a valid consent choice. */ }
  return result;
}

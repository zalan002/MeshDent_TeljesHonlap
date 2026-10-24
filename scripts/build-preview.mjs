// Publish the completed site. The reviewed source designs remain in the repository.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'site');
const output = path.join(root, 'dist');
const origin = new URL(process.env.SITE_URL || 'https://meshdentteljeshonlap.vercel.app').origin;
if (!origin.startsWith('https://')) throw new Error('SITE_URL must use HTTPS.');
const indexable = process.env.SITE_INDEXABLE === 'true' && !new URL(origin).hostname.endsWith('.vercel.app');
const integration = JSON.parse(fs.readFileSync(path.join(source, 'content/integrations.json'), 'utf8'));
const ga4Id = process.env.PUBLIC_GA4_ID ?? integration.ga4Id;
const adsId = process.env.PUBLIC_ADS_ID || integration.adsId;
const adsLabel = process.env.PUBLIC_ADS_LABEL || integration.adsLabel;
if (ga4Id && !/^G-[A-Z0-9]+$/.test(ga4Id)) throw new Error('Invalid GA4 ID.');
if (adsId && !/^AW-\d+$/.test(adsId)) throw new Error('Invalid Ads ID.');
if (adsLabel && !/^[a-zA-Z0-9_-]+$/.test(adsLabel)) throw new Error('Invalid Ads conversion label.');
if (Boolean(adsId) !== Boolean(adsLabel)) throw new Error('Ads ID and conversion label must be configured together.');
const contactEnabled = true;
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
fs.cpSync(path.join(source, 'static'), output, { recursive: true, filter: entry => !entry.endsWith('.d.mts') });
const config = { ga4Id, adsId, adsLabel, contactEnabled, contactForm: integration.contactForm };
fs.writeFileSync(path.join(output, 'site-config.js'), 'window.MeshDentConfig = Object.freeze(' + JSON.stringify(config) + ');\n');
const hashes = Object.fromEntries(fs.readdirSync(output).filter(x => /\.(css|js)$/.test(x)).map(name => [name, createHash('sha256').update(fs.readFileSync(path.join(output, name))).digest('hex').slice(0, 10)]));
const pages = JSON.parse(fs.readFileSync(path.join(source, 'generated/pages.json'), 'utf8'));
for (const page of pages) {
  if (page.externalExport) continue;
  let html = fs.readFileSync(path.join(source, 'generated', page.slug + '.html'), 'utf8')
    .replaceAll('__SITE_URL__', origin).replaceAll('__ROBOTS__', indexable ? 'index, follow, max-image-preview:large' : 'noindex, nofollow');
  html = html.replace(/href="([^"]+)"/g, (match, href) => {
    if (/^(?:#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) return match;
    const url = new URL(href, origin);
    const route = url.pathname === '/index.html' ? '/' : url.pathname.replace(/\.html$/, '');
    return `href="${route}${url.search}${url.hash}"`;
  });
  html = html.replace(/(src|href)="\/?([^"/?]+\.(?:css|js))"/g, (match, attr, name) => `${attr}="/${name}?v=${hashes[name]}"`);
  html = html.replace(/(src|data-image)="assets\//g, '$1="/assets/');
  if (/\{\{|__SITE_URL__|__ROBOTS__|OXO|github\.com/i.test(html)) throw new Error('Stale or forbidden content in ' + page.slug);
  fs.writeFileSync(path.join(output, page.slug + '.html'), html);
}
const urls = pages.filter(page => !page.noindex).map(page => `  <url><loc>${origin}${page.route}</loc></url>`).join('\n');
fs.writeFileSync(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
fs.writeFileSync(path.join(output, 'robots.txt'), indexable ? `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
fs.writeFileSync(path.join(output, 'llms.txt'), `# MeshDent\n\n> Digitális fogtechnikai labor Budapesten, rendelőkkel együttműködésben.\n\nMeshDent Kft. — 1139 Budapest, Petneházy u. 14.\nKapcsolat: meshdentkft@gmail.com; +36 70 361 9962; +36 70 353 4000.\nA MeshDent fogtechnikai labor; fogorvosi vizsgálatot és kezelést nem végez.\n\n## Szolgáltatások és információk\n${pages.filter(p => !p.noindex).map(p => `- [${p.title}](${origin}${p.route})`).join('\n')}\n\nA műszaki lehetőségekről és vállalási határidőkről közvetlen egyeztetés szükséges.\n`);
console.log(JSON.stringify({ output: 'dist', pages: pages.length, indexable, contactEnabled, analyticsConfigured: Boolean(ga4Id), adsConfigured: Boolean(adsId) }));

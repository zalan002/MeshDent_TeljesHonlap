// Publish the reviewed static design. No dependencies or runtime secrets required.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const design = path.join(root, 'design/2026-10-21');
const output = path.join(root, 'dist');
const prototype = path.join(design, 'prototype');
const standalone = fs.readFileSync(path.join(design, 'MeshDent-latvanyterv.html'), 'utf8');
const data = JSON.parse(standalone.match(/<script id="design-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
if (!data.app.includes('MeshDentArch') || !data.pages['index.html'].body.includes('data-arch-angle="occlusal"')) {
  throw new Error('The standalone preview is stale. Run build_standalone.py before publishing.');
}
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
fs.cpSync(prototype, output, { recursive: true });

// Root-relative, extensionless links match Vercel cleanUrls and preserve query/hash state.
let pages = 0;
for (const entry of fs.readdirSync(output)) {
  if (!entry.endsWith('.html')) continue;
  const file = path.join(output, entry);
  const source = fs.readFileSync(file, 'utf8');
  const body = source.replace(/href="([^"]+)"/g, (original, href) => {
    if (/^(?:#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) return original;
    const url = new URL(href, 'https://preview.invalid/');
    if (url.pathname.endsWith('/TELJES-HONLAPTERV.md')) return 'href="/latvanyterv#teljes-terv.html"';
    if (url.pathname.endsWith('/ELLENORZES.md')) return 'href="/latvanyterv#teljes-terv.html%23ellenorzes"';
    const pathname = url.pathname === '/index.html' ? '/' : url.pathname.replace(/\.html$/, '');
    return `href="${pathname}${url.search}${url.hash}"`;
  });
  fs.writeFileSync(file, body);
  pages++;
}
fs.writeFileSync(path.join(output, 'latvanyterv.html'), standalone.replace('Helyi, interaktív látványterv', 'Interaktív látványterv · Fogív 03'));
for (const name of ['TELJES-HONLAPTERV.md','FOOLDAL-02.md','ELLENORZES.md','oldalterv.csv','oldalterv.json','kepvalogatas.json','HASZNALAT.txt']) {
  fs.copyFileSync(path.join(design, name), path.join(output, name));
}
fs.writeFileSync(path.join(output, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log(JSON.stringify({ output: 'dist', pages: pages + 1, home: '/', designViewer: '/latvanyterv', freedomAirPlan: '/FreedomaAir' }));

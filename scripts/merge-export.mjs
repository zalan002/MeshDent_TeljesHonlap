import fs from 'node:fs';
import path from 'node:path';
// Keep the original DOF page's React/CSS/assets isolated from the main site's static HTML.
for (const name of fs.readdirSync('out')) {
  if (name === '404.html' || name === '404') continue;
  fs.cpSync(path.join('out', name), path.join('dist', name), { recursive: true });
}
if (!fs.existsSync('dist/FreedomaAir.html')) throw new Error('The Freedom Air export is missing.');
for (const name of ['robots.txt', 'sitemap.xml']) if (!fs.existsSync('dist/' + name)) throw new Error('Missing ' + name);
console.log('Freedom Air merged into the complete MeshDent site.');

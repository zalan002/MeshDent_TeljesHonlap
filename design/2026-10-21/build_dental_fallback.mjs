// Deterministic, self-contained SVG for JavaScript/Canvas-free previews.
import fs from 'node:fs';
import './prototype/dental-arch.js';

let paths = [], path = '';
const number = value => Number(value.toFixed(1));
const context = {
  clearRect() { paths = []; },
  beginPath() { path = ''; },
  moveTo(x, y) { path += `M${number(x)} ${number(y)}`; },
  lineTo(x, y) { path += `L${number(x)} ${number(y)}`; },
  closePath() { path += 'Z'; },
  fill() {},
  stroke() { paths.push(`<path d="${path}" fill="${this.fillStyle}" stroke="${this.strokeStyle}" stroke-width=".6"/>`); }
};
const mesh = MeshDentArch.createGeometry({ columns: 16, rows: 6, capRings: 5, gumSegments: 80, gumRows: 6, palateRows: 24, palateCols: 12 });
MeshDentArch.createRenderer(context, mesh).draw({ width: 640, height: 510, yaw: -.22, pitch: .64, roll: -.055, wire: false });
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 510" width="640" height="510" aria-hidden="true"><g stroke-linejoin="round">${paths.join('')}</g></svg>`;
fs.writeFileSync(new URL('./prototype/dental-arch-fallback.svg', import.meta.url), svg);
console.log(JSON.stringify({ fallbackPaths: paths.length, bytes: Buffer.byteLength(svg) }));

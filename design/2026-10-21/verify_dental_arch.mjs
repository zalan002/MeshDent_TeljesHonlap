import assert from 'node:assert/strict';
import fs from 'node:fs';
import './prototype/dental-arch.js';

const mesh = MeshDentArch.createGeometry();
assert.equal(mesh.toothCount, 16);
assert.deepEqual(mesh.teeth.map(t => t.fdi), [11,12,13,14,15,16,17,18,21,22,23,24,25,26,27,28]);
assert(mesh.vertices.every(v => v.length === 3 && v.every(Number.isFinite)));
assert(mesh.faces.every(f => f.indices.every(id => Number.isInteger(id) && mesh.vertices[id])));

// Every crown edge has exactly two incident faces: no holes at the incisal/occlusal cap.
for (const tooth of mesh.teeth) {
  const incidence = new Map();
  for (const face of mesh.faces.filter(f => f.owner === tooth.fdi)) {
    for (let i = 0; i < face.indices.length; i++) {
      const edge = [face.indices[i], face.indices[(i + 1) % face.indices.length]].sort((a,b) => a-b).join(':');
      incidence.set(edge, (incidence.get(edge) || 0) + 1);
    }
  }
  assert([...incidence.values()].every(n => n === 2), `Open or non-manifold crown: ${tooth.fdi}`);
}
// Bilateral symmetry is geometric, including cusps and marginal reliefs.
for (let i = 0; i < 8; i++) {
  const a = mesh.teeth[i], b = mesh.teeth[i + 8];
  assert.equal(a.lastVertex - a.firstVertex, b.lastVertex - b.firstVertex);
  for (let j = 0; j <= a.lastVertex - a.firstVertex; j++) {
    const left = mesh.vertices[a.firstVertex + j], right = mesh.vertices[b.firstVertex + j];
    assert(Math.abs(left[0] + right[0]) < 1e-9 && Math.abs(left[1] - right[1]) < 1e-9 && Math.abs(left[2] - right[2]) < 1e-9);
  }
}
// Motion extremes and preset cameras must stay in frame on narrow and wide screens.
const noop = () => {};
const ctx = { clearRect:noop, beginPath:noop, moveTo:noop, lineTo:noop, closePath:noop, fill:noop, stroke:noop };
const renderer = MeshDentArch.createRenderer(ctx, mesh);
const views = [
  {yaw:-.26,pitch:.62,roll:-.06}, {yaw:0,pitch:.02,roll:0}, {yaw:0,pitch:1.5,roll:0},
  {yaw:-.535,pitch:.765,roll:-.072}, {yaw:.015,pitch:.475,roll:-.048}
];
const bounds = [];
for (const [width,height] of [[672,510],[382,350],[312,350],[300,410]]) for (const view of views) {
  const result = renderer.draw({width,height,...view});
  const xs=result.projected.map(p=>p[0]), ys=result.projected.map(p=>p[1]);
  const b = {width,height,view,minX:Math.min(...xs),maxX:Math.max(...xs),minY:Math.min(...ys),maxY:Math.max(...ys)};
  assert(b.minX >= 0 && b.maxX <= width && b.minY >= 30 && b.maxY <= height - 28, `Clipped arch: ${JSON.stringify(b)}`);
  bounds.push(b);
}
const report = { result:'PASS', toothCount:16, watertightCrowns:16, mirroredPairs:8, vertices:mesh.vertices.length, faces:mesh.faces.length, cameraViewportChecks:bounds.length, bounds };
fs.writeFileSync(new URL('./fogiv-03-geometria.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({ ...report, bounds:undefined }));

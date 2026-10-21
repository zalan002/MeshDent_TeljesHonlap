/* Idealized permanent maxillary arch. Original procedural illustration, not scan data.
 * Coordinates use millimetre-like design units, not clinical measurements.
 * +Y points towards the occlusal surface; +Z points labially at the midline.
 * Mirrored FDI quadrants 1/2, including third molars. No external dependencies.
 */
(() => {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const sq = v => v * v;
  const signedPower = (v, p) => Math.sign(v) * Math.pow(Math.abs(v), p);
  const gaussian = (u, v, x, z, sx, sz) => Math.exp(-sq((u - x) / sx) - sq((v - z) / sz));
  const normalize = v => { const n = Math.hypot(...v) || 1; return v.map(x => x / n); };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const subtract = (a, b) => a.map((v, i) => v - b[i]);

  // Width (mesiodistal), depth (buccopalatal), crown height, incisal/cusp level.
  // Separate classes preserve lateral-incisor size, canine eminence and posterior cusp anatomy.
  const TYPES = [
    { type: 'central-incisor', name: 'Középső metszőfog', width: 8.5, depth: 7.0, height: 10.5, level: 4.8, tip: .055 },
    { type: 'lateral-incisor', name: 'Oldalsó metszőfog', width: 6.5, depth: 6.2, height: 9.0, level: 4.0, tip: .045 },
    { type: 'canine', name: 'Szemfog', width: 7.5, depth: 8.0, height: 10.0, level: 4.8, tip: .03 },
    { type: 'first-premolar', name: 'Első kisőrlő', width: 7.0, depth: 9.0, height: 8.5, level: 3.9, tip: .025 },
    { type: 'second-premolar', name: 'Második kisőrlő', width: 6.8, depth: 9.0, height: 8.0, level: 3.7, tip: .02 },
    { type: 'first-molar', name: 'Első nagyőrlő', width: 10.3, depth: 11.3, height: 7.5, level: 3.5, tip: .025 },
    { type: 'second-molar', name: 'Második nagyőrlő', width: 9.4, depth: 10.5, height: 7.0, level: 3.2, tip: .02 },
    { type: 'third-molar', name: 'Harmadik nagyőrlő', width: 8.6, depth: 9.5, height: 6.7, level: 2.9, tip: .02 }
  ];

  // Anterior ellipse, followed by near-parallel posterior segments; spacing is by arc length.
  const arc = [{ s: 0, x: 0, z: 24, tx: 1, tz: 0 }];
  for (let i = 1; i <= 400; i++) {
    const a = i / 400 * Math.PI / 2;
    const x = 28 * Math.sin(a), z = 24 - 38 * (1 - Math.cos(a));
    const previous = arc[arc.length - 1];
    const length = Math.hypot(28 * Math.cos(a), -38 * Math.sin(a));
    arc.push({ s: previous.s + Math.hypot(x - previous.x, z - previous.z), x, z, tx: 28 * Math.cos(a) / length, tz: -38 * Math.sin(a) / length });
  }
  function archAt(s) {
    s = Math.abs(s);
    const end = arc[arc.length - 1];
    if (s >= end.s) return { x: end.x, z: end.z - (s - end.s), tx: 0, tz: -1 };
    let lo = 0, hi = arc.length - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (arc[mid].s < s) lo = mid; else hi = mid; }
    const a = arc[lo], b = arc[hi], t = (s - a.s) / (b.s - a.s);
    return Object.fromEntries(['x', 'z', 'tx', 'tz'].map(k => [k, a[k] + (b[k] - a[k]) * t]));
  }

  function createGeometry({ columns = 24, rows = 10, capRings = 8, gumSegments = 160, gumRows = 10, palateRows = 40, palateCols = 16 } = {}) {
    const vertices = [], faces = [], teeth = [];
    const addPoint = p => { vertices.push(p); return vertices.length - 1; };
    function addFace(indices, material, owner, expected) {
      const a = vertices[indices[0]], b = vertices[indices[1]], c = vertices[indices[2]];
      let normal = normalize(cross(subtract(b, a), subtract(c, a)));
      if (normal.every(x => x === 0)) return;
      if (normal.reduce((sum, v, i) => sum + v * expected[i], 0) < 0) {
        indices = indices.slice().reverse(); normal = normal.map(v => -v);
      }
      const center = [0, 1, 2].map(k => indices.reduce((sum, id) => sum + vertices[id][k], 0) / indices.length);
      faces.push({ indices, normal, center, material, owner });
    }
    let s = .04;
    const positions = TYPES.map((t, index) => {
      const center = s + t.width / 2;
      s += t.width + .07;
      return { ...t, index, s: center, ...archAt(center) };
    });
    const transform = (tooth, u, y, v) => {
      const n = [-tooth.tz, tooth.tx];
      v += (y - (tooth.level - tooth.height)) * tooth.tip;
      return [tooth.side * (tooth.x + tooth.tx * u + n[0] * v), y, tooth.z + tooth.tz * u + n[1] * v];
    };
    const normalAt = (tooth, u, y, v) => [tooth.side * (tooth.tx * u - tooth.tz * v), y, tooth.tz * u + tooth.tx * v];

    for (const side of [-1, 1]) for (const position of positions) {
      const tooth = { ...position, side, fdi: (side < 0 ? 10 : 20) + position.index + 1, firstVertex: vertices.length };
      const { width: w, depth: d, height: h, index } = tooth;
      const anterior = index < 3, incisor = index < 2;
      const exponent = incisor ? (index === 0 ? .53 : .65) : index === 2 ? .78 : .70;
      // Anterior incisal edges are thin blades. Canine has one off-centre cusp.
      function outline(theta, t = 1) {
        const cos = Math.cos(theta), sin = Math.sin(theta);
        let wp, dp;
        if (incisor) {
          wp = .66 + .34 * Math.sin(t * Math.PI * .65);
          dp = (.68 + .28 * Math.sin(t * Math.PI)) * (1 - .78 * Math.pow(t, 2.1));
        } else if (index === 2) {
          wp = .65 + .35 * Math.sin(t * Math.PI * .71);
          dp = (.70 + .30 * Math.sin(t * Math.PI)) * (1 - .72 * Math.pow(t, 2));
        } else {
          wp = .70 + .31 * Math.sin(t * Math.PI * .70);
          dp = .70 + .30 * Math.sin(t * Math.PI * .68);
        }
        let u = signedPower(cos, exponent) * w / 2 * wp;
        let v = signedPower(sin, exponent) * d / 2 * dp;
        // Distolingual reduction: strongest at third molar, modest at second molar.
        if (index >= 6 && u > 0 && v < 0) {
          const reduction = (index === 7 ? .20 : .09) * (u / (w / 2)) * (-v / (d / 2));
          u *= 1 - reduction; v *= 1 - reduction;
        }
        if (anterior) {
          const x = u / (w / 2);
          if (sin > 0) {
            // Labial convexity and three subtle developmental lobes; no spherical ends.
            v += .13 * Math.cos(x * Math.PI * 2.4) * Math.sin(t * Math.PI) * sin;
            if (index === 2) v += .32 * Math.exp(-sq(x * 2.2)) * Math.sin(t * Math.PI);
          } else {
            const marginal = Math.pow(Math.abs(x), 3);
            v -= .55 * Math.exp(-sq((t - .24) / .18)) * (1 - x * x);
            v += .45 * Math.exp(-sq((t - .62) / .22)) * (1 - marginal);
          }
        } else if (index >= 5) {
          // Buccal developmental groove separates the two buccal lobes.
          v -= .16 * Math.exp(-sq(u / (w * .10))) * Math.max(0, sin) * Math.pow(t, 1.8);
        }
        return [u, v];
      }
      function occlusal(u, v) {
        if (incisor) {
          const edge = Math.abs(u) / (w / 2);
          return tooth.level - (u > 0 ? .55 : .24) * Math.pow(edge, 5) - .12 * sq(v);
        }
        if (index === 2) {
          // Shorter mesial cusp ridge, longer distal cusp ridge.
          return tooth.level - 2.35 * Math.pow(Math.abs((u + .35) / (w / 2)), 1.14) - .18 * sq(v);
        }
        let y = tooth.level - 2.25;
        if (index < 5) {
          y += 2.05 * gaussian(u, v, -.04 * w, .27 * d, .26 * w, .25 * d);
          y += (index === 3 ? 1.65 : 1.95) * gaussian(u, v, -.02 * w, -.27 * d, .29 * w, .25 * d);
          // Mesial/distal marginal ridges close the occlusal table around the central fissure.
          y += .65 * Math.exp(-sq((Math.abs(u) - .37 * w) / (.10 * w))) * Math.exp(-sq(v / (.39 * d)));
          y -= .24 * Math.exp(-sq(v / (.045 * d))) * Math.exp(-Math.pow(u / (.32 * w), 4));
        } else {
          const cusps = [[-.25, .25, 1.85], [.24, .24, 1.65], [-.23, -.27, 2.22]];
          if (index < 7) cusps.push([.24, -.25, index === 5 ? 1.75 : 1.20]);
          for (const [x, z, amplitude] of cusps) y += amplitude * gaussian(u, v, x * w, z * d, .22 * w, .23 * d);
          // Maxillary oblique ridge: mesiopalatal to distobuccal.
          y += .56 * Math.exp(-sq((v / d - u / w) / .105)) * Math.exp(-sq(u / (.32 * w)) - sq(v / (.32 * d)));
          y += .40 * Math.exp(-sq((Math.abs(u) - .39 * w) / (.08 * w))) * Math.exp(-sq(v / (.38 * d)));
          y -= .17 * Math.exp(-sq(v / (.045 * d))) * Math.exp(-sq(u / (.38 * w)));
          // Small Carabelli relief on the first molar's mesiopalatal region.
          if (index === 5) y += .32 * gaussian(u, v, -.32 * w, -.42 * d, .12 * w, .12 * d);
        }
        return y;
      }
      const body = [];
      for (let row = 0; row <= rows; row++) {
        const t = row / rows, ring = [];
        for (let col = 0; col < columns; col++) {
          const theta = col / columns * TAU, [u, v] = outline(theta, t), [edgeU, edgeV] = outline(theta);
          const cervical = tooth.level - h + 1.35 * Math.pow(Math.abs(Math.cos(theta)), 4);
          const y = cervical * (1 - t) + occlusal(edgeU, edgeV) * t;
          ring.push(addPoint(transform(tooth, u, y, v)));
        }
        body.push(ring);
      }
      for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
        const next = (col + 1) % columns, angle = (col + .5) / columns * TAU;
        addFace([body[row][col], body[row][next], body[row + 1][next], body[row + 1][col]], 'enamel', tooth.fdi, normalAt(tooth, Math.cos(angle), 0, Math.sin(angle)));
      }
      // Shared boundary vertices give a watertight crown; top is a sculpted occlusal table.
      const caps = [body[rows]];
      for (let ring = 1; ring < capRings; ring++) {
        const r = 1 - ring / capRings, ids = [];
        for (let col = 0; col < columns; col++) {
          let [u, v] = outline(col / columns * TAU); u *= r; v *= r;
          ids.push(addPoint(transform(tooth, u, occlusal(u, v), v)));
        }
        caps.push(ids);
      }
      const center = addPoint(transform(tooth, 0, occlusal(0, 0), 0));
      for (let ring = 0; ring < caps.length; ring++) for (let col = 0; col < columns; col++) {
        const next = (col + 1) % columns;
        const ids = ring === caps.length - 1 ? [caps[ring][col], caps[ring][next], center] : [caps[ring][col], caps[ring][next], caps[ring + 1][next], caps[ring + 1][col]];
        addFace(ids, 'enamel', tooth.fdi, [0, 1, 0]);
      }
      const neckCenter = addPoint(transform(tooth, 0, tooth.level - h, 0));
      for (let col = 0; col < columns; col++) addFace([body[0][col], neckCenter, body[0][(col + 1) % columns]], 'enamel', tooth.fdi, [0, -1, 0]);
      tooth.lastVertex = vertices.length - 1;
      teeth.push({ fdi: tooth.fdi, type: tooth.type, name: tooth.name, side, width: w, depth: d, height: h, center: transform(tooth, 0, tooth.level - h / 2, 0), firstVertex: tooth.firstVertex, lastVertex: tooth.lastVertex });
    }

    // Scalloped gingival band: cervical zeniths, interdental papillae, tapered distal ends.
    // It follows the same arc-length positions as the crowns, never a floating torus.
    const total = s + 1.2, segments = gumSegments, gum = [];
    function gingivalProfile(distance) {
      let a = positions[0], b = positions[0], t = 0, papilla;
      if (distance < a.s) papilla = Math.pow(Math.cos(distance / a.s * Math.PI / 2), 3);
      else {
        for (let i = 0; i < positions.length - 1; i++) {
          if (distance >= positions[i].s) { a = positions[i]; b = positions[i + 1]; }
        }
        t = clamp((distance - a.s) / (b.s - a.s), 0, 1);
        papilla = Math.pow(Math.sin(t * Math.PI), 3);
      }
      return {
        depth: a.depth * (1 - t) + b.depth * t,
        margin: (a.level - a.height) * (1 - t) + (b.level - b.height) * t + 2.4 * papilla,
        prominence: .38 * Math.exp(-sq((distance - positions[2].s) / 4))
      };
    }
    for (let i = 0; i <= segments; i++) {
      const signedS = -total + 2 * total * i / segments, sign = signedS < 0 ? -1 : 1;
      const p = archAt(signedS), profile = gingivalProfile(Math.abs(signedS));
      const endScale = Math.sqrt(Math.max(.025, 1 - sq(Math.max(0, Math.abs(signedS) - (total - 3.5)) / 3.7)));
      const ring = [];
      for (let j = 0; j <= gumRows; j++) {
        const t = j / gumRows, angle = t * Math.PI;
        const offset = Math.cos(angle) * (profile.depth * .36 + .25 + profile.prominence) * endScale;
        const crest = Math.pow(Math.sin(angle), .75) * endScale;
        const y = profile.margin * (1 - crest) - 13.6 * crest;
        ring.push(addPoint([sign * (p.x - p.tz * offset), y, p.z + p.tx * offset]));
      }
      gum.push(ring);
    }
    for (let i = 0; i < segments; i++) for (let j = 0; j < gumRows; j++) {
      const ids = [gum[i][j], gum[i + 1][j], gum[i + 1][j + 1], gum[i][j + 1]];
      const a = (j + .5) / gumRows * Math.PI;
      const signedS = -total + 2 * total * (i + .5) / segments, p = archAt(signedS), sign = signedS < 0 ? -1 : 1;
      addFace(ids, 'gingiva', 0, [sign * -p.tz * Math.cos(a), -Math.sin(a), p.tx * Math.cos(a)]);
    }
    // A recessed palatal vault links the inner margins. Visible from the occlusal view.
    const palate = [];
    for (let row = 0; row <= palateRows; row++) {
      const t = row / palateRows, p = archAt(t * total), profile = gingivalProfile(t * total);
      const endScale = Math.sqrt(Math.max(.025, 1 - sq(Math.max(0, t * total - (total - 3.5)) / 3.7)));
      const offset = (profile.depth * .36 + .25 + profile.prominence) * endScale;
      const halfWidth = Math.max(.025, p.x + p.tz * offset), z = p.z - p.tx * offset;
      const ring = [];
      for (let col = 0; col <= palateCols; col++) {
        const u = col / palateCols * 2 - 1;
        const vault = (1 - Math.pow(Math.abs(u), 3.5)) * Math.min(1, t * 8);
        let y = profile.margin * (1 - vault) + (-12.2 + 3.5 * t * t) * vault;
        y += .14 * Math.cos(u * 7 + t * 50) * Math.exp(-sq((t - .2) / .2)) * Math.abs(u);
        ring.push(addPoint([halfWidth * u, y, z + 3.5 * Math.pow(t, 6) * (1 - u * u)]));
      }
      palate.push(ring);
    }
    for (let row = 0; row < palateRows; row++) for (let col = 0; col < palateCols; col++) addFace([palate[row][col], palate[row + 1][col], palate[row + 1][col + 1], palate[row][col + 1]], 'palate', 0, [0, 1, 0]);
    return { vertices, faces, teeth, units: 'illustrative-mm', arch: 'maxillary', toothCount: teeth.length };
  }

  function createRenderer(ctx, geometry = createGeometry()) {
    const { vertices, faces } = geometry;
    const projected = vertices.map(() => [0, 0, 0]);
    const visible = faces.map(face => ({ face, depth: 0, color: '', light: 0 })).slice();
    const palette = {}, wirePalette = {};
    for (const material of ['enamel', 'gingiva', 'palate']) {
      palette[material] = Array.from({ length: 64 }, (_, i) => {
        const light = i / 63;
        const dark = material === 'enamel' ? [86, 121, 93] : material === 'gingiva' ? [17, 48, 36] : [12, 39, 30];
        const bright = material === 'enamel' ? [229, 242, 204] : material === 'gingiva' ? [85, 139, 92] : [40, 81, 53];
        return `rgb(${dark.map((v, k) => Math.round(v + (bright[k] - v) * light)).join(',')})`;
      });
      wirePalette[material] = palette[material].map(color => color.replace(/\d+/g, value => String(Math.min(255, Number(value) + (material === 'enamel' ? 7 : 4)))));
    }
    function draw({ width, height, yaw = -.25, pitch = .62, roll = -.06, phase = 0, wire = true }) {
      const ca = Math.cos(yaw), sa = Math.sin(yaw), cb = Math.cos(pitch), sb = Math.sin(pitch), cc = Math.cos(roll), sc = Math.sin(roll);
      const transform = ([x, y, z]) => {
        const a = x * ca + z * sa, b = z * ca - x * sa, c = y * cb - b * sb;
        return [a * cc - c * sc, a * sc + c * cc, y * sb + b * cb];
      };
      // Stable framing across all views: actual anatomy determines proportions, not viewport stretching.
      const scale = Math.min(width / 84, height / 67);
      for (let i = 0; i < vertices.length; i++) {
        const [x, y, z] = transform(vertices[i]), perspective = 260 / (260 - z);
        projected[i][0] = width * .50 + x * scale * perspective;
        projected[i][1] = height * .50 + (y + 2.4) * scale * perspective;
        projected[i][2] = z;
      }
      let count = 0;
      for (const face of faces) {
        const normal = transform(face.normal);
        if (normal[2] < -.035) continue;
        const item = visible[count++]; item.face = face;
        item.depth = face.indices.reduce((sum, id) => sum + projected[id][2], 0) / face.indices.length;
        const diffuse = clamp(normal[0] * -.32 + normal[1] * -.45 + normal[2] * .83, 0, 1);
        const rim = .10 * Math.pow(1 - Math.abs(normal[2]), 2);
        item.light = clamp(.28 + diffuse * .68 + rim, 0, 1);
        item.color = palette[face.material][Math.round(item.light * 63)];
        item.wireColor = wirePalette[face.material][Math.round(item.light * 63)];
      }
      const sorted = visible.slice(0, count).sort((a, b) => a.depth - b.depth);
      ctx.clearRect(0, 0, width, height);
      ctx.lineJoin = 'round';
      for (const { face, color, wireColor } of sorted) {
        ctx.beginPath();
        face.indices.forEach((id, index) => { const p = projected[id]; index ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); });
        ctx.closePath(); ctx.fillStyle = color; ctx.fill();
        // One seam/mesh pass avoids a second alpha-blended stroke on every face.
        ctx.strokeStyle = wire ? wireColor : color;
        ctx.lineWidth = .55; ctx.stroke();
      }
      return { visibleFaces: count, scale, projected };
    }
    return { draw, geometry };
  }
  globalThis.MeshDentArch = Object.freeze({ createGeometry, createRenderer, types: TYPES });
})();

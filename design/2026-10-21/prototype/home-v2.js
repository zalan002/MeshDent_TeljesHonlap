// Decorative, parametric dental-arch illustration. This is not a patient scan.
(() => {
  const root = document.querySelector('.home-v2');
  if (!root) return;
  const canvas = document.querySelector('#dental-mesh');
  const scene = document.querySelector('#dental-scene');
  const toggle = document.querySelector('#motion-toggle');
  const description = document.querySelector('#scene-description');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let visible = true;
  let view = 'mesh';
  let frame = 0;
  let phase = .8;
  let previous = 0;
  let pointerX = 0, pointerY = 0, smoothX = 0, smoothY = 0;
  let width = 600, height = 510;
  const ctx = canvas?.getContext('2d', { alpha: true });
  const renderer = ctx && globalThis.MeshDentArch?.createRenderer(ctx);
  let angle = 'spatial';
  const poses = {
    spatial: { yaw: -.26, pitch: .62, roll: -.06 },
    front: { yaw: 0, pitch: .02, roll: 0 },
    occlusal: { yaw: 0, pitch: 1.50, roll: 0 }
  };
  function draw() {
    if (!renderer) return;
    const pose = poses[angle];
    const motion = angle === 'spatial' ? 1 : .12;
    renderer.draw({ width, height, phase,
      yaw: pose.yaw + (Math.sin(phase) * .075 + smoothX * .20) * motion,
      pitch: pose.pitch + (Math.cos(phase * .7) * .025 + smoothY * .12) * motion,
      roll: pose.roll + Math.sin(phase * .6) * .012 * motion
    });
  }
  function tick(time) {
    frame = 0;
    if (paused || !visible || document.hidden || view !== 'mesh') return;
    if (!previous || time - previous >= 32) {
      const delta = previous ? Math.min(time - previous, 80) : 32;
      phase += delta * .00018;
      smoothX += (pointerX - smoothX) * .09;
      smoothY += (pointerY - smoothY) * .09;
      previous = time;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }
  function syncMotion() {
    cancelAnimationFrame(frame); frame = 0; previous = 0;
    root.dataset.motion = paused ? 'paused' : 'running';
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Animáció indítása' : 'Animáció szüneteltetése');
    toggle.querySelector('span').textContent = '';
    toggle.querySelector('.h-motion-label').textContent = paused ? 'Mozgás indítása' : 'Mozgás szüneteltetése';
    if (renderer && !paused && visible && !document.hidden && view === 'mesh') frame = requestAnimationFrame(tick);
    else draw();
  }
  if (renderer) {
    scene.classList.add('has-canvas');
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const ratio = Math.min(devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0); draw();
    };
    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncMotion(); }, { threshold: .05 }).observe(scene);
    scene.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || paused) return;
      const rect = scene.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - .5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - .5) * 2;
    });
    scene.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; });
    resize();
  } else { paused = true; toggle.hidden = true; }
  toggle.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reducedMotion.addEventListener('change', event => { paused = event.matches; syncMotion(); });
  document.addEventListener('visibilitychange', syncMotion);
  document.querySelectorAll('[data-scene-view]').forEach(button => button.addEventListener('click', () => {
    view = button.dataset.sceneView;
    scene.dataset.view = view;
    document.querySelectorAll('[data-scene-view]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    description.textContent = view === 'mesh' ? 'Idealizált felső fogív · 16 fog' : 'Valódi fogpótlás · MeshDent referencia';
    document.querySelector('.h-angle-switch').hidden = view !== 'mesh';
    syncMotion();
  }));
  document.querySelectorAll('[data-arch-angle]').forEach(button => button.addEventListener('click', () => {
    angle = button.dataset.archAngle;
    scene.dataset.angle = angle;
    pointerX = pointerY = smoothX = smoothY = 0;
    document.querySelectorAll('[data-arch-angle]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    draw();
  }));
  syncMotion();

  document.querySelectorAll('[data-step]').forEach(detail => detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelector('#process-number').textContent = detail.dataset.step;
    document.querySelector('#process-word').textContent = detail.dataset.word;
  }));
  const serviceImage = document.querySelector('#service-preview');
  document.querySelectorAll('[data-service-image]').forEach(link => {
    const preview = () => {
      serviceImage.src = link.dataset.serviceImage;
      serviceImage.alt = link.dataset.serviceAlt;
      document.querySelector('#service-preview-title').textContent = link.dataset.serviceTitle;
    };
    link.addEventListener('pointerenter', event => {
      const focused = document.activeElement;
      if (focused?.matches('.h-service-row:focus-visible') && focused !== link) return;
      if (event.pointerType === 'mouse') preview();
    });
    link.addEventListener('focus', preview);
  });
})();

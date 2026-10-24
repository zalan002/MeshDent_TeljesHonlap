/* Progressive enhancements: native anchors and full copy work without JavaScript. */
(() => {
  const process = document.querySelector('.process-home');
  if (process) {
    const story = process.querySelector('.p-story-grid');
    const steps = [...process.querySelectorAll('[data-story-step]')];
    const frames = [...process.querySelectorAll('[data-frame]')];
    const chapters = [...process.querySelectorAll('[data-chapter]')];
    const number = process.querySelector('.p-frame-number');
    const desktop = window.matchMedia('(min-width: 641px)');
    let active = -1;
    let queued = false;
    const update = () => {
      queued = false;
      if (!desktop.matches || document.hidden) return;
      const bounds = story.getBoundingClientRect();
      if (bounds.top > innerHeight || bounds.bottom < 0) return;
      const line = innerHeight * .54;
      let nearest = 0;
      let distance = Infinity;
      steps.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        const candidate = Math.abs((rect.top + rect.bottom) / 2 - line);
        if (candidate < distance) { nearest = index; distance = candidate; }
      });
      if (nearest === active) return;
      active = nearest;
      frames.forEach((frame, index) => {
        frame.classList.toggle('is-active', index === active);
        frame.setAttribute('aria-hidden', String(index !== active));
      });
      chapters.forEach((chapter, index) => {
        if (index === active) chapter.setAttribute('aria-current', 'step');
        else chapter.removeAttribute('aria-current');
      });
      number.textContent = String(active + 1).padStart(2, '0');
    };
    const schedule = () => {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    desktop.addEventListener('change', schedule);
    process.classList.add('has-story');
    schedule();
  }

  const connected = document.querySelector('.connected-home');
  if (connected) {
    const diagram = connected.querySelector('[data-connection-diagram]');
    const controls = connected.querySelector('.c-network-controls');
    const buttons = [...connected.querySelectorAll('[data-connection]')];
    const details = [...connected.querySelectorAll('[data-connection-detail]')];
    const motion = connected.querySelector('[data-network-motion]');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reduced.matches;
    const select = (index) => {
      diagram.dataset.active = String(index);
      buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      details.forEach((detail, i) => { detail.hidden = i !== index; });
    };
    const syncMotion = () => {
      connected.classList.toggle('is-paused', paused || reduced.matches);
      motion.hidden = reduced.matches;
      motion.setAttribute('aria-pressed', String(paused));
      motion.textContent = paused ? 'Mozgás indítása' : 'Mozgás szüneteltetése';
    };
    buttons.forEach((button, i) => button.addEventListener('click', () => select(i)));
    motion.addEventListener('click', () => { paused = !paused; syncMotion(); });
    reduced.addEventListener('change', syncMotion);
    let inView = true;
    const syncVisibility = () => connected.classList.toggle('is-offscreen', !inView || document.hidden);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        inView = entries[0].isIntersecting;
        syncVisibility();
      });
      observer.observe(diagram);
    }
    document.addEventListener('visibilitychange', syncVisibility);
    select(0);
    syncMotion();
    syncVisibility();
    controls.hidden = false;
    connected.classList.add('has-connections');
  }
})();

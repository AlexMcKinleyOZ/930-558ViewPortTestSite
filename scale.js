(() => {
  const DESIGN_W = 930;
  const DESIGN_H = 558;
  const container = document.querySelector('.game-container');
  const viewport = document.getElementById('viewport');

  function applyScale() {
    if (!container || !viewport) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / DESIGN_W, vh / DESIGN_H);

    // Apply scale and center the canvas inside #viewport
    container.style.transform = `scale(${scale})`;

    // Use absolute positioning to center independently from document flow
    const scaledW = DESIGN_W * scale;
    const scaledH = DESIGN_H * scale;
    const offsetX = Math.round(Math.max(0, (vw - scaledW) / 2));
    const offsetY = Math.round(Math.max(0, (vh - scaledH) / 2));

    container.style.position = 'absolute';
    container.style.left = offsetX + 'px';
    container.style.top = offsetY + 'px';

    // expose for other scripts
    window.GAME_SCALE = scale;
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyScale);
  } else {
    applyScale();
  }

  // Reapply on resize and orientation change
  window.addEventListener('resize', applyScale);
  window.addEventListener('orientationchange', () => setTimeout(applyScale, 200));

  // Optional: prevent the page from scaling via pinch
  document.addEventListener('gesturestart', e => e.preventDefault());
})();

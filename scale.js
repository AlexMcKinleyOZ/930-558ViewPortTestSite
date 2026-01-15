(() => {
  const DESIGN_W = 930;
  const DESIGN_H = 558;
  const container = document.querySelector('.game-container');
  const viewport = document.getElementById('viewport');

  function applyScale() {
    if (!container || !viewport) return;

    const vw = window.innerWidth;
    // Scale based on width with some padding to prevent edge cutoff
    const scale = Math.min(1, (vw - 40) / DESIGN_W);

    // Apply scale from top-left to avoid centering issues
    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = 'top left';

    // Use relative positioning to allow natural document flow and scrolling  
    container.style.position = 'relative';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = DESIGN_W + 'px';
    container.style.minHeight = DESIGN_H + 'px'; // Min height, can grow
    
    // Manually center the scaled container
    const scaledW = DESIGN_W * scale;
    const leftOffset = Math.max(0, (vw - scaledW) / 2);
    container.style.marginLeft = leftOffset + 'px';
    container.style.marginRight = 'auto';

    // Reset viewport padding
    viewport.style.paddingLeft = '0';
    viewport.style.paddingRight = '0';

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

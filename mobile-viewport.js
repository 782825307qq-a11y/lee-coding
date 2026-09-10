// Runs synchronously in <head>, before layout and application initialization.
(() => {
  const narrowPreview = Math.min(window.innerWidth, window.innerHeight) <= 1024;
  const touchDevice = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  const touchLayout = narrowPreview || (touchDevice && Math.min(screen.width, screen.height) <= 1024);
  window.portfolioTouchLayout = touchLayout;
  if (!touchLayout) return;
  document.documentElement.classList.add('touch-layout');
  const viewport = document.querySelector('meta[name="viewport"]');
  // Let the browser fit the full 1920px desktop composition to the device width.
  // No scale limits: pinch zoom
  // remains native, and rotation does not overwrite a user-selected zoom.
  viewport.setAttribute('content', 'width=1920');
})();

// Keep off-screen movies out of the initial request queue. The source files,
// playback rate, resolution and loops are unchanged.
(() => {
  function hydrate(video) {
    if (!video) return;
    const sources = [...video.querySelectorAll('source[data-src]')];
    if (!sources.length) return;
    sources.forEach(source => {
      source.src = source.dataset.src;
      delete source.dataset.src;
    });
    video.preload = 'metadata';
    video.load();
  }
  window.hydrateDeferredVideo = hydrate;
  const videos = [...document.querySelectorAll('video[data-deferred]')];
  const visible = new Set();
  const prepare = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      hydrate(entry.target);
      prepare.unobserve(entry.target);
    });
  }, { rootMargin: '600px 0px' });
  const playback = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) visible.add(target);
      else visible.delete(target);
      if (!target.hasAttribute('data-autoplay')) return;
      if (isIntersecting && !document.hidden) {
        hydrate(target);
        target.play().catch(() => {});
      } else target.pause();
    });
  });
  videos.forEach(video => { prepare.observe(video); playback.observe(video); });
  document.addEventListener('visibilitychange', () => {
    videos.filter(video => video.hasAttribute('data-autoplay')).forEach(video => {
      if (!document.hidden && visible.has(video)) video.play().catch(() => {});
      else video.pause();
    });
  });
})();

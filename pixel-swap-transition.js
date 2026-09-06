(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("transition") !== "pixel") return;

  const root = document.documentElement;
  const hero = document.querySelector("#top");
  const stage = document.querySelector(".hero-sticky");
  const cover = document.querySelector("#coverHome");
  if (!hero || !stage || !cover) return;

  root.classList.add("pixel-transition-mode");

  const MAX_PIXELS = 220;
  const KEYFRAME_STEPS = 14;
  const settings = {
    pixelSize: 64,
    gap: 0,
    pixelRadius: 0,
    pixelSpin: 0,
    pixelScale: 0.35,
    duration: 1400,
    pixelDuration: 450,
    randomness: 0,
    fade: true,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const noise = (seed) => {
    const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return value - Math.floor(value);
  };

  const makeEasing = (value) => {
    const match = /cubic-bezier\(([^)]+)\)/.exec(value);
    const points = match?.[1].split(",").map(Number);
    if (!points || points.length !== 4 || points.some(Number.isNaN)) return (progress) => progress;

    const [x1, y1, x2, y2] = points;
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;

    return (progress) => {
      let time = progress;
      for (let index = 0; index < 5; index += 1) {
        const slope = (3 * ax * time + 2 * bx) * time + cx;
        if (!slope) break;
        time -= (((ax * time + bx) * time + cx) * time - progress) / slope;
      }
      time = clamp(time, 0, 1);
      return ((ay * time + by) * time + cy) * time;
    };
  };

  const buildGrid = (width, height) => {
    let size = settings.pixelSize;
    let columns = Math.max(1, Math.ceil(width / size));
    let rows = Math.max(1, Math.ceil(height / size));

    if (columns * rows > MAX_PIXELS) {
      size = Math.ceil(size * Math.sqrt((columns * rows) / MAX_PIXELS));
      columns = Math.max(1, Math.ceil(width / size));
      rows = Math.max(1, Math.ceil(height / size));
    }

    const originX = (width - columns * size) / 2;
    const originY = (height - rows * size) / 2;
    const pixels = [];

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const id = row * columns + column;
        pixels.push({
          id,
          left: originX + column * size,
          top: originY + row * size,
          offset: noise(id + 1),
        });
      }
    }

    return { width, height, size, pixels };
  };

  const buildKeyframes = (reverse) => {
    const ease = makeEasing(settings.easing);
    const windowFrames = [];
    const contentFrames = [];

    for (let step = 0; step <= KEYFRAME_STEPS; step += 1) {
      const progress = step / KEYFRAME_STEPS;
      const eased = ease(progress);
      const scale = settings.pixelScale + (1 - settings.pixelScale) * eased;

      windowFrames.push({
        offset: progress,
        opacity: settings.fade ? Math.min(1, eased * 1.6) : 1,
        transform: `scale(${scale})`,
      });
      contentFrames.push({
        offset: progress,
        transform: `scale(${1 / scale})`,
      });
    }

    if (!reverse) return { windowFrames, contentFrames };

    const reverseFrames = (frames) =>
      frames.map((_, index) => ({
        ...frames[frames.length - 1 - index],
        offset: index / (frames.length - 1),
      }));

    return {
      windowFrames: reverseFrames(windowFrames),
      contentFrames: reverseFrames(contentFrames),
    };
  };

  const transitionLayer = document.createElement("div");
  transitionLayer.className = "pixel-swap-transition";
  transitionLayer.hidden = true;
  transitionLayer.setAttribute("aria-hidden", "true");
  stage.append(transitionLayer);

  let active = false;
  let desiredActive = false;
  let transitioning = false;
  let animations = [];
  let timer = 0;
  let initialized = false;

  const clearTransition = () => {
    animations.forEach((animation) => animation.cancel());
    animations = [];
    window.clearTimeout(timer);
    timer = 0;
    transitionLayer.replaceChildren();
    transitionLayer.hidden = true;
  };

  const prepareSnapshot = () => {
    const snapshot = cover.cloneNode(true);
    snapshot.classList.add("pixel-swap__snapshot");
    snapshot.removeAttribute("id");
    snapshot.setAttribute("aria-hidden", "true");
    snapshot.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    snapshot.querySelectorAll("a, button, input, video").forEach((element) => element.setAttribute("tabindex", "-1"));
    return snapshot;
  };

  const setActiveImmediately = (nextActive) => {
    clearTransition();
    active = nextActive;
    desiredActive = nextActive;
    transitioning = false;
    root.classList.toggle("pixel-cover-active", nextActive);
  };

  const runTransition = (nextActive) => {
    if (transitioning || nextActive === active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveImmediately(nextActive);
      return;
    }

    transitioning = true;
    transitionLayer.hidden = false;
    const grid = buildGrid(stage.clientWidth, stage.clientHeight);
    const gridElement = document.createElement("div");
    gridElement.className = "pixel-swap__grid";
    transitionLayer.append(gridElement);

    if (!nextActive) root.classList.remove("pixel-cover-active");

    const { windowFrames, contentFrames } = buildKeyframes(!nextActive);
    const pixelMs = clamp(settings.pixelDuration, 60, settings.duration);
    const spread = Math.max(0, settings.duration - pixelMs);

    grid.pixels.forEach((pixel) => {
      const pixelElement = document.createElement("div");
      pixelElement.className = "pixel-swap__pixel";
      pixelElement.style.left = `${pixel.left}px`;
      pixelElement.style.top = `${pixel.top}px`;
      pixelElement.style.width = `${grid.size}px`;
      pixelElement.style.height = `${grid.size}px`;
      pixelElement.style.borderRadius = `${settings.pixelRadius}%`;

      const content = document.createElement("div");
      content.className = "pixel-swap__pixel-content";
      content.style.left = `${-pixel.left}px`;
      content.style.top = `${-pixel.top}px`;
      content.style.width = `${grid.width}px`;
      content.style.height = `${grid.height}px`;
      const originX = pixel.left + grid.size / 2;
      const originY = pixel.top + grid.size / 2;
      content.style.transformOrigin = `${originX}px ${originY}px`;
      content.append(prepareSnapshot());
      pixelElement.append(content);
      gridElement.append(pixelElement);

      const timing = {
        duration: pixelMs,
        delay: pixel.offset * spread,
        easing: "linear",
        fill: "both",
      };
      animations.push(pixelElement.animate(windowFrames, timing), content.animate(contentFrames, timing));
    });

    timer = window.setTimeout(() => {
      active = nextActive;
      root.classList.toggle("pixel-cover-active", active);
      clearTransition();
      transitioning = false;
      if (desiredActive !== active) runTransition(desiredActive);
    }, settings.duration);
  };

  const syncToScroll = () => {
    const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
    const progress = clamp((window.scrollY - hero.offsetTop) / travel, 0, 1);
    desiredActive = progress >= 0.2;

    if (!initialized) {
      initialized = true;
      setActiveImmediately(desiredActive);
      return;
    }

    if (!transitioning && desiredActive !== active) runTransition(desiredActive);
  };

  window.addEventListener("scroll", syncToScroll, { passive: true });
  window.addEventListener("resize", syncToScroll);
  window.addEventListener("pageshow", syncToScroll);
  syncToScroll();
})();

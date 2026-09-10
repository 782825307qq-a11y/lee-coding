const isGoogleChrome = (navigator.userAgentData?.brands?.some(({ brand }) => brand === "Google Chrome") ?? false)
  && window.outerWidth - window.innerWidth < 100;
document.documentElement.classList.toggle("is-google-chrome", isGoogleChrome);

// Detail pages should always enter from their designed first frame. Browsers
// otherwise restore an old deep scroll position on reload/back-forward, which
// can make the phone composition appear as a full-screen cropped error.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
function resetEntryScroll() {
  if (location.hash) return;
  window.scrollTo(0, 0);
  window.requestAnimationFrame(() => window.scrollTo(0, 0));
}
resetEntryScroll();
window.addEventListener("pageshow", resetEntryScroll);

const scenes = [
  { name: "南极冰块", src: "./assets/scenes/scene-01-ice.mp4" },
  { name: "奇石木筏", src: "./assets/scenes/scene-02-raft.mp4" },
  { name: "火山", src: "./assets/scenes/scene-06-volcano.mp4" },
  { name: "樱花气垫", src: "./assets/scenes/scene-03-sakura.mp4" },
  { name: "沙漠小船", src: "./assets/scenes/scene-05-desert-boat.mp4" },
  { name: "沙滩木椅", src: "./assets/scenes/scene-04-beach-chair.mp4" },
];

const sealActions = [
  { name: "看书", src: "./assets/seal/animated/read.webp", poster: "./assets/seal/read/000.webp", frames: 161 },
  { name: "熬夜", src: "./assets/seal/animated/late-night.webp", poster: "./assets/seal/posters/late-night.webp", frames: 444 },
  { name: "报告", src: "./assets/seal/animated/report.webp", poster: "./assets/seal/posters/report.webp", frames: 384 },
  { name: "爆炸", src: "./assets/seal/animated/explosion.webp", poster: "./assets/seal/posters/explosion.webp", frames: 468 },
  { name: "吉他", src: "./assets/seal/animated/guitar.webp", poster: "./assets/seal/posters/guitar.webp", frames: 377 },
  { name: "考神", src: "./assets/seal/animated/exam.webp", poster: "./assets/seal/posters/exam.webp", frames: 319 },
  { name: "摸鱼", src: "./assets/seal/animated/slacking.webp", poster: "./assets/seal/posters/slacking.webp", frames: 281 },
  { name: "喷雾", src: "./assets/seal/animated/spray.webp", poster: "./assets/seal/posters/spray.webp", frames: 450 },
  { name: "甩拂尘", src: "./assets/seal/animated/whisk.webp", poster: "./assets/seal/posters/whisk.webp", frames: 321 },
];

const reactionActions = [
  { name: "比心", src: "./assets/seal/animated/heart.webp", frames: 41 },
  { name: "嗨", src: "./assets/seal/animated/hi.webp", frames: 85 },
];

const stage = document.querySelector(".scene-stage");
const deviceComposition = document.querySelector(".device-composition");
const padVideo = document.querySelector("#padVideo");
const phoneVideo = document.querySelector("#phoneVideo");
const sealFrame = document.querySelector("#sealFrame");
const sceneIndex = document.querySelector("#sceneIndex");
const sceneTotal = document.querySelector("#sceneTotal");
const sceneName = document.querySelector("#sceneName");
const nextScene = document.querySelector("#nextScene");
const teaseSeal = document.querySelector("#teaseSeal");
const actionButtons = document.querySelector("#actionButtons");
const loadingScreen = document.querySelector("#loadingScreen");
const loadingProgress = document.querySelector("#loadingProgress");
const loadingPercentage = document.querySelector("#loadingPercentage");
const worldVideo = document.querySelector("#worldVideo");
const previousWorldScene = document.querySelector("#previousWorldScene");
const nextWorldScene = document.querySelector("#nextWorldScene");
const ledeSealFrame = document.querySelector("#ledeSealFrame");
const characterPortraitFrame = document.querySelector("#characterPortraitFrame");
const motionPhone = document.querySelector("#motionPhone");
const motionVideo = document.querySelector("#motionVideo");
const lazyAnimatedSeals = Array.from(document.querySelectorAll("img[data-animation-src]"));

let activeScene = 0;
let activeWorldScene = 4;
let activeAction = 0;
let isReacting = false;
let touchStartY = 0;
let reactionTimer = 0;
let sealActionRequest = 0;

sceneTotal.textContent = String(scenes.length).padStart(2, "0");

sealFrame.src = sealActions[activeAction].poster;

function setLazySealState(image, shouldAnimate) {
  const nextSource = shouldAnimate ? image.dataset.animationSrc : image.dataset.posterSrc;
  if (nextSource && image.getAttribute("src") !== nextSource) image.src = nextSource;
}

const sealAnimationVisibility = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    target.dataset.inView = isIntersecting ? "true" : "false";
    setLazySealState(target, isIntersecting && !document.hidden);
  });
}, { rootMargin: "160px 0px" });

lazyAnimatedSeals.forEach((image) => sealAnimationVisibility.observe(image));

document.addEventListener("visibilitychange", () => {
  lazyAnimatedSeals.forEach((image) => {
    setLazySealState(image, image.dataset.inView === "true" && !document.hidden);
  });
});

function playVideo(video) {
  window.hydrateDeferredVideo?.(video);
  const playPromise = video.play();
  if (playPromise) {
    playPromise.catch(() => {});
  }
}

function setWorldScene(nextIndex) {
  if (!worldVideo) return;

  activeWorldScene = (nextIndex + scenes.length) % scenes.length;
  const source = worldVideo.querySelector("source");
  source.src = scenes[activeWorldScene].src;
  delete source.dataset.src;
  worldVideo.currentTime = 0;
  worldVideo.load();
  worldVideo.addEventListener("loadedmetadata", () => playVideo(worldVideo), { once: true });
  playVideo(worldVideo);
}

function setLoadingProgress(value) {
  const progress = Math.max(0, Math.min(100, Math.round(value)));
  loadingProgress.style.width = `${progress}%`;
  loadingPercentage.textContent = `${progress}%`;
}

function waitForVideoReady(video) {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const finish = () => {
      video.removeEventListener("loadeddata", finish);
      video.removeEventListener("error", finish);
      resolve();
    };

    video.addEventListener("loadeddata", finish, { once: true });
    video.addEventListener("error", finish, { once: true });
  });
}

function waitForSealReady() {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", resolve, { once: true });
    image.src = sealActions[0].poster;
  });
}

function waitForDeviceCompositionReady() {
  return new Promise((resolve) => {
    const reveal = () => {
      const aligned = updatePhoneVideoAlignment();
      if (aligned) deviceComposition?.classList.add("is-ready");
      resolve();
    };

    window.requestAnimationFrame(() => {
      updatePhoneVideoAlignment();
      window.requestAnimationFrame(reveal);
    });
  });
}

function startLoadingSequence() {
  let progress = 0;
  const progressTimer = window.setInterval(() => {
    progress = Math.min(88, progress + Math.max(1, (88 - progress) * 0.16));
    setLoadingProgress(progress);
  }, 90);

  Promise.all([waitForVideoReady(padVideo), waitForVideoReady(phoneVideo), waitForSealReady()]).then(async () => {
    await waitForDeviceCompositionReady();
    window.clearInterval(progressTimer);
    setLoadingProgress(100);
    window.setTimeout(() => loadingScreen.classList.add("is-leaving"), 320);
  });
}

function updatePhoneVideoAlignment() {
  const padFrame = document.querySelector(".pad-frame");
  const phoneScreen = document.querySelector(".phone-screen");
  if (!padFrame || !phoneScreen) return false;

  const padRect = padFrame.getBoundingClientRect();
  const phoneRect = phoneScreen.getBoundingClientRect();
  if (!padRect.width || !padRect.height || !phoneRect.width || !phoneRect.height) return false;
  const sceneRect = {
    left: Math.min(padRect.left, phoneRect.left),
    top: Math.min(padRect.top, phoneRect.top),
    right: Math.max(padRect.right, phoneRect.right),
    bottom: Math.max(padRect.bottom, phoneRect.bottom),
  };
  const sceneWidth = sceneRect.right - sceneRect.left;
  const sceneHeight = sceneRect.bottom - sceneRect.top;
  const sceneAspect = padRect.width / padRect.height;
  const unionAspect = sceneWidth / sceneHeight;
  const renderWidth = unionAspect > sceneAspect ? sceneWidth : sceneHeight * sceneAspect;
  const renderHeight = unionAspect > sceneAspect ? sceneWidth / sceneAspect : sceneHeight;
  const renderLeft = sceneRect.left + (sceneWidth - renderWidth) / 2;
  const renderTop = sceneRect.top + (sceneHeight - renderHeight) / 2;

  [
    { element: padFrame, rect: padRect },
    { element: phoneScreen, rect: phoneRect },
  ].forEach(({ element, rect }) => {
    element.style.setProperty("--scene-video-width", `${renderWidth}px`);
    element.style.setProperty("--scene-video-height", `${renderHeight}px`);
    element.style.setProperty("--scene-video-offset-x", `${rect.left - renderLeft}px`);
    element.style.setProperty("--scene-video-offset-y", `${rect.top - renderTop}px`);
  });
  return true;
}

function queueVideoAlignmentUpdate() {
  updatePhoneVideoAlignment();
  window.requestAnimationFrame(updatePhoneVideoAlignment);
}

function setScene(index) {
  activeScene = (index + scenes.length) % scenes.length;
  const scene = scenes[activeScene];

  stage.classList.add("is-switching");
  const objectPositionY = activeScene === 2 ? "39%" : activeScene === 4 ? "48.9%" : activeScene === 5 ? "47.8%" : "50%";
  stage.style.setProperty("--scene-video-object-position-y", objectPositionY);
  sceneIndex.textContent = String(activeScene + 1).padStart(2, "0");
  sceneName.textContent = scene.name;

  [padVideo, phoneVideo].forEach((video) => {
    video.pause();
    const source = video.querySelector("source");
    if (source) {
      source.src = scene.src;
    } else {
      video.src = scene.src;
    }
    video.currentTime = 0;
    video.load();
    video.addEventListener("loadedmetadata", () => playVideo(video), { once: true });
    playVideo(video);
  });
  queueVideoAlignmentUpdate();

  document.querySelectorAll(".scene-dot").forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeScene);
    dot.setAttribute("aria-pressed", dotIndex === activeScene ? "true" : "false");
  });

  window.setTimeout(() => {
    stage.classList.remove("is-switching");
  }, 440);
}

function moveScene(direction) {
  if (stage.dataset.sceneLocked === "true") return;
  stage.dataset.sceneLocked = "true";
  setScene(Number(sceneIndex.textContent) - 1 + direction);
  window.setTimeout(() => {
    delete stage.dataset.sceneLocked;
  }, 1300);
}

function showSealAction(action, temporary = false) {
  window.clearTimeout(reactionTimer);
  const requestId = ++sealActionRequest;
  if (action.poster) sealFrame.src = action.poster;
  sealFrame.alt = `${action.name}海豹动作`;
  const animation = new Image();
  let activated = false;
  const activate = () => {
    if (activated || requestId !== sealActionRequest) return;
    activated = true;
    sealFrame.src = action.src;
    if (!temporary) return;
    reactionTimer = window.setTimeout(() => {
      isReacting = false;
      showSealAction(sealActions[activeAction]);
    }, Math.round(action.frames * 1000 / 24));
  };
  animation.addEventListener("load", activate, { once: true });
  animation.addEventListener("error", () => {
    if (temporary && requestId === sealActionRequest) {
      isReacting = false;
      showSealAction(sealActions[activeAction]);
    }
  }, { once: true });
  animation.src = action.src;
  if (animation.complete && animation.naturalWidth) activate();
}

function setAction(index) {
  activeAction = index;
  isReacting = false;
  window.clearTimeout(reactionTimer);
  showSealAction(sealActions[activeAction]);

  document.querySelectorAll(".action-button").forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === activeAction);
    button.setAttribute("aria-pressed", buttonIndex === activeAction ? "true" : "false");
  });
}

sealActions.forEach((action, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "action-button";
  button.textContent = action.name;
  button.setAttribute("aria-label", `切换海豹动作：${action.name}`);
  button.addEventListener("click", () => setAction(index));
  actionButtons.appendChild(button);
});

nextScene.onclick = () => moveScene(1);
previousWorldScene?.addEventListener("click", () => setWorldScene(activeWorldScene - 1));
nextWorldScene?.addEventListener("click", () => setWorldScene(activeWorldScene + 1));
teaseSeal.addEventListener("click", () => {
  const reaction = reactionActions[Math.floor(Math.random() * reactionActions.length)];
  isReacting = true;
  showSealAction(reaction, true);
  teaseSeal.classList.remove("is-clicking");
  void teaseSeal.offsetWidth;
  teaseSeal.classList.add("is-clicking");
  window.setTimeout(() => teaseSeal.classList.remove("is-clicking"), 300);
});
motionPhone?.addEventListener("click", () => {
  if (!motionVideo) return;

  if (motionVideo.paused || motionVideo.ended) {
    playVideo(motionVideo);
  } else {
    motionVideo.pause();
  }
});
motionVideo?.addEventListener("play", () => motionPhone?.classList.add("is-playing"));
motionVideo?.addEventListener("pause", () => motionPhone?.classList.remove("is-playing"));
motionVideo?.addEventListener("ended", () => motionPhone?.classList.remove("is-playing"));
window.addEventListener("resize", queueVideoAlignmentUpdate);
window.addEventListener("load", queueVideoAlignmentUpdate);

window.addEventListener(
  "wheel",
  (event) => {
    if (window.portfolioTouchLayout || event.ctrlKey) return;
    if (!stage.contains(event.target)) return;
    if (Math.abs(event.deltaY) < 26) return;
    event.preventDefault();
    moveScene(event.deltaY > 0 ? 1 : -1);
  },
  { passive: false }
);

window.addEventListener(
  "touchstart",
  (event) => {
    if (window.portfolioTouchLayout || event.touches.length !== 1) return;
    touchStartY = event.touches[0].clientY;
  },
  { passive: true }
);

window.addEventListener(
  "touchend",
  (event) => {
    if (window.portfolioTouchLayout || !event.changedTouches.length) return;
    const touchEndY = event.changedTouches[0].clientY;
    const delta = touchStartY - touchEndY;
    if (Math.abs(delta) > 42) {
      moveScene(delta > 0 ? 1 : -1);
    }
  },
  { passive: true }
);

setScene(0);
setAction(0);
startLoadingSequence();

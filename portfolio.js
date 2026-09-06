const projects = [
  {
    number: "01",
    title: "精品就业班 · UI / 工作流",
    label: "精品就业班-UI/工作流",
    image: "./assets/portfolio/figma-directory/employment-workflow-20260902.png",
    href: "./case.html?project=employment",
    status: "live",
    tint: "rgba(221, 225, 255, 0.94)",
  },
  {
    number: "02",
    title: "海豹上岸游记 · 活动体系",
    label: "海豹上岸游记-活动体系",
    image: "./assets/portfolio/figma-directory/seal-campaign-20260902.png",
    href: "./seal.html?v=20260906-1",
    status: "live",
    tint: "rgba(255, 250, 217, 0.95)",
  },
  {
    number: "03",
    title: "智能音箱 · IP 与成长体系",
    label: "智能音箱-IP与成长体系",
    image: "./assets/portfolio/figma-directory/smart-speaker-growth-20260902.png",
    href: "./case.html?project=speaker",
    status: "live",
    tint: "rgba(194, 243, 255, 0.98)",
    imagePosition: "center 42%",
  },
  {
    number: "04",
    title: "悟牛 APP · 0 到 1 K12",
    label: "悟牛APP- 0到1K12",
    image: "./assets/portfolio/figma-directory/k12-app-20260902.png",
    href: "./case.html?project=wuniu",
    status: "live",
    tint: "rgba(213, 255, 213, 0.97)",
  },
];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const heroSection = document.querySelector("#top");
const resumeSection = document.querySelector("#profile");
const projectsSection = document.querySelector("#work");
const contactSection = document.querySelector("#contact");
const navFluidButton = document.querySelector(".nav-fluid-button");
const navLinksContainer = document.querySelector(".nav-links");
const sectionNavLinks = [...document.querySelectorAll(".nav-link[data-nav-index]")];
const mockupShell = document.querySelector("#mockupShell");
const heroMockup = document.querySelector("#heroMockup");
const scrollCue = document.querySelector(".scroll-cue");
const coverHome = document.querySelector("#coverHome");
const coverWindow = document.querySelector("#coverWindow");
const coverArt = document.querySelector("#coverArt");
const coverBackgroundVideo = document.querySelector(".cover-background-video");
const coverRings = [...document.querySelectorAll(".cover-ring")];
const chapterWipes = [...document.querySelectorAll(".chapter-wipe")];
const mockupFallback = document.querySelector("#mockupFallback");
const retryMockup = document.querySelector("#retryMockup");
const projectFan = document.querySelector("#projectFan");
const projectStage = document.querySelector("#projectStage");
const projectCta = document.querySelector("#projectCta");
const aboutViewer = document.querySelector("#aboutViewer");
const aboutViewerFrame = aboutViewer?.querySelector(".about-viewer-frame");
const aboutViewerClose = document.querySelector("#aboutViewerClose");
const aboutViewerScroll = document.querySelector("#aboutViewerScroll");
const pageCurtain = document.querySelector("#pageCurtain");
const toast = document.querySelector("#toast");
const contactVideo = document.querySelector("#contactVideo");
const togglePlayback = document.querySelector("#togglePlayback");
const toggleSound = document.querySelector("#toggleSound");
const heroMockupId = heroMockup?.getAttribute("mockup-id");
const localMockupRecordUrl = "./assets/portfolio/mckp/scene.json?v=20260905-1";
const localMockupPlayerUrl = "./assets/portfolio/mckp/mckp-player.js?v=20260826-1";

let activeProject = 2;
let toastTimer;
let mockupReady = false;
let mockupLoadTimeout;
let mockupStoreUnsubscribe;
let mockupIntroPrepareTimer;
let mockupIntroCompletionTimer;
let mockupCutMaskStartTimer;
let mockupCutMaskEndTimer;
let mockupProgressUnsubscribe;
let mockupIntroStarted = false;
let mockupScreenWasAway = false;
let mockupRendererRestartTimer;
let coverVideoReady = !coverBackgroundVideo || coverBackgroundVideo.readyState >= 2;
let userPausedVideo = false;
let heroScrollFrame;
let mockupDragTimer;
let coverPointerFrame;
let chapterWipeFrame;
let renderedHeroProgress;
let projectsIntroPlayed = false;
let hoveredProject = null;
let projectBounceTimer;
const bounceCardsGsap = window.gsap;
const smoothScroller = window.Lenis
  ? new window.Lenis({
      autoRaf: true,
      anchors: true,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.105,
      wheelMultiplier: 0.62,
      overscroll: true,
    })
  : null;

function showToast(message) {
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1600);
}

async function copyValue(value, label) {
  try {
    await navigator.clipboard.writeText(value);
    showToast(`${label}已复制`);
  } catch {
    showToast(`请手动复制：${value}`);
  }
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => {
    const label = button.classList.contains("copy-wechat") || button.classList.contains("copy-contact") ? "微信号" : "邮箱";
    copyValue(button.dataset.copy, label);
  });
});

const wechatContact = document.querySelector(".contact-item-wechat");
const wechatContactIcon = wechatContact?.querySelector(".contact-icon");
const wechatQr = wechatContact?.querySelector(".contact-wechat-qr");
let wechatQrVisible = false;

function positionWechatQr() {
  if (!wechatContactIcon || !wechatQr) return;
  const iconBounds = wechatContactIcon.getBoundingClientRect();
  const qrWidth = 140;
  const qrHeight = 148;
  const qrGap = 12;
  const viewportInset = 12;
  const preferredLeft = iconBounds.left - 46;
  const left = Math.min(
    Math.max(preferredLeft, viewportInset),
    window.innerWidth - qrWidth - viewportInset,
  );
  const preferredTop = iconBounds.top - qrHeight - qrGap;
  const top = Math.max(preferredTop, viewportInset);

  wechatQr.style.setProperty("--wechat-qr-left", `${left}px`);
  wechatQr.style.setProperty("--wechat-qr-top", `${top}px`);
}

function showWechatQr() {
  if (!wechatQr) return;
  positionWechatQr();
  wechatQrVisible = true;
  wechatQr.classList.add("is-visible");
}

function hideWechatQr() {
  if (!wechatQr) return;
  wechatQrVisible = false;
  wechatQr.classList.remove("is-visible");
}

if (wechatContact && wechatQr) {
  // Keep the scannable artwork outside the contact section's stacking context so
  // the global light-rays layer can never tint or dim the QR pixels.
  document.body.appendChild(wechatQr);
  wechatContact.addEventListener("pointerenter", showWechatQr);
  wechatContact.addEventListener("pointerleave", hideWechatQr);
  wechatContact.addEventListener("focusin", showWechatQr);
  wechatContact.addEventListener("focusout", (event) => {
    if (!wechatContact.contains(event.relatedTarget)) hideWechatQr();
  });
  window.addEventListener(
    "scroll",
    () => {
      if (wechatQrVisible) positionWechatQr();
    },
    { passive: true },
  );
  window.addEventListener("resize", () => {
    if (wechatQrVisible) positionWechatQr();
  });
}

function revealMockup() {
  if (!mockupShell || mockupReady) return;
  window.clearTimeout(mockupLoadTimeout);
  mockupReady = true;
  mockupFallback.hidden = true;
  mockupShell.classList.remove("is-loading", "has-fallback");
}

function showMockupFallback() {
  if (!mockupShell || mockupReady) return;
  mockupShell.classList.add("has-fallback");
  mockupShell.classList.remove("is-loading");
  mockupFallback.hidden = false;
}

function startMockupIntro(controls) {
  if (mockupIntroStarted || !controls?.setProgress || !controls?.play) return false;
  const playbackStore = heroMockup?.store;
  const playbackState = playbackStore?.getState?.();
  const basePlaybackSpeed = Number(playbackState?.scene?.playbackSpeed) || 1;
  let recenterAccelerated = false;
  const setPlaybackSpeed = (speed) => {
    playbackStore?.dispatch?.({ type: "editor/setPlaybackSpeed", payload: speed });
  };

  controls.stop?.();
  controls.setLoop?.(false);
  controls.setProgress(0);

  if (reduceMotion.matches) {
    controls.setProgress(1);
    mockupIntroStarted = true;
    mockupShell?.setAttribute("data-intro-state", "complete");
    revealMockup();
    return true;
  }

  if (!controls.play(false)) return false;

  mockupIntroStarted = true;
  mockupShell?.setAttribute("data-intro-state", "playing");
  revealMockup();

  window.clearTimeout(mockupCutMaskStartTimer);
  window.clearTimeout(mockupCutMaskEndTimer);
  mockupCutMaskStartTimer = window.setTimeout(() => {
    mockupShell?.classList.add("is-cut-masked");
  }, 2200);
  mockupCutMaskEndTimer = window.setTimeout(() => {
    mockupShell?.classList.remove("is-cut-masked");
    recenterAccelerated = true;
    setPlaybackSpeed(basePlaybackSpeed * 1.25);
  }, 3160);

  const finishIntro = () => {
    window.clearTimeout(mockupIntroCompletionTimer);
    window.clearTimeout(mockupCutMaskStartTimer);
    window.clearTimeout(mockupCutMaskEndTimer);
    mockupShell?.classList.remove("is-cut-masked");
    mockupProgressUnsubscribe?.();
    mockupProgressUnsubscribe = undefined;
    if (recenterAccelerated) setPlaybackSpeed(basePlaybackSpeed);
    mockupShell?.setAttribute("data-intro-state", "complete");
  };

  mockupProgressUnsubscribe?.();
  mockupProgressUnsubscribe = controls.subscribeToProgress?.((progress) => {
    if (progress >= 0.999) finishIntro();
  });
  mockupIntroCompletionTimer = window.setTimeout(finishIntro, 11000);
  return true;
}

function enforceMockupInteraction() {
  const store = heroMockup?.store;
  const state = store?.getState?.();
  const runtime = state?.undoableParts?.present?.editor ?? state?.editor;
  const scene = state?.scene ?? state?.undoableParts?.present?.scene ?? state?.editor;
  const sceneLoad = runtime?.sceneLoad;
  const screensReady = !sceneLoad?.screensExpected || sceneLoad.screensTextured?.length >= sceneLoad.screensExpected;

  if (
    runtime?.modelVisible &&
    screensReady &&
    runtime?.animations?.length &&
    runtime?.controls &&
    !mockupIntroStarted &&
    !mockupIntroPrepareTimer
  ) {
    const attemptStart = (attempt = 0) => {
      mockupIntroPrepareTimer = undefined;
      const latestState = store?.getState?.();
      const latestRuntime = latestState?.undoableParts?.present?.editor ?? latestState?.editor;
      if (latestRuntime?.controls && startMockupIntro(latestRuntime.controls)) return;
      if (attempt < 20) {
        mockupIntroPrepareTimer = window.setTimeout(() => attemptStart(attempt + 1), 100);
      }
    };

    mockupIntroPrepareTimer = window.setTimeout(attemptStart, 180);
  }

  if (store && scene?.trigger?.type !== "manual") {
    store.dispatch({ type: "editor/setTrigger", payload: { type: "manual" } });
  }

  const click = scene?.orbitConfig?.click;
  if (!store || !click) return false;

  const returnConfig = click.return ?? {};
  if (click.enabled !== true || returnConfig.enabled !== true || returnConfig.delay !== 0 || returnConfig.speed !== 72) {
    store.dispatch({
      type: "editor/setOrbitConfigClick",
      payload: {
        ...click,
        enabled: true,
        return: {
          ...returnConfig,
          delay: 0,
          enabled: true,
          speed: 72,
        },
      },
    });
  }

  mockupShell?.setAttribute("data-orbit-return", "ready");
  return true;
}

function configureMockupInteraction() {
  let attempts = 0;
  mockupShell?.setAttribute("data-orbit-return", "pending");

  const connect = () => {
    const store = heroMockup?.store;
    if (!store?.subscribe || !enforceMockupInteraction()) {
      attempts += 1;
      if (attempts < 80) window.setTimeout(connect, 100);
      return;
    }

    mockupStoreUnsubscribe?.();
    mockupStoreUnsubscribe = store.subscribe(enforceMockupInteraction);
  };

  connect();
}

function waitForMockup() {
  mockupReady = false;
  mockupIntroStarted = false;
  window.clearTimeout(mockupIntroPrepareTimer);
  mockupIntroPrepareTimer = undefined;
  window.clearTimeout(mockupIntroCompletionTimer);
  mockupIntroCompletionTimer = undefined;
  window.clearTimeout(mockupCutMaskStartTimer);
  mockupCutMaskStartTimer = undefined;
  window.clearTimeout(mockupCutMaskEndTimer);
  mockupCutMaskEndTimer = undefined;
  mockupProgressUnsubscribe?.();
  mockupProgressUnsubscribe = undefined;
  mockupShell?.classList.add("is-loading");
  mockupShell?.classList.remove("has-fallback", "is-cut-masked");
  mockupShell?.removeAttribute("data-intro-state");
  if (mockupFallback) mockupFallback.hidden = true;

  window.clearTimeout(mockupLoadTimeout);
  mockupLoadTimeout = window.setTimeout(showMockupFallback, 15000);
  customElements.whenDefined("mockup-player").then(() => {
    configureMockupInteraction();
  });
}

function prepareLocalMockupRecord() {
  if (!heroMockupId) return;
  window.__MOCKUP_RECORDS__ = window.__MOCKUP_RECORDS__ || {};
  if (window.__MOCKUP_RECORDS__[heroMockupId]) return;

  window.__MOCKUP_RECORDS__[heroMockupId] = fetch(localMockupRecordUrl, { cache: "force-cache" }).then((response) => {
    if (!response.ok) throw new Error(`本地 3D 场景配置加载失败：${response.status}`);
    return response.json();
  });
}

function loadMockupPlayer({ bustCache = false } = {}) {
  if (customElements.get("mockup-player")) {
    waitForMockup();
    return;
  }

  waitForMockup();
  const retryScript = document.createElement("script");
  retryScript.src = `${localMockupPlayerUrl}${bustCache ? `&retry=${Date.now()}` : ""}`;
  retryScript.async = true;
  retryScript.addEventListener("error", showMockupFallback, { once: true });
  document.head.append(retryScript);
}

retryMockup?.addEventListener("click", () => {
  loadMockupPlayer({ bustCache: true });
});

if (location.protocol === "http:" || location.protocol === "https:") {
  prepareLocalMockupRecord();
  loadMockupPlayer();
} else {
  mockupShell?.classList.add("is-static-fallback");
  if (heroMockup) heroMockup.hidden = true;
  showMockupFallback();
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(start, end, value) {
  const progress = clamp((value - start) / (end - start));
  return progress * progress * (3 - 2 * progress);
}

function prepareCoverBackgroundVideo() {
  if (!coverBackgroundVideo || coverVideoReady) return;

  const markReady = () => {
    coverVideoReady = true;
    scheduleHeroStory();
  };

  coverBackgroundVideo.addEventListener("loadeddata", markReady, { once: true });
  coverBackgroundVideo.addEventListener("canplay", markReady, { once: true });
  coverBackgroundVideo.addEventListener("error", markReady, { once: true });
  coverBackgroundVideo.load();
}

function restoreMockupRenderer() {
  window.clearTimeout(mockupRendererRestartTimer);
  if (!heroMockup || typeof heroMockup.deactivate !== "function" || typeof heroMockup.activate !== "function") {
    mockupShell?.setAttribute("data-renderer-restart", "unsupported");
    return;
  }

  mockupShell?.setAttribute("data-renderer-restart", "pending");
  const previousState = heroMockup.store?.getState?.();
  const previousRuntime = previousState?.undoableParts?.present?.editor ?? previousState?.editor;
  const previousControls = previousRuntime?.controls;
  heroMockup.deactivate();

  window.requestAnimationFrame(() => {
    heroMockup.activate();
    let attempts = 0;

    const settleAtCompletedFrame = () => {
      const state = heroMockup.store?.getState?.();
      const runtime = state?.undoableParts?.present?.editor ?? state?.editor;
      const controls = runtime?.controls;
      const sceneLoad = runtime?.sceneLoad;
      const screensReady = !sceneLoad?.screensExpected || sceneLoad.screensTextured?.length >= sceneLoad.screensExpected;

      if (controls?.setProgress && controls !== previousControls && runtime?.modelVisible && screensReady) {
        controls.stop?.();
        controls.setLoop?.(false);
        controls.setProgress(1);
        mockupShell?.setAttribute("data-intro-state", "complete");
        mockupShell?.setAttribute("data-renderer-restart", "ready");
        return;
      }

      attempts += 1;
      if (attempts < 80) mockupRendererRestartTimer = window.setTimeout(settleAtCompletedFrame, 50);
      else mockupShell?.setAttribute("data-renderer-restart", "timeout");
    };

    mockupRendererRestartTimer = window.setTimeout(settleAtCompletedFrame, 50);
  });
}

function updateHeroStory() {
  heroScrollFrame = undefined;
  if (!heroSection || !coverHome || !coverWindow) return;

  const heroTop = heroSection.offsetTop;
  const heroTravel = Math.max(1, heroSection.offsetHeight - window.innerHeight);
  const targetProgress = clamp((window.scrollY - heroTop) / heroTravel);
  navFluidButton?.classList.toggle("is-first-screen-hidden", targetProgress > 0.055);

  if (targetProgress >= 0.62) {
    mockupScreenWasAway = true;
  }
  if (mockupScreenWasAway && targetProgress <= 0.5) {
    mockupScreenWasAway = false;
    restoreMockupRenderer();
  }

  if (renderedHeroProgress === undefined || reduceMotion.matches) renderedHeroProgress = targetProgress;
  else renderedHeroProgress += (targetProgress - renderedHeroProgress) * (smoothScroller ? 0.16 : 0.13);

  const progress = renderedHeroProgress;
  const requestedMockupFade = smoothstep(0.06, 0.44, progress);
  const requestedCoverIn = smoothstep(0.05, 0.64, progress);
  const mockupFade = coverVideoReady ? requestedMockupFade : 0;
  const coverIn = coverVideoReady ? requestedCoverIn : 0;
  const ringIn = smoothstep(0.18, 0.62, progress);
  const resumeWipe = smoothstep(0.84, 0.995, progress);
  coverHome.style.setProperty("--resume-wipe", String(resumeWipe));
  coverHome.style.setProperty("--resume-wipe-offset", `${(1 - resumeWipe) * 110}%`);

  coverRings.forEach((ring, index) => {
    const entryX = (1 - ringIn) * window.innerWidth * (index === 0 ? 0.24 : 0.19);
    const entryY = (1 - ringIn) * window.innerHeight * (index === 0 ? -0.08 : 0.1);
    ring.style.setProperty("--ring-entry-x", `${entryX}px`);
    ring.style.setProperty("--ring-entry-y", `${entryY}px`);
    ring.style.setProperty("--ring-opacity", String(ringIn * 0.72));
  });

  if (coverBackgroundVideo) {
    const shouldPlayCover = coverIn > 0.04 && progress < 0.995 && !document.hidden;
    if (shouldPlayCover && coverBackgroundVideo.paused) coverBackgroundVideo.play().catch(() => {});
    if (!shouldPlayCover && !coverBackgroundVideo.paused) coverBackgroundVideo.pause();
  }

  if (reduceMotion.matches) {
    if (mockupShell) mockupShell.style.opacity = progress < 0.45 ? "1" : "0";
    coverHome.style.opacity = progress < 0.45 ? "0" : "1";
    coverWindow.style.transform = "none";
  } else {
    coverHome.style.opacity = String(coverIn);
    coverHome.style.transform = `translate3d(0, ${(1 - coverIn) * 34}px, 0)`;
    coverWindow.style.transform = `translate3d(0, ${(1 - coverIn) * 3.5}vh, 0)`;

    if (mockupShell) {
      mockupShell.style.opacity = String(1 - mockupFade);
      mockupShell.style.transform = `translate3d(0, ${mockupFade * -3}vh, 0) scale(${1 + mockupFade * 0.07})`;
    }
  }

  coverHome.style.pointerEvents = coverIn > 0.92 ? "auto" : "none";
  if (scrollCue) scrollCue.style.opacity = String(1 - smoothstep(0.04, 0.18, progress));

  if (!reduceMotion.matches && Math.abs(targetProgress - renderedHeroProgress) > 0.001) {
    heroScrollFrame = window.requestAnimationFrame(updateHeroStory);
  }
}

function scheduleHeroStory() {
  if (heroScrollFrame !== undefined) return;
  heroScrollFrame = window.requestAnimationFrame(updateHeroStory);
}

function updateChapterWipes() {
  chapterWipeFrame = undefined;
  const viewportHeight = Math.max(1, window.innerHeight);

  chapterWipes.forEach((wipe) => {
    const nextSection = document.querySelector(wipe.dataset.nextSection);
    if (!nextSection) return;
    const nextTop = nextSection.getBoundingClientRect().top;
    const rawProgress = clamp((viewportHeight - nextTop) / (viewportHeight * 0.72));
    const progress = reduceMotion.matches ? Number(rawProgress >= 0.72) : smoothstep(0, 1, rawProgress);
    const mistOpacity = reduceMotion.matches ? 0 : Math.sin(progress * Math.PI) * 0.92;
    wipe.style.setProperty("--chapter-wipe-opacity", String(mistOpacity));
    wipe.style.setProperty("--chapter-wipe-offset", `${105 - progress * 145}%`);

    if (wipe.dataset.nextSection === "#work") {
      const resumeExit = reduceMotion.matches ? Number(rawProgress >= 0.72) : smoothstep(0.06, 0.76, rawProgress);
      const projectsEnter = reduceMotion.matches ? Number(rawProgress >= 0.72) : smoothstep(0.28, 0.96, rawProgress);
      resumeSection?.style.setProperty("--resume-exit", String(resumeExit));
      resumeSection?.style.setProperty("--resume-shift", `${resumeExit * -26}px`);
      resumeSection?.style.setProperty("--resume-scale", String(1 - resumeExit * 0.012));
      projectsSection?.style.setProperty("--projects-enter", String(projectsEnter));
      projectsSection?.style.setProperty("--projects-visibility", String(projectsEnter));
      projectsSection?.style.setProperty("--projects-motion-offset", `${(1 - projectsEnter) * 34}px`);
    }

    if (wipe.dataset.nextSection === "#contact") {
      const projectsExit = reduceMotion.matches ? Number(rawProgress >= 0.72) : smoothstep(0.06, 0.76, rawProgress);
      const contactEnter = reduceMotion.matches ? Number(rawProgress >= 0.72) : smoothstep(0.28, 0.96, rawProgress);
      const projectsEnter = Number(projectsSection?.style.getPropertyValue("--projects-enter") || 1);
      projectsSection?.style.setProperty("--projects-exit", String(projectsExit));
      projectsSection?.style.setProperty("--projects-visibility", String(projectsEnter * (1 - projectsExit)));
      projectsSection?.style.setProperty("--projects-motion-offset", `${projectsExit * -26}px`);
      contactSection?.style.setProperty("--contact-enter", String(contactEnter));
      contactSection?.style.setProperty("--contact-offset", `${(1 - contactEnter) * 34}px`);
    }
  });
}

function scheduleChapterWipes() {
  if (chapterWipeFrame !== undefined) return;
  chapterWipeFrame = window.requestAnimationFrame(updateChapterWipes);
}

mockupShell?.addEventListener("pointerdown", () => {
  window.clearTimeout(mockupDragTimer);
  mockupShell.classList.add("is-dragging");
});

const finishMockupDrag = () => {
  window.clearTimeout(mockupDragTimer);
  mockupDragTimer = window.setTimeout(() => mockupShell?.classList.remove("is-dragging"), 700);
};

mockupShell?.addEventListener("pointerup", finishMockupDrag);
mockupShell?.addEventListener("pointercancel", finishMockupDrag);
window.addEventListener("scroll", scheduleHeroStory, { passive: true });
window.addEventListener("resize", scheduleHeroStory);
window.addEventListener("pageshow", scheduleHeroStory);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && window.scrollY < window.innerHeight && mockupScreenWasAway) scheduleHeroStory();
});
window.addEventListener("scroll", scheduleChapterWipes, { passive: true });
window.addEventListener("resize", scheduleChapterWipes);
window.addEventListener("pageshow", scheduleChapterWipes);
prepareCoverBackgroundVideo();
scheduleHeroStory();
scheduleChapterWipes();

coverWindow?.addEventListener("pointermove", (event) => {
  if (reduceMotion.matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || !coverArt) return;
  const bounds = coverWindow.getBoundingClientRect();
  const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1) - 0.5;
  const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1) - 0.5;
  window.cancelAnimationFrame(coverPointerFrame);
  coverPointerFrame = window.requestAnimationFrame(() => {
    coverArt.style.setProperty("--pointer-x", `${x * 10}px`);
    coverArt.style.setProperty("--pointer-y", `${y * 7}px`);
    coverArt.style.setProperty("--pointer-rx", `${y * -1.1}deg`);
    coverArt.style.setProperty("--pointer-ry", `${x * 1.4}deg`);
  });
});

coverWindow?.addEventListener("pointerleave", () => {
  if (!coverArt) return;
  coverArt.style.setProperty("--pointer-x", "0px");
  coverArt.style.setProperty("--pointer-y", "0px");
  coverArt.style.setProperty("--pointer-rx", "0deg");
  coverArt.style.setProperty("--pointer-ry", "0deg");
});

if (resumeSection) {
  const resumeObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) resumeSection.classList.add("is-visible");
    },
    { threshold: 0.16 },
  );
  resumeObserver.observe(resumeSection);
}

function relativeIndex(index) {
  let relative = index - activeProject;
  const half = Math.floor(projects.length / 2);
  if (relative > half || (projects.length % 2 === 0 && relative === half)) relative -= projects.length;
  if (relative < -half) relative += projects.length;
  return relative;
}

function projectSpacing() {
  const width = projectStage?.clientWidth || window.innerWidth;
  const renderedCardWidth = projectFan?.querySelector(".project-card")?.offsetWidth;
  const minimum = window.innerWidth <= 640 ? Math.min(window.innerWidth * 0.58, 230) : 220;
  const cardWidth = renderedCardWidth || Math.min(420, Math.max(minimum, width * 0.21875));
  const fourCardPitch = window.innerWidth <= 640 ? 0.62 : 1.06;
  return { near: cardWidth * 0.66, far: cardWidth * 1.2, pitch: cardWidth * fourCardPitch, cardWidth };
}

function projectCardX(relative, spacing, index) {
  if (projects.length === 4) {
    if (window.innerWidth <= 640) return (index - 1.5) * spacing.pitch;

    // The reference fan is intentionally non-uniform. Values are normalized to
    // the source card width, so browser zoom cannot change the composition.
    const figmaX = [-1.365, -0.455, 0.455, 1.365];
    return figmaX[index] * spacing.cardWidth;
  }
  const distance = Math.abs(relative);
  return distance === 0 ? 0 : Math.sign(relative) * (distance === 1 ? spacing.near : spacing.far);
}

function projectCardTransform({ x, y, rotate, scale }) {
  return `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) rotate(${rotate}deg) scale(${scale})`;
}

function updateProjectCards({ bounce = false } = {}) {
  if (!projectFan) return;
  const spacing = projectSpacing();
  const hoveredRelative = hoveredProject === null ? 0 : relativeIndex(hoveredProject);
  const hoveredX = projectCardX(hoveredRelative, spacing, hoveredProject ?? activeProject);
  const useBounce = bounce && bounceCardsGsap && !reduceMotion.matches;
  projectFan.dataset.hoverActive = String(hoveredProject !== null);

  if (useBounce) {
    window.clearTimeout(projectBounceTimer);
    projectFan.classList.add("is-bounce-animating");
    projectBounceTimer = window.setTimeout(() => projectFan.classList.remove("is-bounce-animating"), 620);
  }

  projectFan.querySelectorAll(".project-card").forEach((card, index) => {
    const relative = relativeIndex(index);
    const distance = Math.abs(relative);
    const active = distance === 0;
    const hovered = index === hoveredProject;
    const fourCardSlot = projects.length === 4 ? index : -1;
    const direction = projects.length === 4 ? Math.sign(index - 1.5) : Math.sign(relative);
    const baseX = projectCardX(relative, spacing, index);
    const spreadDirection = Math.sign(baseX - hoveredX) || Math.sign(relative - hoveredRelative) || 1;
    const hoverPush = spacing.cardWidth * (projects.length === 4 ? 0.085 : 0.38);
    const x = hoveredProject !== null && !hovered ? baseX + spreadDirection * hoverPush : baseX;
    const baseScale = projects.length === 4 ? 1 : active ? 1 : distance === 1 ? 0.95 : 0.732;
    const y = projects.length === 4
      ? (window.innerWidth <= 640
          ? [0, 0, spacing.cardWidth * 0.13, 0][fourCardSlot]
          : [-0.116, -0.128, 0.012, -0.115][fourCardSlot] * spacing.cardWidth)
      : distance === 0
        ? 0
        : distance === 1
          ? spacing.cardWidth * 0.05
          : spacing.cardWidth * 0.16;
    const rotate = hovered ? 0 : projects.length === 4 ? [11, 0, -9, 10][fourCardSlot] : relative * 5.5;
    const scale = hovered ? Math.min(baseScale + 0.045, 1.045) : baseScale;
    const currentTransform = useBounce ? getComputedStyle(card).transform : "";
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
    card.style.setProperty("--rotate", `${rotate}deg`);
    card.style.setProperty("--scale", String(scale));
    card.style.setProperty("--z", String(hovered ? 30 : projects.length === 4 ? 10 + index : 10 - distance));
    card.style.setProperty("--opacity", String(distance > 2 ? 0 : 1));
    card.style.setProperty("--active", active ? "1" : "0");
    card.style.setProperty("--entry-side", String(direction || (index % 2 === 0 ? -1 : 1)));
    card.style.setProperty("--entry-delay", `${80 + distance * 70}ms`);
    card.dataset.active = String(active);
    card.dataset.hovered = String(hovered);
    card.setAttribute("aria-current", active ? "true" : "false");
    card.tabIndex = active || distance === 1 ? 0 : -1;

    if (useBounce) {
      const delay = hoveredProject !== null && !hovered ? Math.abs(relative - hoveredRelative) * 0.05 : 0;
      bounceCardsGsap.killTweensOf(card);
      bounceCardsGsap.fromTo(
        card,
        { transform: currentTransform },
        {
          transform: projectCardTransform({ x, y, rotate, scale }),
          duration: 0.4,
          ease: "back.out(1.4)",
          delay,
          overwrite: "auto",
          onComplete: () => bounceCardsGsap.set(card, { clearProps: "transform" }),
        },
      );
    }
  });

  projectCta?.setAttribute("aria-label", `了解项目：${projects[activeProject].title}`);
}

function renderProjects() {
  if (!projectFan) return;
  projectFan.classList.add("is-entry-pending");
  projectFan.innerHTML = projects
    .map(
      (project, index) => `
        <button class="project-card" type="button" role="listitem" data-index="${index}" aria-label="打开项目：${project.title}" style="--card-tint:${project.tint};--image-position:${project.imagePosition || "center"}">
          <span class="project-card-copy" aria-hidden="true">
            <b>${project.number}</b>
            <strong>${project.label}</strong>
          </span>
          <span class="project-card-image">
            <img src="${project.image}" alt="${project.title} 项目视觉" draggable="false" />
          </span>
        </button>`,
    )
    .join("");

  updateProjectCards();
  if (window.location.hash === "#work") {
    projectsIntroPlayed = true;
    projectFan.classList.remove("is-entry-pending", "is-entry-playing");
  }
}

projectFan?.addEventListener("click", (event) => {
  const card = event.target.closest(".project-card");
  if (!card || !projectFan.contains(card)) return;

  const index = Number(card.dataset.index);
  openProject(projects[index]);
});

projectFan?.addEventListener("pointerover", (event) => {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const card = event.target.closest(".project-card");
  if (!card || !projectFan.contains(card) || card.contains(event.relatedTarget)) return;
  hoveredProject = Number(card.dataset.index);
  updateProjectCards({ bounce: true });
});

projectFan?.addEventListener("pointerout", (event) => {
  const card = event.target.closest(".project-card");
  if (!card || !projectFan.contains(card) || card.contains(event.relatedTarget)) return;
  hoveredProject = null;
  updateProjectCards({ bounce: true });
});

if (projectsSection && projectFan) {
  const projectsObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      if (projectsIntroPlayed) {
        projectsObserver.disconnect();
        return;
      }
      projectsIntroPlayed = true;
      projectsObserver.disconnect();

      if (reduceMotion.matches) {
        projectFan.classList.remove("is-entry-pending");
        return;
      }

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          projectFan.classList.add("is-entry-playing");
          projectFan.classList.remove("is-entry-pending");
          window.setTimeout(() => projectFan.classList.remove("is-entry-playing"), 980);
        });
      });
    },
    { threshold: 0.2 },
  );
  projectsObserver.observe(projectsSection);
}

function openProject(project) {
  if (!project?.href || project.status !== "live") {
    showToast("这个项目正在整理中");
    return;
  }
  document.body.classList.add("is-transitioning");
  pageCurtain?.classList.add("is-active");
  const delay = reduceMotion.matches ? 80 : 820;
  window.setTimeout(() => {
    window.location.href = project.href;
  }, delay);
}

function openAboutViewer() {
  if (!aboutViewer) return;
  aboutViewerScroll?.scrollTo({ top: 0, behavior: "instant" });
  aboutViewer.showModal();
  document.body.classList.add("is-about-open");
  smoothScroller?.stop?.();
}

function closeAboutViewer() {
  if (!aboutViewer?.open) return;
  aboutViewer.close();
  document.body.classList.remove("is-about-open");
  smoothScroller?.start?.();
}

projectCta?.addEventListener("click", openAboutViewer);
aboutViewerClose?.addEventListener("click", closeAboutViewer);
aboutViewer?.addEventListener("click", (event) => {
  if (event.target === aboutViewer) closeAboutViewer();
});
aboutViewer?.addEventListener(
  "wheel",
  (event) => {
    if (!aboutViewer.open || !aboutViewerFrame || !aboutViewerScroll) return;
    const bounds = aboutViewerFrame.getBoundingClientRect();
    const insideFrame =
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom;

    event.preventDefault();
    event.stopPropagation();

    if (insideFrame) {
      aboutViewerScroll.scrollTop += event.deltaY;
      return;
    }

    closeAboutViewer();
  },
  { passive: false, capture: true },
);
aboutViewer?.addEventListener("close", () => {
  document.body.classList.remove("is-about-open");
  smoothScroller?.start?.();
});

window.addEventListener("resize", updateProjectCards);
window.addEventListener("pageshow", () => {
  document.body.classList.remove("is-transitioning");
  pageCurtain?.classList.remove("is-active");
});

document.querySelectorAll('a[href="#top"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (smoothScroller && !reduceMotion.matches) smoothScroller.scrollTo(0, { lerp: 0.12 });
    else window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
    if (window.location.hash) history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  });
});

function setActiveNavigation(activeIndex) {
  if (!navLinksContainer) return;
  const hasActiveSection = activeIndex >= 0;
  navLinksContainer.dataset.activeSection = hasActiveSection ? String(activeIndex) : "none";
  if (hasActiveSection) navLinksContainer.style.setProperty("--nav-index", String(activeIndex));

  sectionNavLinks.forEach((link, index) => {
    if (index === activeIndex) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

function updateActiveNavigation() {
  const sections = [resumeSection, projectsSection, contactSection];
  const marker = window.innerHeight * 0.36;
  let activeIndex = -1;

  sections.forEach((section, index) => {
    if (!section) return;
    const bounds = section.getBoundingClientRect();
    if (bounds.top <= marker && bounds.bottom > marker) activeIndex = index;
  });

  setActiveNavigation(activeIndex);
}

let navigationFrame;
window.addEventListener(
  "scroll",
  () => {
    if (navigationFrame) return;
    navigationFrame = requestAnimationFrame(() => {
      navigationFrame = null;
      updateActiveNavigation();
    });
  },
  { passive: true },
);

window.addEventListener("resize", updateActiveNavigation);
sectionNavLinks.forEach((link) => {
  link.addEventListener("click", () => setActiveNavigation(Number(link.dataset.navIndex)));
});

function updatePlaybackButton() {
  if (!contactVideo || !togglePlayback) return;
  const paused = contactVideo.paused;
  togglePlayback.querySelector("span").textContent = paused ? "▶" : "Ⅱ";
  togglePlayback.setAttribute("aria-label", paused ? "播放视频" : "暂停视频");
}

function updateSoundButton() {
  if (!contactVideo || !toggleSound) return;
  toggleSound.querySelector("span").textContent = contactVideo.muted ? "♪" : "×";
  toggleSound.setAttribute("aria-label", contactVideo.muted ? "开启声音" : "关闭声音");
}

togglePlayback?.addEventListener("click", () => {
  if (contactVideo.paused) {
    userPausedVideo = false;
    contactVideo.play().catch(() => {});
  } else {
    userPausedVideo = true;
    contactVideo.pause();
  }
  updatePlaybackButton();
});

toggleSound?.addEventListener("click", () => {
  contactVideo.muted = !contactVideo.muted;
  if (contactVideo.paused && !userPausedVideo) contactVideo.play().catch(() => {});
  updateSoundButton();
});

contactVideo?.addEventListener("play", updatePlaybackButton);
contactVideo?.addEventListener("pause", updatePlaybackButton);

if (contactVideo) {
  const contactVideoObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !userPausedVideo) contactVideo.play().catch(() => {});
      if (!entry.isIntersecting) contactVideo.pause();
    },
    { threshold: 0.12 },
  );
  contactVideoObserver.observe(contactVideo);
}

renderProjects();
updatePlaybackButton();
updateSoundButton();
updateActiveNavigation();
scheduleChapterWipes();

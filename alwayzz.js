const menuToggle = document.querySelector("#menuToggle");
const menuDrawer = document.querySelector("#menuDrawer");
const curveLeft = document.querySelector("#curveLeft");
const curveRight = document.querySelector("#curveRight");
const curveTop = document.querySelector("#curveTop");
const serviceTrack = document.querySelector("#serviceTrack");
const logoTrack = document.querySelector("#logoTrack");
const glowCards = document.querySelectorAll(".border-glow-card");

const services = ["Brand Identity", "App Development", "Visual Design", "Creative Video", "Iconography"];
const companies = [
  ["Airbnb", "logo-airbnb"],
  ["Shopify", "logo-shopify"],
  ["Notion", "logo-notion"],
  ["Linear", "logo-linear"],
  ["Webflow", "logo-webflow"],
  ["Figma", "logo-figma"],
  ["Slack", "logo-slack"],
  ["Stripe", "logo-stripe"],
  ["Vercel", "logo-vercel"],
  ["Framer", "logo-framer"],
];

function appendCurves(container, count = 20) {
  if (!container) return;

  const fragment = document.createDocumentFragment();
  for (let index = 0; index < count; index += 1) {
    const line = document.createElement("span");
    line.style.setProperty("--line-index", index);
    fragment.append(line);
  }
  container.append(fragment);
}

function appendServiceSets() {
  if (!serviceTrack) return;

  for (let copy = 0; copy < 4; copy += 1) {
    const set = document.createElement("div");
    set.className = "ticker-set";
    set.setAttribute("aria-hidden", copy === 0 ? "false" : "true");
    services.forEach((service) => {
      const item = document.createElement("span");
      item.textContent = service;
      set.append(item);
    });
    serviceTrack.append(set);
  }
}

function appendLogoSets() {
  if (!logoTrack) return;

  for (let copy = 0; copy < 4; copy += 1) {
    const set = document.createElement("div");
    set.className = "logo-set";
    set.setAttribute("aria-hidden", copy === 0 ? "false" : "true");
    companies.forEach(([company, className]) => {
      const item = document.createElement("span");
      item.className = className;
      item.textContent = company;
      set.append(item);
    });
    logoTrack.append(set);
  }
}

function setMenu(open) {
  menuToggle?.setAttribute("aria-expanded", String(open));
  menuDrawer?.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("menu-open", open);
}

function parseGlowColor(value) {
  const match = value.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  return match ? { h: Number(match[1]), s: Number(match[2]), l: Number(match[3]) } : { h: 40, s: 80, l: 80 };
}

function setGlowColor(card) {
  const { h, s, l } = parseGlowColor(card.dataset.glowColor || "40 80 80");
  const base = `${h}deg ${s}% ${l}%`;
  card.style.setProperty("--glow-color", `hsl(${base} / 100%)`);
  card.style.setProperty("--glow-color-50", `hsl(${base} / 50%)`);
  card.style.setProperty("--glow-color-30", `hsl(${base} / 30%)`);
  card.style.setProperty("--glow-color-10", `hsl(${base} / 10%)`);
}

function updateGlowFromPointer(card, event) {
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const dx = x - cx;
  const dy = y - cy;
  const kx = dx === 0 ? Infinity : cx / Math.abs(dx);
  const ky = dy === 0 ? Infinity : cy / Math.abs(dy);
  const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  if (angle < 0) angle += 360;
  card.style.setProperty("--edge-proximity", (edge * 100).toFixed(3));
  card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
}

function runGlowSweep(card) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const start = performance.now();
  const duration = 2100;
  card.classList.add("sweep-active");

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const proximity = Math.sin(progress * Math.PI) * 100;
    const angle = 110 + progress * 355;
    card.style.setProperty("--edge-proximity", proximity.toFixed(3));
    card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
    if (progress < 1) {
      window.requestAnimationFrame(tick);
    } else {
      card.style.setProperty("--edge-proximity", "0");
      card.classList.remove("sweep-active");
    }
  }

  window.requestAnimationFrame(tick);
}

menuToggle?.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

menuDrawer?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

glowCards.forEach((card, index) => {
  setGlowColor(card);
  card.addEventListener("pointermove", (event) => updateGlowFromPointer(card, event));
  card.addEventListener("pointerleave", () => card.style.setProperty("--edge-proximity", "0"));
  if (card.dataset.animated === "true") {
    window.setTimeout(() => runGlowSweep(card), 260 + index * 180);
  }
});

appendCurves(curveLeft);
appendCurves(curveRight);
appendCurves(curveTop);
appendServiceSets();
appendLogoSets();

const caseDefinitions = {
  employment: {
    title: "精品就业班 · UI / 工作流",
    directory: "employment",
    firstPage: 4,
    lastPage: 24,
  },
  speaker: {
    title: "智能音箱 · IP 与成长体系",
    directory: "speaker",
    firstPage: 33,
    lastPage: 38,
  },
  wuniu: {
    title: "悟牛 APP · 0 到 1 K12",
    directory: "wuniu",
    firstPage: 39,
    lastPage: 52,
  },
};

const params = new URLSearchParams(window.location.search);
const projectKey = params.get("project");
const project = caseDefinitions[projectKey];
const gallery = document.querySelector("#caseGallery");
const title = document.querySelector("#caseTitle");
const currentPage = document.querySelector("#currentPage");
const totalPages = document.querySelector("#totalPages");
const progress = document.querySelector("#caseProgress");

function padPage(page) {
  return String(page).padStart(2, "0");
}

if (!project) {
  document.title = "项目未找到｜李昊宇";
  gallery.innerHTML = '<p class="case-error">没有找到这个项目，请返回目录重新选择。</p>';
} else {
  document.body.dataset.project = projectKey;
  const pages = Array.from({ length: project.lastPage - project.firstPage + 1 }, (_, index) => project.firstPage + index);
  document.title = `${project.title}｜李昊宇`;
  title.textContent = project.title;
  totalPages.textContent = padPage(pages.length);
  gallery.setAttribute("aria-label", `${project.title} 项目介绍`);
  gallery.innerHTML = pages
    .map(
      (page, index) => `
        <figure class="case-slide" data-index="${index + 1}">
          <img
            src="./assets/portfolio/cases/${project.directory}/page-${padPage(page)}.jpg?v=20260906-hq"
            alt="${project.title}，第 ${index + 1} 页"
            ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}
            decoding="async"
          />
        </figure>`,
    )
    .join("");

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) currentPage.textContent = padPage(Number(visible.target.dataset.index));
    },
    { threshold: [0.25, 0.5, 0.75] },
  );

  gallery.querySelectorAll(".case-slide").forEach((slide) => observer.observe(slide));
}

function updateProgress() {
  const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  progress.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / scrollable))})`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") window.location.href = "./index.html#work";
});
updateProgress();

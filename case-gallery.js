const caseImageSizes = {"employment/page-04.jpg":[2560,2160],"employment/page-05.jpg":[2560,1440],"employment/page-06.jpg":[2560,1440],"employment/page-07.jpg":[2560,1440],"employment/page-08.jpg":[2560,1440],"employment/page-09.jpg":[2560,1440],"employment/page-10.jpg":[2560,1440],"employment/page-11.jpg":[2560,2400],"employment/page-12.jpg":[2560,1440],"employment/page-13.jpg":[2560,1734],"employment/page-14.jpg":[2560,1440],"employment/page-15.jpg":[2560,1440],"employment/page-16.jpg":[2560,1440],"employment/page-17.jpg":[2560,1440],"employment/page-18.jpg":[2560,1867],"employment/page-19.jpg":[2560,2800],"employment/page-20.jpg":[2560,2160],"employment/page-21.jpg":[2560,1734],"employment/page-22.jpg":[2560,1440],"employment/page-23.jpg":[2560,1440],"employment/page-24.jpg":[2560,1440],"seal/page-25.jpg":[2560,2054],"seal/page-26.jpg":[2560,2592],"seal/page-27.jpg":[2560,1440],"seal/page-28.jpg":[2560,4014],"seal/page-29.jpg":[2560,4960],"seal/page-30.jpg":[2560,3995],"seal/page-31.jpg":[2560,7840],"seal/page-32.jpg":[2560,4160],"speaker/page-33.jpg":[2560,5379],"speaker/page-34.jpg":[2560,1440],"speaker/page-35.jpg":[2560,2160],"speaker/page-36.jpg":[2560,4847],"speaker/page-37.jpg":[2560,1440],"speaker/page-38.jpg":[2560,1440],"wuniu/page-39.jpg":[2560,1440],"wuniu/page-40.jpg":[2560,1440],"wuniu/page-41.jpg":[2560,1440],"wuniu/page-42.jpg":[2560,1440],"wuniu/page-43.jpg":[2560,1440],"wuniu/page-44.jpg":[2560,1440],"wuniu/page-45.jpg":[2560,1440],"wuniu/page-46.jpg":[2560,1440],"wuniu/page-47.jpg":[2560,1440],"wuniu/page-48.jpg":[2560,2014],"wuniu/page-49.jpg":[2560,1440],"wuniu/page-50.jpg":[2560,1440],"wuniu/page-51.jpg":[2560,1440],"wuniu/page-52.jpg":[2560,4239]};
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
            width="${caseImageSizes[`${project.directory}/page-${padPage(page)}.jpg`][0]}"
            height="${caseImageSizes[`${project.directory}/page-${padPage(page)}.jpg`][1]}"
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

# Continue after restart

Progress synced: 2026-09-06

## Working project

`/Users/li/Documents/Codex/2026-09-05/jie-g/v-a`

## Current verified state

- The static site runs at `http://127.0.0.1:4174/?mckp-cover=baseline#top` with no main-page build step.
- Per the latest user preference, the intro no longer uses a short black flash. `is-cut-masked` runs from about 2200ms to 3160ms and drives one continuous 960ms `mockup-cut-blend` curve, peaking at 62% black before smoothly returning to transparent. The temporary blur treatment remains removed.
- The main MCKP spotlight in `scene.json` changed from red `#FF0000` to the site's blue `#7467FA`; the scene resource version is `20260905-1`.
- `portfolio.css`, `nav-overrides.css`, and `portfolio.js` are versioned `20260906-11`, `20260906-5`, and `20260906-7` in `index.html`; the lanyard bundle is `20260906-4`.
- The moving top-tab hover pill is restored with an opaque active surface so the gray base label cannot show through.
- Navigation icons follow Figma node `301:389`: inactive icons use 70% opacity and the active icon uses 100%. The former brightness workaround was removed; Resume, Projects, and Contact active states were verified independently. Contact now renders one complete Figma-derived `contact.svg`; frame and dots are no longer independently positioned and always scale together.
- Resume contacts are distributed across the available row; the contact QR sits 12px above the WeChat icon.
- Resume → Projects reuses the soft blue-black upward wipe from Cover → Resume. Projects → Contact keeps the same soft movement but switches to pure black before entering the black contact section, so no directory blue remains at its top edge.
- The cross-boundary feather no longer passes through pure black: it blends the upper cool blue-black `#05122A` through `#020A1B` into the next section's `#00000B`, with transparent ends that preserve both background textures.
- After the 2026-09-06 boundary screenshots, the moving wipe's solid 52% plateau was removed and the seam was shortened to at most 230px. Both Resume → Projects and Projects → Contact were captured at about 0.68 wipe progress without a solid horizontal cut.
- The final edge fix makes both ends of the moving wipe fully transparent (`0 → .44 → .58 → .32 → 0`) and covers only the true section boundary with a narrow 140–190px feather whose opaque `#020817` core occupies 48%–52%.
- The remaining Resume → Projects line came from the first pixel of `.projects-section::after`. Its top now starts at the resume color `#05122A` and fades through blue-black into transparency, matching the Cover → Resume transition logic.
- Resume → Projects now includes the full scroll narrative rather than only a static seam: resume content fades and lifts, a blue-black radial mist travels upward, and the directory title/cards fade in. The seam feather is centered on the true boundary.
- The loading state uses the user-approved wireframe sweep and now traces the current open-laptop cover shape: screen, hinge, keyboard base, and trackpad. The previous phone outline and branded loading copy are removed.
- The sweep and lid-opening timing are unchanged. Only the later camera recenter phase, beginning after the 3160ms cut mask, runs at `1.25×` the base playback speed and resets when the intro completes.
- The resume personal card was restored to its pre-Figma version at the user's request: original portrait front, portfolio-cover back, purple lanyard, and existing physics/drag behavior. Do not reapply the Figma `293:321` card automatically.
- The supplied 54-page PDF has been mapped exactly as requested: Employment 4–24 (21 pages), Seal 25–32 (8 supplemental pages), Speaker 33–38 (6 pages), and Wuniu 39–52 (14 pages). All four cover clicks now route to live project content.
- All 49 project images were re-exported from the user's uncompressed 77MB `protfolio.pdf` at 2560px width and JPEG quality 92. Page ranges, filenames, aspect ratios, and project counts are unchanged; image URLs use `v=20260906-hq` to bypass old compressed browser caches.
- Project-detail header space is consistent across all four entries: about 133px on desktop and 80px on mobile. Employment and Wuniu use solid `#F2F4F7`, Speaker retains sky blue, and Seal uses light gray-white to match its interactive first screen.
- The shared project viewer keeps the header fully clear through the true boundary, then fades the first image in only below that point over 112px with a local 4px blur. No image or blur crosses above the Employment or Wuniu boundary. `case-gallery.css` is versioned `20260906-8` in `case.html`.
- The directory is now a fixed four-card layout: drag, swipe, and arrow-key switching are removed. Hover separation and click-through remain. Direct `#work` entry bypasses the off-screen entry state so cards cannot remain hidden when the page opens at the directory anchor.
- Shared project viewer files are `case.html`, `case-gallery.css`, and `case-gallery.js`; exported source pages are under `assets/portfolio/cases/` and preserve each page's original aspect ratio.
- The Seal project keeps its original interactive page and appends PDF pages 25–32. Its `styles.css` version is `20260906-7`; the fixed return pill now matches the shared project toolbar at 620px wide, 58px high, and the same responsive top offset. The former chapter 04 (“元素拆解，道具设定”) was removed; the former chapter 05 (“激励延伸”) is now chapter 04. The white gap before the PDF supplement was increased by exactly 20px on desktop and mobile.
- A height-aware desktop breakpoint handles laptop screens at 100% zoom. Resume, projects, contact, QR, nav hover, and chapter transitions passed at 1366 × 768, 1440 × 900, and 1920 × 1080.
- Browser console has no errors. Two pre-existing runtime warnings remain: multiple Three.js instances and a deprecated lanyard initialization signature.
- Repeatedly reloading both WebGL experiences in one long-lived test tab can exhaust that tab's WebAssembly/WebGL memory and show both the mockup fallback and a missing lanyard. This is recovered by closing the exhausted tab and opening a fresh main-page tab. A fresh-tab check on 2026-09-06 confirmed the intro, lanyard canvas, four project cards, and all card images with zero console errors.

## Pending work

1. Choose the production hosting target/domain and add its deployment configuration. The handoff archive contains no production platform, repository, domain, or credentials.

## References

- Contact Figma: https://www.figma.com/design/n8OAj2W7WTEmhQQroX2VzA/%E4%B8%AA%E7%AB%99?node-id=274-98355
- Cover layout Figma: node 274:96045 in the same file.
- Directory layout Figma: node 274:98226 / 274:98279 in the same file.

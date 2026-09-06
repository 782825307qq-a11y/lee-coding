# Design QA — Volumetric Blue Flame Field

- Source visual truth: four user-supplied portrait frames: `codex-clipboard-72836747-e1ef-463f-bac4-cbd51adf3d8c.png`, `codex-clipboard-fa38a0c2-8989-40b9-8c0e-7fb534b1a35b.png`, `codex-clipboard-750e4f77-ae08-4828-8054-c97fdfc66624.png`, and `codex-clipboard-7b52f287-fd48-4940-8db9-8b6cedf448cd.png`.
- Reference contact sheet: `/tmp/silk-flame-reference-frames.png`
- Implementation: `http://127.0.0.1:4174/silk-gradient.html`
- Implementation screenshots: `/tmp/silk-flame-morph-frame-1.png` through `/tmp/silk-flame-morph-frame-4.png`
- Side-by-side four-frame comparison: `/tmp/silk-flame-four-frame-comparison.png`
- Source frames: 1080 × 1439 px. Browser portrait captures: 1080 × 1338 px. Both sets were center-fitted to 540 × 720 tiles for equal-density visual comparison.
- Additional responsive evidence: `/tmp/silk-flame-volume-desktop.png` at 1280 × 720 and `/tmp/silk-flame-volume-mobile.png` at 390 × 844.
- Canvas backing buffer: capped at DPR 1.5.
- State: four consecutive animated flame states, captured approximately 470 ms apart.

## Full-view comparison evidence

The combined four-state comparison now shows a shared luminous body feeding unequal flame tongues rather than parallel silk folds. The implementation reproduces the references' dark navy negative space, bright cyan-blue mass, tapered and curling tips, intermittent split tongue, white-hot core, localized pink/peach kernels, and visible fine grain. Consecutive frames also show meaningful changes in tongue length, width, curvature, and visibility.

## Focused-region comparison evidence

A separate crop was not needed because the target is a single full-bleed abstract background with no typography, icons, or fine UI details. The 1:1 full-view comparison keeps all relevant gradients and folds legible.

## Comparison history

1. Initial P2: the first implementation made the entire lower half too uniformly bright and left too little dark falloff on the right.
   - Fix: added a horizontal spatial falloff, narrowed the left blue light pool, tightened the lower-right ice-blue flare, and added paired highlight/shadow folds.
   - Post-fix evidence: `/tmp/silk-gradient-qa-comparison-final.png`.
2. User-found P2: the main light field still read as a horizontal gradient instead of a visibly tilted sheet of silk.
   - Fix: rotated the procedural noise coordinates, increased diagonal depth falloff, and moved the main and secondary folds onto a steeper shared diagonal path.
   - Post-fix evidence: `/tmp/silk-gradient-diagonal-qa-comparison.png`.
3. User-found P2: the tilted field still read as one continuous sheet rather than three to four swaying flame-like wind trails.
   - Fix: replaced the single broad fold with four separate procedural paths, each using its own amplitude, frequency, phase, glow width, bright core, and animation speed; added dark troughs to prevent the strands from merging.
   - Post-fix evidence: `/tmp/silk-gradient-flame-qa-comparison.png`.
4. Video-grounded P2: the still-image interpretation used the wrong diagonal direction and overly narrow, graphic trails.
   - Fix: extracted consecutive frames from `222.mp4`, flipped the bands to rise from lower-left toward upper-right, widened their glow envelopes, softened their cores, and matched the video's subtle deformation rate.
   - Post-fix evidence: `/tmp/silk-gradient-video-reference-comparison.png`.
5. User-found P2: the separated paths still looked too regular and line-like.
   - Fix: replaced individual path strokes with a domain-warped wave field, reduced the field to three-to-four broad folds, added nonuniform density and a soft fork, lowered dark-stripe contrast, and removed flickering grain.
   - Post-fix evidence: `/tmp/silk-gradient-organic-clean-comparison.png`.
6. User-found P2: the flame field remained too monochromatic and missed the reference's subtle warm spectral colour.
   - Fix: bound ice, lavender, rose, and peach masks to the same warped fold field; localized warm colour to moving core segments and spectral edges; clamped all cosine waves before fractional powers to remove isolated black GPU pixels.
   - Post-fix evidence: `/tmp/silk-gradient-flame-palette-comparison.png`.
7. User-found P2: the luminous folds still lacked enough peak brightness and did not read as emissive flame cores.
   - Fix: increased the lower-left blue energy slightly and added a narrow sixth-power hot-core mask with ice-blue additive light and a near-white flare, leaving the surrounding navy troughs unchanged.
   - Post-fix evidence: `/tmp/silk-gradient-brighter-core-comparison.png`; before/after evidence: `/tmp/silk-gradient-brightness-before-after.png`.
8. User-found P1: the simulation still read as silk and did not match the four supplied flame frames; the reference also contained a clear fine-grain texture.
   - Fix: replaced the periodic wave field with one volumetric body feeding three independently tapered tongues; added animated width, length, curl, internal dark cuts, appearance/disappearance, moving warm kernels, and additive two-pixel luminance grain that survives DPR downsampling.
   - Post-fix evidence: `/tmp/silk-flame-four-frame-comparison.png`, `/tmp/silk-flame-volume-desktop.png`, and `/tmp/silk-flame-volume-mobile.png`.

## Required fidelity surfaces

- Fonts and typography: not applicable; the standalone visual contains no text.
- Spacing and layout rhythm: full-bleed canvas covers the viewport without seams, clipping, or margins.
- Colors and visual tokens: near-black blue negative space, saturated cobalt/cyan volume, ice-white cores, and small rose/peach kernels match the new frame set.
- Image quality and asset fidelity: procedural WebGL output stays full-resolution at DPR up to 1.5; stable additive grain matches the supplied texture without producing dead black pixels.
- Copy and content: no visible copy is part of the target.

## Interaction and runtime checks

- Consecutive final portrait captures change by 19.020–22.255 red, 22.331–25.229 green, and 25.382–27.433 blue mean RGB over roughly 470 ms, confirming clearly visible flame morphing rather than a drifting static ribbon.
- Pointer movement produces a restrained local light response without changing the composition.
- `prefers-reduced-motion` renders a stable still frame.
- 1080 px portrait, 1280 × 720 desktop, and 390 × 844 mobile layouts verified.
- WebGL canvas rendered successfully; no browser console errors or framework overlay.

## Findings

No remaining P0, P1, or P2 mismatch in the requested standalone animated-background scope. Exact flame contours intentionally vary continuously, as they do across the supplied reference frames.

final result: passed

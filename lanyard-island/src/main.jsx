import React from 'react';
import { createRoot } from 'react-dom/client';
import Lanyard from './Lanyard/Lanyard';
import FluidGlassNav from './FluidGlass/FluidGlassNav';
import SiteSideRays from './SideRays/SiteSideRays';
import './main.css';
import './FluidGlass/FluidGlass.css';

const mount = document.querySelector('#resumeLanyard');

if (mount) {
  createRoot(mount).render(
    <React.StrictMode>
      <Lanyard
        position={[0, 0, 12.45]}
        gravity={[0, -40, 0]}
        frontImage="./assets/portfolio/resume-portrait-2026.jpg"
        backImage="./assets/portfolio/portfolio-cover.webp"
        imageFit="contain"
        lanyardWidth={0.5}
      />
    </React.StrictMode>
  );
}

const fluidGlassMount = document.querySelector('#fluidGlassNav');

if (fluidGlassMount) {
  createRoot(fluidGlassMount).render(
    <React.StrictMode>
      <FluidGlassNav />
    </React.StrictMode>
  );
}

const sideRaysMount = document.querySelector('#sideRaysRoot');

if (sideRaysMount) {
  createRoot(sideRaysMount).render(
    <React.StrictMode>
      <SiteSideRays />
    </React.StrictMode>
  );
}

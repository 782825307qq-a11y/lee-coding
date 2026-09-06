import SideRays from './SideRays';

export default function SiteSideRays() {
  return (
    <div className="site-side-rays" aria-hidden="true">
      <SideRays
        rayColor1="#65c0ff"
        rayColor2="#deeeff"
        origin="top-left"
        speed={1.9}
        intensity={1.2}
        spread={1.5}
        tilt={0}
        saturation={1.5}
        blend={0.75}
        falloff={1.6}
        opacity={0.6}
      />
    </div>
  );
}

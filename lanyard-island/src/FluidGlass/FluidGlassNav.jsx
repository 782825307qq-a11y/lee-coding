import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import GlassSurface from '../GlassSurface/GlassSurface';

const NAV_ITEMS = [
  { label: '简历', icons: ['/assets/portfolio/navigation/resume.svg'] },
  { label: '项目', icons: ['/assets/portfolio/navigation/project.svg'] },
  {
    label: '联系',
    icons: [
      '/assets/portfolio/navigation/contact-frame.svg',
      '/assets/portfolio/navigation/contact-dots.svg'
    ]
  }
];

function readActiveSection(nav) {
  const value = nav?.dataset.activeSection;
  return value === 'none' || value == null ? null : Number(value);
}

function useNavigationState() {
  const nav = document.querySelector('.nav-links');
  const [activeIndex, setActiveIndex] = useState(() => readActiveSection(nav));
  const [hoverIndex, setHoverIndex] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (!nav) return undefined;

    const links = [...nav.querySelectorAll('.nav-link[data-nav-index]')];
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncActive = () => setActiveIndex(readActiveSection(nav));
    const clearHover = () => setHoverIndex(null);
    const listeners = [];

    syncActive();
    const observer = new MutationObserver(syncActive);
    observer.observe(nav, { attributes: true, attributeFilter: ['data-active-section'] });

    links.forEach((link, index) => {
      const enter = () => {
        if (hoverQuery.matches) setHoverIndex(index);
      };
      const focus = () => setHoverIndex(index);
      link.addEventListener('pointerenter', enter);
      link.addEventListener('focus', focus);
      listeners.push([link, 'pointerenter', enter], [link, 'focus', focus]);
    });

    const syncMotion = () => setReducedMotion(motionQuery.matches);
    const clearKeyboardHover = event => {
      if (!nav.contains(event.relatedTarget)) clearHover();
    };

    nav.addEventListener('pointerleave', clearHover);
    nav.addEventListener('focusout', clearKeyboardHover);
    window.addEventListener('hashchange', syncActive);
    window.addEventListener('pageshow', syncActive);
    motionQuery.addEventListener('change', syncMotion);

    return () => {
      observer.disconnect();
      listeners.forEach(([target, type, listener]) => target.removeEventListener(type, listener));
      nav.removeEventListener('pointerleave', clearHover);
      nav.removeEventListener('focusout', clearKeyboardHover);
      window.removeEventListener('hashchange', syncActive);
      window.removeEventListener('pageshow', syncActive);
      motionQuery.removeEventListener('change', syncMotion);
    };
  }, [nav]);

  return {
    activeIndex,
    visualIndex: hoverIndex ?? activeIndex,
    reducedMotion
  };
}

function NavIcon({ item }) {
  return (
    <span className="liquid-glass-nav-icon">
      {item.icons.map((icon, iconIndex) => (
        <img
          className={iconIndex === 1 ? 'liquid-glass-nav-icon-dots' : undefined}
          src={icon}
          alt=""
          key={icon}
        />
      ))}
    </span>
  );
}

function GlassNav({ activeIndex, visualIndex, reducedMotion }) {
  const selectedItem = visualIndex == null ? null : NAV_ITEMS[visualIndex];

  return (
    <div className="liquid-glass-nav-portal-base" aria-hidden="true">
      <GlassSurface
        width="100%"
        height="100%"
        borderRadius={26}
        borderWidth={0.08}
        brightness={50}
        opacity={0.93}
        blur={11}
        displace={0.5}
        backgroundOpacity={0.1}
        saturation={1}
        distortionScale={-180}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
        mixBlendMode="difference"
        className="liquid-glass-nav-surface"
      >
        <div className="liquid-glass-nav-labels">
          {NAV_ITEMS.map(item => (
            <span className="liquid-glass-nav-label" key={item.label}>
              <NavIcon item={item} />
              <span>{item.label}</span>
            </span>
          ))}
        </div>
      </GlassSurface>

      <div
        className={`liquid-glass-nav-active${selectedItem ? ' is-visible' : ''}${reducedMotion ? ' is-reduced-motion' : ''}`}
        style={{ '--active-index': visualIndex ?? activeIndex ?? 0 }}
      >
        <GlassSurface
          width="100%"
          height="100%"
          borderRadius={29}
          borderWidth={0.1}
          brightness={68}
          opacity={0.9}
          blur={8}
          displace={0.7}
          backgroundOpacity={0.7}
          saturation={1.2}
          distortionScale={-220}
          redOffset={2}
          greenOffset={18}
          blueOffset={32}
          mixBlendMode="screen"
          className="liquid-glass-nav-active-surface"
        >
          {selectedItem ? (
            <span className="liquid-glass-nav-active-label">
              <NavIcon item={selectedItem} />
              <span>{selectedItem.label}</span>
            </span>
          ) : null}
        </GlassSurface>
      </div>
    </div>
  );
}

export default function FluidGlassNav() {
  const navigation = useNavigationState();
  return createPortal(<GlassNav {...navigation} />, document.body);
}

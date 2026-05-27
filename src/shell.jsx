const { useState: useStateS, useEffect: useEffectS } = React;

const CHAPTERS = [
  { id: 'opener',   label: 'Opener' },
  { id: 'scale',    label: '01 · Scale' },
  { id: 'types',    label: '02 · Types' },
  { id: 'where',    label: '03 · Where' },
  { id: 'trend',    label: '04 · Trend' },
  { id: 'centres',  label: '05 · Centres' },
  { id: 'closer',   label: 'Closer' },
];

function ScrollProgress() {
  const [w, setW] = useStateS(0);
  useEffectS(() => {
    const onScroll = () => {
      const max = (document.documentElement.scrollHeight - window.innerHeight);
      setW(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div
      className="scroll-progress"
      style={{ width: `${w * 100}%` }}
      aria-hidden="true"
    />
  );
}

function ChapterRail() {
  const [active, setActive] = useStateS('opener');

  useEffectS(() => {
    const ids = CHAPTERS.map(c => c.id);
    const els = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      let best = null;
      for (const e of entries) {
        if (e.isIntersecting) {
          if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
        }
      }
      if (best) setActive(best.target.id);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.1, 0.3, 0.5, 0.8] });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="chapter-rail" aria-label="Chapters">
      {CHAPTERS.map(c => (
        <button
          key={c.id}
          className={`dot ${active === c.id ? 'active' : ''}`}
          onClick={() => {
            const el = document.getElementById(c.id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          aria-label={c.label}
        >
          <span className="label">{c.label}</span>
        </button>
      ))}
    </nav>
  );
}

Object.assign(window, { ScrollProgress, ChapterRail });

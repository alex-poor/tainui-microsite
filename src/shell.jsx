const { useState: useStateS, useEffect: useEffectS } = React;

const CHAPTER_IDS = ['opener', 'scale', 'types', 'where', 'trend', 'centres', 'closer'];
const CHAPTER_KEYS = ['ch_opener', 'ch_scale', 'ch_types', 'ch_where', 'ch_trend', 'ch_centres', 'ch_closer'];

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
  const t = useT();

  useEffectS(() => {
    const els = CHAPTER_IDS.map(id => document.getElementById(id)).filter(Boolean);
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
      {CHAPTER_IDS.map((id, i) => (
        <button
          key={id}
          className={`dot ${active === id ? 'active' : ''}`}
          onClick={() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          aria-label={t(CHAPTER_KEYS[i])}
        >
          <span className="label">{t(CHAPTER_KEYS[i])}</span>
        </button>
      ))}
    </nav>
  );
}

function LangPicker() {
  const { lang, setLang } = useLang();
  const t = useT();

  return (
    <div className="lang-picker">
      <button
        className={lang === 'mi' ? 'active' : ''}
        onClick={() => setLang('mi')}
      >{t('lang_mi')}</button>
      <span className="lang-sep">·</span>
      <button
        className={lang === 'en' ? 'active' : ''}
        onClick={() => setLang('en')}
      >{t('lang_en')}</button>
    </div>
  );
}

Object.assign(window, { ScrollProgress, ChapterRail, LangPicker });

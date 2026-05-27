const { useEffect, useRef, useState, useMemo, useCallback } = React;

const fmt = {
  big: (n) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
    if (n >= 10_000) return (n / 1_000).toFixed(0) + 'k';
    return n.toLocaleString('en-NZ');
  },
  full: (n) => Number(n).toLocaleString('en-NZ'),
  pct: (n, d = 0) => `${Number(n).toFixed(d)}%`,
  dollar: (n) => {
    if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1_000) return '$' + (n / 1_000).toFixed(0) + 'k';
    return '$' + Number(n).toFixed(0);
  },
  dollarFull: (n) => '$' + Number(n).toLocaleString('en-NZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
};

const RAMP = ['#eae4d6', '#d4c49e', '#c9933a', '#8a6520', '#5a3f10'];

function mix(a, b, t) {
  const ah = a.replace('#', ''), bh = b.replace('#', '');
  const ar = parseInt(ah.slice(0,2), 16), ag = parseInt(ah.slice(2,4), 16), ab_ = parseInt(ah.slice(4,6), 16);
  const br = parseInt(bh.slice(0,2), 16), bg = parseInt(bh.slice(2,4), 16), bb = parseInt(bh.slice(4,6), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab_ + (bb - ab_) * t);
  return `rgb(${r},${g},${bl})`;
}

function colorForValue(value, maxVal) {
  if (value == null || isNaN(value)) return 'transparent';
  const v = Math.max(0, Math.min(maxVal, value));
  const t = v / maxVal;
  const idx = t * (RAMP.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(RAMP.length - 1, lo + 1);
  const frac = idx - lo;
  return mix(RAMP[lo], RAMP[hi], frac);
}

function useInView(opts = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setInView(true); return; }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { rootMargin: '-10% 0px -15% 0px', threshold: 0.05, ...opts });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Eyebrow({ children }) {
  return (
    <div className="eyebrow">
      <span className="rule" />
      {children}
    </div>
  );
}

function SectionFooter({ chap, note }) {
  return (
    <div className="section-footer">
      <span style={{ maxWidth: 800 }}>{note}</span>
      <span className="chap">{chap}</span>
    </div>
  );
}

function NumInline({ children }) {
  return (
    <span style={{
      fontFamily: 'var(--sans)', fontWeight: 600,
      fontVariantNumeric: 'tabular-nums', color: 'var(--ink-soft)',
    }}>{children}</span>
  );
}

Object.assign(window, {
  useState, useEffect, useRef, useMemo, useCallback,
  fmt, RAMP, colorForValue, mix,
  useInView, Eyebrow, SectionFooter, NumInline,
});

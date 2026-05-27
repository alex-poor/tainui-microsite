function Act4Trend() {
  const data = useTainuiData();
  const [ref, inView] = useInView();

  const WAIKATO_TLAS = new Set(['Hamilton City', 'Matamata-Piako District', 'Otorohanga District', 'Waikato District', 'Waipa District']);
  const QUARTERS = [
    'Mar 2023','Jun 2023','Sep 2023','Dec 2023',
    'Mar 2024','Jun 2024','Sep 2024','Dec 2024',
    'Mar 2025','Jun 2025','Sep 2025','Dec 2025',
    'Mar 2026'
  ];

  const { grantsByQ, amountsByQ, maxG, maxA, changeGrants, changeAmount } = useMemo(() => {
    const gq = {}, aq = {};
    for (const q of QUARTERS) { gq[q] = 0; aq[q] = 0; }

    for (const r of data.tlaGrants) {
      if (WAIKATO_TLAS.has(r.tla) && r.hardship_type === 'All hardship') {
        gq[r.quarter] += r.grants;
      }
    }
    for (const r of data.tlaAmounts) {
      if (WAIKATO_TLAS.has(r.tla) && r.hardship_type === 'All hardship') {
        aq[r.quarter] += r.amount;
      }
    }

    const gVals = QUARTERS.map(q => gq[q]);
    const aVals = QUARTERS.map(q => aq[q]);

    return {
      grantsByQ: gq,
      amountsByQ: aq,
      maxG: Math.max(...gVals),
      maxA: Math.max(...aVals),
      changeGrants: ((gVals[gVals.length - 1] - gVals[0]) / gVals[0] * 100).toFixed(0),
      changeAmount: ((aVals[aVals.length - 1] - aVals[0]) / aVals[0] * 100).toFixed(0),
    };
  }, [data]);

  const W = 700, H = 260, PAD = { t: 20, r: 20, b: 40, l: 20 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;

  function makePath(values, maxVal) {
    return values.map((v, i) => {
      const x = PAD.l + (i / (values.length - 1)) * plotW;
      const y = PAD.t + plotH - (v / maxVal) * plotH;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }

  function makeArea(values, maxVal) {
    const path = makePath(values, maxVal);
    const lastX = PAD.l + plotW;
    const firstX = PAD.l;
    const baseY = PAD.t + plotH;
    return `${path} L${lastX},${baseY} L${firstX},${baseY} Z`;
  }

  const grantVals = QUARTERS.map(q => grantsByQ[q]);
  const amountVals = QUARTERS.map(q => amountsByQ[q]);

  return (
    <section id="trend" className="section" ref={ref}>
      <div className={`reveal ${inView ? 'in' : ''}`}>
        <Eyebrow>04 · Trend</Eyebrow>
        <h2 className="h2">Grant numbers hold steady.<br />Spending has halved.</h2>
        <p className="lede">
          The number of hardship grants per quarter has stayed remarkably stable — around
          50–60 thousand. But total spending has fallen sharply, driven by the collapse in
          emergency housing costs.
        </p>
      </div>

      {/* Grants line chart */}
      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48 }}>
        <div className="caption" style={{ marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Grants per quarter
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, height: 'auto' }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(t => {
            const y = PAD.t + plotH - t * plotH;
            return <line key={t} x1={PAD.l} y1={y} x2={PAD.l + plotW} y2={y}
              stroke="var(--rule)" strokeWidth="0.5" />;
          })}

          <path d={makeArea(grantVals, maxG * 1.1)} fill="var(--accent)" opacity="0.08" />
          <path d={makePath(grantVals, maxG * 1.1)} fill="none"
            stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />

          {/* Dots */}
          {grantVals.map((v, i) => {
            const x = PAD.l + (i / (grantVals.length - 1)) * plotW;
            const y = PAD.t + plotH - (v / (maxG * 1.1)) * plotH;
            return <circle key={i} cx={x} cy={y} r="3" fill="var(--accent)">
              <title>{QUARTERS[i]}: {fmt.full(v)} grants</title>
            </circle>;
          })}

          {/* X-axis labels */}
          {QUARTERS.map((q, i) => {
            if (i % 4 !== 0 && i !== QUARTERS.length - 1) return null;
            const x = PAD.l + (i / (QUARTERS.length - 1)) * plotW;
            return <text key={i} x={x} y={H - 8} textAnchor="middle"
              style={{ fontSize: 10, fontFamily: 'var(--sans)', fill: 'var(--mute)' }}>
              {q}
            </text>;
          })}
        </svg>
      </div>

      {/* Amount line chart */}
      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48 }}>
        <div className="caption" style={{ marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Amount granted per quarter
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, height: 'auto' }}>
          {[0, 0.25, 0.5, 0.75, 1].map(t => {
            const y = PAD.t + plotH - t * plotH;
            return <line key={t} x1={PAD.l} y1={y} x2={PAD.l + plotW} y2={y}
              stroke="var(--rule)" strokeWidth="0.5" />;
          })}

          <path d={makeArea(amountVals, maxA * 1.1)} fill="var(--gold)" opacity="0.1" />
          <path d={makePath(amountVals, maxA * 1.1)} fill="none"
            stroke="var(--gold)" strokeWidth="2" strokeLinejoin="round" />

          {amountVals.map((v, i) => {
            const x = PAD.l + (i / (amountVals.length - 1)) * plotW;
            const y = PAD.t + plotH - (v / (maxA * 1.1)) * plotH;
            return <circle key={i} cx={x} cy={y} r="3" fill="var(--gold)">
              <title>{QUARTERS[i]}: {fmt.dollarFull(v)}</title>
            </circle>;
          })}

          {QUARTERS.map((q, i) => {
            if (i % 4 !== 0 && i !== QUARTERS.length - 1) return null;
            const x = PAD.l + (i / (QUARTERS.length - 1)) * plotW;
            return <text key={i} x={x} y={H - 8} textAnchor="middle"
              style={{ fontSize: 10, fontFamily: 'var(--sans)', fill: 'var(--mute)' }}>
              {q}
            </text>;
          })}
        </svg>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48 }}>
        <div className="callout">
          <b>The divergence</b>
          Grant volumes dropped just {Math.abs(changeGrants)}% from Q1 2023 to Q1 2026,
          but total spending fell {Math.abs(changeAmount)}%. The main driver: emergency housing
          spending peaked in mid-2023 and has dropped dramatically since — likely reflecting
          policy changes in emergency housing provision.
        </div>

        <p className="body">
          The stability of grant numbers is striking. Quarter after quarter, roughly 50,000
          grants are issued across the Waikato. The need hasn't gone away — it's the type
          and cost of assistance that has shifted.
        </p>
      </div>

      <SectionFooter
        chap="04 / 05"
        note="Quarterly periods ending March, June, September, December."
      />
    </section>
  );
}

window.Act4Trend = Act4Trend;

function Act2Types() {
  const data = useTainuiData();
  const [ref, inView] = useInView();
  const t = useT();

  const WAIKATO_TLAS = new Set(['Hamilton City', 'Matamata-Piako District', 'Otorohanga District', 'Waikato District', 'Waipa District']);
  const SPECIFIC_TYPES = ['Food', 'Emergency Housing', 'Electricity Assistance', 'Stranded Travel - Petrol', 'Gas Assistance'];
  const QUARTERS = ['Mar 2023','Jun 2023','Sep 2023','Dec 2023','Mar 2024','Jun 2024','Sep 2024','Dec 2024','Mar 2025','Jun 2025','Sep 2025','Dec 2025','Mar 2026'];

  const { byTypeGrants, byTypeAmount, maxGrants, maxAmount, byTypeQuarterly, housingPeakIdx, housingTroughIdx } = useMemo(() => {
    const grantsByType = {};
    const amountsByType = {};
    const quarterly = {};
    for (const tp of SPECIFIC_TYPES) {
      grantsByType[tp] = data.tlaGrants.filter(r => WAIKATO_TLAS.has(r.tla) && r.hardship_type === tp).reduce((s, r) => s + r.grants, 0);
      amountsByType[tp] = data.tlaAmounts.filter(r => WAIKATO_TLAS.has(r.tla) && r.hardship_type === tp).reduce((s, r) => s + r.amount, 0);
      const qMap = {};
      for (const q of QUARTERS) qMap[q] = 0;
      for (const r of data.tlaAmounts) {
        if (WAIKATO_TLAS.has(r.tla) && r.hardship_type === tp) qMap[r.quarter] += r.amount;
      }
      quarterly[tp] = QUARTERS.map(q => qMap[q]);
    }
    const housingSeries = quarterly['Emergency Housing'];
    const peakIdx = housingSeries.indexOf(Math.max(...housingSeries));
    let troughIdx = peakIdx;
    for (let i = peakIdx; i < housingSeries.length; i++) {
      if (housingSeries[i] < housingSeries[peakIdx] * 0.2) { troughIdx = i; break; }
    }
    return {
      byTypeGrants: grantsByType, byTypeAmount: amountsByType,
      maxGrants: Math.max(...Object.values(grantsByType)),
      maxAmount: Math.max(...Object.values(amountsByType)),
      byTypeQuarterly: quarterly,
      housingPeakIdx: peakIdx,
      housingTroughIdx: troughIdx,
    };
  }, [data]);

  const grantsSorted = SPECIFIC_TYPES.slice().sort((a, b) => byTypeGrants[b] - byTypeGrants[a]);
  const amountSorted = SPECIFIC_TYPES.slice().sort((a, b) => byTypeAmount[b] - byTypeAmount[a]);

  const TYPE_KEY = {
    'Food': 'type_food', 'Emergency Housing': 'type_housing',
    'Electricity Assistance': 'type_electricity', 'Stranded Travel - Petrol': 'type_petrol',
    'Gas Assistance': 'type_gas',
  };

  const totalG = Object.values(byTypeGrants).reduce((a, b) => a + b, 0);
  const totalA = Object.values(byTypeAmount).reduce((a, b) => a + b, 0);

  // Line chart geometry
  const LW = 760, LH = 360, LPAD = { t: 30, r: 140, b: 50, l: 60 };
  const plotW = LW - LPAD.l - LPAD.r;
  const plotH = LH - LPAD.t - LPAD.b;
  const maxLineVal = Math.max(...Object.values(byTypeQuarterly).flat());
  const yScale = (v) => LPAD.t + plotH - (v / (maxLineVal * 1.05)) * plotH;
  const xScale = (i) => LPAD.l + (i / (QUARTERS.length - 1)) * plotW;

  function makePath(vals) {
    return vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${xScale(i).toFixed(1)},${yScale(v).toFixed(1)}`).join(' ');
  }

  const TYPE_COLORS = {
    'Emergency Housing': 'var(--gold)',
    'Food': 'var(--accent)',
    'Electricity Assistance': '#6a9dc4',
    'Stranded Travel - Petrol': '#a0c4dd',
    'Gas Assistance': '#c8dde8',
  };
  const TYPE_LINE_ORDER = ['Emergency Housing', 'Food', 'Electricity Assistance', 'Stranded Travel - Petrol', 'Gas Assistance'];

  const housingPeakVal = byTypeQuarterly['Emergency Housing'][housingPeakIdx];
  const housingTroughVal = byTypeQuarterly['Emergency Housing'][housingTroughIdx];
  const housingLatestVal = byTypeQuarterly['Emergency Housing'][QUARTERS.length - 1];
  const foodLatestVal = byTypeQuarterly['Food'][QUARTERS.length - 1];

  return (
    <section id="types" className="section" ref={ref}>
      <div className={`reveal ${inView ? 'in' : ''}`}>
        <Eyebrow>{t('act2_eyebrow')}</Eyebrow>
        <h2 className="h2">{t('act2_title')}</h2>
        <p className="lede">{t('act2_lede')}</p>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
          <div>
            <div className="caption" style={{ marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {t('act2_chart_grants')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {grantsSorted.map((tp, i) => {
                const pct = (byTypeGrants[tp] / maxGrants) * 100;
                return (
                  <div key={tp} className="bar-row" style={{ gridTemplateColumns: '120px 1fr 70px', gap: 12 }}>
                    <span className="lbl">{t(TYPE_KEY[tp])}</span>
                    <span className={`bar ${i === 0 ? 'accent' : ''}`}
                      style={{ width: `${pct}%`, transition: inView ? 'width 800ms cubic-bezier(0.2,0.7,0.3,1)' : 'none', transitionDelay: `${i * 80}ms` }} />
                    <span className="num">{fmt.big(byTypeGrants[tp])}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div className="caption" style={{ marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {t('act2_chart_amount')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {amountSorted.map((tp, i) => {
                const pct = (byTypeAmount[tp] / maxAmount) * 100;
                return (
                  <div key={tp} className="bar-row" style={{ gridTemplateColumns: '120px 1fr 70px', gap: 12 }}>
                    <span className="lbl">{t(TYPE_KEY[tp])}</span>
                    <span className={`bar ${i === 0 ? 'accent' : ''}`}
                      style={{ width: `${pct}%`, transition: inView ? 'width 800ms cubic-bezier(0.2,0.7,0.3,1)' : 'none', transitionDelay: `${i * 80}ms` }} />
                    <span className="num">{fmt.dollar(byTypeAmount[tp])}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48 }}>
        <div className="callout">
          <b>{t('act2_callout_title')}</b>
          {t('act2_callout', {
            grantsPct: fmt.pct(byTypeGrants['Emergency Housing'] / totalG * 100, 0),
            amountPct: fmt.pct(byTypeAmount['Emergency Housing'] / totalA * 100, 0),
          })}
        </div>
        <p className="body">{t('act2_body1', { foodGrants: fmt.full(byTypeGrants['Food']) })}</p>
        <p className="body">{t('act2_body2', { housingAmount: fmt.dollarFull(byTypeAmount['Emergency Housing']) })}</p>
      </div>

      {/* Annotated line chart: dollar spend by type over time */}
      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 80, paddingTop: 40, borderTop: '1px solid var(--rule)' }}>
        <div className="caption" style={{ marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)' }}>
          {t('act2_compare_eyebrow')}
        </div>
        <h3 style={{
          fontFamily: 'var(--serif)', fontWeight: 400,
          fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: 1.1,
          letterSpacing: '-0.02em', color: 'var(--ink-soft)',
          margin: '0 0 16px', textWrap: 'balance', maxWidth: 800,
        }}>{t('act2_compare_title')}</h3>
        <p className="body" style={{ maxWidth: 720 }}>{t('act2_compare_lede')}</p>

        <div style={{ marginTop: 32, maxWidth: LW }}>
          <svg viewBox={`0 0 ${LW} ${LH}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
            {/* Y-axis grid + labels */}
            {[0, 0.25, 0.5, 0.75, 1].map(tk => {
              const val = maxLineVal * 1.05 * tk;
              const y = LPAD.t + plotH - tk * plotH;
              return (
                <g key={tk}>
                  <line x1={LPAD.l} y1={y} x2={LPAD.l + plotW} y2={y} stroke="var(--rule)" strokeWidth="0.5" />
                  <text x={LPAD.l - 8} y={y + 3} textAnchor="end"
                    style={{ fontSize: 10, fontFamily: 'var(--sans)', fill: 'var(--mute)' }}>
                    {fmt.dollar(val)}
                  </text>
                </g>
              );
            })}

            {/* Annotation band: housing collapse window */}
            <rect
              x={xScale(housingPeakIdx)}
              y={LPAD.t}
              width={xScale(housingTroughIdx) - xScale(housingPeakIdx)}
              height={plotH}
              fill="var(--gold)" opacity="0.07"
            />
            <line
              x1={xScale(housingPeakIdx)} y1={LPAD.t}
              x2={xScale(housingPeakIdx)} y2={LPAD.t + plotH}
              stroke="var(--gold)" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.6"
            />
            <line
              x1={xScale(housingTroughIdx)} y1={LPAD.t}
              x2={xScale(housingTroughIdx)} y2={LPAD.t + plotH}
              stroke="var(--gold)" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.6"
            />
            <text
              x={(xScale(housingPeakIdx) + xScale(housingTroughIdx)) / 2}
              y={LPAD.t - 10}
              textAnchor="middle"
              style={{ fontSize: 10.5, fontFamily: 'var(--sans)', fill: 'var(--gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              {t('act2_annot_collapse')}
            </text>

            {/* Lines for each type, drawn back-to-front */}
            {TYPE_LINE_ORDER.slice().reverse().map(tp => (
              <path
                key={tp}
                d={makePath(byTypeQuarterly[tp])}
                fill="none"
                stroke={TYPE_COLORS[tp]}
                strokeWidth={tp === 'Emergency Housing' || tp === 'Food' ? 2.5 : 1.5}
                opacity={tp === 'Emergency Housing' || tp === 'Food' ? 1 : 0.65}
                strokeLinejoin="round"
              />
            ))}

            {/* Endpoint labels — vertically de-collided */}
            {(() => {
              const MIN_GAP = 14;
              const labels = TYPE_LINE_ORDER.map(tp => ({
                tp,
                lastVal: byTypeQuarterly[tp][QUARTERS.length - 1],
                y: yScale(byTypeQuarterly[tp][QUARTERS.length - 1]),
              })).sort((a, b) => a.y - b.y);
              // Bottom-up adjustment to enforce minimum gap
              for (let i = 1; i < labels.length; i++) {
                if (labels[i].y - labels[i-1].y < MIN_GAP) {
                  labels[i].y = labels[i-1].y + MIN_GAP;
                }
              }
              return labels.map(({ tp, lastVal, y }) => {
                const lineEndX = xScale(QUARTERS.length - 1);
                const labelX = lineEndX + 14;
                const isHero = tp === 'Emergency Housing' || tp === 'Food';
                const dotY = yScale(lastVal);
                return (
                  <g key={tp}>
                    <circle cx={lineEndX} cy={dotY} r="3" fill={TYPE_COLORS[tp]} />
                    {/* connector if shifted */}
                    {Math.abs(y - dotY) > 1 && (
                      <line x1={lineEndX + 3} y1={dotY} x2={labelX - 2} y2={y}
                        stroke={TYPE_COLORS[tp]} strokeWidth="0.75" opacity="0.5" />
                    )}
                    <text x={labelX} y={y + 3}
                      style={{
                        fontSize: isHero ? 11 : 10,
                        fontFamily: 'var(--sans)',
                        fill: isHero ? 'var(--ink-soft)' : 'var(--mute)',
                        fontWeight: isHero ? 600 : 400,
                      }}>
                      {t(TYPE_KEY[tp])}
                    </text>
                  </g>
                );
              });
            })()}

            {/* Peak callout (housing) */}
            <g>
              <circle cx={xScale(housingPeakIdx)} cy={yScale(housingPeakVal)} r="4"
                fill="var(--bg)" stroke="var(--gold)" strokeWidth="2" />
              <text x={xScale(housingPeakIdx) + 8} y={yScale(housingPeakVal) - 8}
                style={{ fontSize: 10.5, fontFamily: 'var(--sans)', fill: 'var(--gold)', fontWeight: 600 }}>
                {t('act2_annot_peak', { val: fmt.dollar(housingPeakVal) })}
              </text>
            </g>

            {/* X-axis labels */}
            {QUARTERS.map((q, i) => {
              if (i % 4 !== 0 && i !== QUARTERS.length - 1) return null;
              return (
                <text key={i} x={xScale(i)} y={LPAD.t + plotH + 18} textAnchor="middle"
                  style={{ fontSize: 10, fontFamily: 'var(--sans)', fill: 'var(--mute)' }}>
                  {q}
                </text>
              );
            })}
          </svg>
        </div>

        <div className="callout" style={{ marginTop: 32 }}>
          <b>{t('act2_compare_callout_title')}</b>
          {t('act2_compare_callout', {
            housingPeak: fmt.dollar(housingPeakVal),
            housingLatest: fmt.dollar(housingLatestVal),
            foodLatest: fmt.dollar(foodLatestVal),
          })}
        </div>
      </div>

      <SectionFooter chap="02 / 05" note={t('act2_footer')} />
    </section>
  );
}

window.Act2Types = Act2Types;

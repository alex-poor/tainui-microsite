function Act4Trend() {
  const data = useTainuiData();
  const [ref, inView] = useInView();
  const t = useT();

  const WAIKATO_TLAS = new Set(['Hamilton City', 'Matamata-Piako District', 'Otorohanga District', 'Waikato District', 'Waipa District']);
  const QUARTERS = ['Mar 2023','Jun 2023','Sep 2023','Dec 2023','Mar 2024','Jun 2024','Sep 2024','Dec 2024','Mar 2025','Jun 2025','Sep 2025','Dec 2025','Mar 2026'];

  const { grantsByQ, amountsByQ, maxG, maxA, changeGrants, changeAmount } = useMemo(() => {
    const gq = {}, aq = {};
    for (const q of QUARTERS) { gq[q] = 0; aq[q] = 0; }
    for (const r of data.tlaGrants) { if (WAIKATO_TLAS.has(r.tla) && r.hardship_type === 'All hardship') gq[r.quarter] += r.grants; }
    for (const r of data.tlaAmounts) { if (WAIKATO_TLAS.has(r.tla) && r.hardship_type === 'All hardship') aq[r.quarter] += r.amount; }
    const gV = QUARTERS.map(q => gq[q]), aV = QUARTERS.map(q => aq[q]);
    return {
      grantsByQ: gq, amountsByQ: aq,
      maxG: Math.max(...gV), maxA: Math.max(...aV),
      changeGrants: ((gV[gV.length-1] - gV[0]) / gV[0] * 100).toFixed(0),
      changeAmount: ((aV[aV.length-1] - aV[0]) / aV[0] * 100).toFixed(0),
    };
  }, [data]);

  const W = 700, H = 260, PAD = { t: 20, r: 20, b: 40, l: 20 };
  const plotW = W - PAD.l - PAD.r, plotH = H - PAD.t - PAD.b;

  function makePath(vals, mx) {
    return vals.map((v, i) => {
      const x = PAD.l + (i / (vals.length - 1)) * plotW;
      const y = PAD.t + plotH - (v / mx) * plotH;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }
  function makeArea(vals, mx) {
    return `${makePath(vals, mx)} L${PAD.l + plotW},${PAD.t + plotH} L${PAD.l},${PAD.t + plotH} Z`;
  }

  const gV = QUARTERS.map(q => grantsByQ[q]), aV = QUARTERS.map(q => amountsByQ[q]);
  const titleLines = t('act4_title').split('\n');

  return (
    <section id="trend" className="section" ref={ref}>
      <div className={`reveal ${inView ? 'in' : ''}`}>
        <Eyebrow>{t('act4_eyebrow')}</Eyebrow>
        <h2 className="h2">{titleLines.map((l, i) => <span key={i}>{l}{i < titleLines.length - 1 && <br />}</span>)}</h2>
        <p className="lede">{t('act4_lede')}</p>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48 }}>
        <div className="caption" style={{ marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('act4_chart_grants')}</div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, height: 'auto' }}>
          {[0,.25,.5,.75,1].map(x => { const y = PAD.t + plotH - x * plotH; return <line key={x} x1={PAD.l} y1={y} x2={PAD.l+plotW} y2={y} stroke="var(--rule)" strokeWidth="0.5" />; })}
          <path d={makeArea(gV, maxG*1.1)} fill="var(--accent)" opacity="0.08" />
          <path d={makePath(gV, maxG*1.1)} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
          {gV.map((v,i) => { const x=PAD.l+(i/(gV.length-1))*plotW, y=PAD.t+plotH-(v/(maxG*1.1))*plotH; return <circle key={i} cx={x} cy={y} r="3" fill="var(--accent)"><title>{QUARTERS[i]}: {fmt.full(v)}</title></circle>; })}
          {QUARTERS.map((q,i) => { if(i%4!==0 && i!==QUARTERS.length-1) return null; const x=PAD.l+(i/(QUARTERS.length-1))*plotW; return <text key={i} x={x} y={H-8} textAnchor="middle" style={{fontSize:10,fontFamily:'var(--sans)',fill:'var(--mute)'}}>{q}</text>; })}
        </svg>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48 }}>
        <div className="caption" style={{ marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('act4_chart_amount')}</div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, height: 'auto' }}>
          {[0,.25,.5,.75,1].map(x => { const y = PAD.t + plotH - x * plotH; return <line key={x} x1={PAD.l} y1={y} x2={PAD.l+plotW} y2={y} stroke="var(--rule)" strokeWidth="0.5" />; })}
          <path d={makeArea(aV, maxA*1.1)} fill="var(--gold)" opacity="0.1" />
          <path d={makePath(aV, maxA*1.1)} fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinejoin="round" />
          {aV.map((v,i) => { const x=PAD.l+(i/(aV.length-1))*plotW, y=PAD.t+plotH-(v/(maxA*1.1))*plotH; return <circle key={i} cx={x} cy={y} r="3" fill="var(--gold)"><title>{QUARTERS[i]}: {fmt.dollarFull(v)}</title></circle>; })}
          {QUARTERS.map((q,i) => { if(i%4!==0 && i!==QUARTERS.length-1) return null; const x=PAD.l+(i/(QUARTERS.length-1))*plotW; return <text key={i} x={x} y={H-8} textAnchor="middle" style={{fontSize:10,fontFamily:'var(--sans)',fill:'var(--mute)'}}>{q}</text>; })}
        </svg>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48 }}>
        <div className="callout">
          <b>{t('act4_callout_title')}</b>
          {t('act4_callout', { grantsDrop: Math.abs(changeGrants), amountDrop: Math.abs(changeAmount) })}
        </div>
        <p className="body">{t('act4_body')}</p>
      </div>

      <SectionFooter chap="04 / 05" note={t('act4_footer')} />
    </section>
  );
}

window.Act4Trend = Act4Trend;

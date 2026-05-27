function Act3Where() {
  const data = useTainuiData();
  const [ref, inView] = useInView();
  const t = useT();

  const WAIKATO_TLAS = ['Hamilton City', 'Waikato District', 'Waipa District', 'Matamata-Piako District', 'Otorohanga District'];
  const TLA_SHORT = {
    'Hamilton City': 'Hamilton City', 'Waikato District': 'Waikato District',
    'Waipa District': 'Waipā District', 'Matamata-Piako District': 'Matamata-Piako',
    'Otorohanga District': 'Ōtorohanga',
  };
  const COLORS_TLA = {
    'Hamilton City': 'var(--accent)', 'Waikato District': '#3b6d96',
    'Waipa District': '#6a9dc4', 'Matamata-Piako District': '#a0c4dd',
    'Otorohanga District': '#c8dde8',
  };

  const { byTla, totalGrants, hamiltonHousingPct } = useMemo(() => {
    const popMap = {};
    for (const r of data.population) {
      if (r.type === 'tla') popMap[r.area] = { pop: r.population, maori: r.maori_pct };
    }
    const tlaMap = {};
    for (const tla of WAIKATO_TLAS) {
      const grants = data.tlaGrants.filter(r => r.tla === tla && r.hardship_type === 'All hardship').reduce((s, r) => s + r.grants, 0);
      const amount = data.tlaAmounts.filter(r => r.tla === tla && r.hardship_type === 'All hardship').reduce((s, r) => s + r.amount, 0);
      const housingAmount = data.tlaAmounts.filter(r => r.tla === tla && r.hardship_type === 'Emergency Housing').reduce((s, r) => s + r.amount, 0);
      const pop = popMap[tla]?.pop || 1;
      tlaMap[tla] = {
        grants, amount, housingAmount, exHousingAmount: amount - housingAmount,
        grantsPerCapita: grants / pop * 1000, maoriPct: popMap[tla]?.maori || 0, pop,
      };
    }
    const totalGrants = Object.values(tlaMap).reduce((s, v) => s + v.grants, 0);
    const totalHousing = Object.values(tlaMap).reduce((s, v) => s + v.housingAmount, 0);
    return { byTla: tlaMap, totalGrants, hamiltonHousingPct: (tlaMap['Hamilton City'].housingAmount / totalHousing * 100).toFixed(0) };
  }, [data]);

  const sorted = WAIKATO_TLAS.slice().sort((a, b) => byTla[b].grants - byTla[a].grants);
  const sortedPC = WAIKATO_TLAS.slice().sort((a, b) => byTla[b].grantsPerCapita - byTla[a].grantsPerCapita);
  const hamiltonPct = ((byTla['Hamilton City'].grants / totalGrants) * 100).toFixed(0);
  const maxG = Math.max(...sorted.map(x => byTla[x].grants));
  const maxPC = Math.max(...sortedPC.map(x => byTla[x].grantsPerCapita));
  const totalAmt = Object.values(byTla).reduce((s, v) => s + v.amount, 0);
  const totalExH = Object.values(byTla).reduce((s, v) => s + v.exHousingAmount, 0);

  return (
    <section id="where" className="section" ref={ref}>
      <div className={`reveal ${inView ? 'in' : ''}`}>
        <Eyebrow>{t('act3_eyebrow')}</Eyebrow>
        <h2 className="h2">{t('act3_title')}</h2>
        <p className="lede">{t('act3_lede', { hamiltonPct, housingPct: hamiltonHousingPct })}</p>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48, maxWidth: 800 }}>
        <div className="caption" style={{ marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('act3_chart_total')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sorted.map((tla, i) => {
            const pct = (byTla[tla].grants / maxG) * 100;
            const isH = tla === 'Hamilton City';
            return (
              <div key={tla} className="bar-row" style={{ gridTemplateColumns: '140px 1fr 160px', gap: 12 }}>
                <span className="lbl" style={isH ? { fontWeight: 600 } : {}}>{TLA_SHORT[tla]}</span>
                <span className={`bar ${isH ? 'accent' : ''}`} style={{ width: `${pct}%`, transition: inView ? 'width 800ms cubic-bezier(0.2,0.7,0.3,1)' : 'none', transitionDelay: `${i * 100}ms` }} />
                <span className="num">{fmt.big(byTla[tla].grants)} {t('grants_label')} · {fmt.dollar(byTla[tla].amount)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 32 }}>
        <div className="callout">
          <b>{t('act3_callout_title')}</b>
          {t('act3_callout', {
            withPct: ((byTla['Hamilton City'].amount / totalAmt) * 100).toFixed(0),
            withoutPct: ((byTla['Hamilton City'].exHousingAmount / totalExH) * 100).toFixed(0),
          })}
        </div>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48, maxWidth: 800 }}>
        <div className="caption" style={{ marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('act3_chart_percapita')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sortedPC.map((tla, i) => {
            const pct = (byTla[tla].grantsPerCapita / maxPC) * 100;
            return (
              <div key={tla} className="bar-row" style={{ gridTemplateColumns: '140px 1fr 200px', gap: 12 }}>
                <span className="lbl" style={i === 0 ? { fontWeight: 600 } : {}}>{TLA_SHORT[tla]}</span>
                <span className={`bar ${i === 0 ? 'accent' : ''}`} style={{ width: `${pct}%`, transition: inView ? 'width 800ms cubic-bezier(0.2,0.7,0.3,1)' : 'none', transitionDelay: `${i * 100}ms` }} />
                <span className="num">{byTla[tla].grantsPerCapita.toFixed(0)} {t('per_1000')} · {t('pop_label')} {fmt.full(byTla[tla].pop)}</span>
              </div>
            );
          })}
        </div>
        <p className="body" style={{ marginTop: 24 }}>{t('act3_percapita_body')}</p>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48, maxWidth: 800 }}>
        <div className="caption" style={{ marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('act3_chart_maori')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {WAIKATO_TLAS.slice().sort((a, b) => byTla[b].maoriPct - byTla[a].maoriPct).map((tla, i) => {
            const pct = byTla[tla].maoriPct;
            return (
              <div key={tla} className="bar-row" style={{ gridTemplateColumns: '140px 1fr 60px', gap: 12 }}>
                <span className="lbl" style={i === 0 ? { fontWeight: 600 } : {}}>{TLA_SHORT[tla]}</span>
                <span className="bar" style={{
                  width: `${(pct / 35) * 100}%`, background: i === 0 ? 'var(--gold)' : 'var(--accent)',
                  opacity: i === 0 ? 1 : 0.78, transition: inView ? 'width 800ms cubic-bezier(0.2,0.7,0.3,1)' : 'none', transitionDelay: `${i * 100}ms`,
                }} />
                <span className="num">{pct}%</span>
              </div>
            );
          })}
        </div>
        <p className="body" style={{ marginTop: 24 }}>{t('act3_maori_body')}</p>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48, maxWidth: 800 }}>
        <div className="caption" style={{ marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('act3_chart_dollar')}</div>
        <div style={{ display: 'flex', height: 32, borderRadius: 4, overflow: 'hidden' }}>
          {sorted.map((tla) => {
            const pct = (byTla[tla].amount / totalAmt) * 100;
            return <div key={tla} style={{ width: `${pct}%`, background: COLORS_TLA[tla], transition: inView ? 'width 800ms cubic-bezier(0.2,0.7,0.3,1)' : 'none' }} title={`${TLA_SHORT[tla]}: ${fmt.dollar(byTla[tla].amount)} (${pct.toFixed(0)}%)`} />;
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
          {sorted.map((tla) => {
            const pct = (byTla[tla].amount / totalAmt) * 100;
            return (
              <div key={tla} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: COLORS_TLA[tla], borderRadius: 2 }} />
                <span className="caption">{TLA_SHORT[tla]} {pct.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <SectionFooter chap="03 / 05" note={t('act3_footer')} />
    </section>
  );
}

window.Act3Where = Act3Where;

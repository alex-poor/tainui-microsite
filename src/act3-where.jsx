function Act3Where() {
  const data = useTainuiData();
  const [ref, inView] = useInView();

  const WAIKATO_TLAS = ['Hamilton City', 'Waikato District', 'Waipa District', 'Matamata-Piako District', 'Otorohanga District'];

  const TLA_SHORT = {
    'Hamilton City': 'Hamilton City',
    'Waikato District': 'Waikato District',
    'Waipa District': 'Waipā District',
    'Matamata-Piako District': 'Matamata-Piako',
    'Otorohanga District': 'Ōtorohanga',
  };

  const { byTla, popMap, totalGrants, hamiltonHousingPct } = useMemo(() => {
    const popMap = {};
    for (const r of data.population) {
      if (r.type === 'tla') popMap[r.area] = { pop: r.population, maori: r.maori_pct };
    }

    const tlaMap = {};
    for (const tla of WAIKATO_TLAS) {
      const grants = data.tlaGrants
        .filter(r => r.tla === tla && r.hardship_type === 'All hardship')
        .reduce((s, r) => s + r.grants, 0);
      const amount = data.tlaAmounts
        .filter(r => r.tla === tla && r.hardship_type === 'All hardship')
        .reduce((s, r) => s + r.amount, 0);
      const housingAmount = data.tlaAmounts
        .filter(r => r.tla === tla && r.hardship_type === 'Emergency Housing')
        .reduce((s, r) => s + r.amount, 0);
      const exHousingAmount = amount - housingAmount;
      const pop = popMap[tla]?.pop || 1;
      tlaMap[tla] = {
        grants, amount, housingAmount, exHousingAmount,
        grantsPerCapita: (grants / pop * 1000),
        amountPerCapita: (amount / pop),
        maoriPct: popMap[tla]?.maori || 0,
        pop,
      };
    }
    const totalGrants = Object.values(tlaMap).reduce((s, v) => s + v.grants, 0);

    const totalHousingAmount = Object.values(tlaMap).reduce((s, v) => s + v.housingAmount, 0);
    const hamiltonHousingPct = (tlaMap['Hamilton City'].housingAmount / totalHousingAmount * 100).toFixed(0);

    return { byTla: tlaMap, popMap, totalGrants, hamiltonHousingPct };
  }, [data]);

  const sorted = WAIKATO_TLAS.slice().sort((a, b) => byTla[b].grants - byTla[a].grants);
  const sortedPerCapita = WAIKATO_TLAS.slice().sort((a, b) => byTla[b].grantsPerCapita - byTla[a].grantsPerCapita);
  const hamiltonPct = ((byTla['Hamilton City'].grants / totalGrants) * 100).toFixed(0);
  const maxGrants = Math.max(...sorted.map(t => byTla[t].grants));
  const maxPerCapita = Math.max(...sortedPerCapita.map(t => byTla[t].grantsPerCapita));

  const COLORS_TLA = {
    'Hamilton City': 'var(--accent)',
    'Waikato District': '#3b6d96',
    'Waipa District': '#6a9dc4',
    'Matamata-Piako District': '#a0c4dd',
    'Otorohanga District': '#c8dde8',
  };

  return (
    <section id="where" className="section" ref={ref}>
      <div className={`reveal ${inView ? 'in' : ''}`}>
        <Eyebrow>03 · Where</Eyebrow>
        <h2 className="h2">Hamilton's numbers are large — but context matters.</h2>
        <p className="lede">
          Hamilton City accounts for {hamiltonPct}% of all Waikato hardship grants.
          But much of that is because emergency housing is physically located
          in the city — {hamiltonHousingPct}% of the region's emergency housing spend
          flows through Hamilton.
        </p>
      </div>

      {/* Absolute bar chart */}
      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48, maxWidth: 800 }}>
        <div className="caption" style={{ marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Total grants by territorial authority
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sorted.map((tla, i) => {
            const pct = (byTla[tla].grants / maxGrants) * 100;
            const isHamilton = tla === 'Hamilton City';
            return (
              <div key={tla} className="bar-row" style={{ gridTemplateColumns: '140px 1fr 160px', gap: 12 }}>
                <span className="lbl" style={isHamilton ? { fontWeight: 600 } : {}}>{TLA_SHORT[tla]}</span>
                <span className={`bar ${isHamilton ? 'accent' : ''}`}
                  style={{ width: `${pct}%`, transition: inView ? 'width 800ms cubic-bezier(0.2,0.7,0.3,1)' : 'none',
                           transitionDelay: `${i * 100}ms` }} />
                <span className="num">
                  {fmt.big(byTla[tla].grants)} grants · {fmt.dollar(byTla[tla].amount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 32 }}>
        <div className="callout">
          <b>Why Hamilton dominates</b>
          Emergency housing motels and providers are concentrated in Hamilton.
          People from across the Waikato — and sometimes beyond — are placed into
          Hamilton emergency housing, inflating the city's share of grants and especially
          of dollars. Strip out emergency housing spend and Hamilton's share of the total drops
          from {((byTla['Hamilton City'].amount / Object.values(byTla).reduce((s,v) => s + v.amount, 0)) * 100).toFixed(0)}%
          {' '}to {((byTla['Hamilton City'].exHousingAmount / Object.values(byTla).reduce((s,v) => s + v.exHousingAmount, 0)) * 100).toFixed(0)}%.
        </div>
      </div>

      {/* Per capita chart */}
      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48, maxWidth: 800 }}>
        <div className="caption" style={{ marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Grants per 1,000 residents (2023 Census)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sortedPerCapita.map((tla, i) => {
            const pct = (byTla[tla].grantsPerCapita / maxPerCapita) * 100;
            const isTop = i === 0;
            return (
              <div key={tla} className="bar-row" style={{ gridTemplateColumns: '140px 1fr 200px', gap: 12 }}>
                <span className="lbl" style={isTop ? { fontWeight: 600 } : {}}>{TLA_SHORT[tla]}</span>
                <span className={`bar ${isTop ? 'accent' : ''}`}
                  style={{ width: `${pct}%`, transition: inView ? 'width 800ms cubic-bezier(0.2,0.7,0.3,1)' : 'none',
                           transitionDelay: `${i * 100}ms` }} />
                <span className="num">
                  {byTla[tla].grantsPerCapita.toFixed(0)} per 1,000 · pop {fmt.full(byTla[tla].pop)}
                </span>
              </div>
            );
          })}
        </div>
        <p className="body" style={{ marginTop: 24 }}>
          Per capita, the picture shifts. Hamilton still leads, but smaller
          authorities — particularly Ōtorohanga and Waikato District — show rates
          that are not far behind, despite having a fraction of the population.
        </p>
      </div>

      {/* Māori population context */}
      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48, maxWidth: 800 }}>
        <div className="caption" style={{ marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Māori population share by territorial authority
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {WAIKATO_TLAS.slice().sort((a, b) => byTla[b].maoriPct - byTla[a].maoriPct).map((tla, i) => {
            const pct = byTla[tla].maoriPct;
            const isTop = i === 0;
            return (
              <div key={tla} className="bar-row" style={{ gridTemplateColumns: '140px 1fr 60px', gap: 12 }}>
                <span className="lbl" style={isTop ? { fontWeight: 600 } : {}}>{TLA_SHORT[tla]}</span>
                <span className="bar" style={{
                  width: `${(pct / 35) * 100}%`,
                  background: isTop ? 'var(--gold)' : 'var(--accent)',
                  opacity: isTop ? 1 : 0.78,
                  transition: inView ? 'width 800ms cubic-bezier(0.2,0.7,0.3,1)' : 'none',
                  transitionDelay: `${i * 100}ms`,
                }} />
                <span className="num">{pct}%</span>
              </div>
            );
          })}
        </div>
        <p className="body" style={{ marginTop: 24 }}>
          Ōtorohanga has the highest proportion of Māori residents at 32.5%, followed by
          Waikato District at 26.9% and Hamilton at 25.4%. These are communities at
          the heart of Tainui's rohe. The hardship data does not include ethnicity,
          but the overlap between where Māori live and where hardship concentrates
          is not a coincidence.
        </p>
      </div>

      {/* Dollar split */}
      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48, maxWidth: 800 }}>
        <div className="caption" style={{ marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Dollar share by territorial authority
        </div>
        <div style={{ display: 'flex', height: 32, borderRadius: 4, overflow: 'hidden' }}>
          {sorted.map((tla) => {
            const pct = (byTla[tla].amount / Object.values(byTla).reduce((s, v) => s + v.amount, 0)) * 100;
            return (
              <div key={tla} style={{
                width: `${pct}%`, background: COLORS_TLA[tla],
                transition: inView ? 'width 800ms cubic-bezier(0.2,0.7,0.3,1)' : 'none',
              }}
              title={`${TLA_SHORT[tla]}: ${fmt.dollar(byTla[tla].amount)} (${pct.toFixed(0)}%)`}
              />
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
          {sorted.map((tla) => {
            const pct = (byTla[tla].amount / Object.values(byTla).reduce((s, v) => s + v.amount, 0)) * 100;
            return (
              <div key={tla} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: COLORS_TLA[tla], borderRadius: 2 }} />
                <span className="caption">{TLA_SHORT[tla]} {pct.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <SectionFooter
        chap="03 / 05"
        note="TLA estimated from client address. Population from 2023 Census (Stats NZ). Māori ethnicity uses total response method."
      />
    </section>
  );
}

window.Act3Where = Act3Where;

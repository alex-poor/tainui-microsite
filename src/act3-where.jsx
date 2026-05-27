function Act3Where() {
  const data = useTainuiData();
  const [ref, inView] = useInView();

  const WAIKATO_TLAS = ['Hamilton City', 'Waikato District', 'Waipa District', 'Matamata-Piako District', 'Otorohanga District'];

  const { byTla, maxGrants, maxAmount, totalGrants } = useMemo(() => {
    const tlaMap = {};
    for (const tla of WAIKATO_TLAS) {
      const grants = data.tlaGrants
        .filter(r => r.tla === tla && r.hardship_type === 'All hardship')
        .reduce((s, r) => s + r.grants, 0);
      const amount = data.tlaAmounts
        .filter(r => r.tla === tla && r.hardship_type === 'All hardship')
        .reduce((s, r) => s + r.amount, 0);
      tlaMap[tla] = { grants, amount };
    }
    const totalGrants = Object.values(tlaMap).reduce((s, v) => s + v.grants, 0);
    return {
      byTla: tlaMap,
      maxGrants: Math.max(...Object.values(tlaMap).map(v => v.grants)),
      maxAmount: Math.max(...Object.values(tlaMap).map(v => v.amount)),
      totalGrants,
    };
  }, [data]);

  const sorted = WAIKATO_TLAS.slice().sort((a, b) => byTla[b].grants - byTla[a].grants);
  const hamiltonPct = ((byTla['Hamilton City'].grants / totalGrants) * 100).toFixed(0);

  const TLA_SHORT = {
    'Hamilton City': 'Hamilton City',
    'Waikato District': 'Waikato District',
    'Waipa District': 'Waipā District',
    'Matamata-Piako District': 'Matamata-Piako',
    'Otorohanga District': 'Ōtorohanga',
  };

  return (
    <section id="where" className="section" ref={ref}>
      <div className={`reveal ${inView ? 'in' : ''}`}>
        <Eyebrow>03 · Where</Eyebrow>
        <h2 className="h2">Hamilton carries {hamiltonPct}% of the region's hardship load.</h2>
        <p className="lede">
          Hamilton City alone accounts for nearly two-thirds of all hardship grants
          in the Waikato — a concentration that reflects both population size and
          the depth of urban need.
        </p>
      </div>

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

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48 }}>
        <p className="body">
          Hamilton's dominance is stark: {fmt.full(byTla['Hamilton City'].grants)} grants
          worth {fmt.dollar(byTla['Hamilton City'].amount)}, compared to {fmt.full(byTla['Waikato District'].grants)} for
          the entire Waikato District and {fmt.full(byTla['Waipa District'].grants)} for Waipā.
        </p>
        <p className="body">
          The smaller rural authorities — Matamata-Piako
          and Ōtorohanga — show lower absolute numbers, but these communities are also
          smaller. Per capita, the pressure may be just as intense.
        </p>
      </div>

      {/* Dollar split */}
      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48, maxWidth: 800 }}>
        <div className="caption" style={{ marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Dollar share by territorial authority
        </div>
        <div style={{ display: 'flex', height: 32, borderRadius: 4, overflow: 'hidden' }}>
          {sorted.map((tla, i) => {
            const pct = (byTla[tla].amount / Object.values(byTla).reduce((s, v) => s + v.amount, 0)) * 100;
            const colors = ['var(--accent)', '#3b6d96', '#6a9dc4', '#a0c4dd', '#c8dde8'];
            return (
              <div key={tla} style={{
                width: `${pct}%`, background: colors[i],
                transition: inView ? 'width 800ms cubic-bezier(0.2,0.7,0.3,1)' : 'none',
              }}
              title={`${TLA_SHORT[tla]}: ${fmt.dollar(byTla[tla].amount)} (${pct.toFixed(0)}%)`}
              />
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
          {sorted.map((tla, i) => {
            const pct = (byTla[tla].amount / Object.values(byTla).reduce((s, v) => s + v.amount, 0)) * 100;
            const colors = ['var(--accent)', '#3b6d96', '#6a9dc4', '#a0c4dd', '#c8dde8'];
            return (
              <div key={tla} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, background: colors[i], borderRadius: 2 }} />
                <span className="caption">{TLA_SHORT[tla]} {pct.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <SectionFooter
        chap="03 / 05"
        note="TLA estimated from client address at time of grant."
      />
    </section>
  );
}

window.Act3Where = Act3Where;

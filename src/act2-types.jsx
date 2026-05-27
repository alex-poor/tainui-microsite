function Act2Types() {
  const data = useTainuiData();
  const [ref, inView] = useInView();

  const WAIKATO_TLAS = new Set(['Hamilton City', 'Matamata-Piako District', 'Otorohanga District', 'Waikato District', 'Waipa District']);
  const SPECIFIC_TYPES = ['Food', 'Emergency Housing', 'Electricity Assistance', 'Stranded Travel - Petrol', 'Gas Assistance'];

  const { byTypeGrants, byTypeAmount, maxGrants, maxAmount } = useMemo(() => {
    const grantsByType = {};
    const amountsByType = {};

    for (const t of SPECIFIC_TYPES) {
      grantsByType[t] = data.tlaGrants
        .filter(r => WAIKATO_TLAS.has(r.tla) && r.hardship_type === t)
        .reduce((s, r) => s + r.grants, 0);
      amountsByType[t] = data.tlaAmounts
        .filter(r => WAIKATO_TLAS.has(r.tla) && r.hardship_type === t)
        .reduce((s, r) => s + r.amount, 0);
    }

    return {
      byTypeGrants: grantsByType,
      byTypeAmount: amountsByType,
      maxGrants: Math.max(...Object.values(grantsByType)),
      maxAmount: Math.max(...Object.values(amountsByType)),
    };
  }, [data]);

  const grantsSorted = SPECIFIC_TYPES.slice().sort((a, b) => byTypeGrants[b] - byTypeGrants[a]);
  const amountSorted = SPECIFIC_TYPES.slice().sort((a, b) => byTypeAmount[b] - byTypeAmount[a]);

  const TYPE_LABELS = {
    'Food': 'Food',
    'Emergency Housing': 'Emergency Housing',
    'Electricity Assistance': 'Electricity',
    'Stranded Travel - Petrol': 'Petrol / Travel',
    'Gas Assistance': 'Gas',
  };

  return (
    <section id="types" className="section" ref={ref}>
      <div className={`reveal ${inView ? 'in' : ''}`}>
        <Eyebrow>02 · What Kind of Help</Eyebrow>
        <h2 className="h2">Food keeps people coming back. Housing costs the most.</h2>
        <p className="lede">
          Food grants account for more than half of all hardship assistance in the Waikato —
          but emergency housing, though far fewer grants, consumes almost half the total dollar spend.
        </p>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>

          {/* Grants chart */}
          <div>
            <div className="caption" style={{ marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              By number of grants
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {grantsSorted.map((t, i) => {
                const pct = (byTypeGrants[t] / maxGrants) * 100;
                const isTop = i === 0;
                return (
                  <div key={t} className="bar-row" style={{ gridTemplateColumns: '120px 1fr 70px', gap: 12 }}>
                    <span className="lbl">{TYPE_LABELS[t]}</span>
                    <span className={`bar ${isTop ? 'accent' : ''}`}
                      style={{ width: `${pct}%`, transition: inView ? 'width 800ms cubic-bezier(0.2,0.7,0.3,1)' : 'none',
                               transitionDelay: `${i * 80}ms` }} />
                    <span className="num">{fmt.big(byTypeGrants[t])}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Amount chart */}
          <div>
            <div className="caption" style={{ marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              By dollar amount
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {amountSorted.map((t, i) => {
                const pct = (byTypeAmount[t] / maxAmount) * 100;
                const isTop = i === 0;
                return (
                  <div key={t} className="bar-row" style={{ gridTemplateColumns: '120px 1fr 70px', gap: 12 }}>
                    <span className="lbl">{TYPE_LABELS[t]}</span>
                    <span className={`bar ${isTop ? 'accent' : ''}`}
                      style={{ width: `${pct}%`, transition: inView ? 'width 800ms cubic-bezier(0.2,0.7,0.3,1)' : 'none',
                               transitionDelay: `${i * 80}ms` }} />
                    <span className="num">{fmt.dollar(byTypeAmount[t])}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48 }}>
        <div className="callout">
          <b>The housing gap</b>
          Emergency housing accounts for just {fmt.pct(byTypeGrants['Emergency Housing'] / Object.values(byTypeGrants).reduce((a,b) => a+b, 0) * 100, 0)} of
          grants but {fmt.pct(byTypeAmount['Emergency Housing'] / Object.values(byTypeAmount).reduce((a,b) => a+b, 0) * 100, 0)} of
          the total spend — reflecting the high cost of emergency accommodation
          relative to other forms of assistance.
        </div>

        <p className="body">
          Food grants are the most frequent form of hardship assistance — overwhelmingly so.
          At {fmt.full(byTypeGrants['Food'])} grants over three years, they outnumber the next
          category by more than ten to one. But each food grant is relatively small.
        </p>
        <p className="body">
          Emergency housing tells the opposite story: fewer grants, but each one involves
          significant cost. The total spend on emergency housing —
          {' '}{fmt.dollarFull(byTypeAmount['Emergency Housing'])} — represents the single largest
          line item in Waikato hardship assistance.
        </p>
      </div>

      <SectionFooter
        chap="02 / 05"
        note="All hardship includes SNG, ADV, and RAP grant types."
      />
    </section>
  );
}

window.Act2Types = Act2Types;

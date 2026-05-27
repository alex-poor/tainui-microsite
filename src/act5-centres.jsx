function Act5Centres() {
  const data = useTainuiData();
  const [ref, inView] = useInView();
  const [selectedType, setSelectedType] = useState('All hardship');

  const TYPES = ['All hardship', 'Food', 'Emergency Housing', 'Electricity Assistance', 'Stranded Travel - Petrol'];

  const { centres, maxGrants, maxAmount } = useMemo(() => {
    const wkGrants = data.regGrants.filter(r => r.region === 'Waikato' && r.hardship_type === selectedType);
    const wkAmounts = data.regAmounts.filter(r => r.region === 'Waikato' && r.hardship_type === selectedType);

    const centreMap = {};
    for (const r of wkGrants) {
      if (!centreMap[r.service_centre]) centreMap[r.service_centre] = { grants: 0, amount: 0 };
      centreMap[r.service_centre].grants += r.grants;
    }
    for (const r of wkAmounts) {
      if (!centreMap[r.service_centre]) centreMap[r.service_centre] = { grants: 0, amount: 0 };
      centreMap[r.service_centre].amount += r.amount;
    }

    const list = Object.entries(centreMap)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.grants - a.grants);

    return {
      centres: list,
      maxGrants: Math.max(...list.map(c => c.grants)),
      maxAmount: Math.max(...list.map(c => c.amount)),
    };
  }, [data, selectedType]);

  const TYPE_LABELS = {
    'All hardship': 'All Types',
    'Food': 'Food',
    'Emergency Housing': 'Housing',
    'Electricity Assistance': 'Electricity',
    'Stranded Travel - Petrol': 'Petrol',
  };

  return (
    <section id="centres" className="section" ref={ref}>
      <div className={`reveal ${inView ? 'in' : ''}`}>
        <Eyebrow>05 · Service Centres</Eyebrow>
        <h2 className="h2">Kirikiriroa leads. Smaller towns carry quiet weight.</h2>
        <p className="lede">
          Thirteen MSD service centres serve the Waikato region. Kirikiriroa (Hamilton central)
          handles the most volume — but places like Huntly, Ngaruawahia, and Te Awamutu
          serve communities where hardship is deeply felt.
        </p>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 32 }}>
        <div className="region-tabs">
          {TYPES.map(t => (
            <button key={t}
              className={selectedType === t ? 'active' : ''}
              onClick={() => setSelectedType(t)}>
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          {/* By grants */}
          <div>
            <div className="caption" style={{ marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Grants
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {centres.map((c, i) => {
                const pct = (c.grants / maxGrants) * 100;
                const isTop = i === 0;
                return (
                  <div key={c.name} className="bar-row" style={{ gridTemplateColumns: '110px 1fr 60px', gap: 8 }}>
                    <span className="lbl" style={{ fontSize: 11.5 }}>{c.name}</span>
                    <span className={`bar ${isTop ? 'accent' : ''}`}
                      style={{ width: `${pct}%`, height: 10,
                               transition: inView ? 'width 600ms cubic-bezier(0.2,0.7,0.3,1)' : 'none',
                               transitionDelay: `${i * 40}ms` }} />
                    <span className="num" style={{ fontSize: 10 }}>{fmt.big(c.grants)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By amount */}
          <div>
            <div className="caption" style={{ marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Amount
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {centres.slice().sort((a, b) => b.amount - a.amount).map((c, i) => {
                const pct = (c.amount / maxAmount) * 100;
                const isTop = i === 0;
                return (
                  <div key={c.name} className="bar-row" style={{ gridTemplateColumns: '110px 1fr 60px', gap: 8 }}>
                    <span className="lbl" style={{ fontSize: 11.5 }}>{c.name}</span>
                    <span className={`bar ${isTop ? 'accent' : ''}`}
                      style={{ width: `${pct}%`, height: 10,
                               transition: inView ? 'width 600ms cubic-bezier(0.2,0.7,0.3,1)' : 'none',
                               transitionDelay: `${i * 40}ms` }} />
                    <span className="num" style={{ fontSize: 10 }}>{fmt.dollar(c.amount)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48 }}>
        <p className="body">
          The four Hamilton-based centres — Kirikiriroa, Five Cross Roads, Hamilton East,
          and Dinsdale — together account for the majority of Waikato hardship grants.
          But the regional centres tell their own stories: Huntly and Ngaruawahia, smaller
          communities with deep roots in Tainui, consistently appear in the upper tier.
        </p>
        <p className="body">
          Use the tabs above to explore how different types of hardship assistance
          distribute across centres. The pattern shifts: food grants spread relatively
          evenly, but emergency housing concentrates in the larger urban centres.
        </p>
      </div>

      <SectionFooter
        chap="05 / 05"
        note="Service centre assignment based on the MSD office that processed the grant."
      />
    </section>
  );
}

window.Act5Centres = Act5Centres;

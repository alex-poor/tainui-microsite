function Act5Centres() {
  const data = useTainuiData();
  const [ref, inView] = useInView();
  const [selectedType, setSelectedType] = useState('All hardship');
  const [view, setView] = useState('per-capita');

  const TYPES = ['All hardship', 'Food', 'Emergency Housing', 'Electricity Assistance', 'Stranded Travel - Petrol'];
  const WAIKATO_CENTRES = ['Kirikiriroa', 'Five Cross Roads', 'Hamilton East', 'Dinsdale',
    'Huntly', 'Te Awamutu', 'Ngaruawahia', 'Matamata', 'Thames', 'Paeroa', 'Waihi', 'Cambridge', 'Morrinsville'];

  const TYPE_LABELS = {
    'All hardship': 'All Types',
    'Food': 'Food',
    'Emergency Housing': 'Housing',
    'Electricity Assistance': 'Electricity',
    'Stranded Travel - Petrol': 'Petrol',
  };

  const { centres, popMap } = useMemo(() => {
    const popMap = {};
    for (const r of data.population) {
      if (r.type === 'centre') popMap[r.area] = { pop: r.population, maori: r.maori_pct };
    }

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
      .filter(([name]) => WAIKATO_CENTRES.includes(name))
      .map(([name, v]) => {
        const pop = popMap[name]?.pop || 1;
        const maori = popMap[name]?.maori || 0;
        return {
          name, ...v,
          grantsPerCapita: v.grants / pop * 1000,
          amountPerCapita: v.amount / pop,
          pop, maori,
        };
      });

    return { centres: list, popMap };
  }, [data, selectedType]);

  const sortedRaw = centres.slice().sort((a, b) => b.grants - a.grants);
  const sortedPerCapita = centres.slice().sort((a, b) => b.grantsPerCapita - a.grantsPerCapita);
  const sortedMaori = centres.slice().sort((a, b) => b.maori - a.maori);
  const displayed = view === 'per-capita' ? sortedPerCapita : sortedRaw;
  const maxVal = view === 'per-capita'
    ? Math.max(...displayed.map(c => c.grantsPerCapita))
    : Math.max(...displayed.map(c => c.grants));

  const isHamiltonCentre = (name) => ['Kirikiriroa', 'Five Cross Roads', 'Hamilton East', 'Dinsdale'].includes(name);

  return (
    <section id="centres" className="section" ref={ref}>
      <div className={`reveal ${inView ? 'in' : ''}`}>
        <Eyebrow>05 · Service Centres</Eyebrow>
        <h2 className="h2">Small towns, heavy loads.</h2>
        <p className="lede">
          Adjusted for population, the smaller Waikato centres — Huntly,
          Ngāruawāhia, Paeroa — carry hardship rates far above the urban Hamilton
          offices. These are also the communities with the highest Māori populations.
        </p>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 32 }}>
        {/* Type filter tabs */}
        <div className="region-tabs">
          {TYPES.map(t => (
            <button key={t}
              className={selectedType === t ? 'active' : ''}
              onClick={() => setSelectedType(t)}>
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderBottom: '1px solid var(--rule)' }}>
          {[['per-capita', 'Per capita'], ['raw', 'Raw totals']].map(([key, label]) => (
            <button key={key}
              className={view === key ? 'active' : ''}
              style={{
                appearance: 'none', border: 'none', background: 'transparent',
                fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: view === key ? 600 : 400,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: view === key ? 'var(--ink-soft)' : 'var(--mute)',
                padding: '10px 16px 12px', cursor: 'pointer',
                borderBottom: view === key ? '2px solid var(--gold)' : '2px solid transparent',
                marginBottom: '-1px',
              }}
              onClick={() => setView(key)}>
              {label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div style={{ maxWidth: 760 }}>
          <div className="caption" style={{ marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {view === 'per-capita' ? 'Grants per 1,000 residents' : 'Total grants'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {displayed.map((c, i) => {
              const val = view === 'per-capita' ? c.grantsPerCapita : c.grants;
              const pct = (val / maxVal) * 100;
              const isHam = isHamiltonCentre(c.name);
              const isTop = i < 3 && !isHam;
              return (
                <div key={c.name} className="bar-row" style={{ gridTemplateColumns: '120px 1fr 180px', gap: 8 }}>
                  <span className="lbl" style={{
                    fontSize: 11.5,
                    fontWeight: isTop ? 600 : 400,
                    color: isHam ? 'var(--mute)' : 'var(--ink)',
                  }}>{c.name}</span>
                  <span className="bar" style={{
                    width: `${pct}%`, height: 12,
                    background: isTop ? 'var(--gold)' : isHam ? 'var(--rule)' : 'var(--accent)',
                    opacity: isHam ? 0.6 : (isTop ? 1 : 0.78),
                    transition: inView ? 'width 600ms cubic-bezier(0.2,0.7,0.3,1)' : 'none',
                    transitionDelay: `${i * 40}ms`,
                  }} />
                  <span className="num" style={{ fontSize: 10 }}>
                    {view === 'per-capita'
                      ? `${val.toFixed(0)}/1k · ${c.maori}% Māori`
                      : `${fmt.big(c.grants)} · pop ${fmt.big(c.pop)}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Māori population correlation */}
      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48 }}>
        <div className="callout">
          <b>The pattern</b>
          The communities with the highest per-capita hardship rates —
          {' '}{sortedPerCapita.slice(0, 3).map(c => c.name).join(', ')} —
          are also among those with the highest Māori populations
          ({sortedPerCapita.slice(0, 3).map(c => `${c.maori}%`).join(', ')} Māori respectively).
          The hardship data doesn't record ethnicity, but the geography speaks clearly.
        </div>

        <p className="body">
          Hamilton's four service centres — Kirikiriroa, Five Cross Roads, Hamilton East,
          and Dinsdale — show moderate per-capita rates despite high raw totals,
          because they serve a city of {fmt.full(175000)} people. Compare this to
          Huntly (pop. {fmt.full(8232)}, {sortedMaori.find(c => c.name === 'Huntly')?.maori}% Māori) or
          Ngāruawāhia (pop. {fmt.full(7992)}, {sortedMaori.find(c => c.name === 'Ngaruawahia')?.maori}% Māori),
          where the per-capita burden is significantly higher.
        </p>
        <p className="body">
          For Tainui, this is the critical insight: the communities most deeply
          connected to the iwi — the places where whakapapa runs deepest — are also
          where hardship assistance is most concentrated relative to population.
        </p>
      </div>

      <SectionFooter
        chap="05 / 05"
        note="Per-capita rates use 2023 Census usually-resident population. Town populations approximate. Hamilton centre catchments estimated proportionally."
      />
    </section>
  );
}

window.Act5Centres = Act5Centres;

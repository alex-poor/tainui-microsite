function Act5Centres() {
  const data = useTainuiData();
  const [ref, inView] = useInView();
  const [selectedType, setSelectedType] = useState('All hardship');
  const [view, setView] = useState('per-capita');
  const t = useT();

  const TYPES = ['All hardship', 'Food', 'Emergency Housing', 'Electricity Assistance', 'Stranded Travel - Petrol'];
  const WAIKATO_CENTRES = ['Kirikiriroa','Five Cross Roads','Hamilton East','Dinsdale','Huntly','Te Awamutu','Ngaruawahia','Matamata','Thames','Paeroa','Waihi','Cambridge','Morrinsville'];
  const TAB_KEYS = { 'All hardship': 'act5_tab_all', 'Food': 'act5_tab_food', 'Emergency Housing': 'act5_tab_housing', 'Electricity Assistance': 'act5_tab_electricity', 'Stranded Travel - Petrol': 'act5_tab_petrol' };

  const { centres } = useMemo(() => {
    const popMap = {};
    for (const r of data.population) { if (r.type === 'centre') popMap[r.area] = { pop: r.population, maori: r.maori_pct }; }
    const wkG = data.regGrants.filter(r => r.region === 'Waikato' && r.hardship_type === selectedType);
    const wkA = data.regAmounts.filter(r => r.region === 'Waikato' && r.hardship_type === selectedType);
    const cm = {};
    for (const r of wkG) { if (!cm[r.service_centre]) cm[r.service_centre] = { grants: 0, amount: 0 }; cm[r.service_centre].grants += r.grants; }
    for (const r of wkA) { if (!cm[r.service_centre]) cm[r.service_centre] = { grants: 0, amount: 0 }; cm[r.service_centre].amount += r.amount; }
    const list = Object.entries(cm).filter(([n]) => WAIKATO_CENTRES.includes(n)).map(([name, v]) => {
      const pop = popMap[name]?.pop || 1, maori = popMap[name]?.maori || 0;
      return { name, ...v, grantsPerCapita: v.grants / pop * 1000, pop, maori };
    });
    return { centres: list };
  }, [data, selectedType]);

  const sortedRaw = centres.slice().sort((a, b) => b.grants - a.grants);
  const sortedPC = centres.slice().sort((a, b) => b.grantsPerCapita - a.grantsPerCapita);
  const sortedMaori = centres.slice().sort((a, b) => b.maori - a.maori);
  const displayed = view === 'per-capita' ? sortedPC : sortedRaw;
  const maxVal = view === 'per-capita' ? Math.max(...displayed.map(c => c.grantsPerCapita)) : Math.max(...displayed.map(c => c.grants));
  const isHam = (n) => ['Kirikiriroa','Five Cross Roads','Hamilton East','Dinsdale'].includes(n);

  const huntly = sortedMaori.find(c => c.name === 'Huntly');
  const ngarua = sortedMaori.find(c => c.name === 'Ngaruawahia');

  return (
    <section id="centres" className="section" ref={ref}>
      <div className={`reveal ${inView ? 'in' : ''}`}>
        <Eyebrow>{t('act5_eyebrow')}</Eyebrow>
        <h2 className="h2">{t('act5_title')}</h2>
        <p className="lede">{t('act5_lede')}</p>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 32 }}>
        <div className="region-tabs">
          {TYPES.map(tp => (
            <button key={tp} className={selectedType === tp ? 'active' : ''} onClick={() => setSelectedType(tp)}>{t(TAB_KEYS[tp])}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderBottom: '1px solid var(--rule)' }}>
          {[['per-capita', t('act5_view_percapita')], ['raw', t('act5_view_raw')]].map(([key, label]) => (
            <button key={key}
              style={{
                appearance: 'none', border: 'none', background: 'transparent',
                fontFamily: 'var(--sans)', fontSize: '11px', fontWeight: view === key ? 600 : 400,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: view === key ? 'var(--ink-soft)' : 'var(--mute)',
                padding: '10px 16px 12px', cursor: 'pointer',
                borderBottom: view === key ? '2px solid var(--gold)' : '2px solid transparent',
                marginBottom: '-1px',
              }}
              onClick={() => setView(key)}>{label}</button>
          ))}
        </div>

        <div style={{ maxWidth: 760 }}>
          <div className="caption" style={{ marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {view === 'per-capita' ? t('act5_chart_percapita') : t('act5_chart_total')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {displayed.map((c, i) => {
              const val = view === 'per-capita' ? c.grantsPerCapita : c.grants;
              const pct = (val / maxVal) * 100;
              const ham = isHam(c.name);
              const top = i < 3 && !ham;
              return (
                <div key={c.name} className="bar-row" style={{ gridTemplateColumns: '120px 1fr 180px', gap: 8 }}>
                  <span className="lbl" style={{ fontSize: 11.5, fontWeight: top ? 600 : 400, color: ham ? 'var(--mute)' : 'var(--ink)' }}>{c.name}</span>
                  <span className="bar" style={{
                    width: `${pct}%`, height: 12,
                    background: top ? 'var(--gold)' : ham ? 'var(--rule)' : 'var(--accent)',
                    opacity: ham ? 0.6 : (top ? 1 : 0.78),
                    transition: inView ? 'width 600ms cubic-bezier(0.2,0.7,0.3,1)' : 'none', transitionDelay: `${i * 40}ms`,
                  }} />
                  <span className="num" style={{ fontSize: 10 }}>
                    {view === 'per-capita'
                      ? `${val.toFixed(0)}/1k · ${c.maori}% Maaori`
                      : `${fmt.big(c.grants)} · ${t('pop_label')} ${fmt.big(c.pop)}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 48 }}>
        <div className="callout">
          <b>{t('act5_callout_title')}</b>
          {t('act5_callout', {
            topCentres: sortedPC.slice(0, 3).map(c => c.name).join(', '),
            topMaori: sortedPC.slice(0, 3).map(c => `${c.maori}%`).join(', '),
          })}
        </div>
        <p className="body">{t('act5_body1', {
          hamiltonPop: fmt.full(175000),
          huntlyPop: fmt.full(8232), huntlyMaori: huntly?.maori,
          ngaruaPop: fmt.full(7992), ngaruaMaori: ngarua?.maori,
        })}</p>
        <p className="body">{t('act5_body2')}</p>
      </div>

      <SectionFooter chap="05 / 05" note={t('act5_footer')} />
    </section>
  );
}

window.Act5Centres = Act5Centres;

function Act2Types() {
  const data = useTainuiData();
  const [ref, inView] = useInView();
  const t = useT();

  const WAIKATO_TLAS = new Set(['Hamilton City', 'Matamata-Piako District', 'Otorohanga District', 'Waikato District', 'Waipa District']);
  const SPECIFIC_TYPES = ['Food', 'Emergency Housing', 'Electricity Assistance', 'Stranded Travel - Petrol', 'Gas Assistance'];

  const { byTypeGrants, byTypeAmount, maxGrants, maxAmount } = useMemo(() => {
    const grantsByType = {};
    const amountsByType = {};
    for (const tp of SPECIFIC_TYPES) {
      grantsByType[tp] = data.tlaGrants.filter(r => WAIKATO_TLAS.has(r.tla) && r.hardship_type === tp).reduce((s, r) => s + r.grants, 0);
      amountsByType[tp] = data.tlaAmounts.filter(r => WAIKATO_TLAS.has(r.tla) && r.hardship_type === tp).reduce((s, r) => s + r.amount, 0);
    }
    return {
      byTypeGrants: grantsByType, byTypeAmount: amountsByType,
      maxGrants: Math.max(...Object.values(grantsByType)),
      maxAmount: Math.max(...Object.values(amountsByType)),
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

      <SectionFooter chap="02 / 05" note={t('act2_footer')} />
    </section>
  );
}

window.Act2Types = Act2Types;

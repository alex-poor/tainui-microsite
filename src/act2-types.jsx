function Act2Types() {
  const data = useTainuiData();
  const [ref, inView] = useInView();
  const t = useT();

  const WAIKATO_TLAS = new Set(['Hamilton City', 'Matamata-Piako District', 'Otorohanga District', 'Waikato District', 'Waipa District']);
  const SPECIFIC_TYPES = ['Food', 'Emergency Housing', 'Electricity Assistance', 'Stranded Travel - Petrol', 'Gas Assistance'];
  const EARLY_QUARTERS = new Set(['Mar 2023','Jun 2023','Sep 2023','Dec 2023']);
  const RECENT_QUARTERS = new Set(['Jun 2025','Sep 2025','Dec 2025','Mar 2026']);

  const { byTypeGrants, byTypeAmount, maxGrants, maxAmount, earlyAmounts, recentAmounts } = useMemo(() => {
    const grantsByType = {};
    const amountsByType = {};
    const earlyA = {};
    const recentA = {};
    for (const tp of SPECIFIC_TYPES) {
      grantsByType[tp] = data.tlaGrants.filter(r => WAIKATO_TLAS.has(r.tla) && r.hardship_type === tp).reduce((s, r) => s + r.grants, 0);
      amountsByType[tp] = data.tlaAmounts.filter(r => WAIKATO_TLAS.has(r.tla) && r.hardship_type === tp).reduce((s, r) => s + r.amount, 0);
      earlyA[tp] = data.tlaAmounts.filter(r => WAIKATO_TLAS.has(r.tla) && r.hardship_type === tp && EARLY_QUARTERS.has(r.quarter)).reduce((s, r) => s + r.amount, 0);
      recentA[tp] = data.tlaAmounts.filter(r => WAIKATO_TLAS.has(r.tla) && r.hardship_type === tp && RECENT_QUARTERS.has(r.quarter)).reduce((s, r) => s + r.amount, 0);
    }
    return {
      byTypeGrants: grantsByType, byTypeAmount: amountsByType,
      maxGrants: Math.max(...Object.values(grantsByType)),
      maxAmount: Math.max(...Object.values(amountsByType)),
      earlyAmounts: earlyA,
      recentAmounts: recentA,
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

  const totalEarly = Object.values(earlyAmounts).reduce((a, b) => a + b, 0);
  const totalRecent = Object.values(recentAmounts).reduce((a, b) => a + b, 0);
  const earlySorted = SPECIFIC_TYPES.slice().sort((a, b) => earlyAmounts[b] - earlyAmounts[a]);
  const recentSorted = SPECIFIC_TYPES.slice().sort((a, b) => recentAmounts[b] - recentAmounts[a]);
  const maxPeriodAmount = Math.max(...Object.values(earlyAmounts), ...Object.values(recentAmounts));

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

      {/* Before / After comparison */}
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, marginTop: 40 }}>
          {/* Early period (2023) */}
          <div>
            <div className="caption" style={{ marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {t('act2_compare_early')}
            </div>
            <div className="caption" style={{ marginBottom: 16, color: 'var(--mute-soft)' }}>
              {t('act2_compare_early_sub', { total: fmt.dollar(totalEarly) })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {earlySorted.map((tp, i) => {
                const pct = (earlyAmounts[tp] / maxPeriodAmount) * 100;
                const shareOfPeriod = (earlyAmounts[tp] / totalEarly * 100).toFixed(0);
                return (
                  <div key={tp} className="bar-row" style={{ gridTemplateColumns: '120px 1fr 90px', gap: 12 }}>
                    <span className="lbl">{t(TYPE_KEY[tp])}</span>
                    <span className={`bar ${i === 0 ? 'accent' : ''}`}
                      style={{ width: `${pct}%`, transition: inView ? 'width 800ms cubic-bezier(0.2,0.7,0.3,1)' : 'none', transitionDelay: `${i * 80}ms` }} />
                    <span className="num">{fmt.dollar(earlyAmounts[tp])} · {shareOfPeriod}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent period (post-collapse) */}
          <div>
            <div className="caption" style={{ marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {t('act2_compare_recent')}
            </div>
            <div className="caption" style={{ marginBottom: 16, color: 'var(--mute-soft)' }}>
              {t('act2_compare_recent_sub', { total: fmt.dollar(totalRecent) })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {recentSorted.map((tp, i) => {
                const pct = (recentAmounts[tp] / maxPeriodAmount) * 100;
                const shareOfPeriod = (recentAmounts[tp] / totalRecent * 100).toFixed(0);
                return (
                  <div key={tp} className="bar-row" style={{ gridTemplateColumns: '120px 1fr 90px', gap: 12 }}>
                    <span className="lbl">{t(TYPE_KEY[tp])}</span>
                    <span className={`bar ${i === 0 ? 'accent' : ''}`}
                      style={{ width: `${pct}%`, transition: inView ? 'width 800ms cubic-bezier(0.2,0.7,0.3,1)' : 'none', transitionDelay: `${i * 80}ms` }} />
                    <span className="num">{fmt.dollar(recentAmounts[tp])} · {shareOfPeriod}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="callout" style={{ marginTop: 32 }}>
          <b>{t('act2_compare_callout_title')}</b>
          {t('act2_compare_callout', {
            housingEarlyPct: (earlyAmounts['Emergency Housing'] / totalEarly * 100).toFixed(0),
            housingRecentPct: (recentAmounts['Emergency Housing'] / totalRecent * 100).toFixed(0),
            foodEarlyPct: (earlyAmounts['Food'] / totalEarly * 100).toFixed(0),
            foodRecentPct: (recentAmounts['Food'] / totalRecent * 100).toFixed(0),
          })}
        </div>
      </div>

      <SectionFooter chap="02 / 05" note={t('act2_footer')} />
    </section>
  );
}

window.Act2Types = Act2Types;

function Act1Scale() {
  const data = useTainuiData();
  const [ref, inView] = useInView();
  const t = useT();

  const WAIKATO_TLAS = new Set(['Hamilton City', 'Matamata-Piako District', 'Otorohanga District', 'Waikato District', 'Waipa District']);

  const stats = useMemo(() => {
    const wkGrantsAll = data.tlaGrants.filter(r => WAIKATO_TLAS.has(r.tla) && r.hardship_type === 'All hardship');
    const wkAmountsAll = data.tlaAmounts.filter(r => WAIKATO_TLAS.has(r.tla) && r.hardship_type === 'All hardship');
    const totalGrants = wkGrantsAll.reduce((s, r) => s + r.grants, 0);
    const totalAmount = wkAmountsAll.reduce((s, r) => s + r.amount, 0);
    const quarters = [...new Set(wkGrantsAll.map(r => r.quarter))];
    return { totalGrants, totalAmount, quarters: quarters.length, tlas: WAIKATO_TLAS.size };
  }, [data]);

  return (
    <section id="scale" className="section" ref={ref}>
      <div className={`reveal ${inView ? 'in' : ''}`}>
        <Eyebrow>{t('act1_eyebrow')}</Eyebrow>
        <div className="big-number">{fmt.dollarFull(stats.totalAmount)}</div>
        <p className="lede">
          {t('act1_lede', { totalAmount: fmt.dollarFull(stats.totalAmount), totalGrants: fmt.full(stats.totalGrants) })}
        </p>
      </div>

      <div className={`reveal-stagger ${inView ? 'in' : ''}`}>
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-value">{fmt.big(stats.totalGrants)}</div>
            <div className="stat-label">{t('act1_stat_grants')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{fmt.dollar(stats.totalAmount)}</div>
            <div className="stat-label">{t('act1_stat_amount')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.quarters}</div>
            <div className="stat-label">{t('act1_stat_quarters')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.tlas}</div>
            <div className="stat-label">{t('act1_stat_tlas')}</div>
          </div>
        </div>

        <p className="body">{t('act1_body1')}</p>
        <p className="body">{t('act1_body2')}</p>
      </div>

      <SectionFooter chap="01 / 05" note={t('act1_footer')} />
    </section>
  );
}

window.Act1Scale = Act1Scale;

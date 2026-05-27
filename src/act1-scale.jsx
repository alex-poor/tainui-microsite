function Act1Scale() {
  const data = useTainuiData();
  const [ref, inView] = useInView();

  const WAIKATO_TLAS = new Set(['Hamilton City', 'Matamata-Piako District', 'Otorohanga District', 'Waikato District', 'Waipa District']);

  const stats = useMemo(() => {
    const wkGrantsAll = data.tlaGrants.filter(r => WAIKATO_TLAS.has(r.tla) && r.hardship_type === 'All hardship');
    const wkAmountsAll = data.tlaAmounts.filter(r => WAIKATO_TLAS.has(r.tla) && r.hardship_type === 'All hardship');
    const totalGrants = wkGrantsAll.reduce((s, r) => s + r.grants, 0);
    const totalAmount = wkAmountsAll.reduce((s, r) => s + r.amount, 0);

    const quarters = [...new Set(wkGrantsAll.map(r => r.quarter))];
    const tlas = [...WAIKATO_TLAS];

    return { totalGrants, totalAmount, quarters: quarters.length, tlas: tlas.length };
  }, [data]);

  return (
    <section id="scale" className="section" ref={ref}>
      <div className={`reveal ${inView ? 'in' : ''}`}>
        <Eyebrow>01 · The Scale</Eyebrow>
        <div className="big-number">{fmt.dollarFull(stats.totalAmount)}</div>
        <p className="lede">
          In three years, the government granted <NumInline>{fmt.dollarFull(stats.totalAmount)}</NumInline> in
          hardship assistance across the Waikato — spread over <NumInline>{fmt.full(stats.totalGrants)}</NumInline> individual grants.
        </p>
      </div>

      <div className={`reveal-stagger ${inView ? 'in' : ''}`}>
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-value">{fmt.big(stats.totalGrants)}</div>
            <div className="stat-label">Total grants issued</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{fmt.dollar(stats.totalAmount)}</div>
            <div className="stat-label">Total amount granted</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.quarters}</div>
            <div className="stat-label">Quarters of data</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.tlas}</div>
            <div className="stat-label">Territorial authorities</div>
          </div>
        </div>

        <p className="body">
          These figures cover five territorial authorities in the Waikato region,
          from January 2023 to March 2026. Each grant represents a moment where
          a person or whānau reached out for help — with food, with rent,
          with keeping the lights on.
        </p>
        <p className="body">
          This is a count of grants, not people. One person may receive
          multiple grants in a quarter. The true number of people in hardship
          is smaller — but the frequency of need is itself part of the story.
        </p>
      </div>

      <SectionFooter
        chap="01 / 05"
        note="Source: MSD IAP Data Warehouse, request BIIM-7241. Counts randomly rounded to base 3."
      />
    </section>
  );
}

window.Act1Scale = Act1Scale;

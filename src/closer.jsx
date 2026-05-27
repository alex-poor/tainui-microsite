function Closer() {
  const [ref, inView] = useInView();
  const t = useT();

  return (
    <div className="closer-bg">
      <section id="closer" className="section" ref={ref}>
        <div className={`reveal ${inView ? 'in' : ''}`}>
          <Eyebrow>{t('closer_eyebrow')}</Eyebrow>
          <h2 className="h2">{t('closer_title')}</h2>
          <p className="lede">{t('closer_lede')}</p>
        </div>

        <div className={`reveal ${inView ? 'in' : ''}`}>
          <p className="body">{t('closer_body1')}</p>
          <p className="body">{t('closer_body2')}</p>
        </div>

        <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 56 }}>
          <div className="caption" style={{ marginBottom: 20, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {t('closer_method_title')}
          </div>
          <div className="method-grid">
            <div><h4>{t('method_source_h')}</h4><p>{t('method_source')}</p></div>
            <div><h4>{t('method_confid_h')}</h4><p>{t('method_confid')}</p></div>
            <div><h4>{t('method_grants_h')}</h4><p>{t('method_grants')}</p></div>
            <div><h4>{t('method_geo_h')}</h4><p>{t('method_geo')}</p></div>
            <div><h4>{t('method_amount_h')}</h4><p>{t('method_amount')}</p></div>
            <div><h4>{t('method_coverage_h')}</h4><p>{t('method_coverage')}</p></div>
          </div>
        </div>

        <div style={{
          marginTop: 80, paddingTop: 24, borderTop: '1px solid var(--rule)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--mute)', flexWrap: 'wrap', gap: 12,
        }}>
          <span>{t('closer_footer_left')}</span>
          <span>{t('closer_footer_right')}</span>
        </div>
      </section>
    </div>
  );
}

window.Closer = Closer;

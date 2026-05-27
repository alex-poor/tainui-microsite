function Closer() {
  const [ref, inView] = useInView();

  return (
    <div className="closer-bg">
      <section id="closer" className="section" ref={ref}>
        <div className={`reveal ${inView ? 'in' : ''}`}>
          <Eyebrow>Closer</Eyebrow>
          <h2 className="h2">Behind every number, a whānau.</h2>
          <p className="lede">
            This data doesn't capture the full picture of hardship in the Waikato.
            It captures the moments when people asked for help — and received it.
            The unrecorded need is larger still.
          </p>
        </div>

        <div className={`reveal ${inView ? 'in' : ''}`}>
          <p className="body">
            For Waikato-Tainui, these numbers carry particular weight. The rohe of the iwi
            overlaps substantially with the MSD service areas captured here — Huntly,
            Ngāruawāhia, Kirikiriroa, Te Awamutu. The communities most represented
            in this data are Tainui communities.
          </p>
          <p className="body">
            The data shows a region where food insecurity is persistent, where emergency
            housing costs have shifted dramatically, and where the structural drivers of
            hardship remain largely unchanged even as policy settings move.
          </p>
        </div>

        <div className={`reveal ${inView ? 'in' : ''}`} style={{ marginTop: 56 }}>
          <div className="caption" style={{ marginBottom: 20, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Methodology & caveats
          </div>
          <div className="method-grid">
            <div>
              <h4>Data source</h4>
              <p>
                Ministry of Social Development, IAP Data Warehouse.
                Request BIIM-7241, prepared by Business Intelligence,
                Insights MSD Group.
              </p>
            </div>
            <div>
              <h4>Confidentiality</h4>
              <p>
                All cell counts have been randomly rounded to base three.
                Values of 1 or 2 are rounded to 3. Published counts never
                differ by more than two from actual values.
              </p>
            </div>
            <div>
              <h4>Grants, not people</h4>
              <p>
                These are counts of grants, not individual clients.
                One person can receive multiple grants in a single quarter.
                The number of people in hardship is smaller than the grant count.
              </p>
            </div>
            <div>
              <h4>Geography</h4>
              <p>
                Territorial Local Authority is estimated from the client's address
                recorded by MSD at the time of the grant. Service centre reflects
                the MSD office that processed the application.
              </p>
            </div>
            <div>
              <h4>Amount granted</h4>
              <p>
                Dollar figures represent the amount granted, which is not necessarily
                the amount spent. Includes Special Needs Grants (SNG), Advance
                payments of benefit (ADV), and Recoverable Assistance Payments (RAP).
              </p>
            </div>
            <div>
              <h4>Coverage</h4>
              <p>
                Data spans 13 quarters from January 2023 to March 2026,
                covering five Waikato territorial authorities and 13 Waikato
                MSD service centres plus Pukekohe (Auckland Metro).
              </p>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 80, paddingTop: 24,
          borderTop: '1px solid var(--rule)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: 'var(--sans)', fontSize: 11,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--mute)', flexWrap: 'wrap', gap: 12,
        }}>
          <span>Waikato-Tainui · May 2026</span>
          <span>Data: Ministry of Social Development</span>
        </div>
      </section>
    </div>
  );
}

window.Closer = Closer;

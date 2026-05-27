function TitleCard() {
  return (
    <section id="opener" className="section" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      paddingTop: 48, paddingBottom: 48,
    }}>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'var(--mute)',
        paddingBottom: 24, borderBottom: '1px solid var(--rule)',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <TainuiMark />
          <span style={{ fontWeight: 600, color: 'var(--ink-soft)', letterSpacing: '0.18em' }}>
            Waikato-Tainui
          </span>
        </div>
        <div>Hardship in the Waikato &nbsp;·&nbsp; May 2026</div>
      </header>

      <div className="reveal in" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: 920,
      }}>
        <div className="eyebrow" style={{ marginBottom: 32 }}>
          <span className="rule" />
          A data story
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)',
          fontWeight: 400,
          fontSize: 'clamp(48px, 8vw, 116px)',
          lineHeight: 0.96,
          letterSpacing: '-0.035em',
          color: 'var(--ink-soft)',
          margin: '0 0 32px',
          textWrap: 'balance',
        }}>
          Te āhua o te<br />uaua i<br />Waikato.
        </h1>
        <p style={{
          fontFamily: 'var(--serif)',
          fontWeight: 300,
          fontSize: 'clamp(18px, 2vw, 24px)',
          lineHeight: 1.5,
          color: 'var(--ink)',
          maxWidth: 640,
          margin: 0,
          textWrap: 'pretty',
        }}>
          Three years of government hardship assistance data
          across the Waikato region. Where the need is greatest,
          what kind of help is being sought, and how it's changing.
        </p>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        paddingTop: 32, borderTop: '1px solid var(--rule)',
        fontFamily: 'var(--sans)', fontSize: 11,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'var(--mute)',
      }}>
        <span>Scroll to explore</span>
        <span style={{ width: 28, height: 1, background: 'var(--mute)' }} />
        <span style={{ marginLeft: 'auto' }} className="tab-num">05 chapters</span>
      </div>
    </section>
  );
}

function TainuiMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="var(--accent)" strokeWidth="1.2" opacity="0.5" />
      <circle cx="12" cy="12" r="3.5" fill="var(--gold)" />
    </svg>
  );
}

window.TitleCard = TitleCard;
window.TainuiMark = TainuiMark;

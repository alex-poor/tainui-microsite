const { createContext, useContext, useState: useStateD, useEffect: useEffectD } = React;

const DataContext = createContext(null);

const FILES = [
  ['tlaGrants',   '01_tla_grants.csv'],
  ['tlaAmounts',  '02_tla_amounts.csv'],
  ['regGrants',   '03_region_grants.csv'],
  ['regAmounts',  '04_region_amounts.csv'],
  ['population',  '05_population.csv'],
];

function parseCsv(text) {
  return Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: true }).data;
}

async function loadAll() {
  const out = {};
  await Promise.all(FILES.map(async ([key, file]) => {
    const r = await fetch(`data/${file}`);
    const t = await r.text();
    out[key] = parseCsv(t);
  }));
  return out;
}

function TainuiProvider({ children }) {
  const [data, setData] = useStateD(null);
  const [error, setError] = useStateD(null);

  useEffectD(() => {
    loadAll()
      .then(d => setData(d))
      .catch(e => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="loading" style={{ color: '#a32', flexDirection: 'column', gap: 8 }}>
        <div>Could not load data: {error}</div>
        <div style={{ fontSize: 11 }}>Serve via HTTP, not file://</div>
      </div>
    );
  }
  if (!data) {
    return <div className="loading">Loading data…</div>;
  }
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

function useTainuiData() {
  return useContext(DataContext);
}

Object.assign(window, { TainuiProvider, useTainuiData });

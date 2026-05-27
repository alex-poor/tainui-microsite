function App() {
  return (
    <window.TainuiProvider>
      <window.ScrollProgress />
      <window.ChapterRail />
      <main>
        <window.TitleCard />
        <window.Act1Scale />
        <window.Act2Types />
        <window.Act3Where />
        <window.Act4Trend />
        <window.Act5Centres />
        <window.Closer />
      </main>
    </window.TainuiProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

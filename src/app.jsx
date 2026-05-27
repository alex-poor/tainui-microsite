function App() {
  return (
    <window.LangProvider>
      <window.TainuiProvider>
        <window.ScrollProgress />
        <window.ChapterRail />
        <window.LangPicker />
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
    </window.LangProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

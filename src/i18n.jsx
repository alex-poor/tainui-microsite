const { createContext: createCtxI, useContext: useCtxI, useState: useStateI, useCallback: useCbI } = React;

const LangContext = createCtxI({ lang: 'mi', setLang: () => {} });

function LangProvider({ children }) {
  const [lang, setLang] = useStateI('mi');
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

function useLang() {
  return useCtxI(LangContext);
}

function useT() {
  const { lang } = useCtxI(LangContext);
  return useCbI((key, vars) => {
    const s = (window.STRINGS[lang] && window.STRINGS[lang][key]) || window.STRINGS['en'][key] || key;
    if (!vars) return s;
    return s.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? `{${name}}`);
  }, [lang]);
}

Object.assign(window, { LangProvider, useLang, useT });

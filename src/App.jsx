import { useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { LangCtx, Navbar, usePersistentState } from "./components/chrome";
import { STR } from "./i18n";
import HomePage from "./pages/Home";
import ListeningPage from "./pages/Listening";
import ReadingPage from "./pages/Reading";
import WritingPage from "./pages/Writing";
import SpeakingPage from "./pages/Speaking";
import MockPage from "./pages/Mock";
import StudyPage from "./pages/Study";
import GuidePage from "./pages/Guide";

export default function App() {
  const [state, setState] = usePersistentState();
  const [lang, setLang] = useState(() => { try { return localStorage.getItem("tef-lang") || "en"; } catch { return "en"; } });
  const t = STR[lang] || STR.en;
  return (
    <LangCtx.Provider value={{ lang, setLang, t }}>
      <HashRouter>
        <div className="min-h-screen">
          <Navbar state={state} />
          <main className="max-w-7xl mx-auto px-4 py-4">
            <Routes>
              <Route path="/" element={<HomePage state={state} />} />
              <Route path="/listening" element={<ListeningPage state={state} setState={setState} />} />
              <Route path="/reading" element={<ReadingPage state={state} setState={setState} />} />
              <Route path="/writing" element={<WritingPage state={state} setState={setState} />} />
              <Route path="/speaking" element={<SpeakingPage state={state} setState={setState} />} />
              <Route path="/mock" element={<MockPage state={state} setState={setState} />} />
              <Route path="/study" element={<StudyPage />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="*" element={<HomePage state={state} />} />
            </Routes>
            <div className="mt-6 text-center text-xs text-slate-400">TEF Canada Pro • Real format: Listening Q1–40 • Reading Q1–40 • {t.practiceOnly}</div>
          </main>
        </div>
      </HashRouter>
    </LangCtx.Provider>
  );
}

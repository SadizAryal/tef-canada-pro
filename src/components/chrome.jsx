import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BookOpen, Ear, Eye, FileText, Flame, Home, Mic, PenLine, Star, Timer, Volume2 } from "lucide-react";
import { loadState, saveState, speakFrench, stopSpeak, touchStreak } from "../utils";
import { STR } from "../i18n";

export const LangCtx = createContext({ lang: "en", setLang: () => {}, t: STR.en });
export const useLang = () => useContext(LangCtx);

export function usePersistentState() {
  const [s, setS] = useState(loadState);
  useEffect(() => { saveState(s); }, [s]);
  return [s, setS];
}
export function addXP(setS, n) {
  setS((prev) => { const st = touchStreak(prev); return { ...st, xp: (st.xp || 0) + n }; });
}
export function useTimer() {
  const [sec, setSec] = useState(0);
  const [run, setRun] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (run) ref.current = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(ref.current);
  }, [run]);
  const fmt = `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
  return { sec, fmt, run, setRun, setSec };
}

export function Navbar({ state }) {
  const { lang, setLang, t } = useLang();
  const links = [
    ["/", t.home, Home], ["/listening", t.listening, Ear], ["/reading", t.reading, Eye],
    ["/writing", t.writing, PenLine], ["/speaking", t.speaking, Mic],
    ["/mock", t.mock, Timer], ["/study", t.study, BookOpen], ["/guide", lang === "fr" ? "Guide" : "Guide", FileText],
  ];
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center text-white font-black text-xs">TEF</div>
          <div>
            <div className="font-extrabold text-sm leading-tight text-slate-900">TEF Pro <span className="text-blue-700">CLB 7+</span></div>
            <div className="text-[11px] text-slate-500">TEF Canada • EN + FR • Real format Q1–40</div>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="hidden md:inline-flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-700 px-2 py-0.5 rounded-full font-bold text-xs"><Flame size={13} /> {state.streakCount || 0}</span>
          <span className="hidden md:inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-full font-bold text-xs"><Star size={13} /> {state.xp || 0}</span>
          <div className="flex border border-slate-300 rounded-lg overflow-hidden text-xs font-bold">
            {(["en", "fr"]).map((l) => (
              <button key={l} onClick={() => { try { localStorage.setItem("tef-lang", l); } catch {} setLang(l); }}
                className={`px-2.5 py-1 ${lang === l ? "bg-slate-900 text-white" : "bg-white text-slate-600"}`}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-2 flex gap-1.5 overflow-x-auto">
        {links.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} onClick={stopSpeak}
            className={({ isActive }) => `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap border ${isActive ? "bg-blue-700 text-white border-blue-700" : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-700"}`}>
            <Icon size={14} /> {label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export function EnToggle({ showEn, setShowEn }) {
  const { t } = useLang();
  return (
    <button onClick={() => setShowEn(!showEn)} className="text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-1 bg-white hover:border-blue-500">
      {showEn ? t.hideEn : t.showEn}
    </button>
  );
}
export function SectionHead({ title, sub, right }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <div><h2 className="text-lg font-black text-slate-900">{title}</h2><div className="text-xs text-slate-500">{sub}</div></div>
      <div className="ml-auto flex gap-2">{right}</div>
    </div>
  );
}
export function SideCard({ title, children }) {
  return (
    <div className="pro-card p-3 h-fit">
      <div className="font-extrabold text-[13px] text-slate-900 px-1 py-1">{title}</div>
      {children}
    </div>
  );
}
export function SpeakBtn({ text, label }) {
  return (
    <button onClick={() => speakFrench(text)} className="inline-flex items-center gap-1 text-xs font-bold border border-slate-300 rounded-lg px-2 py-1 bg-white hover:border-blue-500">
      <Volume2 size={12} /> {label || "Play"}
    </button>
  );
}

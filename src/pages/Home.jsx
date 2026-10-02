import { Link } from "react-router-dom";
import { CalendarCheck, Ear, Eye, Mic, PenLine, Trophy, Volume2 } from "lucide-react";
import { useLang } from "../components/chrome";
import { speakFrench } from "../utils";
import { connecteurDuJour, dailyPlan } from "../data";

export default function HomePage({ state }) {
  const { t, lang } = useLang();
  const sections = [
    { to: "/listening", icon: Ear, name: t.listening, color: "bg-sky-600", target: "Target 249/360 • 40Q/40min",
      types: ["A Q1–4 pictures", "B Q5–8 announcements", "C Q9–14 answering machine", "D Q15–20 opinions (3 choices)", "E Q21–22 chronicles", "F Q23–30 interviews", "G Q31–40 report + docs"] },
    { to: "/reading", icon: Eye, name: t.reading, color: "bg-emerald-600", target: "Target 207/300 • 40Q/60min • free navigation",
      types: ["Q1–7 short docs: main intent", "Q8–17 fill-in-the-blank vocab + grammar", "Q18–40 deep reading: long paragraphs, harder as you go"] },
    { to: "/writing", icon: PenLine, name: t.writing, color: "bg-amber-500", target: "Target 310/450 • split screen + word counter + accents",
      types: ["Section A ×6 (fait divers continuation)", "Section B ×6 (formal letter to the editor)"] },
    { to: "/speaking", icon: Mic, name: t.speaking, color: "bg-rose-600", target: "Target 310/450 • A 5min / B 10min • recorded",
      types: ["Section A ×5 (ask 10 formal questions)", "Section B ×5 (pitch flyer to skeptical friend)"] },
  ];
  const idx = new Date().getDate() % connecteurDuJour.length;
  const cdj = connecteurDuJour[idx];
  return (
    <div className="space-y-4">
      <div className="pro-card p-6 md:p-8 border-t-4 border-t-blue-700">
        <div className="text-xs font-black text-blue-700 tracking-widest">{t.heroBadge}</div>
        <h1 className="text-2xl md:text-4xl font-black text-slate-900 mt-1 max-w-3xl">{t.heroTitle}</h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl">{t.heroSub}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link to="/listening" className="bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-blue-800">{t.startPractice}</Link>
          <Link to="/mock" className="bg-white border border-slate-300 font-bold px-5 py-2.5 rounded-lg text-sm hover:border-blue-500">{t.takeMock}</Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-5 text-center">
          {[["40", "Listening Q1–40"], ["40", "Reading Q1–40"], ["12", lang === "fr" ? "Sujets écrit" : "Writing prompts"],
            ["10", lang === "fr" ? "Sujets oral" : "Speaking tasks"], ["12", lang === "fr" ? "Mots vocab" : "Vocab words"],
            ["20", lang === "fr" ? "Questions A" : "Sec-A questions"]].map(([n, l]) => (
            <div key={l} className="bg-slate-50 border border-slate-200 rounded-lg py-2"><div className="text-xl font-black text-slate-900">{n}</div><div className="text-[11px] text-slate-500">{l}</div></div>
          ))}
        </div>
      </div>

      <div className="pro-card p-5">
        <div className="font-extrabold text-slate-900">NCLC 7 targets for Express Entry <span className="text-xs font-normal text-slate-500">(/699 scale + ancien score in brackets)</span></div>
        <div className="grid sm:grid-cols-4 gap-2 mt-3 text-sm">
          {[["Listening", "434 – 461", "ancien 249+"], ["Reading", "434 – 461", "ancien 207+"], ["Writing", "428 – 471", "ancien 310+"], ["Speaking", "456 – 493", "ancien 310+"]].map(([a, b, c]) => (
            <div key={a} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center"><div className="font-bold text-slate-900">{a}</div><div className="text-lg font-black text-blue-700">{b}</div><div className="text-xs text-slate-500">{c}</div></div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.to} className="pro-card p-4 flex flex-col">
              <div className={`w-9 h-9 rounded-lg ${s.color} text-white flex items-center justify-center`}><Icon size={18} /></div>
              <div className="font-extrabold mt-2 text-slate-900">{s.name}</div>
              <div className="text-xs font-bold text-blue-700">{s.target}</div>
              <ul className="text-xs text-slate-600 mt-2 space-y-1 flex-1">{s.types.map((x) => <li key={x}>• {x}</li>)}</ul>
              <Link to={s.to} className="mt-3 text-center bg-slate-900 text-white text-sm font-bold py-2 rounded-lg">Practice →</Link>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
        <div className="pro-card p-5 lg:col-span-2">
          <div className="font-extrabold flex items-center gap-2 text-slate-900"><CalendarCheck size={17} className="text-blue-700" /> {t.plan7}</div>
          <div className="divide-y divide-slate-100 mt-1">
            {dailyPlan.map((d) => (
              <div key={d.day} className="py-2 flex items-center gap-3 text-sm">
                <span className="w-24 font-bold text-blue-700">{lang === "fr" ? d.dayFr : d.day}</span>
                <span className="flex-1 text-slate-700"><b>{lang === "fr" ? d.focusFr : d.focus}</b> <span className="text-slate-500">• {d.task}</span></span>
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-600">{d.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="pro-card p-5 border-t-4 border-t-amber-400">
            <div className="text-xs font-bold text-amber-600 uppercase">{t.connectorDay}</div>
            <div className="text-xl font-black mt-1 text-slate-900">{cdj.fr}</div>
            <div className="text-sm italic mt-1 text-slate-700">"{cdj.ex}"</div>
            <div className="text-xs text-slate-500 mt-1">= {cdj.en}</div>
            <button onClick={() => speakFrench(cdj.ex)} className="mt-2 inline-flex items-center gap-1 text-sm font-bold bg-slate-900 text-white px-3 py-1.5 rounded-lg"><Volume2 size={14} /> Play</button>
          </div>
          <div className="pro-card p-5 text-sm">
            <div className="font-extrabold flex items-center gap-2 text-slate-900"><Trophy size={16} className="text-blue-700" /> {t.progress}</div>
            <div className="mt-2 space-y-1 text-slate-600">
              <div>Listening: <b>{Object.values(state.listeningDone || {}).filter(Boolean).length}</b> • Reading: <b>{Object.values(state.readingDone || {}).filter(Boolean).length}</b></div>
              <div>Writing saved: <b>{state.writingAttempts?.length || 0}</b> • Speaking saved: <b>{state.speakingAttempts?.length || 0}</b></div>
              <div>Mocks: <b>{state.mockHistory?.length || 0}</b> • XP: <b>{state.xp}</b> • Streak: <b>{state.streakCount || 0}d</b></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

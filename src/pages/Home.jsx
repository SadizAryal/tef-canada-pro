import { Link } from "react-router-dom";
import { Ear, Eye, GraduationCap, Mic, PenLine, Timer } from "lucide-react";
import { useLang } from "../components/chrome";

export default function HomePage({ state }) {
  const { t, lang } = useLang();
  const fr = lang === "fr";
  const skills = [
    { to: "/listening", icon: Ear, name: t.listening, line: fr ? "40 Q • Q1–40 dans l'ordre" : "40 Qs • Q1–40 in order", color: "bg-sky-600" },
    { to: "/reading", icon: Eye, name: t.reading, line: fr ? "40 Q • navigation libre" : "40 Qs • free navigation", color: "bg-emerald-600" },
    { to: "/writing", icon: PenLine, name: t.writing, color: "bg-amber-500", line: fr ? "Fait divers + lettre • 60 min" : "News story + letter • 60 min" },
    { to: "/speaking", icon: Mic, name: t.speaking, line: fr ? "10 questions + pitch • 15 min" : "10 questions + pitch • 15 min", color: "bg-rose-600" },
  ];
  return (
    <div className="space-y-4">
      <div className="pro-card p-6 md:p-8 border-t-4 border-t-blue-700">
        <div className="text-xs font-black text-blue-700 tracking-widest">{t.heroBadge}</div>
        <h1 className="text-2xl md:text-4xl font-black text-slate-900 mt-1 max-w-3xl">{t.heroTitle}</h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl">{t.heroSub}</p>
        <div className="grid sm:grid-cols-3 gap-2 mt-5">
          {[
            ["/learn", GraduationCap, fr ? "1. Apprendre" : "1. Learn", fr ? "Watch a teacher explain it" : "Watch a teacher explain it"],
            ["/listening", Ear, fr ? "2. Pratiquer" : "2. Practice", fr ? "Drills Q1–40, dans l'ordre" : "Q1–40 drills, in order"],
            ["/mock", Timer, fr ? "3. Examen blanc" : "3. Mock test", fr ? "Comme le jour J, chronométré" : "Timed, like exam day"],
          ].map(([to, Icon, a, b]) => (
            <Link key={to} to={to} className="flex items-center gap-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 rounded-xl px-4 py-3">
              <Icon size={22} className="text-blue-700 shrink-0" />
              <span><span className="block font-extrabold text-slate-900 text-sm">{a}</span><span className="block text-xs text-slate-500">{b}</span></span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {skills.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.to} to={s.to} className="pro-card p-4 hover:shadow-lg transition-shadow">
              <div className={`w-9 h-9 rounded-lg ${s.color} text-white flex items-center justify-center`}><Icon size={18} /></div>
              <div className="font-extrabold mt-2 text-slate-900">{s.name}</div>
              <div className="text-xs text-slate-500">{s.line}</div>
            </Link>
          );
        })}
      </div>

      <div className="pro-card p-5">
        <div className="font-extrabold text-slate-900">{fr ? "Objectifs NCLC 7 (échelle /699)" : "NCLC 7 targets (/699 scale)"}</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-sm">
          {[["Listening", "434–461"], ["Reading", "434–461"], ["Writing", "428–471"], ["Speaking", "456–493"]].map(([a, b]) => (
            <div key={a} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center"><div className="font-bold text-slate-900 text-[13px]">{a}</div><div className="text-lg font-black text-blue-700">{b}</div></div>
          ))}
        </div>
        <div className="text-xs text-slate-500 mt-3">
          {fr ? "Progression : " : "Your progress: "}
          Écoute <b>{Object.values(state.listeningDone || {}).filter(Boolean).length}</b> • Lecture <b>{Object.values(state.readingDone || {}).filter(Boolean).length}</b> • Écrits <b>{state.writingAttempts?.length || 0}</b> • Oraux <b>{state.speakingAttempts?.length || 0}</b> • Mocks <b>{state.mockHistory?.length || 0}</b>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Copy, Volume2, CalendarCheck, FileText, Layers } from "lucide-react";
import { SectionHead, useLang } from "../components/chrome";
import { connecteurs, dailyPlan, questionStems, vocabBook } from "../data";
import { speakFrench } from "../utils";

export default function StudyPage() {
  const { t, lang } = useLang();
  const [tab, setTab] = useState("vocab");
  const copy = (x) => { try { navigator.clipboard.writeText(x); } catch {} };
  return (
    <div>
      <SectionHead title={t.study} sub="Vocab book • Section-A questions • Connectors • 7-day plan" />
      <div className="flex gap-1.5 mb-3">
        {[["vocab", t.vocabBook, Layers], ["templates", t.templatesVault, FileText], ["plan", t.studyPlan, CalendarCheck]].map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border ${tab === id ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"}`}><Icon size={14} /> {label}</button>
        ))}
      </div>
      {tab === "vocab" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {vocabBook.map((v) => (
            <div key={v.fr} className="pro-card p-4">
              <div className="flex items-center gap-2"><span className="font-black text-slate-900">{v.fr}</span>
                <span className="ml-auto text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">{v.tag}</span></div>
              <div className="text-sm text-blue-700 font-semibold">= {v.en}</div>
              <div className="text-[13px] italic text-slate-600 mt-1">"{v.ex}"</div>
              <div className="text-xs text-slate-400">"{v.exEn}"</div>
              <button onClick={() => speakFrench(v.ex)} className="mt-2 text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-1 inline-flex items-center gap-1"><Volume2 size={12} /> Play</button>
            </div>
          ))}
        </div>
      )}
      {tab === "templates" && (
        <div className="grid lg:grid-cols-2 gap-3">
          <div className="pro-card p-5">
            <div className="font-extrabold text-slate-900">Section A — 20 questions (FR + EN)</div>
            <div className="space-y-1 mt-2">
              {questionStems.map((q, i) => <div key={i} className="flex items-center gap-2 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                <span className="flex-1"><span className="text-slate-900 font-medium">{q.fr}</span><br /><span className="text-xs text-slate-500">{q.en}</span></span>
                <button onClick={() => copy(q.fr)} className="text-slate-400 hover:text-slate-800"><Copy size={14} /></button>
                <button onClick={() => speakFrench(q.fr)} className="text-slate-400 hover:text-blue-700"><Volume2 size={14} /></button>
              </div>)}
            </div>
          </div>
          <div className="space-y-3">
            <div className="pro-card p-5">
              <div className="font-extrabold text-slate-900">Connectors / Connecteurs (FR + EN)</div>
              {Object.entries(connecteurs).map(([k, arr]) => (
                <div key={k} className="mb-2 mt-1"><div className="text-xs font-bold uppercase text-blue-700">{k}</div>
                  <div className="flex flex-wrap gap-1.5 mt-1">{arr.map((c) => <button key={c.fr} title={c.en} onClick={() => speakFrench(c.fr)} className="text-xs bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full font-semibold hover:bg-blue-100 text-slate-800">{c.fr} <span className="text-slate-400">• {c.en}</span></button>)}</div>
                </div>
              ))}
            </div>
            <div className="pro-card p-5 border-t-4 border-t-blue-700 text-sm">
              <div className="font-extrabold text-slate-900">Writing B skeleton — plan (EN + FR to copy)</div>
              <pre className="whitespace-pre-wrap mt-2 text-[13px] text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3">Intro: Nowadays, [topic]. In my opinion, [opinion]. / De nos jours... À mon avis...
Arg 1: Firstly + example / Premièrement + Par exemple...
Arg 2: Moreover / De plus...
Objection: However... Although... / Cependant... Bien que...
Conclusion: In conclusion... That's why... / En conclusion... C'est pourquoi...</pre>
              <button onClick={() => copy("De nos jours... À mon avis... Premièrement... Par exemple... De plus... Cependant... Bien que... En conclusion... C'est pourquoi...")} className="mt-2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg inline-flex gap-1 items-center"><Copy size={13} /> Copy FR version</button>
            </div>
          </div>
        </div>
      )}
      {tab === "plan" && (
        <div className="pro-card p-5">
          <div className="font-extrabold text-slate-900">{lang === "fr" ? "Plan 7 jours" : "7-day plan"}</div>
          <div className="divide-y divide-slate-100 mt-1">
            {dailyPlan.map((d) => <div key={d.day} className="py-2 flex items-center gap-3 text-sm">
              <span className="w-24 font-bold text-blue-700">{lang === "fr" ? d.dayFr : d.day}</span>
              <span className="flex-1 text-slate-700">{lang === "fr" ? d.focusFr : d.focus} <span className="text-slate-400">/ {lang === "fr" ? d.focus : d.focusFr}</span></span>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-600">{d.time}</span>
            </div>)}
          </div>
        </div>
      )}
    </div>
  );
}

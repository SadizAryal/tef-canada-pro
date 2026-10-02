import { useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { addXP, EnToggle, SectionHead, SideCard, useLang, useTimer } from "../components/chrome";
import { sampleWritingA, sampleWritingB, writingPromptsA, writingPromptsB } from "../data";
import { countWords, rubricToScaled, speakFrench } from "../utils";

export default function WritingPage({ state, setState }) {
  const { t, lang } = useLang();
  const [showEn, setShowEn] = useState(true);
  const [section, setSection] = useState("A");
  const [prompt, setPrompt] = useState(0);
  const [text, setText] = useState("");
  const [checks, setChecks] = useState([false, false, false, false, false]);
  const tm = useTimer();
  const areaRef = useRef(null);
  const ACCENTS = ["é", "è", "ê", "ë", "à", "â", "ç", "î", "ï", "ô", "ù", "û", "œ", "«", "»"];
  const insertAccent = (ch) => {
    const el = areaRef.current;
    if (!el) { setText((v) => v + ch); return; }
    const s = el.selectionStart ?? text.length, e = el.selectionEnd ?? text.length;
    setText(text.slice(0, s) + ch + text.slice(e));
    requestAnimationFrame(() => { el.focus(); el.selectionStart = el.selectionEnd = s + ch.length; });
  };
  const words = countWords(text);
  const target = section === "A" ? 80 : 200;
  const limit = section === "A" ? 25 * 60 : 35 * 60;
  const labels = section === "A"
    ? ["Greeting + subject line / Formule + objet", "Correct passé composé / imparfait", "2 connectors / 2 connecteurs", "Clear request at end / Demande claire", "2-min proofread / Relecture 2 min"]
    : ["Rephrased intro + clear opinion / Intro + avis", "2 arguments + examples / 2 args + exemples", "Objection + rebuttal / Objection + réfutation", "5+ varied connectors / 5+ connecteurs", "Conclusion + word count / Conclusion + mots"];
  const score100 = Math.round((checks.filter(Boolean).length / checks.length) * 70 + Math.min(30, (words / target) * 30));
  const scaled = rubricToScaled(score100);
  const pass = scaled >= 310 && words >= target;
  const prompts = section === "A" ? writingPromptsA : writingPromptsB;
  const save = () => {
    setState((p) => ({ ...p, writingAttempts: [...(p.writingAttempts || []), { section, prompt, words, scaled, date: new Date().toISOString() }], bestBands: { ...p.bestBands, writing: Math.max(p.bestBands?.writing || 0, scaled >= 310 ? 7 : 6) } }));
    addXP(setState, 20);
  };
  return (
    <div>
      <SectionHead title={`${t.writing} — 60 min: A 80+ words (25 min) + B 200+ words (35 min)`} sub={t.writeFrNote}
        right={<EnToggle showEn={showEn} setShowEn={setShowEn} />} />
      <div className="grid lg:grid-cols-[300px_1fr_260px] gap-3">
        <SideCard title={`${t.queTypes} • Writing`}>
          <div className="flex gap-2 mb-2">
            {(["A", "B"]).map((s) => <button key={s} onClick={() => { setSection(s); setPrompt(0); setText(""); setChecks([false, false, false, false, false]); tm.setSec(0); tm.setRun(false); }} className={`flex-1 py-2 rounded-lg text-[13px] font-bold border ${section === s ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 border-slate-200"}`}>{t["sec" + s]} {s === "A" ? "(80+)" : "(200+)"}</button>)}
          </div>
          <div className="space-y-1.5 max-h-[440px] overflow-auto">
            {prompts.map((p, i) => <button key={i} onClick={() => setPrompt(i)} className={`w-full text-left text-[13px] px-2.5 py-2 rounded-lg border ${prompt === i ? "bg-blue-700 text-white border-blue-700" : "bg-slate-50 border-slate-200"}`}>
              <div className="font-semibold">{lang === "fr" ? p.fr : p.en}</div>
              {showEn && <div className="text-[11px] opacity-70">{lang === "fr" ? p.en : p.fr}</div>}
            </button>)}
          </div>
        </SideCard>
        <div className="pro-card p-5">
          <div className="text-[13px] bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-slate-700"><b>{section === "A" ? "Fact sheet / Fiche de faits (use every fact!)" : "Task / Sujet"} :</b> {prompts[prompt].fr}{showEn && <div className="text-slate-500">{prompts[prompt].en}</div>}</div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`font-mono font-black text-lg ${tm.sec > limit ? "text-red-600" : "text-slate-900"}`}>{tm.fmt}</span>
            <span className="text-xs text-slate-500">{t.limit} {section === "A" ? "25:00" : "35:00"}</span>
            {!tm.run ? <button onClick={() => tm.setRun(true)} className="bg-slate-900 text-white text-sm font-bold px-3 py-1.5 rounded-lg">{t.start}</button>
              : <button onClick={() => tm.setRun(false)} className="bg-white border border-slate-300 text-sm font-bold px-3 py-1.5 rounded-lg">{t.pause}</button>}
            <button onClick={() => { tm.setSec(0); tm.setRun(false); }} className="text-sm px-3 py-1.5 rounded-lg border border-slate-300">{t.reset}</button>
            <span className={`ml-auto text-sm font-bold px-3 py-1.5 rounded-lg border ${words >= target ? "bg-green-50 text-green-700 border-green-300" : "bg-amber-50 text-amber-700 border-amber-300"}`}>{words} / {target} {t.words}</span>
          </div>
          <textarea ref={areaRef} value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder={t.writeHereFr}
            className="mt-2 w-full border border-slate-300 rounded-lg p-3 text-[15px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <span className="text-xs font-bold text-slate-500 mr-1">Accents / Clavier français :</span>
            {ACCENTS.map((a) => <button key={a} onClick={() => insertAccent(a)} className="w-8 h-8 rounded-lg border border-slate-300 bg-white text-sm font-bold hover:border-blue-500 hover:bg-blue-50">{a}</button>)}
          </div>
          {section === "B" && <div className="mt-2 text-xs bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-slate-700"><b>Letter frame / Plan de lettre :</b> Monsieur le Rédacteur, → I read your editorial… → Firstly… Moreover… → However… Although… → thank you for publishing → salutations distinguées.</div>}
          <div className="mt-3 grid sm:grid-cols-2 gap-1.5">
            {labels.map((c, i) => (
              <label key={i} className={`text-[13px] flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer ${checks[i] ? "bg-green-50 border-green-400" : "bg-slate-50 border-slate-200"}`}>
                <input type="checkbox" checked={checks[i]} onChange={() => setChecks((p) => p.map((v, j) => j === i ? !v : v))} /> {c}
              </label>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`font-bold text-sm px-3 py-2 rounded-lg border ${pass ? "bg-green-600 text-white border-green-600" : "bg-slate-100 border-slate-200"}`}>{t.estimate}: {scaled}/450 {pass ? `• ${t.pass7}` : `• ${t.below310}`}</span>
            <button onClick={save} className="bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg">{t.save} (+20 XP)</button>
            <button onClick={() => speakFrench(text.slice(0, 400))} className="text-sm border border-slate-300 px-3 py-2 rounded-lg inline-flex items-center gap-1"><Volume2 size={14} /> Listen</button>
          </div>
          <details className="mt-3 text-sm"><summary className="font-bold cursor-pointer text-blue-700">{t.modelAnswer}</summary>
            <pre className="whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-lg p-3 mt-2 text-[13px] leading-relaxed text-slate-800">{section === "A" ? sampleWritingA : sampleWritingB}</pre>
          </details>
        </div>
        <div className="space-y-3">
          <div className="pro-card p-4"><div className="font-extrabold text-[13px] text-slate-900">Target / Seuil</div><div className="text-xs text-slate-600 mt-1">Writing 310/450<br />A: every fact used<br />B: 5+ connectors</div></div>
          <div className="pro-card p-4"><div className="font-extrabold text-[13px] text-slate-900">Plan B</div><div className="text-xs text-slate-600 mt-1">Opinion → 2 args + examples → objection → rebuttal → conclusion.</div></div>
        </div>
      </div>
    </div>
  );
}

import { useRef, useState } from "react";
import { Mic } from "lucide-react";
import { addXP, EnToggle, SectionHead, SideCard, useLang, useTimer } from "../components/chrome";
import { speakingPromptsA, speakingPromptsB } from "../data";
import { rubricToScaled, speakFrench } from "../utils";

export default function SpeakingPage({ state, setState }) {
  const { t, lang } = useLang();
  const [showEn, setShowEn] = useState(true);
  const [section, setSection] = useState("A");
  const [prompt, setPrompt] = useState(0);
  const [recUrl, setRecUrl] = useState(null);
  const [recording, setRecording] = useState(false);
  const [rubric, setRubric] = useState([false, false, false, false]);
  const recRef = useRef(null);
  const chunks = useRef([]);
  const tm = useTimer();
  const prompts = section === "A" ? speakingPromptsA : speakingPromptsB;
  const cur = prompts[prompt];
  const labels = ["Fluency / Fluidité", "Vocab + connectors / Lexique + connecteurs", "Grammar / Morphosyntaxe", "Pronunciation / Phonétique"];
  const scaled = rubricToScaled(Math.round((rubric.filter(Boolean).length / 4) * 100));
  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunks.current = [];
      mr.ondataavailable = (e) => chunks.current.push(e.data);
      mr.onstop = () => { setRecUrl(URL.createObjectURL(new Blob(chunks.current, { type: "audio/webm" }))); stream.getTracks().forEach((tr) => tr.stop()); };
      mr.start(); recRef.current = mr; setRecording(true); tm.setSec(0); tm.setRun(true);
    } catch { alert("Microphone blocked. / Micro bloqué."); }
  };
  const stopRec = () => { recRef.current?.stop(); setRecording(false); tm.setRun(false); };
  return (
    <div>
      <SectionHead title={`${t.speaking} — 15 min: A ask-for-info (5 min) + B convince (10 min)`} sub={t.speakFr}
        right={<EnToggle showEn={showEn} setShowEn={setShowEn} />} />
      <div className="grid lg:grid-cols-[300px_1fr_260px] gap-3">
        <SideCard title={`${t.queTypes} • Speaking`}>
          <div className="flex gap-2 mb-2">
            {(["A", "B"]).map((s) => <button key={s} onClick={() => { setSection(s); setPrompt(0); setRubric([false, false, false, false]); }} className={`flex-1 py-2 rounded-lg text-[13px] font-bold border ${section === s ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 border-slate-200"}`}>{t["sec" + s]} {s === "A" ? "(5 min)" : "(10 min)"}</button>)}
          </div>
          {prompts.map((p, i) => <button key={i} onClick={() => setPrompt(i)} className={`w-full text-left text-[13px] px-2.5 py-2 rounded-lg border mb-1.5 ${prompt === i ? "bg-blue-700 text-white border-blue-700" : "bg-slate-50 border-slate-200"}`}>
            <b>{lang === "fr" ? p.titleFr : p.title}</b>{showEn && <div className="text-[11px] opacity-75">{lang === "fr" ? p.title : p.titleFr}</div>}
          </button>)}
        </SideCard>
        <div className="pro-card p-5">
          <div className="text-xs font-bold text-rose-700 uppercase">{t["sec" + section]} • {cur.title} / {cur.titleFr}</div>
          {section === "A" && cur.ad && (
            <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-slate-800"><b>Ad / Annonce :</b> {cur.adFr || cur.ad}{showEn && <div className="text-slate-500">{cur.adEn}</div>}</div>
          )}
          <div className="text-[15px] font-semibold mt-2 text-slate-900">{cur.roleFr}</div>
          {showEn && <div className="text-sm text-slate-500">{cur.role}</div>}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="font-mono font-black text-lg text-slate-900">{tm.fmt}</span>
            {!recording ? <button onClick={startRec} className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg inline-flex items-center gap-1.5"><Mic size={15} /> {t.record}</button>
              : <button onClick={stopRec} className="bg-slate-900 text-white text-sm font-bold px-4 py-2 rounded-lg">{t.stop}</button>}
            {recUrl && <audio src={recUrl} controls className="h-9" />}
          </div>
          <div className="grid sm:grid-cols-2 gap-1.5 mt-3">
            {labels.map((l, i) => <label key={i} className={`text-[13px] flex gap-2 items-center px-3 py-2 rounded-lg border cursor-pointer ${rubric[i] ? "bg-green-50 border-green-400" : "bg-slate-50 border-slate-200"}`}><input type="checkbox" checked={rubric[i]} onChange={() => setRubric((p) => p.map((v, j) => j === i ? !v : v))} /> {l}</label>)}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className={`text-sm font-bold px-3 py-2 rounded-lg border ${scaled >= 310 ? "bg-green-600 text-white border-green-600" : "bg-slate-100 border-slate-200"}`}>{t.estimate}: {scaled}/450 {scaled >= 310 ? `• ${t.pass7}` : `• ${t.below310}`}</span>
            <button onClick={() => { setState((p) => ({ ...p, speakingAttempts: [...(p.speakingAttempts || []), { section, prompt, scaled, date: new Date().toISOString() }], bestBands: { ...p.bestBands, speaking: Math.max(p.bestBands?.speaking || 0, scaled >= 310 ? 7 : 6) } })); addXP(setState, 20); }} className="bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg">{t.save} (+20 XP)</button>
          </div>
          <div className="mt-3 text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700"><b>Must-use / À placer :</b> « Pourriez-vous me préciser… ? » • « À mon avis… » • « C'est pourquoi je vous propose… » <button onClick={() => speakFrench("Pourriez-vous me préciser les horaires ? À mon avis, c'est essentiel. C'est pourquoi je vous propose cette solution.")} className="ml-2 underline font-bold text-blue-700">Play</button></div>
          {section === "A" && <div className="mt-2 text-xs bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-slate-700">Exam rule: YOU interview the examiner with <b>10 formal questions</b> about the ad. The examiner only answers. / C'est VOUS qui posez <b>10 questions formelles</b>.</div>}
          {section === "B" && <div className="mt-2 text-xs bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-slate-700"><b>Flyer pitch / Présentation du prospectus :</b> read the flyer above, then pitch it to the examiner — who plays your <b>skeptical friend</b>. Persuade them to join you with 2–3 arguments + answers to their doubts.</div>}
        </div>
        <div className="space-y-3">
          <div className="pro-card p-4"><div className="font-extrabold text-[13px] text-slate-900">Target / Seuil</div><div className="text-xs text-slate-600 mt-1">Speaking 310/450<br />A: 10 formal questions<br />B: pitch flyer to skeptical friend</div></div>
          <div className="pro-card p-4"><div className="font-extrabold text-[13px] text-slate-900">Plan B</div><div className="text-xs text-slate-600 mt-1">Opinion → 2 args + examples → objection → rebuttal → call to action.</div></div>
        </div>
      </div>
    </div>
  );
}

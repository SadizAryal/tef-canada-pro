import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award, Play } from "lucide-react";
import { addXP, SectionHead, useLang, useTimer } from "../components/chrome";
import { listeningItems, readingItems } from "../data";
import { pctToBand, speakFrench } from "../utils";

function OrderedRun({ kind, items, onDone }) {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [played, setPlayed] = useState({});
  const tm = useTimer();
  const [started, setStarted] = useState(false);
  const cur = items[step];
  const sameAudioAsPrev = step > 0 && items[step - 1].audio && items[step - 1].audio === cur.audio;

  if (!started) {
    return (
      <div className="pro-card p-6 max-w-xl mx-auto text-center">
        <h3 className="font-black text-lg text-slate-900">{kind === "L" ? "Listening — 40 Q in exam order (Q1→40)" : "Reading — 40 Q in exam order (Q1→40)"}</h3>
        <p className="text-[13px] text-slate-500 mt-1">{kind === "L" ? "One play per audio (interviews + report: no replay). Auto-advance, no going back — like the real test." : "Read, answer, no going back — like the real test."}</p>
        <button onClick={() => { setStarted(true); tm.setSec(0); tm.setRun(true); }} className="mt-3 bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm">{t.start}</button>
      </div>
    );
  }
  if (!cur) {
    let ok = 0;
    items.forEach((it) => { if (it.type === "fib" ? answers[it.n] === "ok" : answers[it.n] === it.answer) ok++; });
    const pct = Math.round((ok / items.length) * 100);
    return (
      <div className="pro-card p-6 max-w-xl mx-auto text-center">
        <div className="text-3xl font-black text-slate-900">{ok}/{items.length}</div>
        <div className="font-bold text-blue-700">{pct}% → {pctToBand(pct).label}</div>
        <button onClick={() => onDone(ok, pct)} className="mt-3 bg-slate-900 text-white font-bold px-6 py-2 rounded-lg text-sm">Continue →</button>
      </div>
    );
  }
  const answer = (val) => {
    setAnswers((a) => ({ ...a, [cur.n]: val }));
    setStep((s) => s + 1);
  };
  return (
    <div className="max-w-2xl mx-auto pro-card p-5">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <span className="font-mono bg-slate-900 text-white px-2.5 py-1 rounded-lg">{tm.fmt}</span>
        <span>Q{cur.n}/40 • {kind === "R" ? (cur.n <= 7 ? "Section A" : cur.n <= 17 ? "Section B" : "Section C — deep reading") : `Section ${cur.section}`}</span>
        <div className="ml-auto h-2 w-32 bg-slate-100 rounded-full"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${((step + 1) / items.length) * 100}%` }} /></div>
      </div>
      {kind === "L" ? (
        sameAudioAsPrev
          ? <div className="mt-3 text-xs font-bold bg-amber-50 border border-amber-300 rounded-lg px-3 py-2">Same audio as previous — no replay (exam rule). / Même audio — pas de réécoute.</div>
          : <button onClick={() => { if (!played[cur.n]) { speakFrench(cur.audio); setPlayed((p) => ({ ...p, [cur.n]: true })); } }} disabled={!!played[cur.n]} className="mt-3 bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg inline-flex gap-1.5 items-center disabled:opacity-40"><Play size={14} /> {played[cur.n] ? "Played ✓" : t.play + " (1×)"}</button>
      ) : (
        <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-800">{cur.text || (cur.docs || []).join(" ")}</div>
      )}
      <h3 className="font-bold mt-3 text-slate-900">Q{cur.n}. {cur.q}</h3>
      <div className="grid gap-1.5 mt-2">
        {cur.choices.map((c, i) => (
          <button key={i} onClick={() => answer(i)} className="text-left text-sm px-4 py-2.5 rounded-lg border bg-slate-50 border-slate-200 hover:border-blue-500 font-semibold text-slate-900">{c}</button>
        ))}
      </div>
    </div>
  );
}

export default function MockPage({ state, setState }) {
  const { t } = useLang();
  const nav = useNavigate();
  const [stage, setStage] = useState("menu");
  const [lRes, setLRes] = useState(null);

  if (stage === "listen") {
    return (
      <div>
        <SectionHead title="Full mock — Stage 1/2: Listening Q1–40" sub="In exact exam order" />
        <OrderedRun kind="L" items={listeningItems} onDone={(ok, pct) => { setLRes({ ok, pct, band: pctToBand(pct).band }); setStage("read"); }} />
      </div>
    );
  }
  if (stage === "read") {
    return (
      <div>
        <SectionHead title="Full mock — Stage 2/2: Reading Q1–40" sub="In exact exam order" />
        <OrderedRun kind="R" items={readingItems.filter((x) => x.type !== "fib")} onDone={(ok, pct) => {
          const rb = pctToBand(pct).band;
          const entry = { date: new Date().toISOString(), lc: lRes.ok, rc: ok, lpct: lRes.pct, rpct: pct, lb: lRes.band, rb };
          setState((p) => ({ ...p, mockHistory: [...(p.mockHistory || []), entry], bestBands: { ...p.bestBands, listening: Math.max(p.bestBands?.listening || 0, lRes.band), reading: Math.max(p.bestBands?.reading || 0, rb) } }));
          addXP(setState, 50);
          setStage("done");
        }} />
      </div>
    );
  }
  if (stage === "done") {
    const last = state.mockHistory[state.mockHistory.length - 1];
    if (!last) return null;
    return (
      <div className="pro-card p-6 max-w-2xl mx-auto text-center">
        <Award size={36} className="mx-auto text-amber-500" />
        <h2 className="text-2xl font-black mt-2 text-slate-900">{t.clbReport}</h2>
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          <div className={`rounded-lg p-4 border ${last.lb >= 7 ? "bg-green-50 border-green-400" : "bg-red-50 border-red-300"}`}><div className="font-bold">Listening Q1–40</div><div className="text-2xl font-black">{last.lc}/40</div><div>{last.lpct}% → CLB {last.lb}</div></div>
          <div className={`rounded-lg p-4 border ${last.rb >= 7 ? "bg-green-50 border-green-400" : "bg-red-50 border-red-300"}`}><div className="font-bold">Reading Q1–40</div><div className="text-2xl font-black">{last.rc}/30</div><div>{last.rpct}% → CLB {last.rb}</div></div>
        </div>
        <p className="text-xs text-slate-500 mt-3">{t.thresholds}. Now validate Writing + Speaking (310 each) with one timed task each:</p>
        <div className="flex gap-2 justify-center mt-3">
          <button onClick={() => nav("/writing")} className="border border-slate-300 font-bold px-4 py-2 rounded-lg text-sm">Writing →</button>
          <button onClick={() => nav("/speaking")} className="border border-slate-300 font-bold px-4 py-2 rounded-lg text-sm">Speaking →</button>
          <button onClick={() => setStage("menu")} className="bg-slate-900 text-white font-bold px-4 py-2 rounded-lg text-sm">{t.retry}</button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <SectionHead title={t.mock} sub="Full TEF order: Listening Q1–40 → Reading Q1–40 → report" />
      <div className="grid md:grid-cols-2 gap-3">
        <div className="pro-card p-5 border-t-4 border-t-blue-700">
          <div className="font-extrabold text-slate-900">Full mock — Listening 40 + Reading 40</div>
          <p className="text-[13px] text-slate-500 mt-1">Exact section order A→G, one play per audio, no going back. Then do Writing + Speaking tasks to complete all 4 skills.</p>
          <button onClick={() => setStage("listen")} className="mt-3 bg-blue-700 text-white font-bold px-5 py-2 rounded-lg text-sm">{t.start}</button>
        </div>
        <div className="pro-card p-5">
          <div className="font-extrabold text-slate-900">Complete all 4 skills</div>
          <p className="text-[13px] text-slate-500 mt-1">After the mock: one timed Writing B (200+ words) + one recorded Speaking B.</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => nav("/writing")} className="border border-slate-300 font-bold px-4 py-2 rounded-lg text-sm">Writing →</button>
            <button onClick={() => nav("/speaking")} className="border border-slate-300 font-bold px-4 py-2 rounded-lg text-sm">Speaking →</button>
          </div>
        </div>
      </div>
      {state.mockHistory?.length > 0 && (
        <div className="pro-card p-5 text-sm">
          <div className="font-bold mb-1 text-slate-900">{t.history}:</div>
          {state.mockHistory.slice(-6).reverse().map((m, i) => <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 mb-1 text-slate-700">Listening {m.lc} ({m.lpct}%) → CLB {m.lb} • Reading {m.rc} → CLB {m.rb}</div>)}
        </div>
      )}
    </div>
  );
}

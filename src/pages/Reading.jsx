import { useState } from "react";
import { EnToggle, SectionHead, SideCard, Steps, useLang, addXP } from "../components/chrome";
import { readingItems, readingSections } from "../data";

export default function ReadingPage({ state, setState }) {
  const { t } = useLang();
  const [showEn, setShowEn] = useState(true);
  const [sel, setSel] = useState(1);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [fibs, setFibs] = useState({});
  const item = readingItems.find((x) => x.n === sel);
  const docMates = readingItems.filter((x) => item.doc && x.doc === item.doc);

  const checkMcq = (it, i) => {
    setAnswers((a) => ({ ...a, [it.n]: i }));
    setRevealed((r) => ({ ...r, [it.n]: true }));
    const ok = i === it.answer;
    setState((p) => ({ ...p, readingDone: { ...p.readingDone, ["q" + it.n]: ok } }));
    if (ok) addXP(setState, 10);
  };
  const checkFib = (it) => {
    const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const v = fibs[it.n] || ["", ""];
    const ok = norm(v[0]) === norm(it.fib[0]) && norm(v[1]) === norm(it.fib[1]);
    setRevealed((r) => ({ ...r, [it.n]: true }));
    setAnswers((a) => ({ ...a, [it.n]: ok ? "ok" : "ko" }));
    setState((p) => ({ ...p, readingDone: { ...p.readingDone, ["q" + it.n]: ok } }));
    if (ok) addXP(setState, 15);
  };
  const pick = (n) => { setSel(n); };
  const done = state.readingDone || {};
  const keys = Object.keys(done).filter((k) => k.startsWith("q"));
  const correct = keys.filter((k) => done[k]).length;
  const secMeta = (id) => readingSections.find((s) => s.id === id);
  const groupOf = (n) => (n <= 7 ? "A" : n <= 17 ? "B" : "C");

  const renderQ = (it) => (
    <div key={it.n} className="mt-4 border-t border-slate-100 pt-3">
      <h3 className="text-[15px] font-bold text-slate-900">Q{it.n}. {it.q}</h3>
      {showEn && <div className="text-[13px] text-slate-500">{it.qEn}</div>}
      {it.type === "fib" ? (
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <input value={(fibs[it.n] || ["", ""])[0]} onChange={(e) => setFibs((f) => ({ ...f, [it.n]: [e.target.value, (f[it.n] || ["", ""])[1]] }))} placeholder="word 1" className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-32" />
          <span className="text-slate-400">/</span>
          <input value={(fibs[it.n] || ["", ""])[1]} onChange={(e) => setFibs((f) => ({ ...f, [it.n]: [(f[it.n] || ["", ""])[0], e.target.value] }))} placeholder="word 2" className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-32" />
          <button onClick={() => checkFib(it)} className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg text-sm">{t.check}</button>
          {revealed[it.n] && <span className={`text-sm font-bold ${answers[it.n] === "ok" ? "text-green-600" : "text-red-600"}`}>{answers[it.n] === "ok" ? "✓ Correct" : `${t.answer}: ${it.fib[0]} / ${it.fib[1]}`}</span>}
        </div>
      ) : (
        <div className="grid gap-1.5 mt-2">
          {it.choices.map((c, i) => {
            const rev = revealed[it.n];
            const isAns = rev && i === it.answer;
            const isWrong = rev && answers[it.n] === i && i !== it.answer;
            return (
              <button key={i} disabled={rev} onClick={() => checkMcq(it, i)}
                className={`text-left px-3.5 py-2 rounded-lg border text-sm font-semibold ${isAns ? "bg-green-50 border-green-500" : isWrong ? "bg-red-50 border-red-400" : "bg-slate-50 border-slate-200 hover:border-blue-500"}`}>
                <div className="text-slate-900">{c} {isAns && "✓"}</div>
                {showEn && it.choicesEn && <div className="text-xs text-slate-500 font-normal">{it.choicesEn[i]}</div>}
              </button>
            );
          })}
        </div>
      )}
      {revealed[it.n] && <div className="mt-2 text-[13px] bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-slate-700"><b>{t.strategy} (EN):</b> {it.explain}<div className="text-slate-500 mt-1"><b>Stratégie (FR) :</b> {it.explainFr}</div></div>}
    </div>
  );

  return (
    <div>
      <SectionHead title={`${t.reading} — 40 Q / 60 min (Q1–40 in order)`} sub={`${t.readNote} • ${correct}/${keys.length} correct`}
        right={<EnToggle showEn={showEn} setShowEn={setShowEn} />} />
      <Steps steps={[["1", "Read the question first"], ["2", "Find it in the text — don't overthink"], ["3", "Q18–40 get longer and harder"]]} />
      <div className="grid lg:grid-cols-[280px_1fr_260px] gap-3">
        <SideCard title={`${t.queTypes} • Reading`}>
          <div className="space-y-2 max-h-[600px] overflow-auto">
            {readingSections.map((s) => (
              <div key={s.id}>
                <div className="text-[11px] font-black text-emerald-700 uppercase px-1">{s.id} • {s.range} — {s.en}</div>
                <div className="flex flex-wrap gap-1">
                  {readingItems.filter((x) => groupOf(x.n) === s.id).map((r) => (
                    <button key={r.n} onClick={() => pick(r.n)}
                      className={`px-2 py-1 rounded-lg text-xs font-bold border ${sel === r.n ? "bg-emerald-600 text-white border-emerald-600" : "bg-slate-50 border-slate-200 hover:border-emerald-500"}`}>
                      {r.n}{done["q" + r.n] ? "✓" : ""}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SideCard>

        <div className="pro-card p-5">
          <div className="text-xs font-bold text-emerald-700 uppercase">{secMeta(groupOf(item.n)).range} • {secMeta(groupOf(item.n)).en} / {secMeta(groupOf(item.n)).fr} • {item.title} / {item.titleFr}</div>
          {(item.type === "match" || item.type === "series") ? (
            <div className="grid sm:grid-cols-2 gap-1.5 mt-2">
              {item.docs.map((d, i) => <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[13px] text-slate-800">{d}{showEn && <div className="text-xs text-slate-500">{item.docsEn[i]}</div>}</div>)}
            </div>
          ) : (
            <>
              <div className="mt-2 bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-[14px] leading-relaxed text-slate-800">{item.text}</div>
              {showEn && <div className="mt-1.5 text-[13px] text-slate-500 bg-blue-50/60 border border-blue-100 rounded-lg p-2.5"><b>EN:</b> {item.textEn}</div>}
            </>
          )}
          {(item.doc ? docMates : [item]).map(renderQ)}
        </div>

        <div className="space-y-3">
          <div className="pro-card p-4">
            <div className="font-extrabold text-[13px] text-slate-900">Target / Seuil</div>
            <div className="text-xs text-slate-600 mt-1">Reading 207/300<br />≈ 60%+ for CLB 7 (estimate)</div>
          </div>
          <div className="pro-card p-4">
            <div className="font-extrabold text-[13px] text-slate-900">Tips</div>
            <ul className="text-xs text-slate-600 mt-1 space-y-1">
              <li>• Read the question BEFORE the text.</li>
              <li>• A: match the person's need, not a word.</li>
              <li>• B: en + gerund, au moins, par jour.</li>
              <li>• F: last sentence often = thesis.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

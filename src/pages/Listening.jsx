import { useState } from "react";
import { Play, Square, Volume2 } from "lucide-react";
import { addXP, EnToggle, SectionHead, SideCard, Steps, useLang, VoiceBar } from "../components/chrome";
import { listeningItems, listeningSections } from "../data";
import { pctToBand, speakFrench, stopSpeak } from "../utils";

// group consecutive items sharing the same `group` audio (interviews x2, report x3)
function buildGroups() {
  const groups = [];
  let cur = null;
  for (const it of listeningItems) {
    if (it.group && cur && cur.key === it.group) { cur.items.push(it); continue; }
    cur = it.group ? { key: it.group, items: [it] } : { key: "q" + it.n, items: [it] };
    groups.push(cur);
  }
  return groups;
}
const GROUPS = buildGroups();

export default function ListeningPage({ state, setState }) {
  const { t } = useLang();
  const [showEn, setShowEn] = useState(true);
  const [sel, setSel] = useState(1);
  const [examMode, setExamMode] = useState(true);
  const [plays, setPlays] = useState({});
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const group = GROUPS.find((g) => g.items.some((i) => i.n === sel)) || GROUPS[0];
  const maxPlays = examMode ? 1 : 3;
  const used = plays[group.key] || 0;
  const left = maxPlays - used;

  const play = () => {
    if (left <= 0) return;
    speakFrench(group.items[0].audio);
    setPlays((p) => ({ ...p, [group.key]: (p[group.key] || 0) + 1 }));
  };
  const playSlow = () => {
    if (left <= 0) return;
    speakFrench(group.items[0].audio, { rate: 0.65 });
    setPlays((p) => ({ ...p, [group.key]: (p[group.key] || 0) + 1 }));
  };
  const check = (item, i) => {
    setAnswers((a) => ({ ...a, [item.n]: i }));
    setRevealed((r) => ({ ...r, [item.n]: true }));
    const ok = i === item.answer;
    setState((p) => ({ ...p, listeningDone: { ...p.listeningDone, ["q" + item.n]: ok } }));
    if (ok) addXP(setState, 10);
  };
  const pick = (n) => { setSel(n); stopSpeak(); };
  const done = state.listeningDone || {};
  const keys = Object.keys(done).filter((k) => k.startsWith("q"));
  const correct = keys.filter((k) => done[k]).length;
  const secOf = (n) => listeningItems.find((x) => x.n === n).section;
  const secMeta = (id) => listeningSections.find((s) => s.id === id);

  return (
    <div>
      <SectionHead title={`${t.listening} — 40 Q / 40 min (Q1–40 in order)`} sub={`${t.listenNote} • ${correct}/${keys.length} correct`}
        right={<><EnToggle showEn={showEn} setShowEn={setShowEn} />
          <label className="text-xs flex items-center gap-1 font-bold text-slate-600 bg-white border border-slate-300 rounded-lg px-2.5 py-1"><input type="checkbox" checked={examMode} onChange={(e) => setExamMode(e.target.checked)} /> {examMode ? t.examMode : t.practiceMode}</label></>} />
      <Steps steps={[["1", "Press Play once and listen (exam rule)"], ["2", "Pick your answer — no going back"], ["3", "Then check the translation below"]]} />
      <div className="mb-3"><VoiceBar /></div>
      <div className="mb-3 text-xs text-slate-500">Robot voice not clear enough? Real human audio lessons are on the <b>Learn</b> page.</div>
      <div className="grid lg:grid-cols-[280px_1fr_260px] gap-3">
        <SideCard title={`${t.queTypes} • Listening`}>
          <div className="space-y-2 max-h-[600px] overflow-auto">
            {listeningSections.map((s) => (
              <div key={s.id}>
                <div className="text-[11px] font-black text-blue-700 uppercase px-1">{s.id} • {s.range} — {s.en}</div>
                <div className="space-y-1">
                  {listeningItems.filter((x) => x.section === s.id).map((l) => (
                    <button key={l.n} onClick={() => pick(l.n)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[13px] border ${sel === l.n ? "bg-blue-700 text-white border-blue-700" : "bg-slate-50 border-slate-200 hover:border-blue-400"}`}>
                      <span className="font-bold">Q{l.n}</span> <span className="opacity-80">{l.topic}</span>
                      {l.choices.length === 3 && <span className="ml-1 text-[10px] font-bold">• 3 choices</span>}
                      {done["q" + l.n] && <span className="ml-1 text-[11px] font-bold text-green-600">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SideCard>

        <div className="pro-card p-5">
          <div className="text-xs font-bold text-sky-700 uppercase">
            {secMeta(secOf(group.items[0].n)).range} • {secMeta(secOf(group.items[0].n)).en} / {secMeta(secOf(group.items[0].n)).fr}
            {group.items.length > 1 && <span className="ml-2 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">1 audio → {group.items.length} questions (exam rule)</span>}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <button disabled={left <= 0} onClick={play} className="inline-flex items-center gap-1.5 bg-slate-900 text-white font-bold px-5 py-2.5 rounded-lg text-[15px] disabled:opacity-40"><Play size={16} /> {t.play} ({left} left)</button>
            {!examMode && <button disabled={left <= 0} onClick={playSlow} className="inline-flex items-center gap-1.5 bg-white border border-slate-300 font-bold px-4 py-2 rounded-lg text-sm disabled:opacity-40"><Volume2 size={15} /> {t.slow}</button>}
            <button onClick={stopSpeak} className="inline-flex items-center gap-1.5 bg-white border border-slate-300 px-3 py-2 rounded-lg text-sm"><Square size={14} /> {t.stop}</button>
          </div>
          {group.items.map((item) => (
            <div key={item.n} className="mt-4 border-t border-slate-100 pt-3">
              <h3 className="text-[15px] font-bold text-slate-900">Q{item.n}. {item.q}</h3>
              {showEn && <div className="text-[13px] text-slate-500">{item.qEn}</div>}
              <div className="grid gap-1.5 mt-2">
                {item.choices.map((c, i) => {
                  const rev = revealed[item.n];
                  const isAns = rev && i === item.answer;
                  const isWrong = rev && answers[item.n] === i && i !== item.answer;
                  return (
                    <button key={i} disabled={rev} onClick={() => check(item, i)}
                      className={`text-left px-3.5 py-2 rounded-lg border text-sm font-semibold ${isAns ? "bg-green-50 border-green-500" : isWrong ? "bg-red-50 border-red-400" : "bg-slate-50 border-slate-200 hover:border-blue-500"}`}>
                      <div className="text-slate-900">{c} {isAns && "✓"}</div>
                      {showEn && <div className="text-xs text-slate-500 font-normal">{item.choicesEn[i]}</div>}
                    </button>
                  );
                })}
              </div>
              {revealed[item.n] && (
                <div className="mt-2 text-[13px] bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 space-y-1">
                  <div><b>{t.transcript}:</b> <i>"{item.audio}"</i></div>
                  {showEn && <div><b>{t.translation}:</b> <i>"{item.audioEn}"</i></div>}
                  <div><b>{t.explanation} (EN):</b> {item.explain}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="pro-card p-4">
            <div className="font-extrabold text-[13px] text-slate-900">Target / Seuil</div>
            <div className="text-xs text-slate-600 mt-1">Listening 249/360<br />≈ 60%+ for CLB 7 (estimate)</div>
            <div className="text-xs mt-2 font-bold text-blue-700">Your estimate: {pctToBand(keys.length ? Math.round((correct / keys.length) * 100) : 0).label}</div>
          </div>
          <div className="pro-card p-4">
            <div className="font-extrabold text-[13px] text-slate-900">Tips</div>
            <ul className="text-xs text-slate-600 mt-1 space-y-1">
              <li>• A: key nouns decide the picture.</li>
              <li>• C: tone + greeting reveals the caller.</li>
              <li>• D has only 3 choices.</li>
              <li>• F/G: one audio, several questions.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

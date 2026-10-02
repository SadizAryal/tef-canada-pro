import { Link } from "react-router-dom";
import { BookOpen, Ear, Eye, Mic, PenLine, Timer } from "lucide-react";
import { SectionHead } from "../components/chrome";

const SECTIONS = [
  { icon: Eye, title: "1. Reading — 60 min, 40 MCQs, free navigation",
    body: ["You can move forward AND backward between questions during the hour.", "Q1–7: short documents (ads, notices, graphs). Find the main intent — match the person's need, not a single word.", "Q8–17: fill-in-the-blank vocab + grammar inside sentences and short paragraphs (en + gerund, au moins, bénéficier de…).", "Q18–40: deep reading. Long paragraphs that get harder as you go — spot summaries and hidden arguments. The last sentence is often the thesis."],
    train: "Train on the Reading page (Q1–40 sidebar) then validate with a Mock." },
  { icon: Ear, title: "2. Listening — 40 min, 40 MCQs, plays once, no going back",
    body: ["The audio plays ONLY once and the test auto-advances. You cannot pause or return.", "Flow: picture-matching dialogues → public announcements → phone voicemails (who called + why) → micro-trottoirs (speaker's opinion, 3 choices) → chronicles/interviews → long journalistic report.", "Exam-mode toggle = 1 play (real rule). Practice mode = 3 plays + slow version.", "First listen decides: note numbers, names and the speaker's tone before choosing."],
    train: "Train per section on the Listening page, then run the full Q1–40 mock." },
  { icon: PenLine, title: "3. Writing — 60 min, 2 typed tasks, split screen + word counter",
    body: ["Section A (25 min, 80+ words): you get the beginning of a news snippet (un fait divers). Write the continuation — what happened next. Use EVERY fact given.", "Section B (35 min, 200+ words): you get an argumentative prompt. Write a FORMAL LETTER to a newspaper editor defending your stance with structured arguments.", "Use the accent keyboard (é è ê à ç…) under the editor — the real test has a French keyboard layout.", "Letter frame: Monsieur le Rédacteur → I read your editorial… → Firstly… Moreover… → However… Although… → thank you → salutations distinguées."],
    train: "Write timed on the Writing page, tick the self-check list, aim for estimate 310+." },
  { icon: Mic, title: "4. Speaking — 15 min, 2 face-to-face role-plays, recorded",
    body: ["Section A (5 min): you get a casual ad (travel offer, job post, rental). YOU interview the examiner with 10 formal questions to gather information. They only answer.", "Section B (10 min): you read a flyer about an activity (cooking class, sports club). Pitch it to the examiner, who plays your skeptical friend — persuade them to join you.", "Record yourself on the Speaking page, play it back, then self-score fluency / vocab / grammar / pronunciation.", "Memorize the 20 Section-A questions + connectors in Study → Templates."],
    train: "2 recorded role-plays per session. Save attempts to track your 310 estimate." },
];

export default function GuidePage() {
  return (
    <div className="space-y-3 max-w-4xl">
      <SectionHead title="How to use this portal (English guide)" sub="Read this first — 5 minutes that save 50 hours" />
      <div className="pro-card p-5">
        <div className="font-extrabold text-slate-900 flex items-center gap-2"><BookOpen size={16} /> The goal</div>
        <p className="text-sm text-slate-700 mt-1">TEF Canada for Express Entry needs <b>NCLC 7 in ALL four skills</b> — no averaging. Targets on the /699 scale: <b>Reading 434–461 • Listening 434–461 • Writing 428–471 • Speaking 456–493</b> (ancien scores: 207 / 249 / 310 / 310). This portal mirrors the real exam order Q1–40. Interface is English; exam material is French with English translations.</p>
        <div className="flex flex-wrap gap-2 mt-3 text-sm font-bold">
          <Link to="/listening" className="bg-slate-900 text-white px-4 py-2 rounded-lg">Start Listening</Link>
          <Link to="/mock" className="border border-slate-300 px-4 py-2 rounded-lg inline-flex items-center gap-1"><Timer size={14} /> Full mock</Link>
        </div>
      </div>
      {SECTIONS.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.title} className="pro-card p-5">
            <div className="font-extrabold text-slate-900 flex items-center gap-2"><Icon size={16} /> {s.title}</div>
            <ul className="text-sm text-slate-700 mt-2 space-y-1">{s.body.map((b) => <li key={b}>• {b}</li>)}</ul>
            <div className="text-xs mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2 text-slate-700"><b>How to train here:</b> {s.train}</div>
          </div>
        );
      })}
      <div className="pro-card p-5">
        <div className="font-extrabold text-slate-900">Weekly routine that works</div>
        <ol className="text-sm text-slate-700 mt-1 space-y-1 list-decimal ml-5">
          <li>Read this guide + open Templates (memorize 20 questions + letter frame).</li>
          <li>Mon–Sat: one skill per day, 30–60 min (see Home → 7-day plan).</li>
          <li>Sunday: full mock Listening Q1–40 + Reading Q1–40 in order.</li>
          <li>Save every Writing/Speaking attempt — watch the 310 estimates turn green.</li>
        </ol>
      </div>
    </div>
  );
}

import { PlayCircle, ListVideo } from "lucide-react";
import { SectionHead, useLang } from "../components/chrome";

const thumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const VIDEOS = [
  { id: "qjNPFbOGbaQ", skill: "Start here", skillFr: "Commence ici", title: "TEF Canada first-attempt experience: do's & don'ts", titleFr: "Retour d'expérience : à faire et à éviter", channel: "Frenchify", mins: "47 min", why: "A student explains what each module really feels like — watch before anything else.", whyFr: "Un étudiant raconte chaque épreuve — à voir avant tout." },
  { id: "1-nxf68ucVw", skill: "Listening", skillFr: "Écoute", title: "Full listening exam, new 2026 format (40 min)", titleFr: "Examen d'écoute complet, nouveau format 2026", channel: "TEF Canada Mastery", mins: "40 min", why: "Real human audio, full Q1–40 run. Best replacement for our robot voice.", whyFr: "Vraies voix humaines, examen complet. Mieux que notre voix robot." },
  { id: "lHUt3XC6br0", skill: "Listening", skillFr: "Écoute", title: "Listening practice test A1 to C2", titleFr: "Test d'écoute d'entraînement A1 à C2", channel: "Ross French Academy", mins: "14 min", why: "Short practice with answer key at the end.", whyFr: "Pratique courte avec corrigé à la fin." },
  { id: "NTEmkHW9sLY", skill: "Reading", skillFr: "Lecture", title: "Reading comprehension mock test", titleFr: "Examen blanc de compréhension écrite", channel: "L'Atelier du TEF", mins: "13 min", why: "Everyday texts, notices and articles like the real Q1–40.", whyFr: "Textes quotidiens et articles comme au vrai examen." },
  { id: "I-DFB00-zC8", skill: "Writing", skillFr: "Écrit", title: "Writing complete guide: both tasks + samples (CLB 7+)", titleFr: "Guide complet : les 2 tâches + exemples (NCLC 7+)", channel: "French tweets", mins: "20 min", why: "Fait divers + formal letter structure, grading criteria, common mistakes.", whyFr: "Fait divers + lettre formelle, critères, erreurs fréquentes." },
  { id: "dTUyiV2-C0g", skill: "Speaking + tips", skillFr: "Oral + astuces", title: "Insider tips: exam centres, Section A & B prep", titleFr: "Astuces : centres d'examen, sections A et B", channel: "Learn French with Anks", mins: "30 min", why: "Speaking prep focus + what really matters on exam day.", whyFr: "Préparation de l'oral + ce qui compte le jour J." },
];

const PLAYLISTS = [
  { url: "https://www.youtube.com/playlist?list=PLdcRfRayZ_rlc_BRcIgXyRNshAY2lGb2U", title: "Speaking A model answers", titleFr: "Modèles de réponses — Oral A", channel: "Learn French with Anks" },
  { url: "https://www.youtube.com/playlist?list=PLdcRfRayZ_rllXNBgdmck-w3V8D_cDBqg", title: "Fait divers (Writing A) lessons", titleFr: "Leçons fait divers (Écrit A)", channel: "Learn French with Anks" },
  { url: "https://www.youtube.com/playlist?list=PLdcRfRayZ_rnjxjo8X1Bsji3Tjj4KitZw", title: "Writing B model answers", titleFr: "Modèles — Écrit B", channel: "Learn French with Anks" },
];

export default function LearnPage() {
  const { lang } = useLang();
  const fr = lang === "fr";
  return (
    <div>
      <SectionHead title={fr ? "Apprendre avec de vrais profs" : "Learn from real teachers"}
        sub={fr ? "Vidéos YouTube vérifiées : d'abord regarder, ensuite pratiquer" : "Verified YouTube lessons: watch first, then practice here"} />
      <div className="mb-3 text-[13px] bg-amber-50 border border-amber-200 rounded-lg p-3 text-slate-700">
        {fr ? "Notre voix audio est un robot (pratique). Ces vidéos sont de vraies voix humaines — utilisez-les pour l'oreille, notre portail pour les QCM." : "Our audio player is a robot (for drills). These videos are real human voices — use them for your ear, our portal for the drills."}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {VIDEOS.map((v) => (
          <a key={v.id} href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" className="pro-card overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img src={thumb(v.id)} alt="" loading="lazy" className="w-full aspect-video object-cover" />
              <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">{v.mins}</span>
              <span className="absolute top-2 left-2 bg-slate-900/85 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><PlayCircle size={12} /> {fr ? v.skillFr : v.skill}</span>
            </div>
            <div className="p-3.5">
              <div className="font-bold text-sm text-slate-900 leading-snug">{fr ? v.titleFr : v.title}</div>
              <div className="text-xs text-slate-500 mt-1">{v.channel}</div>
              <div className="text-[13px] text-slate-600 mt-1.5">{fr ? v.whyFr : v.why}</div>
            </div>
          </a>
        ))}
      </div>
      <div className="font-extrabold text-slate-900 mt-5 mb-2 flex items-center gap-2"><ListVideo size={16} /> {fr ? "Séries à suivre (playlists)" : "Follow-along series (playlists)"}</div>
      <div className="grid sm:grid-cols-3 gap-3">
        {PLAYLISTS.map((p) => (
          <a key={p.url} href={p.url} target="_blank" rel="noreferrer" className="pro-card p-4 hover:shadow-lg transition-shadow">
            <div className="font-bold text-sm text-slate-900">{fr ? p.titleFr : p.title}</div>
            <div className="text-xs text-slate-500 mt-1">{p.channel} • YouTube playlist</div>
            <div className="text-xs font-bold text-blue-700 mt-2">Open playlist →</div>
          </a>
        ))}
      </div>
    </div>
  );
}

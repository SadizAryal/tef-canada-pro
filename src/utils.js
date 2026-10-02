// Shared helpers: TTS, storage, CLB mapping

export function listFrenchVoices() {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return [];
    return synth.getVoices().filter((v) => v.lang?.toLowerCase().startsWith("fr"));
  } catch { return []; }
}

// Prefer the most human-sounding French voice on this device:
// Google français > Microsoft natural (Denise/Henri) > any other FR voice.
export function pickBestFrenchVoice() {
  const voices = listFrenchVoices();
  if (!voices.length) return null;
  const byName = (re) => voices.find((v) => re.test(v.name));
  return (
    byName(/google.*français/i) ||
    byName(/denise/i) || byName(/henri/i) ||
    byName(/natural/i) ||
    byName(/canada/i) ||
    voices.find((v) => v.localService === false) ||
    voices[0]
  );
}

export function getVoicePrefs() {
  try {
    return {
      voiceURI: localStorage.getItem("tef-voice") || "",
      rate: parseFloat(localStorage.getItem("tef-rate") || "0.92"),
    };
  } catch { return { voiceURI: "", rate: 0.92 }; }
}

export function speakFrench(text, rateOrOpts = 0.92) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const opts = typeof rateOrOpts === "object" ? rateOrOpts : { rate: rateOrOpts };
    const prefs = getVoicePrefs();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR";
    u.rate = opts.rate ?? prefs.rate ?? 0.92;
    u.pitch = opts.pitch ?? 1;
    const voices = synth.getVoices();
    const saved = voices.find((v) => v.voiceURI === (opts.voiceURI || prefs.voiceURI));
    if (saved) u.voice = saved;
    else {
      const best = pickBestFrenchVoice();
      if (best) u.voice = best;
    }
    synth.speak(u);
  } catch {}
}

export function stopSpeak() {
  try { window.speechSynthesis?.cancel(); } catch {}
}

// Raw % -> estimated NCLC band for listening/reading practice
export function pctToBand(pct) {
  if (pct >= 85) return { band: 9, label: "NCLC 9 (est.)", pass7: true };
  if (pct >= 75) return { band: 8, label: "NCLC 8 (est.)", pass7: true };
  if (pct >= 60) return { band: 7, label: "NCLC 7 (est.) ✓", pass7: true };
  if (pct >= 45) return { band: 6, label: "NCLC 6 (est.)", pass7: false };
  return { band: 5, label: "NCLC ≤5 (est.)", pass7: false };
}

// Rubric 0-100 -> scaled 200-450 estimate for writing/speaking
export function rubricToScaled(score100) {
  return Math.round(200 + (score100 / 100) * 250);
}

export const THRESHOLDS = {
  listening: 249,
  reading: 207,
  writing: 310,
  speaking: 310,
};

const KEY = "tef-portal-v1";

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

export function saveState(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}

function defaultState() {
  return {
    xp: 0,
    streakCount: 0,
    lastDay: null,
    listeningDone: {}, // id -> correct bool
    readingDone: {},
    writingAttempts: [],
    speakingAttempts: [],
    mockHistory: [],
    bestBands: { listening: 0, reading: 0, writing: 0, speaking: 0 },
  };
}

export function touchStreak(state) {
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastDay === today) return state;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streakCount = state.lastDay === yesterday ? (state.streakCount || 0) + 1 : 1;
  return { ...state, lastDay: today, streakCount };
}

export function countWords(text) {
  const t = (text || "").trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

export function fuzzyMatch(a, b) {
  const norm = (s) =>
    (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,!?;:«»"']/g, "").replace(/\s+/g, " ").trim();
  const na = norm(a).split(" ").filter(Boolean);
  const nb = norm(b).split(" ").filter(Boolean);
  if (nb.length === 0) return 0;
  const setA = new Set(na);
  let hit = 0;
  nb.forEach((w) => { if (setA.has(w)) hit++; });
  return Math.round((hit / nb.length) * 100);
}

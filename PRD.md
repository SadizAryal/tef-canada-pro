# TEF Canada NCLC 7 Portal — PRD

## Goal
APEUni-style practice portal for French TEF Canada. Target: NCLC 7 in all 4 skills for Express Entry.
IRCC thresholds (ancien score): Listening 249/360, Reading 207/300, Writing 310/450, Speaking 310/450.

## Users
- Beginner -> B2 learner (his girlfriend), needs guided path to CLB7.
- Solo self-study, browser-only v1.

## Modules (v1)
1. **Dashboard**: CLB estimator (4 bars to threshold), XP/streak (localStorage), daily plan, connecteur du jour, continue cards.
2. **Listening (CO)**: 14 practice Q (MCQ + dictation), TTS fr-FR, exam mode (1 play) vs practice (3 plays), auto-score + estimated NCLC band. Raw->band heuristic labeled Estimated.
3. **Reading (CE)**: 8 passages, MCQ + FIB, optional 60-min timer, auto-score + band.
4. **Writing (EE)**: Sec A (80+ words/25min) + Sec B (200+ words/35min), 12 prompts each, live word count, timer, checklist auto-estimate + sample answers, save attempts.
5. **Speaking (EO)**: Sec A (5min ask) + Sec B (10min convince), 10 prompts each, templates, MediaRecorder + playback, timer, self-rubric -> estimate.
6. **Templates Vault**: Sec A 20 question stems, Sec B plan, Writing skeletons, 60 connecteurs, copy button.
7. **Mock**: Mini-mock (20min, 20Q + 1 writing + 1 speaking) and Full-demo flow, sequential timer, final CLB report pass/fail vs 249/207/310/310.

## Non-goals v1
- No backend, no real AI scoring. Heuristic + self-rubric only, clearly labeled Estimated.
- No account sync. localStorage only.

## Tech
Vite + React + Tailwind v4 + lucide-react. Browser APIs: speechSynthesis (TTS), MediaRecorder (speaking), localStorage.

## Scoring
- Listening/Reading: % correct -> band: >=85% = NCLC9 est, 75-84%=8, 60-74%=7, 45-59%=6, else <6.
- Writing/Speaking: rubric checklist (0-100) -> scaled 200-450 estimate. Pass >=310 shown green.

## Success
Can run `npm run dev`, complete a mock, see CLB report, streak persists.

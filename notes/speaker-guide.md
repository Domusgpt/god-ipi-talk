# Speaker Guide — IPI Talk

## Before the Talk

### Technical Setup (30 min before)
1. Open `presentation/index.html` in Chrome
2. Test fullscreen: press `F`
3. Test presenter notes: press `N`
4. Test all iframe slides (3, 9, 10, 11, 12) — navigate to each and verify the visualizer loads
5. Close all other tabs and apps to free GPU memory
6. Set display resolution to 1920×1080 if possible
7. Join the YouTube stream / Teams meeting
8. Share your **Chrome tab** (not entire screen) — this way your presenter notes bar won't be visible to the audience

### Audio
- Use a decent microphone. Built-in laptop mics pick up fan noise.
- Mute notifications (Do Not Disturb mode).

---

## Slide-by-Slide Timing Guide

**Target: 35 minutes** (leaves 10 min for Q&A in a 45-min slot)

| Slide | Title | Target Time | Cumulative |
|-------|-------|-------------|------------|
| 1  | Title Card | 0:30 | 0:30 |
| 2  | What is E8? | 3:00 | 3:30 |
| 3  | Live E8 (demo) | 3:00 | 6:30 |
| 4  | Stereoscopic Projection | 2:30 | 9:00 |
| 5  | Six Shells | 2:00 | 11:00 |
| 6  | Information Has Weight | 3:00 | 14:00 |
| 7  | Vopson's 2nd Law | 3:00 | 17:00 |
| 8  | The σ-Chain | 2:30 | 19:30 |
| 9  | Rotation Planes (demo) | 2:00 | 21:30 |
| 10 | Klein Quartic (demo) | 2:00 | 23:30 |
| 11 | Tower / Latizurus (demo) | 3:00 | 26:30 |
| 12 | Nested Torus (demo) | 1:30 | 28:00 |
| 13 | 137 Connection | 2:00 | 30:00 |
| 14 | What's Established | 2:00 | 32:00 |
| 15 | Open Questions | 2:00 | 34:00 |
| 16 | Thank You | 1:00 | 35:00 |

### Pacing Tips
- If you're running long, **cut slides 9 and 12** (rotation planes and nested torus) — they're the least essential.
- If you're running short, spend more time on **slide 11** (Latizurus tower) — there's a lot to show.
- **Watch the timer** in the top-right corner. It starts when you leave slide 1.

---

## Demo Instructions per Slide

### Slide 3 — E8 Visualizer
1. Let it auto-rotate for 5 seconds (don't touch)
2. Toggle **SHELLS** on (button in drawer)
3. Point out the 6 concentric rings
4. Toggle **D8** off — "Now you see only the S+ spinor roots"
5. Toggle **D8** back on, toggle **S+** off — "Now only integer roots"
6. Toggle both on — "Together they make 240"

### Slide 9 — Rotation Planes
1. Let the initial view settle
2. Point out the 28 planes
3. Highlight the non-orthogonal pairs count: 168

### Slide 10 — Klein Quartic
1. Start in Poincaré disk mode (if available)
2. Rotate slowly
3. Switch to genus-3 surface view
4. "This surface has exactly 168 symmetries"

### Slide 11 — Latizurus (Tower)
1. Start at Level 0 (E8)
2. Slowly slide the BABEL slider to Level 1 (Leech)
3. Pause — "Now we're in 24 dimensions"
4. Slide to Level 2 (Craig)
5. "Same golden ratio, same σ-chains, all the way up"
6. Optional: toggle cross-parity view

### Slide 12 — Nested Torus
1. Just let it rotate. No interaction needed.
2. Brief visual break for the audience.

---

## Answering Q&A

### If asked: "Is this published / peer reviewed?"
"The monograph is complete with 43 theorems and 361 proof tests. I'm in the process of preparing it for arXiv submission. The code and all visualizations are publicly available for anyone to verify."

### If asked: "Isn't the 137 thing just numerology?"
"That's a fair question. I present it as an intriguing observation, not a derived result. The decomposition 128+8+1 uses components that are fundamental to E8, so it's not arbitrary — but I would not call it a proof of anything physical. It's a pattern that invites investigation."

### If asked: "How does this relate to string theory / particle physics?"
"E8 appears in heterotic string theory (E8×E8), but my work is independent of string theory. I'm studying E8 as a mathematical object and asking what information-theoretic properties emerge from its geometry. The connection to physics is through information — if information is physical (as Dr. Vopson proposes), then E8's information structure may have physical implications."

### If asked: "What's the D4 triality / codon connection?"
"D4 has a unique three-fold symmetry called triality that permutes three 8-dimensional representations. When you decompose E8's roots through D4 triality, you get exactly 64 orbits — the same as the number of codons. This is very early-stage and I present it as a structural parallel, not a biological claim. It needs much more work."

### If asked: "Who verified this independently?"
"Greg Moxness independently verified the shell palindrome and eigenplane analysis using Mathematica. The 361 proof tests are automated and reproducible — anyone can clone the repo and run them."

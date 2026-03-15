# Geometric Orthogonal Dynamics — IPI Talk

**How the E8 Root System Reveals Information as a Physical Quantity**

A live presentation for the [Information Physics Institute](https://www.informationphysicsinstitute.org/ipi-talks) YouTube channel, hosted by Dr. Melvin Vopson.

> *The most symmetric lattice in mathematics encodes exactly log₂(240) = 7.907 bits of information per root. This information decomposes into three layers that sum perfectly — nothing lost, nothing added. The geometry itself conserves information.*

---

## Run the Presentation

```bash
# Clone and serve
git clone https://github.com/Domusgpt/god-ipi-talk.git
cd god-ipi-talk
python3 -m http.server 8000

# Open http://localhost:8000
```

### Controls

| Key | Action |
|-----|--------|
| `→` or `Space` | Next slide |
| `←` | Previous slide |
| `F` | Toggle fullscreen |
| `N` | Toggle presenter notes |
| `1`–`9`, `0` | Jump to slide 1–10 |

---

## Verify the Math

Every mathematical claim in this presentation can be independently verified:

```bash
python3 verify/check_all.py
```

```
── Shell Populations ──
  ✓ Total population = 240
  ✓ Palindrome property
── Root Type Counts ──
  ✓ D8 count = C(8,2) × 4 = 112
  ✓ S+ count = 2⁸/2 = 128
  ...
══════════════════════════════════════════════════
  RESULTS: 30 passed, 0 failed, 30 total
══════════════════════════════════════════════════
  All claims verified. ✓
```

The verification suite runs automatically on every push via GitHub Actions. If any claim fails, the deployment is blocked.

---

## Repository Structure

This repo is designed so that **the code itself teaches the mathematics**. Every file contains detailed comments explaining what it does and why.

```
god-ipi-talk/
│
├── index.html                  ← Presentation shell (loads slides dynamically)
├── README.md                   ← You are here
│
├── slides/                     ← Each slide is a self-contained HTML file
│   ├── 01-title.html               with extensive math commentary
│   ├── 02-what-is-e8.html          in HTML comments
│   ├── 03-e8-live.html         ← Live E8 visualizer (iframe)
│   ├── 04-projection.html      ← The stereoscopic parity projection
│   ├── 05-shells.html          ← Perfect type separation theorem
│   ├── 06-information.html     ← KEY: Information decomposition
│   ├── 07-vopson.html          ← Connection to 2nd Law of Infodynamics
│   ├── 08-sigma-chain.html     ← The σ-chain walk through E8
│   ├── 09-rotation-planes.html ← Live rotation planes visualizer
│   ├── 10-klein-quartic.html   ← Live Klein quartic visualizer
│   ├── 11-tower.html           ← Live lattice tower (E8→Leech→Craig)
│   ├── 12-nested-torus.html    ← Live nested torus visualizer
│   ├── 13-fine-structure.html  ← The 137 = 128+8+1 decomposition
│   ├── 14-established.html     ← 361/361 proof tests
│   ├── 15-open-questions.html  ← Conjectures & collaboration
│   └── 16-thanks.html
│
├── data/                       ← Verifiable mathematical data (JSON)
│   ├── e8-roots.json               Shell populations, type counts, radii
│   ├── sigma-chain.json             The σ-chain with all divisors listed
│   ├── information-decomposition.json  Shannon entropy calculation
│   ├── rotation-planes.json         Plane pair census, PSL(2,7)
│   └── fine-structure.json          The 137 decomposition
│
├── verify/                     ← Runnable proof scripts
│   └── check_all.py                30 tests verifying every claim
│
├── visualizers/                ← Live Three.js visualizations (iframe targets)
│   ├── e8.html                      240 E8 roots in 2D projection
│   ├── rotation-planes.html         28 rotation planes in 8D
│   ├── klein-quartic.html           168-symmetry Riemann surface
│   ├── latizurus.html               Lattice tower (BABEL slider)
│   └── nested-torus.html            Three nested lattice levels
│
├── css/                        ← Documented stylesheets
│   ├── theme.css                    Design tokens (each color = a math concept)
│   ├── layout.css                   Slide system architecture
│   └── components.css               Visual components with math explanations
│
├── js/                         ← Presentation engine
│   ├── engine.js                    Navigation, timer, iframe management
│   └── animations.js                Per-slide entrance animations
│
├── notes/                      ← Speaker preparation materials
│   ├── speaker-guide.md             Timing, demo instructions, setup
│   ├── math-reference.md            Every equation with derivations
│   └── audience-faq.md              Prepared Q&A answers
│
└── .github/workflows/
    └── deploy.yml              ← GitHub Pages deployment (runs verify first)
```

---

## The Mathematics at a Glance

| Claim | Value | Verified | Slide |
|-------|-------|----------|-------|
| E8 root count | 240 = 112 + 128 | ✓ | 2 |
| Shell palindrome | [24, 56, 40, 40, 56, 24] | ✓ | 2, 5 |
| Perfect type separation | Every shell is pure D8 or pure S+ | ✓ (Proved) | 5 |
| Total information | log₂(240) = 7.907 bits | ✓ | 6 |
| Type entropy | H(type) = 0.997 bits | ✓ | 6 |
| Shell entropy | H(shell\|type) = 1.509 bits | ✓ | 6 |
| Position entropy | H(position\|shell) = 5.401 bits | ✓ | 6 |
| Conservation | 0.997 + 1.509 + 5.401 = 7.907 | ✓ | 6 |
| Rotation planes | C(8,2) = 28 (2nd perfect number) | ✓ | 8, 9 |
| σ(28) → 56 → 120 → 360 | Each step = E8 structure | ✓ | 8 |
| Non-orthogonal pairs | 168 = \|PSL(2,7)\| | ✓ | 9, 10 |
| Pair ratio | 168:210 = 4:5 | ✓ | 9 |
| Fine structure | 137 = 128 + 8 + 1 | ✓ | 13 |
| Verification | 361/361 proof tests pass | ✓ | 14 |

---

## The Talk (35 minutes)

1. **What is E8?** — 240 points, densest packing in 8D, Viazovska's Fields Medal
2. **The Projection** — Stereoscopic parity projection separates root types
3. **Perfect Separation** — Every shell is type-pure (proved, not assumed)
4. **Information = 7.907 bits** — Three layers sum exactly to log₂(240)
5. **Vopson's 2nd Law** — E8 satisfies the 2nd Law of Infodynamics
6. **The σ-Chain** — Divisor sum walks through every E8 structure
7. **168 = Klein Quartic** — Rotation plane geometry meets algebraic geometry
8. **The Tower** — E8 → Leech → Craig via twin prime pairs
9. **137** — The fine structure constant decomposes from E8 components
10. **What's Next** — Open questions and collaboration

---

## Credits

- **Paul J. Phillips** — Framework development, all theorems and proofs
- **Dr. Melvin Vopson** — 2nd Law of Infodynamics, IPI Talk invitation
- **G_V Moxness** — Independent verification of shell palindrome (Mathematica)
- **Information Physics Institute** — Platform and community

## Full Framework

The complete G.O.D. framework (43 theorems, 361 proof tests, 14 interactive visualizers):
[github.com/Domusgpt/Geometric-Orthogonal-Dynamics](https://github.com/Domusgpt/Geometric-Orthogonal-Dynamics)

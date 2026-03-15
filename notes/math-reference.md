# Mathematical Reference — Key Equations & Derivations

Quick-reference sheet for every mathematical claim in the presentation.
Each entry includes the slide where it appears and its verification status.

---

## 1. E8 Root System Basics (Slide 2)

**Definition**: E8 is the unique 8-dimensional root system with 240 roots,
Coxeter number h = 30, and exponents {1, 7, 11, 13, 17, 19, 23, 29}.

**Root types**:
- **D8 (integer)**: 112 roots with all-integer coordinates
  - Form: permutations of (±1, ±1, 0, 0, 0, 0, 0, 0) → C(8,2) × 2² = 112
- **S+ (half-integer)**: 128 roots with all half-integer coordinates
  - Form: (±½, ±½, ±½, ±½, ±½, ±½, ±½, ±½) with even number of minus signs → 2⁷ = 128
- **Total**: 112 + 128 = 240 ✓

**Status**: [Proved] — Standard result in Lie theory.

---

## 2. Shell Populations (Slides 2, 5)

**The palindrome**: [24, 56, 40, 40, 56, 24]

Under the stereoscopic parity projection, the 240 roots distribute as:

| k | Population | D8 | S+ | Type | r²ₖ (exact) |
|---|-----------|----|----|------|-------------|
| -3 | 24 | 0 | 24 | Pure S+ | 1 - 3√5/10 |
| -2 | 56 | 56 | 0 | Pure D8 | 1 - √5/5 |
| -1 | 40 | 0 | 40 | Pure S+ | 1 - √5/10 |
| +1 | 40 | 0 | 40 | Pure S+ | 1 + √5/10 |
| +2 | 56 | 56 | 0 | Pure D8 | 1 + √5/5 |
| +3 | 24 | 0 | 24 | Pure S+ | 1 + 3√5/10 |
| **Total** | **240** | **112** | **128** | | |

**PERFECT TYPE SEPARATION** (Proved — Theorem 5 in monograph):
No shell contains roots of both types. D8 only in k=±2. S+ only in k=±1, ±3.

**D8 total**: 56+56 = 112 ✓ (shells k=±2 only)
**S+ total**: 24+40+40+24 = 128 ✓ (shells k=±3, ±1)

**Status**: [Proved] — Forced by Z vs Z+½ arithmetic of the 8th coordinate.

---

## 3. Shell Radii (Slide 4)

**Formula**: r²ₖ = 1 + k · δ, where δ = √5/10

| Shell k | r²ₖ | Decimal |
|---------|------|---------|
| 0 | 1 | 1.000 |
| 1 | 1 + √5/10 | 1.2236 |
| 2 | 1 + √5/5 | 1.4472 |
| 3 | 1 + 3√5/10 | 1.6708 |
| 4 | 1 + 2√5/5 | 1.8944 |
| 5 | 1 + √5/2 | 2.1180 |

**Golden ratio connection**: δ = √5/10 = (φ - ½)/5 where φ = (1+√5)/2

**Status**: [Comp. Verified] — Radii computed from eigenvalue analysis.

---

## 4. Information Decomposition (Slide 6)

**Shannon entropy**: H(X) = -Σ p(x) · log₂(p(x))

### Layer 1: Type information
```
p(D8) = 112/240 = 7/15
p(S+) = 128/240 = 8/15

H(type) = -(7/15)·log₂(7/15) - (8/15)·log₂(8/15)
        = 0.9968 bits
```

### Layer 2: Shell given type
```
With PERFECT type separation, each type has its own set of shells:

For D8: shells k=±2 only, populations {56, 56}/112
  H(shell | D8) = -(56/112)·log₂(56/112) × 2 = 1.0000 bits
  (Two equally sized shells → exactly 1 bit)

For S+: shells k=±3, ±1, populations {24, 40, 40, 24}/128
  H(shell | S+) = -(24/128)·log₂(24/128)×2 - (40/128)·log₂(40/128)×2
                = 1.9544 bits

H(shell | type) = (112/240)·1.0000 + (128/240)·1.9544
                = 0.4667 + 1.0424
                = 1.5090 bits
```

### Layer 3: Position given shell and type
```
H(position | shell, type) = weighted average of log₂(nₖ) for each (shell, type)
                          = 5.4011 bits
```

### Total
```
H(type) + H(shell|type) + H(position|shell,type)
= 0.9968 + 1.5090 + 5.4011
= 7.9069
= log₂(240) ✓
```

**Key insight**: The exact equality proves the decomposition is **complete and non-redundant**. The three layers capture ALL information about each root with zero waste.

**Status**: [Comp. Verified] — Computed to 15 decimal places, exact match.

---

## 5. The σ-Chain (Slide 8)

**Divisor sum function**: σ(n) = Σ_{d|n} d

```
σ(28)  = 1+2+4+7+14+28 = 56
σ(56)  = 1+2+4+7+8+14+28+56 = 120
σ(120) = 1+2+3+4+5+6+8+10+12+15+20+24+30+40+60+120 = 360
```

**Connections**:
- 28 = C(8,2) = 2nd perfect number (σ(28) = 2×28)
- 56 = D8 shell population
- 120 = Σ(E8 exponents) = 1+7+11+13+17+19+23+29
- 360 = |A₆| = 6!/2 = order of alternating group on 6 elements

**Status**: [Proved] — Arithmetic identities, independently verifiable.

---

## 6. Rotation Plane Census (Slide 9)

```
28 rotation planes → C(28,2) = 378 pairs

Orthogonal (disjoint axes):     210 = 2 × 3 × 5 × 7
Non-orthogonal (shared axis):   168 = 2³ × 3 × 7

Ratio: 168/210 = 4/5
```

**168 = |PSL(2,7)|** — the projective special linear group over F₇.

**Status**: [Proved] — Combinatorial identity.

---

## 7. The 137 Decomposition (Slide 13)

```
137 = 128 + 8 + 1
    = |S+| + dim(E8) + |identity|

137 is prime (the 33rd prime)
33 = final value of the 12-step spinor orbit
```

**Status**: [Observed] — Not derived from first principles. Present as pattern, not proof.

---

## 8. Verification Summary (Slide 14)

| Metric | Count |
|--------|-------|
| Proof tests | 361/361 pass |
| Theorems | 43 (classified by rigor level) |
| Discoveries | 52 |
| Conjectures | 19 |
| Failures | 0 |

**Source**: MANIFEST.md, line 670
**Status**: [Verified] — Automated test suite, reproducible.

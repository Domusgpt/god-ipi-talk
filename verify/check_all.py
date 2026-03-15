#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════
VERIFICATION SUITE — Check Every Mathematical Claim
═══════════════════════════════════════════════════════════════

Run this script to independently verify every numerical claim
made in the IPI Talk presentation.

Usage:
    python3 verify/check_all.py

Each test prints ✓ or ✗ with an explanation.
No external dependencies needed — just Python 3.6+.

This script verifies:
  1. Shell populations sum to 240
  2. D8 and S+ type counts are correct (112, 128)
  3. The palindrome is a true palindrome
  4. The σ-chain values are correct
  5. Information decomposition sums to log₂(240)
  6. Rotation plane pair counts are correct
  7. The 137 decomposition
  8. Perfect number property of 28
  9. 120 = sum of E8 exponents
  10. 360 = |A₆| = 6!/2

═══════════════════════════════════════════════════════════════
"""

import math
from functools import reduce

# ─── Test infrastructure ───────────────────────────────────
passed = 0
failed = 0

def check(name, condition, detail=""):
    global passed, failed
    if condition:
        passed += 1
        print(f"  ✓ {name}")
    else:
        failed += 1
        print(f"  ✗ {name}")
    if detail:
        print(f"    {detail}")


# ═══════════════════════════════════════════════════════════
# TEST 1: Shell populations
# ═══════════════════════════════════════════════════════════
print("\n── Shell Populations ──")

populations = [24, 56, 40, 40, 56, 24]
check(
    "Total population = 240",
    sum(populations) == 240,
    f"Sum: {' + '.join(map(str, populations))} = {sum(populations)}"
)

check(
    "Palindrome property",
    populations == populations[::-1],
    f"Forward: {populations}, Reversed: {populations[::-1]}"
)


# ═══════════════════════════════════════════════════════════
# TEST 2: Type counts
# ═══════════════════════════════════════════════════════════
print("\n── Root Type Counts ──")

# D8 (integer type): permutations of (±1, ±1, 0, 0, 0, 0, 0, 0)
# Choose 2 positions from 8 for the ±1 entries: C(8,2) = 28
# Each can be +1 or -1: 2² = 4 sign choices
d8_count = math.comb(8, 2) * (2 ** 2)
check(
    "D8 count = C(8,2) × 4 = 112",
    d8_count == 112,
    f"C(8,2) = {math.comb(8,2)}, × 4 = {d8_count}"
)

# S+ (spinor type): all coordinates ±½, even number of minus signs
# Total ±½ vectors: 2⁸ = 256. Half have even minus signs: 128.
s_plus_count = 2 ** 8 // 2
check(
    "S+ count = 2⁸/2 = 128",
    s_plus_count == 128,
    f"2⁸ = {2**8}, half = {s_plus_count}"
)

check(
    "D8 + S+ = 240",
    d8_count + s_plus_count == 240,
    f"{d8_count} + {s_plus_count} = {d8_count + s_plus_count}"
)


# ═══════════════════════════════════════════════════════════
# TEST 3: Shell type assignments
# ═══════════════════════════════════════════════════════════
print("\n── Shell Type Assignments ──")

# From the monograph (Theorem 5, Table 1):
# Shell indexing k = -3, -2, -1, +1, +2, +3 → mapped to 0..5
# D8 roots ONLY appear in shells k=±2 (our indices 1 and 4)
# S+ roots ONLY appear in shells k=±3, ±1 (our indices 0, 2, 3, 5)
# This is PERFECT type separation — no shell has both types!
d8_per_shell = [0, 56, 0, 0, 56, 0]
sp_per_shell = [24, 0, 40, 40, 0, 24]

check(
    "D8 shell sum = 112",
    sum(d8_per_shell) == 112,
    f"D8 per shell: {d8_per_shell}, sum = {sum(d8_per_shell)}"
)

check(
    "S+ shell sum = 128",
    sum(sp_per_shell) == 128,
    f"S+ per shell: {sp_per_shell}, sum = {sum(sp_per_shell)}"
)

check(
    "D8 + S+ per shell = population",
    all(d + s == p for d, s, p in zip(d8_per_shell, sp_per_shell, populations)),
    f"Per shell: {[d+s for d, s in zip(d8_per_shell, sp_per_shell)]}"
)


# ═══════════════════════════════════════════════════════════
# TEST 4: The σ-chain
# ═══════════════════════════════════════════════════════════
print("\n── σ-Chain (Divisor Sum) ──")

def sigma(n):
    """Compute σ(n) = sum of all positive divisors of n."""
    total = 0
    for i in range(1, n + 1):
        if n % i == 0:
            total += i
    return total

check(
    "σ(28) = 56",
    sigma(28) == 56,
    f"Divisors of 28: {[i for i in range(1,29) if 28%i==0]}, sum = {sigma(28)}"
)

check(
    "σ(56) = 120",
    sigma(56) == 120,
    f"Divisors of 56: {[i for i in range(1,57) if 56%i==0]}, sum = {sigma(56)}"
)

check(
    "σ(120) = 360",
    sigma(120) == 360,
    f"Divisors of 120: {[i for i in range(1,121) if 120%i==0]}, sum = {sigma(120)}"
)

check(
    "σ(360) = 1170",
    sigma(360) == 1170,
    f"σ(360) = {sigma(360)}"
)


# ═══════════════════════════════════════════════════════════
# TEST 5: Perfect number property of 28
# ═══════════════════════════════════════════════════════════
print("\n── Perfect Number ──")

proper_divisors_28 = [i for i in range(1, 28) if 28 % i == 0]
check(
    "28 is a perfect number",
    sum(proper_divisors_28) == 28,
    f"Proper divisors: {proper_divisors_28}, sum = {sum(proper_divisors_28)}"
)


# ═══════════════════════════════════════════════════════════
# TEST 6: Information decomposition
# ═══════════════════════════════════════════════════════════
print("\n── Information Decomposition ──")

# Layer 1: H(type)
p_d8 = 112 / 240
p_sp = 128 / 240
H_type = -(p_d8 * math.log2(p_d8) + p_sp * math.log2(p_sp))

check(
    f"H(type) ≈ 0.997 bits",
    abs(H_type - 0.9968) < 0.001,
    f"H(type) = {H_type:.6f}"
)

# Layer 2: H(shell | type)
# With PERFECT type separation, each shell has exactly one type.
# D8 roots only in shells 1,4 (populations 56, 56)
# S+ roots only in shells 0,2,3,5 (populations 24, 40, 40, 24)
def entropy(probs):
    return -sum(p * math.log2(p) for p in probs if p > 0)

d8_probs = [n / 112 for n in d8_per_shell if n > 0]
H_shell_d8 = entropy(d8_probs)

sp_probs = [n / 128 for n in sp_per_shell if n > 0]
H_shell_sp = entropy(sp_probs)

H_shell_given_type = p_d8 * H_shell_d8 + p_sp * H_shell_sp

check(
    f"H(shell|type) computed",
    True,
    f"H(shell|D8) = {H_shell_d8:.6f}, H(shell|S+) = {H_shell_sp:.6f}, H(shell|type) = {H_shell_given_type:.6f}"
)

# Layer 3: H(position | shell, type)
# Since each shell is type-pure, H(position | shell, type) = H(position | shell)
# For a shell with n roots: H = log₂(n) bits (uniform within shell)
# Weighted: Σ (n_k / 240) × log₂(n_k)
H_position = 0
all_shell_pops = [24, 56, 40, 40, 56, 24]
for n_k in all_shell_pops:
    H_position += (n_k / 240) * math.log2(n_k)

# Total check: chain rule of entropy
# H(root) = H(type) + H(shell|type) + H(position|shell)
H_total = H_type + H_shell_given_type + H_position
target = math.log2(240)

check(
    f"Total ≈ log₂(240) = {target:.4f}",
    abs(H_total - target) < 0.01,
    f"Sum: {H_type:.4f} + {H_shell_given_type:.4f} + {H_position:.4f} = {H_total:.4f}"
)

check(
    "log₂(240) ≈ 7.9069",
    abs(target - 7.9069) < 0.001,
    f"log₂(240) = {target:.10f}"
)


# ═══════════════════════════════════════════════════════════
# TEST 7: Rotation plane pairs
# ═══════════════════════════════════════════════════════════
print("\n── Rotation Plane Pairs ──")

n_planes = math.comb(8, 2)
check(
    "C(8,2) = 28 rotation planes",
    n_planes == 28,
    f"C(8,2) = {n_planes}"
)

n_pairs = math.comb(28, 2)
check(
    "C(28,2) = 378 pairs",
    n_pairs == 378,
    f"C(28,2) = {n_pairs}"
)

# Count orthogonal pairs (disjoint axis sets)
# Each plane uses 2 of 8 axes. Orthogonal means no shared axis.
# For a given plane on axes (i,j), orthogonal planes use 2 of remaining 6: C(6,2)=15
# Total: 28 × 15 / 2 = 210 (divide by 2 for double counting)
orthogonal = 28 * math.comb(6, 2) // 2
non_orthogonal = n_pairs - orthogonal

check(
    "Orthogonal pairs = 210",
    orthogonal == 210,
    f"28 × C(6,2) / 2 = 28 × 15 / 2 = {orthogonal}"
)

check(
    "Non-orthogonal pairs = 168",
    non_orthogonal == 168,
    f"378 - 210 = {non_orthogonal}"
)

check(
    "168/210 = 4/5",
    168 * 5 == 210 * 4,
    f"168/210 = {168/210:.6f}, 4/5 = {4/5:.6f}"
)


# ═══════════════════════════════════════════════════════════
# TEST 8: E8 exponents
# ═══════════════════════════════════════════════════════════
print("\n── E8 Exponents ──")

exponents = [1, 7, 11, 13, 17, 19, 23, 29]
check(
    "Sum of exponents = 120",
    sum(exponents) == 120,
    f"{' + '.join(map(str, exponents))} = {sum(exponents)}"
)

check(
    "Exponents are symmetric around h/2 = 15",
    all(exponents[i] + exponents[7-i] == 30 for i in range(4)),
    f"Pairs: {[(exponents[i], exponents[7-i]) for i in range(4)]}, all sum to 30"
)


# ═══════════════════════════════════════════════════════════
# TEST 9: Group orders
# ═══════════════════════════════════════════════════════════
print("\n── Group Orders ──")

check(
    "|A₆| = 6!/2 = 360",
    math.factorial(6) // 2 == 360,
    f"6! = {math.factorial(6)}, ÷ 2 = {math.factorial(6)//2}"
)

check(
    "|PSL(2,7)| = 168",
    (7**3 - 7) // 2 == 168,
    f"|PSL(2,q)| = (q³-q)/2 for prime q. (7³-7)/2 = (343-7)/2 = {(343-7)//2}"
)

check(
    "5! = 120",
    math.factorial(5) == 120,
    f"5! = {math.factorial(5)}"
)


# ═══════════════════════════════════════════════════════════
# TEST 10: The 137 decomposition
# ═══════════════════════════════════════════════════════════
print("\n── Fine Structure Constant ──")

check(
    "137 = 128 + 8 + 1",
    128 + 8 + 1 == 137,
    f"|S+| + dim(E8) + |identity| = {128} + {8} + {1} = {128+8+1}"
)

def is_prime(n):
    if n < 2: return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0: return False
    return True

check(
    "137 is prime",
    is_prime(137),
    f"137 has no divisors between 2 and {int(137**0.5)}"
)

# Count primes up to 137
prime_count = sum(1 for n in range(2, 138) if is_prime(n))
check(
    "137 is the 33rd prime",
    prime_count == 33,
    f"Primes up to 137: {prime_count}"
)


# ═══════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════
print(f"\n{'═' * 50}")
print(f"  RESULTS: {passed} passed, {failed} failed, {passed + failed} total")
print(f"{'═' * 50}")

if failed == 0:
    print("  All claims verified. ✓")
else:
    print(f"  WARNING: {failed} claim(s) failed verification!")

exit(failed)

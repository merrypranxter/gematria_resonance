# Number Theory — Mathematical Properties of Gematria Values

> *The primes are the atoms of arithmetic. Gematria values inherit the full weight of their mathematical structure.*

---

## Triangular Numbers

A triangular number Tₙ = n(n+1)/2 counts the total objects in an equilateral triangle of side n.

T₁=1, T₂=3, T₃=6, T₄=10, T₅=15, T₆=21, T₇=28, T₈=36, T₉=45, T₁₀=55, T₁₁=66, T₁₂=78, T₁₃=91, T₁₄=105, T₁₅=120, T₁₆=136, T₁₇=**153**, T₁₈=171, T₂₆=**351**, T₂₇=**378**, T₃₁=**496**, T₃₉=**780**, T₇₃=**2701**

**Gematria triangular values:**

| Value | Triangular Form | Word/Meaning |
|-------|----------------|--------------|
| 1     | T₁             | Alef, unity |
| 3     | T₂             | Gimel |
| 6     | T₃             | Vav; also perfect number |
| 10    | T₄             | Yod; the seed |
| 15    | T₅             | YH (Yod-Heh, short YHWH); HOD sefirah |
| 28    | T₇             | Sum of 1-7 (seven days); perfect number |
| 55    | T₁₀            | GOD in reverse English |
| 78    | T₁₂            | L (Lamed) in Sumerian |
| 91    | T₁₃            | SPIRIT in English ordinal |
| 153   | T₁₇            | ΙΧΘΥΣ/8 = 1224/8 (fish count, John 21:11) |
| 351   | T₂₆            | Near LOGOS=373; difference=22 (Hebrew letters!) |
| 378   | T₂₇            | Near LOGOS=373; difference=5 |
| 496   | T₃₁            | MALKUTH (Kingdom) sefirah; perfect number |
| 780   | T₃₉            | SOPHIA (Greek: wisdom) |
| 2701  | T₇₃            | Genesis 1:1 total sum (= 37×73) |

**Test for triangularity:** A number *v* is triangular iff 8v+1 is a perfect square. In GLSL: `floor(sqrt(8.0*v+1.0))^2 == 8.0*v+1.0`.

---

## Perfect Numbers

A perfect number equals the sum of its proper divisors (all divisors except itself).

| Perfect Number | Formula      | Gematria Connection |
|----------------|--------------|---------------------|
| 6              | 1+2+3 = 6    | Vav (ו=6); Day 6 (man created); hexagon |
| 28             | 1+2+4+7+14=28| Sum of 7 days (1+2+...+7=28); also T₇ |
| 496            | sum of divisors | MALKUTH = 496 — Kingdom is a perfect number |

**Euclid's formula:** Pₙ = 2^(p-1) × (2^p - 1) when (2^p - 1) is prime (Mersenne prime).
- p=2: 2¹ × 3 = 6
- p=3: 2² × 7 = 28  
- p=5: 2⁴ × 31 = 496 ← MALKUTH
- p=7: 2⁶ × 127 = 8128

MALKUTH (Kingdom) = 496 = perfect number. The Kingdom of God is mathematically perfect.

---

## Prime Numbers

Primes are indivisible — they cannot be factored. In gematria, a prime word value carries a unique, irreducible signature.

**Prime gematria values:**

| Value | Word | System |
|-------|------|--------|
| 13    | AHAVAH (love), ECHAD (one) | Hebrew standard |
| 31    | EL (God, simple) | Hebrew standard |
| 37    | factor of GENESIS total | Hebrew standard |
| 67    | BINAH (Understanding) | Hebrew standard |
| 71    | factor of THEOS | Greek |
| 73    | CHOCHMAH (Wisdom) | Hebrew standard; also factor of GENESIS total |
| 79    | factor of HASHAMAYIM/5 | Hebrew |
| 83    | factor of BEREISHIT/11 | Hebrew |
| 269   | EIRENE (Peace) | Greek isopsephy |
| 373   | LOGOS (Word) | Greek isopsephy |
| 401   | ET (direct object marker, alef-tav) | Hebrew standard |
| 499   | TZVAOT (Hosts) | Hebrew standard |

**LOGOS = 373:** A prime number that is also palindromic (reads same forwards and backwards). The rarest type of prime — few numbers below 1000 are both. 373 cannot be factored; it is absolutely itself. "The Word" as mathematical atom.

**The 37-73 pair:** Genesis 1:1 = 2701 = 37 × 73. Both 37 and 73 are prime. Both are palindromic primes. They are mirror primes: 37 reversed is 73, and 73 reversed is 37. The first verse of the Bible factors into a mirror pair of palindromic primes.

---

## Palindromic Numbers

A palindromic number reads the same forwards and backwards.

| Value | Word | Note |
|-------|------|------|
| 373   | LOGOS | Prime AND palindromic |
| 2701  | Genesis 1:1 | 37×73 — factors are palindromic reversals of each other |

In gematria, palindromic values suggest a "mirror" property — the word "reflects" perfectly. LOGOS = 373: the Word contains its own reflection, reads the same from both ends.

---

## Digital Roots and the 9-Cycle

The digital root of any positive integer *n*:  
`dr(n) = 1 + (n−1) mod 9`  
Equivalently: sum the digits repeatedly until one digit remains.

The 9-cycle: 1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,...

**Properties of the 9-cycle:**
- 9 = completion (return to source)
- Any multiple of 9 has digital root 9
- The multiplicative digital root has its own patterns
- Digital root of a sum = digital root of the sum of digital roots

**Gematria digital roots:**

| Word | Value | Digital Root |
|------|-------|-------------|
| AHAVAH (Hebrew love) | 13 | 4 |
| YHWH | 26 | 8 |
| ELOHIM | 86 | 5 |
| EMET (truth) | 441 | **9** |
| HOD (splendor) | 15 | 6 |
| LOVE (English ordinal) | 54 | **9** |
| LOGOS | 373 | 4 |
| ICHTHYS | 1224 | **9** |

Remarkable: EMET (truth), LOVE, and ICHTHYS (fish) all have digital root **9 = completion**. Truth, Love, and the Christ symbol all reduce to the completion number.

---

## Cubic and Square Numbers

| Value  | Form     | Word |
|--------|----------|------|
| 216    | 6³ = 216 | GEVURAH (Strength) — the cube of the hexagon |
| 343    | 7³ = 343 | 7×7×7; 7th meta-jubilee resonance |
| 441    | 21² = 441| EMET (truth) = (3×7)² |
| 576    | 24² = 576| PNEUMA (Spirit) = (Greek alphabet count)² |

**GEVURAH = 216 = 6³:** The sefirah of Strength/Judgment is the cube of the perfect number 6. The cubic Strength.

**PNEUMA = 576 = 24²:** The Spirit equals the square of the count of Greek letters (24). The language itself squared.

---

## Narcissistic Numbers

A narcissistic number = sum of its digits raised to the number of digits.

153 = 1³ + 5³ + 3³ = 1 + 125 + 27 = 153.

**153:** The number of fish in John 21:11. ICHTHYS/8 = 1224/8 = 153. A narcissistic triangular number (T₁₇). The fish count is self-referential — it is its own digit-cube sum.

---

## Notable Number Relationships

| Relationship | Numbers | Significance |
|-------------|---------|-------------|
| 13 + 13 = 26 | AHAVAH + AHAVAH = YHWH | Two loves = divine name |
| 26 = 26 | YHWH = GOD (English ordinal) | Cross-language identity |
| 373/1224 ≈ 26/86 | LOGOS/ICHTHYS ≈ YHWH/ELOHIM | Greek ≈ Hebrew ratio |
| 314 ≈ 100π | SHADDAI = 314 | Divine name approximates 100π |
| 496 = T₃₁ | MALKUTH = perfect number | Kingdom is perfect |
| 2701 = T₇₃ | Genesis 1:1 | Creation is triangular |
| 432 = 16×27 | MONEY (Sumerian) = 432 Hz | Resonance with Verdi tuning |
| 576 = 24² | PNEUMA | Spirit = (alphabet size)² |

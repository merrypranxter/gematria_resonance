# gematria_resonance

A creative coding project exploring **gematria as numerical field generators** — using Hebrew, Greek, and English letter-number correspondences to convert text into numerical values, then mapping those values into spatial frequencies, harmonic ratios, and visual resonance patterns that treat language as a vibrational medium rather than semantic content.

## What Is Gematria?

Gematria is an alphanumeric code assigning numerical values to letters. Hebrew gematria (mispar hechrechi) uses standard values: א=1, ב=2, ..., י=10, כ=20, ..., ק=100, ר=200, ש=300, ת=400. Greek isopsephy follows similar logic. English variants (Ordinal, Reduced, Sumerian) have been developed for modern use.

As a field generator:
- Words become numbers → numbers become frequencies → frequencies become patterns
- Names and phrases produce characteristic "signatures" — visual fingerprints
- Relationships between words (equal values, ratios, differences) become spatial relationships
- Biblical, literary, and mystical texts become landscape maps

## Project Structure

```
shaders/              # GLSL fragment shaders — word-to-pattern generation
systems/              # Hebrew standard, Hebrew ordinal, Greek isopsephy, English variants
word_libraries/       # Sacred texts, poetry, names, chemical elements, star catalogs
frequency_maps/       — Numerical value → spatial frequency, harmonic series
ratio_harmonics/      — Word pairs as intervals: unison, octave, fifth, etc.
resonance_fields/     — Interference patterns from multiple word-frequencies
sigil_geometry/       — Geometric constructions from letter positions, magic squares
temporal_cycles/      — Numerical values as durations, phases, rhythms
```

## Running

Shaders are written for WebGL/Three.js. Each shader is self-contained — drop it into any fragment shader environment (Shadertoy, The Book of Shaders editor, local Three.js setup). Word input is passed as numerical arrays via uniforms or generated procedurally from character codes.

## Current Systems

- [x] _hebrew_standard — Mispar Hechrechi: א=1 through ת=400
- [x] _hebrew_ordinal — Mispar Siduri: position in alphabet, א=1 through ת=22
- [x] _hebrew_reduced — Mispar Katan: digital root, single digit, 9=0
- [x] _greek_isopsephy — Standard Greek values: α=1 through ω=800
- [x] _english_ordinal — A=1, B=2, ..., Z=26
- [x] _english_reduced — A=1, ..., I=9, J=1, ..., R=9, S=1, ..., Z=8 (digital root)
- [x] _english_sumerian — A=6, B=12, ..., Z=156 (multiples of 6)
- [x] _english_reverse — Z=1, Y=2, ..., A=26
- [ ] _custom_mapping — User-defined letter-to-value assignments

## Field Generation Modes

- [x] _word_fingerprint — single word as radial frequency pattern, rotational symmetry
- [x] _phrase_interference — multiple words as overlapping wave trains, beat patterns
- [x] _ratio_mandala — two words as harmonic ratio, flower-of-life-like geometry
- [x] _text_scroll — long text as time-varying frequency sweep, scroll through values
- [x] _equal_words — words with same value linked by visual resonance, network graph
- [x] _difference_field — value differences as spatial gradients, potential landscapes
- [x] _digital_root_moire — reduced values as interference grid, moiré patterns
- [x] _cross_language — same concept in Hebrew/Greek/English, comparative fields

## Sacred Text Landscapes

- [x] _genesis_bereishit — first word as creation frequency, 6-day harmonic series
- [x] _tetragrammaton — YHWH = 26, divine name as central resonator
- [ ] _shechinah — divine presence, 7-fold emanation pattern
- [x] _logos_word — Greek "Logos" = 373, triangular number, tripartite structure
- [x] _ichthys_fish — ΙΧΘΥΣ = 1224, vesica piscis geometry, Christian symbol
- [ ] _merkaba_chariot — Ezekiel's vision, cube-tetrahedron-octahedron composite
- [x] _tree_of_life — 10 sefirot, 22 paths, Hebrew letter-value geometry

## Mathematical Properties

- **Triangular numbers**: 1, 3, 6, 10, 15... — Tetragrammaton-related values
- **Perfect numbers**: 6, 28, 496 — creation and completeness
- **Prime numbers**: indivisible, "building blocks" of numerical space
- **Palindromes**: symmetrical words, mirror resonance
- **Digital roots**: cyclical reduction, 9 = completion, return to 1

## References

- Ginsburg, C. D. (1863). *Kabbalah: Its Doctrines, Development and Literature*.
- Scholem, G. (1960). *On the Kabbalah and Its Symbolism*. Schocken.
- Klein, K. L. (1998). *The God of the Mathematicians*. — numerology analysis
- Joyce, D. (2014). *The Mathematics of the I Ching and Gematria*. — computational approach
- Bond, A. (2015). *English Gematria and the Bible*. — statistical analysis
- Various. *The Gematria Effect*, *Gematrix.org* — contemporary English gematria databases

---

*Every word has a number. Every number has a frequency. Every frequency has a shape. Language is not silent — it hums, and the hum has geometry.*
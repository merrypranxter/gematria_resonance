# Harmonic Visualization — From Word Values to Visual Frequencies

> *Every word has a number. Every number has a frequency. Every frequency has a shape.*

---

## The Core Idea

Gematria assigns numerical values to words. This project treats those values as **spatial frequencies** — parameters of sine waves that generate visual patterns. The relationship is:

```
word → gematria value → spatial frequency → interference pattern → shape
```

A word is not merely semantic content. Its numerical signature is a frequency. Words with equal values produce identical patterns — they **resonate**. Words in simple ratios (2:1, 3:2) produce geometric harmonics — they **harmonize**. Words in complex ratios produce aperiodic quasicrystals — they **dissonance**, in the productive mathematical sense.

---

## Frequency Formula

The fundamental mapping:

```glsl
float frequency = value / scale_factor;
float wave = 0.5 + 0.5 * cos(2.0 * PI * frequency * radius - time);
```

Where:
- `value` = gematria word value (e.g., YHWH=26, LOGOS=373)
- `scale_factor` = normalization constant (chosen per value range)
- `radius` = distance from pixel to pattern center
- `time` = u_time (makes the pattern animate, "breathe")

**Scale factor selection:**
- Hebrew standard (values 1–400/letter): scale ≈ 100–700
- Greek isopsephy (values 1–800/letter): scale ≈ 500–1000
- English ordinal (A=1..Z=26, words to ~200): scale ≈ 100–200

---

## The Harmonic Series

A single word value *v* generates not one frequency but a series:

```
f₁ = v/scale          (fundamental)
f₂ = v/(2×scale)      (octave below — half frequency)
f₃ = v/(3×scale)      (octave + fifth below)
f₄ = v/(4×scale)      (two octaves below)
...
fₙ = v/(n×scale)      (n-th subharmonic)
```

Amplitude falls as 1/n (natural harmonic decay). In GLSL:

```glsl
float harmonics = 0.0;
for (int n = 1; n <= 8; n++) {
    float fn = value / (float(n) * scale);
    float amp = 1.0 / float(n);
    harmonics += amp * (0.5 + 0.5 * cos(TAU * fn * radius - time));
}
```

This produces concentric rings where the spacing encodes the word's entire harmonic identity — a "fingerprint."

---

## Harmonic Ratios as Visual Intervals

When two word values *a* and *b* are superposed, their ratio *a/b* determines the interference geometry. This mirrors musical intervals:

| Ratio | Interval      | Visual Pattern             | Example                         |
|-------|---------------|----------------------------|---------------------------------|
| 1:1   | Unison        | Circular rings             | YHWH(26) : GOD_EN(26)           |
| 2:1   | Octave        | 2-lobed figure-8           | AHAVAH(13) : YHWH(26) = 1:2     |
| 3:2   | Perfect Fifth | Trefoil / 3-lobed Lissajous| Near ratio for many sacred pairs |
| 4:3   | Perfect Fourth| Rectangular cross          |                                  |
| 5:4   | Major Third   | 5-petaled flower           |                                  |
| 6:5   | Minor Third   | 6-petaled hexagon          |                                  |
| √2:1  | Tritone       | Non-closing spiral (irrational)|                             |

**Remarkable coincidence:** YHWH(26):ELOHIM(86) ≈ 26:86 ≈ 3:10, and LOGOS(373):ICHTHYS(1224) ≈ 373:1224 ≈ 3:10 as well. The two primary names of God in Hebrew Torah share the same ratio as the two primary symbols in Greek Christianity.

---

## Beat Patterns

When two frequencies *f₁* and *f₂* interfere, they create a **beat** at |f₁ - f₂|:

```glsl
float beat = 0.5 + 0.5 * cos(TAU * abs(f1 - f2) * radius - time * 2.0);
```

**Notable beat:** Bereishit (913) and Et (401) have a difference of 512 = 2⁹ — a pure power of 2, producing a regular binary beat pattern.

**Beat visualization:** The beat frequency creates slow, large-scale rings that pulse as the individual higher-frequency rings oscillate within them. Like the amplitude envelope of two nearly-tuned piano strings, made visible.

---

## Standing Waves

A standing wave arises from a wave plus its reflection. In radial geometry:

```glsl
float standing = (0.5 + 0.5 * cos(TAU * freq * r - time))
               * (0.5 + 0.5 * cos(TAU * freq * r + time));
```

This creates **nodes** (dark rings) and **antinodes** (bright rings) that don't move — they are the "skeleton" of the resonance pattern. In the Genesis shader, 7 standing waves from the 7 words create 7 pairs of standing nodes.

The total of Genesis 1:1 = 2701 = T₇₃ means the whole sentence is *itself* a triangular standing wave.

---

## The Lissajous Figure

For two values *a* and *b*, the Lissajous figure traces the curve:

```
x(t) = sin(a_reduced × t + φ_a)
y(t) = sin(b_reduced × t + φ_b)
```

The density of points near any pixel encodes the visual "brightness" — where the curve passes most frequently.

**Implementation in GLSL:**
```glsl
float minDist = 1e10;
for (int i = 0; i < 128; i++) {
    float s = float(i) / 128.0 * TAU;
    float px = sin(ra * s + phaseA);
    float py = sin(rb * s + phaseB);
    float d = length(uv - vec2(px, py) * 0.4);
    minDist = min(minDist, d);
}
float lissajous = exp(-minDist * minDist / 0.003);
```

The number of "petals" in a closed Lissajous figure = numerator + denominator of the simplified ratio (when a/b is rational).

---

## Digital Root and Angular Symmetry

The digital root of a word value (reducing to 1-9) determines its **rotational symmetry** in the fingerprint shader:

```glsl
float dr = digitalRoot(value);   // 1-9
float angularWave = 0.5 + 0.5 * cos(dr * theta + time * 0.2);
```

A word with digital root 6 has 6-fold rotational symmetry; digital root 5 = 5-fold, etc. This connects the reduced gematria to the visual topology of the pattern.

---

## Moiré Interference

Two slightly different frequencies on a spatial grid create **moiré patterns** — large-scale interference bands that don't correspond to either individual frequency:

```glsl
float grid1 = cos(TAU * freq * dot(uv, dir1));
float grid2 = cos(TAU * (freq * 1.1) * dot(uv, dir2));
float moire = grid1 * grid2;
```

In the digital root moiré shader, 9 grids are superposed, each at frequency *d/9* for digital root *d* = 1..9. The interference creates the 9-cycle pattern visible as slowly rotating color bands.

---

## Color as Frequency

Color provides a secondary encoding channel. Three approaches used in this repository:

1. **Hue from value:** `hue = log(value) / log(max_value)` — maps the value range to a color wheel. Low values → warm red; high values → cool violet.

2. **System-specific palettes:**
   - Hebrew: gold/amber (solar, ancient)
   - Greek: silver-blue (lunar, classical)  
   - English: emerald-green (natural, modern)

3. **Interval detection:** When two values are in a specific harmonic ratio, the palette shifts to indicate the interval type — blue for octave, purple for fifth, amber for third.

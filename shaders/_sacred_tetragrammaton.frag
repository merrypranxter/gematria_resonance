// _sacred_tetragrammaton.frag
// YHWH — The Tetragrammaton as 4-Frequency Superposition
//
// The divine Name: יהוה (Yod-Heh-Vav-Heh)
// Individual letter values:
//   י (Yod)  = 10  — the seed, the point, the primordial
//   ה (Heh)  = 5   — the breath, the window, revelation
//   ו (Vav)  = 6   — the nail, the connector, the spine of creation
//   ה (Heh)  = 5   — the breath again, manifestation
//
// Sum: 10 + 5 + 6 + 5 = 26
//
// 26 = 2 × 13
//   13 = AHAVAH (אהבה, love) = ECHAD (אחד, one)
//   26 = two loves = two-in-one (echad)
//   26 = GOD in English ordinal
//
// The structure of YHWH (10,5,6,5):
//   Sum of pairs: 10+5=15=YH (short form, Yah)
//                 5+6=11=HV  
//                 6+5=11=VH
//   15+11=26, 10+16=26 — the name is self-referential
//
// Kabbalistic Expansion:
//   Yod (י) = 10 → expands to milui: יוד = 10+6+4 = 20
//   Heh (ה) = 5  → expands to: הא = 5+1 = 6
//   Vav (ו) = 6  → expands to: ואו = 6+1+6 = 13
//   Heh (ה) = 5  → expands to: הא = 5+1 = 6
//
// Visualization: 4-frequency superposition in gold.
// One radial wave per letter, phased 90° apart (quaternal structure).
// The interference of 10, 5, 6, 5 creates the "divine name field."
// Sacred geometry: the number 26 as harmonic center.

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

const float TAU = 6.28318530718;

// ─── YHWH letter values ──────────────────────────────────────────────────────
const float YOD = 10.0;  // י
const float HEH =  5.0;  // ה
const float VAV =  6.0;  // ו
// Second HEH = 5.0 again

const float YHWH_SUM = 26.0;
const float YAH = 15.0;  // first two letters = יה

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float r    = length(uv);
    float theta = atan(uv.y, uv.x);
    float t    = u_time * 0.15;

    float scale = 60.0;

    // ── Four letter waves ─────────────────────────────────────────────────
    // Each letter radiates from a slightly offset center
    // Arranged in descending order: Yod (top), then Heh, Vav, Heh
    // Like reading the name from top to bottom (Hebrew reads RTL, name read top-down)
    vec2 c1 = vec2(0.0,  0.18);   // Yod: top
    vec2 c2 = vec2(0.0,  0.06);   // Heh: upper middle
    vec2 c3 = vec2(0.0, -0.06);   // Vav: lower middle
    vec2 c4 = vec2(0.0, -0.18);   // Heh: bottom

    // Wave from each letter at its value
    float wY1 = 0.5 + 0.5 * cos(TAU * YOD / scale * length(uv - c1) - t * 1.0);
    float wH1 = 0.5 + 0.5 * cos(TAU * HEH / scale * length(uv - c2) - t * 0.9);
    float wV  = 0.5 + 0.5 * cos(TAU * VAV / scale * length(uv - c3) - t * 0.8);
    float wH2 = 0.5 + 0.5 * cos(TAU * HEH / scale * length(uv - c4) - t * 0.9);

    // ── Superposition ─────────────────────────────────────────────────────
    float field4 = (wY1 + wH1 + wV + wH2) * 0.25;

    // ── Central radial at YHWH total = 26 ────────────────────────────────
    float wYHWH = 0.5 + 0.5 * cos(TAU * YHWH_SUM / scale * r - t * 0.5);

    // ── 26-fold angular symmetry ──────────────────────────────────────────
    float ang26 = 0.5 + 0.5 * cos(26.0 * theta + t * 0.08);

    // ── Double-love structure: 26 = 2×13 ─────────────────────────────────
    float love1 = 0.5 + 0.5 * cos(TAU * 13.0 / scale * r - t);
    float love2 = 0.5 + 0.5 * cos(TAU * 13.0 / scale * r + t);  // mirror
    float doubleLove = love1 * love2;  // constructive when in phase

    // ── YAH (first two letters = 15) ─────────────────────────────────────
    float wYAH = 0.5 + 0.5 * cos(TAU * YAH / scale * r - t * 1.2);

    // ── Composite ─────────────────────────────────────────────────────────
    float field = field4     * 0.35
                + wYHWH      * 0.20
                + ang26      * 0.10
                + doubleLove * 0.20
                + wYAH       * 0.15;

    // ── Color: deep gold palette ───────────────────────────────────────────
    float envelope = exp(-r * r / 0.45);

    // Gold hue: 0.10-0.14 range, shifting slightly
    float hue = 0.11 + 0.03 * sin(field * TAU + t * 0.2);
    float sat = 0.9 - r * 0.2;
    float val = field * envelope * 1.6;

    vec3 col = hsv2rgb(vec3(hue, sat, clamp(val, 0.0, 1.0)));

    // ── Letter position glows ─────────────────────────────────────────────
    // Yod = brightest (10 = the seed)
    col += vec3(1.0, 0.95, 0.5) * exp(-length(uv - c1) / 0.03) * 0.8;
    // Two Hehs: breath
    col += vec3(1.0, 0.8, 0.3)  * exp(-length(uv - c2) / 0.02) * 0.5;
    col += vec3(1.0, 0.8, 0.3)  * exp(-length(uv - c4) / 0.02) * 0.5;
    // Vav: the connector
    col += vec3(0.9, 0.7, 1.0)  * exp(-length(uv - c3) / 0.02) * 0.4;

    // ── 26 harmonic rings ─────────────────────────────────────────────────
    for (int i = 1; i <= 4; i++) {
        float ringR = float(i) * YHWH_SUM / scale / TAU * 0.5;
        float ring  = exp(-pow(r - ringR, 2.0) / 0.0002);
        col += vec3(1.0, 0.9, 0.4) * ring * 0.4;
    }

    col *= 1.0 - smoothstep(0.55, 0.95, r);
    col = clamp(col, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
}

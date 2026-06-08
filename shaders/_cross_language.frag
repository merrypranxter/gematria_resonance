// _cross_language.frag
// Cross-Language Gematria — Same Concept, Three Traditions
//
// LOVE in three sacred languages, three gematria systems:
//
//   Hebrew: AHAVAH (אהבה)
//     Mispar Hechrechi: א(1)+ה(5)+ב(2)+ה(5) = 13
//     13 is also the value of ECHAD (אחד, "one") — LOVE = UNITY
//     Note: LOVE(13) + LOVE(13) = 26 = YHWH. Two loves = divine name.
//
//   Greek: AGAPE (αγαπη)
//     Greek isopsephy: α(1)+γ(3)+α(1)+π(80)+η(8) = 93
//     AGAPE = 93. The word used in "God is love" (1 John 4:8).
//     93 = 3 × 31. 31 = EL (אל, God in Hebrew). 93 = 3 × God.
//
//   English: LOVE (L-O-V-E)
//     Ordinal: L(12)+O(15)+V(22)+E(5) = 54
//     54 = 2 × 27 = 2 × 3³ = 6 × 9
//     LOVE = 54 is palindromic (ordinal = reverse ordinal = 54!)
//
// Three radial fields in three colors:
//   AHAVAH=13  → GOLD    (Hebrew, ancient)
//   AGAPE=93   → SILVER  (Greek, classical)
//   LOVE=54    → EMERALD (English, modern)
//
// Their interference creates the composite "LOVE field" — where
// all three traditions agree, the field brightens to white.

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

const float TAU = 6.28318530718;

// ─── Values ──────────────────────────────────────────────────────────────────
const float AHAVAH = 13.0;   // Hebrew: אהבה
const float AGAPE  = 93.0;   // Greek:  αγαπη
const float LOVE   = 54.0;   // English: LOVE

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Radial frequency field: harmonic series from a center point
float radialField(vec2 uv, vec2 center, float value, float t, float speed) {
    float d = length(uv - center);
    float freq = value / 100.0;
    float field = 0.0;
    for (int n = 1; n <= 6; n++) {
        float fn = freq / float(n);
        float amp = 1.0 / float(n);
        field += amp * (0.5 + 0.5 * cos(TAU * fn * d - t * speed + float(n) * 0.5));
    }
    return field / 2.45;  // normalize (sum of 1/n for n=1..6)
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float r    = length(uv);
    float theta = atan(uv.y, uv.x);
    float t    = u_time * 0.25;

    // ── Three field centers (slightly offset, like three traditions) ───────
    // Hebrew center: slightly left
    vec2 centerHeb = vec2(-0.05, 0.03);
    // Greek center: slightly right
    vec2 centerGrk = vec2(0.05, -0.03);
    // English center: at origin
    vec2 centerEng = vec2(0.0, 0.0);

    // ── Individual language fields ────────────────────────────────────────
    float fHeb = radialField(uv, centerHeb, AHAVAH, t, 1.1);
    float fGrk = radialField(uv, centerGrk, AGAPE,  t, 0.9);
    float fEng = radialField(uv, centerEng, LOVE,   t, 1.0);

    // ── Language signature colors ─────────────────────────────────────────
    // Gold: Hebrew (ancient, warm, solar)
    vec3 colorHeb = vec3(1.00, 0.82, 0.20) * fHeb;
    // Silver-blue: Greek (classical, cool, lunar)
    vec3 colorGrk = vec3(0.75, 0.85, 1.00) * fGrk;
    // Emerald: English (modern, natural, earth)
    vec3 colorEng = vec3(0.20, 0.90, 0.45) * fEng;

    // ── AHAVAH×2 = YHWH: special resonance at 26 ─────────────────────────
    // When two love-fields (AHAVAH=13) overlap, they sum to 26=YHWH
    // Show this as a golden halo where the Hebrew field is doubly strong
    float doubleAhavah = 0.5 + 0.5 * cos(TAU * (2.0 * AHAVAH) / 100.0 * r - t);
    vec3 yhwhGlow = vec3(1.0, 0.9, 0.5) * doubleAhavah * 0.15;

    // ── Cross-tradition unity: where all three agree ───────────────────────
    // Bright white where all three fields are simultaneously high
    float unity = fHeb * fGrk * fEng;
    vec3 unityGlow = vec3(1.0, 1.0, 1.0) * unity * 2.0;

    // ── Angular differentiation ────────────────────────────────────────────
    // Hebrew (gold) dominates top third
    // Greek (silver) dominates right third
    // English (emerald) dominates left/bottom
    float hebrewSector  = smoothstep(0.2, 0.7, 0.5 + 0.5 * sin(theta + 1.57));
    float greekSector   = smoothstep(0.2, 0.7, 0.5 + 0.5 * sin(theta - 1.05));
    float englishSector = smoothstep(0.2, 0.7, 0.5 + 0.5 * sin(theta + 3.66));

    colorHeb *= 1.0 + hebrewSector * 0.5;
    colorGrk *= 1.0 + greekSector  * 0.5;
    colorEng *= 1.0 + englishSector * 0.5;

    // ── Composite ─────────────────────────────────────────────────────────
    vec3 col = colorHeb + colorGrk + colorEng + yhwhGlow + unityGlow;

    float envelope = exp(-r * r / 0.55) + 0.05;
    col *= envelope * 0.9;
    col = clamp(col, 0.0, 1.0);

    // ── Overlay: faint concentric rings at each value ─────────────────────
    float ringsHeb = 0.5 + 0.5 * cos(TAU * AHAVAH / 80.0 * r - t);
    float ringsGrk = 0.5 + 0.5 * cos(TAU * AGAPE  / 80.0 * r - t * 0.9);
    float ringsEng = 0.5 + 0.5 * cos(TAU * LOVE   / 80.0 * r - t * 1.1);

    col += vec3(0.3, 0.2, 0.0) * ringsHeb * 0.08 * envelope;
    col += vec3(0.1, 0.2, 0.4) * ringsGrk * 0.08 * envelope;
    col += vec3(0.0, 0.3, 0.1) * ringsEng * 0.08 * envelope;

    col *= 1.0 - smoothstep(0.55, 0.95, r);
    col = clamp(col, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
}

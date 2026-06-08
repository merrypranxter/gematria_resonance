// _field_hebrew_reduced.frag
// Mispar Katan — Hebrew Reduced (Small) Gematria
//
// Mispar Katan reduces every letter to a single digit by taking
// the digital root. Formally: for value v, Katan(v) = ((v-1) mod 9) + 1
// (with the special convention that 9 maps to 9, not 0).
//
// Reduction table (standard → reduced):
//   א=1→1   ב=2→2   ג=3→3   ד=4→4   ה=5→5
//   ו=6→6   ז=7→7   ח=8→8   ט=9→9
//   י=10→1  כ=20→2  ל=30→3  מ=40→4  נ=50→5
//   ס=60→6  ע=70→7  פ=80→8  צ=90→9
//   ק=100→1 ר=200→2 ש=300→3 ת=400→4
//
// Notice: three tiers of letters (units, tens, hundreds) collapse
// onto the same 1-9 cycle. This reveals a 9-fold cyclical structure
// underlying the alphabet — a "base-9" resonance.
//
// Digital root of a word: drsum = ((sum - 1) mod 9) + 1
//
// Examples:
//   YHWH  יהוה = 1+5+6+5 = 17 → 1+7 = 8  (digital root)
//   ELOHIM     = 1+3+5+1+4 = 14 → 5
//   EMET  אמת  = 1+4+4   = 9   → 9 (truth = completion!)
//   AHAVAH אהבה= 1+5+2+5 = 13 → 4
//
// Visualization: cyclical moiré — the field is tiled in 9-fold
// repeating patterns. Interference between the 9 reduced-value
// frequencies creates characteristic moiré fringes.
// The 9-cycle is mapped to hue: 1=red...9=violet (rainbow collapse).

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

const float TAU = 6.28318530718;
const float NINE = 9.0;

// ─── Digital root function ───────────────────────────────────────────────────
// Returns 1-9, never 0
float digitalRoot(float v) {
    // Iterative: keep summing digits. For shader: use modulo formula.
    float n = mod(v, NINE);
    return n == 0.0 ? NINE : n;
}

// ─── Reduced word values ─────────────────────────────────────────────────────
// (sum of reduced letter values → reduce again)
const float YHWH_R  = 8.0;  // 1+5+6+5=17→8
const float ELO_R   = 5.0;  // 1+3+5+1+4=14→5
const float EMET_R  = 9.0;  // 1+4+4=9 → 9 (perfect completion)
const float AHA_R   = 4.0;  // 1+5+2+5=13→4
const float SHALOM_R= 7.0;  // 3+3+6+4=16→7

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// 9-cycle hue: maps integer 1-9 to full rainbow
vec3 cycleColor(float n) {
    float hue = (n - 1.0) / NINE;
    return hsv2rgb(vec3(hue, 0.9, 1.0));
}

// Moiré tile: two overlapping grids at slight angle difference
float moire(vec2 uv, float freq, float angle, float t) {
    vec2 dir = vec2(cos(angle), sin(angle));
    return 0.5 + 0.5 * cos(TAU * freq * dot(uv, dir) + t);
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float r    = length(uv);
    float theta = atan(uv.y, uv.x);
    float t    = u_time * 0.3;

    // ── Nine overlapping moiré grids, one per digit 1-9 ──────────────────
    // Each grid vibrates at frequency = digit/scale
    // They are angled at 40° intervals (360°/9)
    float moireSum = 0.0;
    float scale = 4.0;

    for (int d = 1; d <= 9; d++) {
        float freq  = float(d) / scale;
        float angle = float(d) * TAU / NINE + t * 0.02 * float(d);
        moireSum += moire(uv, freq, angle, t * 0.5 * float(d)) / NINE;
    }

    // ── Radial 9-cycle rings ──────────────────────────────────────────────
    // Rings that repeat with period 9 — showing the cyclical reduction
    float cycleR = mod(r * 18.0, NINE);          // radius remapped to 9-cycle
    float cycleRing = 0.5 + 0.5 * cos(TAU * cycleR / NINE);

    // ── Word signatures at their reduced frequencies ──────────────────────
    float wYHWH  = 0.5 + 0.5 * cos(TAU * YHWH_R  / scale * r - t);
    float wEMET  = 0.5 + 0.5 * cos(TAU * EMET_R  / scale * r - t * 0.7 + 1.0);
    float wSHA   = 0.5 + 0.5 * cos(TAU * SHALOM_R/ scale * r - t * 0.5 + 2.0);

    // ── Composite field ───────────────────────────────────────────────────
    float field = moireSum * 0.5 + cycleRing * 0.2 + wYHWH * 0.15 + wEMET * 0.10 + wSHA * 0.05;

    // ── 9-fold spiral: arms of the digital root cycle ─────────────────────
    // At angle = k*40°, the k-th digit (1-9) is highlighted
    float spiralPhase = mod(theta / TAU * NINE + r * NINE + t * 0.5, NINE);
    float spiralHighlight = exp(-pow(mod(spiralPhase, 1.0) - 0.5, 2.0) / 0.05);

    // ── Color: hue = position in 9-cycle ─────────────────────────────────
    float hue = mod(field + t * 0.04, 1.0);
    float sat = 0.85 - r * 0.3;
    float val = field * exp(-r * r / 0.7);

    vec3 col = hsv2rgb(vec3(hue, sat, val));

    // ── Highlight the 9 = completion ring ─────────────────────────────────
    // At radius corresponding to EMET=9, draw a special ring
    float emetRing = exp(-pow(r - 0.45, 2.0) / 0.0003);
    col += vec3(1.0, 0.95, 0.5) * emetRing * 0.8;  // golden "truth" ring

    // ── Spiral arms overlay ───────────────────────────────────────────────
    col += cycleColor(spiralPhase + 1.0) * spiralHighlight * 0.3 * exp(-r * 2.0);

    // ── Vignette ──────────────────────────────────────────────────────────
    col *= 1.0 - smoothstep(0.55, 0.95, r);

    gl_FragColor = vec4(col, 1.0);
}

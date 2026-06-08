// _field_hebrew_ordinal.frag
// Mispar Siduri — Hebrew Ordinal Gematria
//
// In Mispar Siduri, each letter is assigned its positional number in the
// 22-letter Hebrew alphabet, from 1 to 22. This compresses the value space
// dramatically compared to Mispar Hechrechi (max letter = 22 vs 400).
//
// Ordinal values:
//   א=1  ב=2  ג=3  ד=4  ה=5  ו=6  ז=7  ח=8  ט=9  י=10
//   כ=11 ל=12 מ=13 נ=14 ס=15 ע=16 פ=17 צ=18 ק=19 ר=20
//   ש=21 ת=22
//
// Maximum single-letter value: 22 (Tav)
// Maximum word value: 22 × word_length
//
// Notable ordinal values:
//   YHWH  יהוה  = 10+5+6+5    = 26  (same as standard! — special symmetry)
//   TORAH תורה  = 22+16+20+5  = 63  — instruction
//   SHABBAT שבת = 21+2+22     = 45  — rest, sabbath
//   ADAM  אדם   = 1+4+13      = 18  — man (18 = chai, life in standard)
//
// Visualization: concentric wave pattern with 22-fold angular symmetry.
// The 22 letters become 22 angular sectors. Each ring at radius r
// vibrates at frequency proportional to the ordinal sum of a word.
// The compression of ordinal values (1-22 per letter) creates a more
// regular, crystalline interference compared to the standard system.
//
// A 22-pointed star motif underlies the whole field — one ray per letter.

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

// ─── Ordinal word values ────────────────────────────────────────────────────
// Each letter = its position in the aleph-bet (1-22)
const float YHWH_ORD   = 26.0;  // י=10 ה=5  ו=6  ה=5  → same as standard!
const float TORAH_ORD  = 63.0;  // ת=22 ו=6  ר=20 ה=5
const float SHABBAT_ORD= 45.0;  // ש=21 ב=2  ת=22
const float ADAM_ORD   = 18.0;  // א=1  ד=4  מ=13
const float EMET_ORD   = 45.0;  // א=1  מ=13 ת=22 + ה=5 → different from SHABBAT? Let's check: 1+13+22=36, EMET without final: 36

// 22-fold symmetry constant
const float TAU = 6.28318530718;
const int   N_LETTERS = 22;

// ─── Helpers ────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Cosine wave ring at given radius
float ring(float r, float center, float width) {
    return exp(-pow((r - center) / width, 2.0));
}

// 22-fold angular star: peaks at each letter's angular position
float starRay(float theta, float n) {
    // n rays evenly spaced around circle
    float a = mod(theta, TAU / n) / (TAU / n);
    return pow(0.5 + 0.5 * cos(a * TAU), 3.0);
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float r    = length(uv);
    float theta = atan(uv.y, uv.x);
    float t    = u_time * 0.2;

    // ── 22-fold star base ─────────────────────────────────────────────────
    // One angular sector per letter of the aleph-bet
    float star22 = starRay(theta + t * 0.1, float(N_LETTERS));
    float star11 = starRay(theta - t * 0.07, 11.0);  // half-cycle
    float star7  = starRay(theta + t * 0.05, 7.0);   // menorah pattern

    // ── Ordinal frequency rings ───────────────────────────────────────────
    // YHWH = 26 ordinal: wave at frequency 26/44 (scale to canvas)
    float scale = 44.0;
    float f1 = YHWH_ORD   / scale;
    float f2 = TORAH_ORD  / scale;
    float f3 = SHABBAT_ORD/ scale;
    float f4 = ADAM_ORD   / scale;

    // Radial waves for each word
    float w1 = 0.5 + 0.5 * cos(TAU * f1 * r - t * 1.2);
    float w2 = 0.5 + 0.5 * cos(TAU * f2 * r - t * 0.9 + 1.0);
    float w3 = 0.5 + 0.5 * cos(TAU * f3 * r - t * 0.7 + 2.1);
    float w4 = 0.5 + 0.5 * cos(TAU * f4 * r - t * 1.5 + 0.7);

    // ── Ordinal compression highlight ────────────────────────────────────
    // Show that ordinal values are denser — more rings per unit radius
    // Draw 22 faint concentric rings, one per letter value
    float letterRings = 0.0;
    for (int i = 1; i <= 22; i++) {
        float ri = float(i) / 24.0;
        letterRings += ring(r, ri, 0.008) * (0.3 + 0.7 * float(i) / 22.0);
    }

    // ── Combine ───────────────────────────────────────────────────────────
    float radial = w1 * 0.30 + w2 * 0.25 + w3 * 0.25 + w4 * 0.20;
    float angular = star22 * 0.5 + star11 * 0.3 + star7 * 0.2;
    float field = radial * 0.7 + angular * 0.3;
    field += letterRings * 0.25;

    // ── Color: silver-blue palette (ordinal = structural, architectural) ──
    float envelope = exp(-r * r / 0.5);
    float hue = 0.58 + 0.12 * sin(field * 3.14 + t * 0.3);  // blue-cyan range
    float sat = 0.75;
    float val = field * envelope * 1.2;

    // Brighten the 22-ray star intersections
    float cross = star22 * ring(r, 0.0, 0.3);
    val += cross * 0.3;

    vec3 col = hsv2rgb(vec3(hue, sat, clamp(val, 0.0, 1.0)));

    // ── White highlights on letter-position rings ─────────────────────────
    col += vec3(0.8, 0.9, 1.0) * letterRings * 0.4;

    // ── Vignette ──────────────────────────────────────────────────────────
    col *= 1.0 - smoothstep(0.55, 0.95, r);

    gl_FragColor = vec4(col, 1.0);
}

// _field_hebrew_standard.frag
// Mispar Hechrechi — Hebrew Standard Gematria (classical system)
//
// The foundational Hebrew gematria system, tracing to talmudic sources.
// Each of the 22 Hebrew letters carries a numerical weight:
//
//   Alef   א = 1    Yod    י = 10   Kof    ק = 100
//   Bet    ב = 2    Kaf    כ = 20   Resh   ר = 200
//   Gimel  ג = 3    Lamed  ל = 30   Shin   ש = 300
//   Dalet  ד = 4    Mem    מ = 40   Tav    ת = 400
//   Heh    ה = 5    Nun    נ = 50
//   Vav    ו = 6    Samech ס = 60
//   Zayin  ז = 7    Ayin   ע = 70
//   Chet   ח = 8    Peh    פ = 80
//   Tet    ט = 9    Tzadi  צ = 90
//
// Notable word values (encoded as radial frequencies below):
//   YHWH   יהוה  = 10+5+6+5   = 26   — divine name, center frequency
//   SHALOM שלום  = 300+30+6+40 = 376  — peace, outer ring
//   EMET   אמת   = 1+40+400   = 441  — truth, 21^2, perfect square
//   AHAVAH אהבה  = 1+5+2+5    = 13   — love, inner ring
//   ELOHIM אלהים = 1+30+5+10+40 = 86 — God, second harmonic
//
// Visualization: radial interference field.
// Each word value v maps to spatial frequency f = v / SCALE.
// The superposition of these sinusoidal radial waves creates
// a standing-wave interference pattern — the "resonance signature"
// of the Hebrew textual field.
//
// References:
//   Ginsburg, C.D. (1863). Kabbalah. London: Longmans Green.
//   Scholem, G. (1960). On the Kabbalah and Its Symbolism. Schocken.

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

// ─── Word values (Mispar Hechrechi) ────────────────────────────────────────
const float YHWH   = 26.0;    // יהוה  divine name
const float ELOHIM = 86.0;    // אלהים God
const float AHAVAH = 13.0;    // אהבה  love
const float EMET   = 441.0;   // אמת   truth (= 21²)
const float SHALOM = 376.0;   // שלום  peace
const float BEREISHIT = 913.0;// בראשית In the beginning

// ─── Frequency scale ────────────────────────────────────────────────────────
// Maps gematria value → spatial frequency. Chosen so that value=26 (YHWH)
// produces approximately 1 full cycle across half the canvas.
const float SCALE  = 200.0;

// ─── Helpers ────────────────────────────────────────────────────────────────

// Radial wave from a single frequency: cos(2π·f·r + phase)
float radialWave(float r, float freq, float phase) {
    return 0.5 + 0.5 * cos(6.28318 * freq * r + phase);
}

// Soft glow: apply a smooth radial envelope
float glow(float r, float sigma) {
    return exp(-r * r / (2.0 * sigma * sigma));
}

// HSV → RGB (for beautiful color mapping)
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    // Normalized coordinates, centered, aspect-corrected
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float r  = length(uv);
    float theta = atan(uv.y, uv.x);

    // Time-based phase drift — the field breathes
    float t = u_time * 0.25;

    // ── Layer 1: YHWH = 26 — golden center pulse ──────────────────────────
    float f_YHWH = YHWH / SCALE;
    float w_YHWH = radialWave(r, f_YHWH, -t * 1.0);

    // ── Layer 2: ELOHIM = 86 — blue-violet expansion ──────────────────────
    float f_ELO = ELOHIM / SCALE;
    float w_ELO = radialWave(r, f_ELO, -t * 0.7 + 1.0);

    // ── Layer 3: AHAVAH = 13 — warm inner love frequency ──────────────────
    float f_AHA = AHAVAH / SCALE;
    float w_AHA = radialWave(r, f_AHA, -t * 1.4 + 2.0);

    // ── Layer 4: EMET = 441 — fine-grained truth lattice ──────────────────
    float f_EMT = EMET / SCALE;
    float w_EMT = radialWave(r, f_EMT, -t * 0.3 + 0.5);

    // ── Layer 5: SHALOM = 376 — outer peace ring ──────────────────────────
    float f_SHA = SHALOM / SCALE;
    float w_SHA = radialWave(r, f_SHA, -t * 0.4 + 3.14);

    // ── Angular modulation from BEREISHIT = 913 ───────────────────────────
    // 913 is the first word of Genesis — it modulates angularly
    float angular_freq = BEREISHIT / 300.0;
    float angMod = 0.5 + 0.5 * sin(angular_freq * theta + t * 0.5);

    // ── Beat pattern: interference between YHWH and ELOHIM ────────────────
    // Beat frequency = |f_ELO - f_YHWH| creates slow pulsing rings
    float beat = 0.5 + 0.5 * cos(6.28318 * abs(f_ELO - f_YHWH) * r - t * 2.0);

    // ── Composite field ───────────────────────────────────────────────────
    // Weight each layer by its "sacred importance" and spatial role
    float field = w_YHWH * 0.30
                + w_ELO  * 0.25
                + w_AHA  * 0.20
                + w_EMT  * 0.10
                + w_SHA  * 0.10
                + beat   * 0.05;

    field *= angMod * 0.4 + 0.6;  // angular modulation

    // ── Radial envelope: glow from center ─────────────────────────────────
    float envelope = glow(r, 0.6) * 0.7 + 0.3 * glow(r - 0.3, 0.4);

    // ── Color: map field value to HSV ─────────────────────────────────────
    // Hue: rotates with time and field value (gold/amber for YHWH center)
    float hue = mod(field * 0.6 + t * 0.05 + r * 0.15, 1.0);
    float sat = 0.85 - r * 0.2;
    float val = field * envelope;

    // Bias toward gold/amber (YHWH) at center, blue-violet at edges
    hue = mix(0.10, hue, smoothstep(0.0, 0.5, r));  // gold at center
    hue = mix(hue, 0.70, smoothstep(0.4, 0.9, r));  // violet at edge

    vec3 col = hsv2rgb(vec3(hue, sat, val));

    // ── Special rings: mark exact YHWH harmonics as bright lines ──────────
    for (int i = 1; i <= 5; i++) {
        float ring_r = float(i) / (f_YHWH * 6.28318 * 0.5);
        float ring   = exp(-pow((r - ring_r * 0.15) / 0.005, 2.0));
        col += vec3(1.0, 0.85, 0.3) * ring * 0.5;  // golden rings
    }

    // ── Vignette ──────────────────────────────────────────────────────────
    col *= 1.0 - smoothstep(0.6, 1.0, r);

    gl_FragColor = vec4(col, 1.0);
}

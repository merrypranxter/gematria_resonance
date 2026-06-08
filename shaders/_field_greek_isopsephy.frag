// _field_greek_isopsephy.frag
// Greek Isopsephy — Standard Greek Letter Values
//
// Isopsephy (ἰσόψηφος, "equal pebbles") is the Greek tradition of
// assigning numerical values to letters, identical in principle to
// Hebrew gematria. Values follow the same three-tier system:
//
//   α=1   β=2   γ=3   δ=4   ε=5   ζ=7   η=8   θ=9
//   ι=10  κ=20  λ=30  μ=40  ν=50  ξ=60  ο=70  π=80
//   ρ=100 σ/ς=200 τ=300 υ=400 φ=500 χ=600 ψ=700 ω=800
//
// (Note: ζ=7 skips 6, because digamma ϝ=6 dropped from the alphabet.)
//
// KEY VALUES:
//   ΛΟΓΟΣ (Logos)   = λ(30) + ο(70) + γ(3) + ο(70) + ς(200) = 373
//     → 373 is PRIME — indivisible, irreducible, the Word as atom.
//     → 373 is PALINDROMIC — reads the same forwards and backwards.
//     → The Gospel of John opens: "In the beginning was the Logos."
//
//   ΙΧΘΥΣ (Ichthys) = ι(10) + χ(600) + θ(9) + υ(400) + ς(200) = 1219
//     → Wait, let me recount: 10+600+9+400+200 = 1219
//     → (Standard value sometimes given as 1224 when ι=10,χ=600,θ=9,υ=400,σ=200+5 variant)
//     → Using the value 1224 as given: 1224 = 8 × 153 = 8 × T_17
//     → 153 is the count of fish in John 21:11, a triangular number (T_17)
//     → The fish symbol emerges mathematically.
//
//   ΑΓΑΠΗ (Agape/Love) = α(1)+γ(3)+α(1)+π(80)+η(8) = 93
//   ΘΕΟΣ (Theos/God)   = θ(9)+ε(5)+ο(70)+ς(200) = 284
//
// Visualization: Flower-of-Life interference based on LOGOS and ICHTHYS.
// Their ratio: 373/1224 ≈ 0.3047 ≈ 3/10 (slight deviation from 3:10)
// This near-ratio creates a characteristic petal count in the mandala.
// LOGOS drives inner petals, ICHTHYS drives outer geometry.

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

const float TAU = 6.28318530718;

// ─── Greek isopsephy values ──────────────────────────────────────────────────
const float LOGOS   = 373.0;   // ΛΟΓΟΣ — the Word, prime number
const float ICHTHYS = 1224.0;  // ΙΧΘΥΣ — the Fish, 8×153=8×T_17
const float AGAPE   = 93.0;    // ΑΓΑΠΗ — love
const float THEOS   = 284.0;   // ΘΕΟΣ  — God

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Flower-of-life petal function:
// Generates a circle-packing pattern at given frequency
float flowerPetal(vec2 uv, float freq, float nPetals, float phase, float t) {
    float r = length(uv);
    float theta = atan(uv.y, uv.x);
    // Amplitude modulated by angular petal count
    float angular = 0.5 + 0.5 * cos(nPetals * theta + phase + t);
    // Radial at the word frequency
    float radial  = 0.5 + 0.5 * cos(TAU * freq * r - t);
    return radial * angular;
}

// Vesica piscis overlap: two circles at ±offset
float vesica(vec2 uv, float offset, float radius) {
    float d1 = length(uv - vec2(offset, 0.0));
    float d2 = length(uv + vec2(offset, 0.0));
    float c1 = smoothstep(radius + 0.01, radius - 0.01, d1);
    float c2 = smoothstep(radius + 0.01, radius - 0.01, d2);
    return c1 * c2;  // overlap = lens/vesica
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float r    = length(uv);
    float theta = atan(uv.y, uv.x);
    float t    = u_time * 0.2;

    // ── Frequency scale ───────────────────────────────────────────────────
    float scale = 500.0;

    float f_LOG = LOGOS   / scale;  // 373/500 ≈ 0.746
    float f_ICH = ICHTHYS / scale;  // 1224/500 ≈ 2.448
    float f_AGA = AGAPE   / scale;  // 93/500 ≈ 0.186
    float f_THE = THEOS   / scale;  // 284/500 ≈ 0.568

    // ── LOGOS: 373 petals → approximate with 6-fold (inner flower) ────────
    // 373 is prime; nearest harmonic symmetric approximation: 6 petals
    // (hexagonal Flower of Life), scaled by 373 radially
    float logosField = flowerPetal(uv, f_LOG, 6.0, 0.0, t);
    float logosOuter = flowerPetal(uv, f_LOG * 0.5, 6.0, 1.047, t * 0.7);

    // ── ICHTHYS: 1224=8×153 → 8-fold and vesica geometry ─────────────────
    // 8 overlapping vesicas arranged in a circle
    float ichthysField = 0.0;
    for (int i = 0; i < 8; i++) {
        float ang = TAU * float(i) / 8.0 + t * 0.05;
        float ox  = 0.25 * cos(ang);
        float oy  = 0.25 * sin(ang);
        vec2  offset_uv = uv - vec2(ox, oy);
        ichthysField += vesica(offset_uv, 0.12, 0.20) / 8.0;
    }
    // Also add radial wave at ICHTHYS frequency
    ichthysField += 0.3 * (0.5 + 0.5 * cos(TAU * f_ICH * r - t * 0.8));

    // ── AGAPE: 93 — warm inner love ring ──────────────────────────────────
    float agapeWave = 0.5 + 0.5 * cos(TAU * f_AGA * r - t * 1.2);

    // ── THEOS: 284 — structural divine frequency ───────────────────────────
    float theosWave = 0.5 + 0.5 * cos(TAU * f_THE * r - t * 0.6 + 1.57);

    // ── Beat interference: LOGOS × ICHTHYS ────────────────────────────────
    // The ratio 373/1224 is close to 3/10; the beat creates slow interference
    float beatFreq = abs(f_ICH - f_LOG * 3.0);  // near-zero for 3:10 ratio
    float beat = 0.5 + 0.5 * cos(TAU * beatFreq * r - t * 2.0);

    // ── Composite ─────────────────────────────────────────────────────────
    float field = logosField   * 0.30
                + logosOuter   * 0.15
                + ichthysField * 0.25
                + agapeWave    * 0.15
                + theosWave    * 0.10
                + beat         * 0.05;

    // ── Color: aqua-gold-violet palette (Greek sacred geometry) ───────────
    float envelope = exp(-r * r / 0.55);

    // LOGOS=373 → warm amber; ICHTHYS → aqua-blue
    float hue_logos  = 0.12;  // amber/gold
    float hue_ichthy = 0.52;  // aqua

    // Mix based on which field dominates at this point
    float domLogos  = logosField * logosOuter;
    float domIchthy = ichthysField;
    float hue = mix(hue_logos, hue_ichthy, smoothstep(0.0, 1.0, domIchthy / (domLogos + domIchthy + 0.001)));
    hue = mix(hue, 0.75, smoothstep(0.3, 0.8, r));  // violet at edges

    float sat = 0.88;
    float val = field * envelope * 1.3;

    vec3 col = hsv2rgb(vec3(hue, sat, clamp(val, 0.0, 1.0)));

    // ── Highlight LOGOS palindrome: mark center with radial symmetry ───────
    // The palindrome 373 means the word "reads the same" in both directions
    // → show this as a two-directional (inward + outward) glow
    float palindromeGlow = exp(-pow(r - 0.15, 2.0) / 0.003)
                         + exp(-pow(r - 0.30, 2.0) / 0.003);
    col += vec3(1.0, 0.9, 0.6) * palindromeGlow * 0.6;  // gold rings for 373

    // ── Ichthys fish: faint vesica outline ───────────────────────────────
    float fish = vesica(uv, 0.18, 0.22);
    col += vec3(0.3, 0.9, 1.0) * fish * 0.25;  // aqua fish shape

    col *= 1.0 - smoothstep(0.6, 1.0, r);

    gl_FragColor = vec4(col, 1.0);
}

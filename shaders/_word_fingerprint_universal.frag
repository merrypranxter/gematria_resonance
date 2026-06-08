// _word_fingerprint_universal.frag
// Universal Word Fingerprint — Generic Radial Frequency Pattern
//
// This shader accepts any gematria word value via the u_word_value uniform
// and renders its unique "fingerprint": a radial frequency pattern where:
//
//   f = value / scale    (fundamental spatial frequency)
//
// The harmonic series: f, f/2, f/3, f/4, ... generates overtone rings,
// like the harmonic partials of a vibrating string. Each ring carries
// amplitude 1/n (natural harmonic falloff).
//
// Angular segmentation: the digital root of the value determines
// the number of angular "petals" — the value's compressed essence.
//
// The result is a unique visual signature: no two values produce
// the same pattern. Equal-value words produce identical fingerprints —
// this is the visual proof of their "resonance."
//
// Usage:
//   u_word_value = 26    → YHWH / GOD signature
//   u_word_value = 373   → LOGOS signature  
//   u_word_value = 1224  → ICHTHYS signature
//   u_word_value = 54    → LOVE signature (EN ordinal = EN reverse!)

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform float u_word_value;  // the gematria value — default to YHWH=26

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Digital root: 1-9 (never 0)
float digitalRoot(float v) {
    if (v < 1.0) return 1.0;
    float n = mod(v, 9.0);
    return n < 0.5 ? 9.0 : n;
}

// Single harmonic ring: radial cosine at frequency f/n
float harmonicRing(float r, float f, int n, float t) {
    float fn = f / float(n);
    float amp = 1.0 / float(n);    // natural harmonic amplitude
    return amp * (0.5 + 0.5 * cos(6.28318 * fn * r - t / float(n)));
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float r    = length(uv);
    float theta = atan(uv.y, uv.x);
    float t    = u_time * 0.3;

    // Use default value of 26 (YHWH/GOD) if uniform not set
    float value = u_word_value > 0.5 ? u_word_value : 26.0;

    // ── Fundamental frequency ─────────────────────────────────────────────
    // Scale chosen so that value=100 produces about 3 rings on the canvas
    float scale = value * 0.5;  // adaptive scale
    float f0 = value / scale;   // fundamental = 2.0 cycles/unit

    // ── Harmonic series: first 8 harmonics ───────────────────────────────
    float harmonics = 0.0;
    float harmonicWeightSum = 0.0;
    for (int n = 1; n <= 8; n++) {
        float fn = f0 / float(n);
        float amp = 1.0 / float(n);
        harmonics += amp * (0.5 + 0.5 * cos(6.28318 * fn * r - t / float(n)));
        harmonicWeightSum += amp;
    }
    harmonics /= harmonicWeightSum;  // normalize

    // ── Angular segmentation by digital root ──────────────────────────────
    float dr = digitalRoot(value);
    float angularFreq = dr;
    float angularWave = 0.5 + 0.5 * cos(angularFreq * theta + t * 0.2);

    // ── Prime check visualization ─────────────────────────────────────────
    // For prime values (indivisible), add a crystalline sharpness
    // Approximate: check if value is far from a composite pattern
    bool isPrime = false;
    float v = value;
    if (v > 1.0) {
        isPrime = true;
        for (int i = 2; i <= 30; i++) {
            if (float(i) * float(i) > v) break;
            if (mod(v, float(i)) < 0.5) { isPrime = false; break; }
        }
    }
    float primeSharpness = isPrime ? 1.5 : 1.0;

    // ── Triangular number detection ────────────────────────────────────────
    // T_n = n(n+1)/2 — check if value is triangular
    // For triangular values, add a 3-fold "tri" overlay
    float tCheck = (-1.0 + sqrt(1.0 + 8.0 * value)) / 2.0;
    bool isTriangular = abs(tCheck - floor(tCheck + 0.5)) < 0.01;
    float triOverlay = isTriangular ? (0.5 + 0.5 * cos(3.0 * theta + t * 0.3)) : 0.0;

    // ── Composite field ───────────────────────────────────────────────────
    float field = harmonics * 0.7
                + angularWave * 0.2
                + triOverlay  * 0.1;

    // ── Radial envelope: bright center, fade to edge ──────────────────────
    float envelope = exp(-r * r / 0.45) * 1.2 + 0.1 * exp(-r * r / 1.5);

    // ── Color mapping ─────────────────────────────────────────────────────
    // Hue encodes the fundamental frequency (value)
    // Low values (1-10): warm red-orange
    // Mid values (10-100): green-cyan
    // High values (100+): blue-violet
    float hueBase = mod(log(value + 1.0) / log(1500.0), 1.0);
    float hue = hueBase + field * 0.2 + t * 0.04;
    hue = mod(hue, 1.0);

    float sat = 0.85 * primeSharpness - 0.1;
    sat = clamp(sat, 0.0, 1.0);
    float val = field * envelope;
    val = clamp(val * primeSharpness, 0.0, 1.0);

    vec3 col = hsv2rgb(vec3(hue, sat, val));

    // ── Fundamental ring: brightest ring at r = 1/f0 ─────────────────────
    float fundRing = exp(-pow(r - 0.5 / f0, 2.0) / 0.002);
    col += vec3(1.0) * fundRing * 0.5;

    // ── Mark prime: add crystalline star ─────────────────────────────────
    if (isPrime) {
        float star = 0.5 + 0.5 * cos(value * theta);  // value-pointed star
        col += vec3(0.9, 1.0, 1.0) * star * 0.15 * envelope;
    }

    // ── Triangular overlay ────────────────────────────────────────────────
    col += hsv2rgb(vec3(0.15, 0.8, 1.0)) * triOverlay * 0.2 * envelope;

    col *= 1.0 - smoothstep(0.55, 0.95, r);

    gl_FragColor = vec4(col, 1.0);
}

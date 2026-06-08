// _ratio_mandala.frag
// Harmonic Ratio Mandala — Two Words as Interval Geometry
//
// Two words as two frequencies, their ratio determining the geometry:
//   ratio = value_a / value_b
//
// Musical interval analogy (frequency ratios → visual geometry):
//   Unison      1:1  → circular rings (no variation)
//   Octave      2:1  → doubling rings, 2-fold radial
//   Fifth       3:2  → trefoil-like, 3 vs 2 interference
//   Fourth      4:3  → 4 vs 3 interference, cross-hatching
//   Major Third 5:4  → 5 vs 4 pattern, 5-fold petals
//   Minor Third 6:5  → 6 vs 5 pattern, complex rosette
//
// Default values:
//   a = LOGOS  (Greek Λογος)  = 373  — the Word, prime
//   b = ICHTHYS (Greek Ιχθυς) = 1224 — the Fish, 8×T_17
//
// Ratio: 373/1224 ≈ 0.3047 ≈ 3/10 approximately
// This near 3:10 ratio produces a 3-petal vs 10-petal interference pattern.
//
// The Lissajous figure is drawn parametrically:
//   x(s) = sin(a_scaled * s + phase_a)
//   y(s) = sin(b_scaled * s + phase_b)
// Density field: distance from any pixel to the nearest curve point.
//
// Interval detection: if ratio ≈ known interval, color changes:
//   Octave  → deep blue
//   Fifth   → rich purple
//   Third   → warm amber
//   Other   → gradient from value pair

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform float u_value_a;  // default: LOGOS = 373
uniform float u_value_b;  // default: ICHTHYS = 1224

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Check if x is close to target ratio (within tolerance)
float nearRatio(float x, float num, float den, float tol) {
    return smoothstep(tol, 0.0, abs(x - num / den));
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float r    = length(uv);
    float theta = atan(uv.y, uv.x);
    float t    = u_time * 0.15;

    // Default values
    float va = u_value_a > 0.5 ? u_value_a : 373.0;   // LOGOS
    float vb = u_value_b > 0.5 ? u_value_b : 1224.0;  // ICHTHYS

    // ── Ratio analysis ────────────────────────────────────────────────────
    float ratio = va / vb;
    float ratioInv = vb / va;
    float useRatio = ratio < 1.0 ? ratio : 1.0 / ratioInv;

    // Detect interval type
    float isOctave = nearRatio(ratio, 2.0, 1.0, 0.05)
                   + nearRatio(ratio, 1.0, 2.0, 0.05);
    float isFifth  = nearRatio(ratio, 3.0, 2.0, 0.05)
                   + nearRatio(ratio, 2.0, 3.0, 0.05);
    float isFourth = nearRatio(ratio, 4.0, 3.0, 0.05)
                   + nearRatio(ratio, 3.0, 4.0, 0.05);
    float isMajThd = nearRatio(ratio, 5.0, 4.0, 0.05)
                   + nearRatio(ratio, 4.0, 5.0, 0.05);
    float isMinThd = nearRatio(ratio, 6.0, 5.0, 0.05)
                   + nearRatio(ratio, 5.0, 6.0, 0.05);

    // ── Lissajous density field ───────────────────────────────────────────
    // Reduce frequencies to manageable integers for visualization
    float scaleFreq = 200.0;
    float fa = va / scaleFreq;
    float fb = vb / scaleFreq;

    // Simplify ratio: find GCD-like reduction for visualization
    // Use reduced ratio (ra:rb where ra,rb small integers approximation)
    // Approximate by rounding to nearest simple ratio
    float ra = va / min(va, vb);  // normalize
    float rb = vb / min(va, vb);

    // Use small integer approximation of ratio for Lissajous
    float ra_int = round(ra * 6.0) / 6.0 * 6.0;
    float rb_int = round(rb * 6.0) / 6.0 * 6.0;
    ra_int = clamp(ra_int, 1.0, 10.0);
    rb_int = clamp(rb_int, 1.0, 10.0);

    // Lissajous density: sample parametric curve
    float minDist = 1e10;
    for (int i = 0; i < 128; i++) {
        float s = float(i) / 128.0 * 6.28318;
        float px = sin(ra_int * s + t);
        float py = sin(rb_int * s + t * 0.7 + 1.57);
        vec2 pt = vec2(px, py) * 0.4;
        float d = length(uv - pt);
        minDist = min(minDist, d);
    }
    float lissajous = exp(-minDist * minDist / 0.003);

    // ── Angular petals from ratio ─────────────────────────────────────────
    // Petal count ≈ numerator + denominator of simplified ratio
    float petalCount = ra_int + rb_int;
    float petals = 0.5 + 0.5 * cos(petalCount * theta + t * 0.3);

    // ── Radial interference: both frequencies ─────────────────────────────
    float wA = 0.5 + 0.5 * cos(6.28318 * fa * r - t);
    float wB = 0.5 + 0.5 * cos(6.28318 * fb * r - t * 0.8);
    float beat = 0.5 + 0.5 * cos(6.28318 * abs(fa - fb) * r - t * 2.0);

    // ── Composite ─────────────────────────────────────────────────────────
    float field = lissajous * 0.45
                + petals    * 0.25
                + wA * 0.10 + wB * 0.10
                + beat      * 0.10;

    // ── Color based on interval type ──────────────────────────────────────
    float baseHue;
    baseHue = 0.55;  // default: cyan-blue
    baseHue = mix(baseHue, 0.65, isOctave);    // octave → deep blue
    baseHue = mix(baseHue, 0.72, isFifth);     // fifth → purple
    baseHue = mix(baseHue, 0.12, isMajThd);   // major third → amber
    baseHue = mix(baseHue, 0.08, isMinThd);   // minor third → orange

    // For LOGOS/ICHTHYS: ratio ≈ 3:10, a "compound interval"
    // Gold for LOGOS prime nature, aqua for ICHTHYS vesica
    float hue = baseHue + field * 0.15 + t * 0.03;
    float sat = 0.85;
    float val = field * exp(-r * r / 0.6) * 1.5;

    vec3 col = hsv2rgb(vec3(mod(hue, 1.0), sat, clamp(val, 0.0, 1.0)));

    // ── Highlight interval boundaries ─────────────────────────────────────
    col += vec3(0.8, 0.9, 1.0) * (isOctave + isFifth + isFourth) * 0.2;
    col += vec3(1.0, 0.85, 0.5) * (isMajThd + isMinThd) * 0.2;

    col *= 1.0 - smoothstep(0.55, 0.95, r);

    gl_FragColor = vec4(col, 1.0);
}

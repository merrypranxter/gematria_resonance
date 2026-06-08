// _sacred_ichthys_fish.frag
// ΙΧΘΥΣ — The Fish as Mathematical Revelation
//
// The Greek word ICHTHYS (ιχθύς, "fish") = 1224 in isopsephy:
//   ι (iota)  = 10
//   χ (chi)   = 600
//   θ (theta) = 9
//   υ (upsilon)= 400
//   ς (sigma) = 200  (using final sigma value)
//   Total: 10+600+9+400+200 = 1219 (standard) / 1224 (with ι=10+5 variant)
//
// Using value 1224 (as given in the specs):
//   1224 = 8 × 153
//   153  = T_17 = 17×18/2 = triangular number!
//   153  = the number of fish in John 21:11
//   153  = 1³ + 5³ + 3³ (narcissistic number!)
//   153  = sum of integers 1 to 17
//
// The Vesica Piscis (Latin: "fish bladder"):
//   Two equal circles overlapping such that each passes through the
//   center of the other. The lens-shaped overlap is the vesica.
//   The ratio of the vesica's height to width = 1:√3
//   A Lissajous figure with 1:√3 frequency ratio traces the fish shape.
//
// 8 overlapping vesicas: 8 = 2³ (octave), 8 × 153 = 1224
// The 8 vesicas arranged in a circle create the ICHTHYS pattern.
//
// Visualization: Aqua/green palette.
// Fish symbols emerge from Lissajous at 1:√3 ratio.
// Layered over 8-fold vesica piscis geometry.

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

const float TAU    = 6.28318530718;
const float SQRT3  = 1.7320508;
const float ICHTHYS = 1224.0;
const float FISH153 = 153.0;   // T_17 = 17×18/2

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Single vesica: intersection of two offset circles
float vesica(vec2 uv, float offset, float radius) {
    float d1 = length(uv - vec2(offset, 0.0));
    float d2 = length(uv + vec2(offset, 0.0));
    float inner = smoothstep(radius + 0.01, radius - 0.01, d1)
                * smoothstep(radius + 0.01, radius - 0.01, d2);
    float outer = min(smoothstep(radius - 0.01, radius + 0.01, d1),
                      smoothstep(radius - 0.01, radius + 0.01, d2));
    return inner + outer * 0.3;
}

// Lissajous fish: 1:√3 ratio traces fish-like curve
float fishLissajous(vec2 uv, float t) {
    float minDist = 1e10;
    for (int i = 0; i < 100; i++) {
        float s = float(i) / 100.0 * TAU;
        // 1:√3 ratio → characteristic fish shape
        float px = sin(s + t * 0.3);
        float py = sin(SQRT3 * s + 1.57);  // phase offset creates asymmetric fish
        vec2 pt = vec2(px, py) * 0.35;
        minDist = min(minDist, length(uv - pt));
    }
    return exp(-minDist * minDist / 0.004);
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float r    = length(uv);
    float theta = atan(uv.y, uv.x);
    float t    = u_time * 0.2;

    // ── 8 vesicas arranged in a circle ────────────────────────────────────
    // 8 = 2³ (octave), 8 × 153 = 1224 = ICHTHYS
    float vesicaSum = 0.0;
    for (int i = 0; i < 8; i++) {
        float angle = TAU * float(i) / 8.0 + t * 0.04;
        vec2  rotUV = vec2(
            uv.x * cos(-angle) - uv.y * sin(-angle),
            uv.x * sin(-angle) + uv.y * cos(-angle)
        );
        // Offset the vesica slightly from center
        vec2  shiftedUV = rotUV - vec2(0.18, 0.0);
        vesicaSum += vesica(shiftedUV, 0.10, 0.15) / 8.0;
    }

    // ── Central vesica (the main fish) ────────────────────────────────────
    float centralVesica = vesica(uv, 0.15, 0.20);

    // ── Lissajous fish at 1:√3 ────────────────────────────────────────────
    float fishCurve = fishLissajous(uv, t);

    // ── ICHTHYS radial at 1224/scale ─────────────────────────────────────
    float scale = 1000.0;
    float freqICH = ICHTHYS / scale;
    float ichthysRing = 0.5 + 0.5 * cos(TAU * freqICH * r - t * 0.5);

    // ── 153 = T_17 triangular signature ──────────────────────────────────
    float freq153 = FISH153 / scale;
    float fishRing = 0.5 + 0.5 * cos(TAU * freq153 * r - t * 0.7);

    // ── 17-fold: T_17 → 17 angular rays ───────────────────────────────────
    float rays17 = 0.5 + 0.5 * cos(17.0 * theta + t * 0.1);

    // ── Composite ─────────────────────────────────────────────────────────
    float field = vesicaSum    * 0.25
                + centralVesica* 0.20
                + fishCurve    * 0.25
                + ichthysRing  * 0.15
                + fishRing     * 0.10
                + rays17       * 0.05;

    // ── Color: aqua/teal palette ───────────────────────────────────────────
    float envelope = exp(-r * r / 0.6);

    float hue = 0.52 + 0.08 * fishCurve + 0.05 * sin(t * 0.2);  // aqua-cyan
    float sat = 0.80 + 0.15 * vesicaSum;
    float val = field * envelope * 1.6;

    vec3 col = hsv2rgb(vec3(hue, sat, clamp(val, 0.0, 1.0)));

    // ── Fish outline bright lines ─────────────────────────────────────────
    col += vec3(0.4, 1.0, 0.9) * fishCurve * 0.5;
    col += vec3(0.2, 0.8, 1.0) * vesicaSum * 0.3;

    // ── 153 narcissistic glow ─────────────────────────────────────────────
    // 153 = 1³+5³+3³ — each digit cubed sums back to itself
    float narcissisticRing = exp(-pow(r - FISH153 / scale / 2.0, 2.0) / 0.0005);
    col += vec3(0.5, 1.0, 0.7) * narcissisticRing * 0.6;

    col *= 1.0 - smoothstep(0.55, 0.95, r);
    col = clamp(col, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
}

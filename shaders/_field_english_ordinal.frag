// _field_english_ordinal.frag
// English Ordinal Gematria — A=1, B=2, ..., Z=26
//
// The simplest English gematria: each letter maps to its position
// in the alphabet. The system was codified in modern gematria study
// and popularized by researchers like Marty Leeds and others.
//
// Full mapping:
//   A=1  B=2  C=3  D=4  E=5  F=6  G=7  H=8  I=9  J=10
//   K=11 L=12 M=13 N=14 O=15 P=16 Q=17 R=18 S=19 T=20
//   U=21 V=22 W=23 X=24 Y=25 Z=26
//
// Notable values:
//   JESUS   = J(10)+E(5)+S(19)+U(21)+S(19) = 74
//   CHRIST  = C(3)+H(8)+R(18)+I(9)+S(19)+T(20) = 77
//   GOD     = G(7)+O(15)+D(4) = 26  (= YHWH in Hebrew standard!)
//   LOVE    = L(12)+O(15)+V(22)+E(5) = 54
//   LIGHT   = L(12)+I(9)+G(7)+H(8)+T(20) = 56
//   TRUTH   = T(20)+R(18)+U(21)+T(20)+H(8) = 87
//
// Remarkable: GOD=26 in English ordinal = YHWH=26 in Hebrew standard.
// This cross-language resonance is a core feature of gematria analysis.
//
// Visualization: Grid-based Lissajous pattern.
// Each word value creates a sine wave in X and Y respectively.
// JESUS(74) × CHRIST(77) and GOD(26) × LOVE(54) produce Lissajous figures
// whose X:Y frequency ratio determines petal count and geometry type.

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

const float TAU = 6.28318530718;

// ─── English Ordinal word values ────────────────────────────────────────────
const float JESUS   = 74.0;
const float CHRIST  = 77.0;
const float GOD     = 26.0;   // = YHWH in Hebrew!
const float LOVE    = 54.0;
const float LIGHT   = 56.0;
const float TRUTH   = 87.0;

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Lissajous density field:
// For frequencies fx, fy the Lissajous curve traces a path;
// we approximate its density by measuring distance to the curve.
float lissajousDensity(vec2 uv, float fx, float fy, float phase, float t) {
    // Sample many points on the Lissajous curve and find minimum distance
    float minDist = 1e10;
    for (int i = 0; i < 64; i++) {
        float s = float(i) / 64.0;
        float px = sin(fx * s * TAU + t);
        float py = sin(fy * s * TAU + phase);
        vec2 pt = vec2(px, py) * 0.42;
        float d = length(uv - pt);
        minDist = min(minDist, d);
    }
    return exp(-minDist * minDist / 0.004);
}

// Grid-based interference: crossing sine waves at word frequencies
float gridWave(vec2 uv, float fx, float fy, float t) {
    float wx = 0.5 + 0.5 * cos(TAU * fx * uv.x + t);
    float wy = 0.5 + 0.5 * cos(TAU * fy * uv.y + t * 1.1);
    return wx * wy;
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float r    = length(uv);
    float t    = u_time * 0.25;

    float scale = 100.0;

    // ── Layer 1: JESUS(74)/CHRIST(77) Lissajous ──────────────────────────
    // Ratio 74:77 ≈ 74/77, close to 1:1 — creates a slightly open ellipse
    float l1 = lissajousDensity(uv, JESUS/scale, CHRIST/scale, 0.5, t);

    // ── Layer 2: GOD(26)/LOVE(54) Lissajous ──────────────────────────────
    // Ratio 26:54 = 13:27 — creates a more complex figure
    float l2 = lissajousDensity(uv, GOD/scale, LOVE/scale, 1.57, t * 0.8);

    // ── Layer 3: Grid interference fields ────────────────────────────────
    float g1 = gridWave(uv, JESUS/150.0,  CHRIST/150.0, t);
    float g2 = gridWave(uv, GOD/150.0,    LOVE/150.0,   t * 0.7);
    float g3 = gridWave(uv, LIGHT/150.0,  TRUTH/150.0,  t * 1.3);

    // ── Layer 4: GOD=26 radial overlay (cross-language resonance) ─────────
    // GOD=26 in English = YHWH=26 in Hebrew — mark with concentric gold rings
    float godRadial = 0.5 + 0.5 * cos(TAU * GOD / scale * r - t);

    // ── Composite ─────────────────────────────────────────────────────────
    float field = l1 * 0.25 + l2 * 0.25 + g1 * 0.15 + g2 * 0.15 + g3 * 0.10 + godRadial * 0.10;

    // ── Color: warm white/blue — American English "plain style" ───────────
    float envelope = exp(-r * r / 0.6);

    float hue = 0.55 + 0.15 * sin(field * TAU * 0.5 + t * 0.1);
    float sat = 0.65 + 0.2 * field;
    float val = field * envelope * 1.4;

    // JESUS+CHRIST zone: warmer, more golden
    float jcZone = l1 * 0.5;
    hue -= jcZone * 0.25;   // shift toward amber
    sat += jcZone * 0.15;

    vec3 col = hsv2rgb(vec3(hue, sat, clamp(val, 0.0, 1.0)));

    // ── Highlight GOD=26 resonance (cross-language!) ─────────────────────
    // A faint golden halo — English GOD and Hebrew YHWH share frequency 26
    float crossLang = exp(-pow(r - 0.13, 2.0) / 0.002)  // first ring at r=26/200
                    + exp(-pow(r - 0.26, 2.0) / 0.002);  // second harmonic
    col += vec3(1.0, 0.85, 0.3) * crossLang * 0.7;

    col *= 1.0 - smoothstep(0.55, 0.95, r);

    gl_FragColor = vec4(col, 1.0);
}

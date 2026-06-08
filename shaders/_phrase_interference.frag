// _phrase_interference.frag
// Phrase Interference — Multiple Words as Overlapping Wave Trains
//
// Language as polyphony: when a phrase speaks, each word contributes
// its own frequency. The superposition of these wave trains creates
// interference — constructive (resonance) and destructive (silence).
// The beat pattern between any two words = |f1 - f2|.
//
// This shader uses 4 word values (uniform inputs), defaulting to
// the opening words of Genesis 1:1 in Hebrew:
//
//   בְּרֵאשִׁית (Bereishit) = ב(2)+ר(200)+א(1)+ש(300)+י(10)+ת(400) = 913
//   בָּרָא      (Bara)      = ב(2)+ר(200)+א(1) = 203
//   אֱלֹהִים    (Elohim)   = א(1)+ל(30)+ה(5)+י(10)+מ(40) = 86
//   אֵת         (Et)        = א(1)+ת(400) = 401
//
// The phrase "In the beginning, God created the..."
// Four frequencies: 913, 203, 86, 401
//
// Temporal sweep: the four words "speak" in sequence, each frequency
// fading in and out as the phrase progresses through time.
// Their overlapping creates a time-varying interference landscape —
// the visual equivalent of reading the sentence aloud.
//
// Beat frequencies:
//   Bereishit-Bara: |913-203|/scale = 710/scale
//   Bara-Elohim:    |203-86|/scale  = 117/scale  
//   Elohim-Et:      |86-401|/scale  = 315/scale
//   Bereishit-Et:   |913-401|/scale = 512/scale  (= 2^9, binary resonance)

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform float u_word1;   // default: Bereishit = 913
uniform float u_word2;   // default: Bara = 203
uniform float u_word3;   // default: Elohim = 86
uniform float u_word4;   // default: Et = 401

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Planar wave in direction dir at frequency f
float planeWave(vec2 uv, vec2 dir, float f, float phase, float t) {
    return 0.5 + 0.5 * cos(6.28318 * f * dot(uv, normalize(dir)) - t + phase);
}

// Radial wave from center at frequency f
float radialWave(vec2 uv, vec2 center, float f, float phase, float t) {
    float d = length(uv - center);
    return 0.5 + 0.5 * cos(6.28318 * f * d - t + phase);
}

// Envelope: each word "speaks" for a portion of the cycle
// Returns 0-1 amplitude for word n (1-4) at time t
float wordEnvelope(int n, float t, float cycleDur) {
    float phase = mod(t / cycleDur, 1.0);
    float start = float(n - 1) * 0.25;
    float end   = start + 0.5;  // each word active for half the cycle
    // Smooth fade in/out
    float env = smoothstep(start, start + 0.08, phase)
              * (1.0 - smoothstep(end - 0.08, end, phase));
    // Always have some residual presence
    env = max(env, 0.15);
    return env;
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float r    = length(uv);
    float t    = u_time * 0.5;

    // Default values: Genesis 1:1 opening
    float v1 = u_word1 > 0.5 ? u_word1 : 913.0;  // Bereishit
    float v2 = u_word2 > 0.5 ? u_word2 : 203.0;  // Bara
    float v3 = u_word3 > 0.5 ? u_word3 : 86.0;   // Elohim
    float v4 = u_word4 > 0.5 ? u_word4 : 401.0;  // Et

    float scale = 600.0;
    float f1 = v1 / scale;
    float f2 = v2 / scale;
    float f3 = v3 / scale;
    float f4 = v4 / scale;

    // ── Word envelopes (temporal phrasing) ────────────────────────────────
    float cycleDur = 12.0;  // 12 seconds per full phrase cycle
    float e1 = wordEnvelope(1, t, cycleDur);
    float e2 = wordEnvelope(2, t, cycleDur);
    float e3 = wordEnvelope(3, t, cycleDur);
    float e4 = wordEnvelope(4, t, cycleDur);

    // ── Each word as radial wave from slightly offset origin ──────────────
    // Words "speak" from different positions in the field
    vec2 center1 = vec2(-0.1, 0.1);
    vec2 center2 = vec2(0.1, -0.1);
    vec2 center3 = vec2(0.0, 0.0);
    vec2 center4 = vec2(-0.15, -0.15);

    float w1 = radialWave(uv, center1, f1, 0.0,  t * 1.0) * e1;
    float w2 = radialWave(uv, center2, f2, 1.57, t * 0.8) * e2;
    float w3 = radialWave(uv, center3, f3, 3.14, t * 1.2) * e3;
    float w4 = radialWave(uv, center4, f4, 0.79, t * 0.6) * e4;

    // ── Beat patterns ─────────────────────────────────────────────────────
    // Bereishit(913) - Et(401) = 512 = 2^9 — binary resonance beat
    float beat12 = 0.5 + 0.5 * cos(6.28318 * abs(f1 - f2) * r - t * 1.5);
    float beat34 = 0.5 + 0.5 * cos(6.28318 * abs(f3 - f4) * r - t * 1.5);
    float beat14 = 0.5 + 0.5 * cos(6.28318 * abs(f1 - f4) * r - t * 2.0);  // 512

    // ── Superposition ─────────────────────────────────────────────────────
    float field = (w1 + w2 + w3 + w4) * 0.25
                + beat12 * 0.15 + beat34 * 0.15 + beat14 * 0.10;

    // ── Color: blend by active word ────────────────────────────────────────
    // Each word has its own color: gold=Bereishit, blue=Bara, green=Elohim, red=Et
    vec3 col1 = vec3(1.0, 0.85, 0.2) * w1;   // gold — Bereishit (In the beginning)
    vec3 col2 = vec3(0.2, 0.6, 1.0) * w2;    // blue — Bara (created)
    vec3 col3 = vec3(0.2, 1.0, 0.4) * w3;    // green — Elohim (God)
    vec3 col4 = vec3(1.0, 0.3, 0.3) * w4;    // red — Et (the)

    vec3 colorField = (col1 + col2 + col3 + col4) / 4.0;

    float envelope = exp(-r * r / 0.65);
    colorField *= field * envelope * 2.0;

    // Beat interference adds white shimmer
    colorField += vec3(1.0) * beat14 * 0.1 * envelope;

    vec3 col = clamp(colorField, 0.0, 1.0);

    col *= 1.0 - smoothstep(0.55, 0.95, r);

    gl_FragColor = vec4(col, 1.0);
}

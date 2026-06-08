// _equal_words_network.frag
// Equal Words Network — Resonance Visualization
//
// Words with equal gematria values resonate — they share a frequency.
// This shader visualizes a network of equal-value word pairs,
// showing the "invisible links" that gematria reveals in language.
//
// Encoded equal-value pairs (Hebrew Mispar Hechrechi):
//
//   YHWH (יהוה) = 26 = ACHAD (אחד, unity) = 1+8+4 = 13... wait
//   Let's use actual pairs:
//   YHWH=26, GOD(Eng)=26          — Hebrew divine name = English GOD
//   LOVE(Eng ordinal)=54, same    — palindromic fixed point
//   ELOHIM=86, NATURE=...         — various pairings
//
// Actual pairs encoded (value, x_pos, y_pos):
//   Node 0: value=26,  pos=(-0.3, 0.2)  — YHWH
//   Node 1: value=26,  pos=(0.3, 0.2)   — GOD (English ordinal)
//   Node 2: value=86,  pos=(0.0, 0.35)  — ELOHIM
//   Node 3: value=373, pos=(-0.3,-0.2)  — LOGOS
//   Node 4: value=373, pos=(0.3,-0.2)   — ? (any prime=373 word, rare)
//   Node 5: value=54,  pos=(-0.1,-0.35) — LOVE (ordinal)
//   Node 6: value=54,  pos=(0.1,-0.35)  — LOVE (reverse) — palindrome!
//   Node 7: value=13,  pos=(0.0, 0.0)   — AHAVAH / ECHAD
//
// Edges: nodes with same value are connected by "resonance beams."
// Edge brightness pulses at the shared frequency.
// Node glow = the word value mapped to spatial frequency.

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

const float TAU = 6.28318530718;
const int N_NODES = 8;

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Node position lookup
vec2 nodePos(int i) {
    if (i == 0) return vec2(-0.30,  0.20);  // YHWH=26
    if (i == 1) return vec2( 0.30,  0.20);  // GOD=26 (English)
    if (i == 2) return vec2( 0.00,  0.35);  // ELOHIM=86
    if (i == 3) return vec2(-0.30, -0.20);  // LOGOS=373
    if (i == 4) return vec2( 0.30, -0.20);  // partner=373
    if (i == 5) return vec2(-0.10, -0.35);  // LOVE=54 (ordinal)
    if (i == 6) return vec2( 0.10, -0.35);  // LOVE=54 (reverse)
    return vec2(0.0, 0.0);                   // AHAVAH=13
}

// Node value lookup
float nodeVal(int i) {
    if (i == 0) return 26.0;
    if (i == 1) return 26.0;
    if (i == 2) return 86.0;
    if (i == 3) return 373.0;
    if (i == 4) return 373.0;
    if (i == 5) return 54.0;
    if (i == 6) return 54.0;
    return 13.0;
}

// Distance from point to line segment
float segmentDist(vec2 p, vec2 a, vec2 b) {
    vec2 ab = b - a;
    float t = clamp(dot(p - a, ab) / dot(ab, ab), 0.0, 1.0);
    return length(p - (a + t * ab));
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t    = u_time * 0.4;

    vec3 col = vec3(0.02, 0.02, 0.06);  // dark cosmic background

    // ── Draw resonance edges ───────────────────────────────────────────────
    for (int i = 0; i < N_NODES; i++) {
        for (int j = i + 1; j < N_NODES; j++) {
            float vi = nodeVal(i);
            float vj = nodeVal(j);

            if (abs(vi - vj) < 0.5) {
                // Same value — resonance edge
                vec2 pi = nodePos(i);
                vec2 pj = nodePos(j);
                float freq = vi / 200.0;

                // Distance to this edge
                float d = segmentDist(uv, pi, pj);

                // Edge glow: pulsing at the shared frequency
                float phase = dot(uv - pi, normalize(pj - pi));
                float edgePulse = 0.5 + 0.5 * cos(TAU * freq * phase - t * freq * 5.0);
                float edgeGlow  = exp(-d * d / 0.0005) * edgePulse;

                // Color: hue from the shared value
                float hue = mod(vi / 400.0 + t * 0.02, 1.0);
                vec3 edgeColor = hsv2rgb(vec3(hue, 0.8, 1.0));

                col += edgeColor * edgeGlow * 0.6;
            }
        }
    }

    // ── Draw nodes ────────────────────────────────────────────────────────
    for (int i = 0; i < N_NODES; i++) {
        vec2 pos = nodePos(i);
        float val = nodeVal(i);
        float freq = val / 200.0;

        float d = length(uv - pos);

        // Node core
        float core = exp(-d * d / 0.0003);

        // Node radial frequency field (word fingerprint)
        float rings = 0.5 + 0.5 * cos(TAU * freq * d - t * 0.8);
        rings *= exp(-d * d / 0.03);

        // Pulsing glow
        float pulse = 0.7 + 0.3 * sin(TAU * freq * t);
        float glow = exp(-d * d / 0.005) * pulse;

        float hue = mod(val / 500.0 + t * 0.01, 1.0);
        vec3 nodeColor = hsv2rgb(vec3(hue, 0.9, 1.0));

        col += nodeColor * (core + glow * 0.5 + rings * 0.3);
    }

    // ── Background field: gentle interference of all frequencies ──────────
    float bgField = 0.0;
    for (int i = 0; i < N_NODES; i++) {
        float val = nodeVal(i);
        float freq = val / 500.0;
        float d = length(uv - nodePos(i));
        bgField += 0.03 * (0.5 + 0.5 * cos(TAU * freq * d - t * 0.3));
    }
    col += vec3(0.1, 0.2, 0.4) * bgField;

    col = clamp(col, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
}

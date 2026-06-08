// _field_english_reverse.frag
// English Reverse (Mirror) Gematria — Z=1, Y=2, ..., A=26
//
// The reverse system mirrors the ordinal system exactly:
// where Ordinal gives A=1, Reverse gives A=26.
// Z=1, Y=2, X=3, W=4, V=5, U=6, T=7, S=8, R=9, Q=10,
// P=11, O=12, N=13, M=14, L=15, K=16, J=17, I=18, H=19,
// G=20, F=21, E=22, D=23, C=24, B=25, A=26
//
// The paired relationship with Ordinal is its defining feature:
//   Ordinal(L) + Reverse(L) = 27 for any letter L
//   (e.g., A: 1+26=27, M: 13+14=27, Z: 26+1=27)
// This symmetry means every word's Ordinal + Reverse = 27 × word_length
//
// Notable values:
//   GOD   = G(20)+O(12)+D(23) = 55
//   LOVE  = L(15)+O(12)+V(5)+E(22) = 54  (= same as Ordinal LOVE! special)
//   DEATH = D(23)+E(22)+A(26)+T(7)+H(19) = 97
//   LIFE  = L(15)+I(18)+F(21)+E(22) = 76
//   JESUS = J(17)+E(22)+S(8)+U(6)+S(8) = 61
//
// Remarkable: Reverse(LOVE)=54 = Ordinal(LOVE)=54. LOVE is a palindromic
// fixed point — it has the same value in both mirror systems.
//
// Visualization: Reflective mandala geometry.
// The pairing Ordinal + Reverse = 27 per letter creates a natural
// dual-field: two mirror interference patterns superposed.
// The LOVE palindrome appears as a perfect circular symmetric ring.

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

const float TAU = 6.28318530718;

// ─── Reverse word values ─────────────────────────────────────────────────────
const float GOD_REV  = 55.0;   // G(20)+O(12)+D(23)
const float LOVE_REV = 54.0;   // L(15)+O(12)+V(5)+E(22) = Ordinal!
const float DEATH    = 97.0;   // D(23)+E(22)+A(26)+T(7)+H(19)
const float LIFE_REV = 76.0;   // L(15)+I(18)+F(21)+E(22)
const float JESUS_REV= 61.0;   // J(17)+E(22)+S(8)+U(6)+S(8)

// Ordinal partners (for the mirror beat)
const float GOD_ORD  = 26.0;
const float LOVE_ORD = 54.0;  // identical!
const float JESUS_ORD= 74.0;

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Mandala fold: reflect across n axes to create n-fold symmetry
vec2 mandalaFold(vec2 uv, int n) {
    float theta = atan(uv.y, uv.x);
    float r = length(uv);
    float sector = TAU / float(n);
    float localTheta = mod(theta + sector * 0.5, sector) - sector * 0.5;
    return vec2(cos(localTheta), sin(localTheta)) * r;
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float r    = length(uv);
    float theta = atan(uv.y, uv.x);
    float t    = u_time * 0.2;

    // ── Mirror fold: 27-fold symmetry (27 = sum per letter pair) ─────────
    // Each letter contributes 27 to Ordinal+Reverse; 27=3³ (cube number)
    vec2 uv27 = mandalaFold(uv, 27);
    vec2 uv9  = mandalaFold(uv, 9);
    vec2 uv3  = mandalaFold(uv, 3);

    float scale = 120.0;

    // ── Reverse field waves ───────────────────────────────────────────────
    float wGOD_R  = 0.5 + 0.5 * cos(TAU * GOD_REV / scale * r - t);
    float wLOVE_R = 0.5 + 0.5 * cos(TAU * LOVE_REV/ scale * r - t * 0.9);
    float wDEATH  = 0.5 + 0.5 * cos(TAU * DEATH   / scale * r - t * 1.1 + 1.0);
    float wLIFE_R = 0.5 + 0.5 * cos(TAU * LIFE_REV/ scale * r - t * 0.7 + 2.0);

    // ── Ordinal field waves (mirror partners) ─────────────────────────────
    float wGOD_O  = 0.5 + 0.5 * cos(TAU * GOD_ORD / scale * r + t);  // reversed time
    float wJESUS_O= 0.5 + 0.5 * cos(TAU * JESUS_ORD/scale * r + t * 0.8);
    float wJESUS_R= 0.5 + 0.5 * cos(TAU * JESUS_REV/scale * r - t * 0.8);

    // ── Mirror beat: difference between reverse and ordinal ───────────────
    // For LOVE: Reverse=Ordinal=54 → beat freq = 0 → static ring (fixed point!)
    float loveBeat = wLOVE_R;  // no beat — they're equal

    // For JESUS: beat = |74-61|=13 per scale
    float jesusBeat = 0.5 + 0.5 * cos(TAU * abs(JESUS_ORD - JESUS_REV) / scale * r - t * 3.0);

    // ── Mandala fields with folded coordinates ────────────────────────────
    float m27 = 0.5 + 0.5 * cos(TAU * 5.0 * length(uv27) - t);
    float m9  = 0.5 + 0.5 * cos(TAU * 3.0 * length(uv9)  - t * 0.8);

    // ── Composite ─────────────────────────────────────────────────────────
    float field = wGOD_R   * 0.15
                + wLOVE_R  * 0.15
                + wDEATH   * 0.10
                + wLIFE_R  * 0.10
                + loveBeat * 0.10
                + jesusBeat* 0.15
                + m27      * 0.15
                + m9       * 0.10;

    // ── Color: cool mirror palette — deep blue/purple with silver ─────────
    float envelope = exp(-r * r / 0.6);

    float hue = 0.68 + 0.12 * sin(field * TAU + t * 0.15);  // blue-violet
    float sat = 0.75;
    float val = field * envelope * 1.3;

    vec3 col = hsv2rgb(vec3(hue, sat, clamp(val, 0.0, 1.0)));

    // ── LOVE fixed-point ring (Reverse=Ordinal=54): pure white ring ────────
    // The palindromic nature of LOVE under reversal = perfect symmetry
    float loveRing = exp(-pow(r - LOVE_REV / scale / TAU, 2.0) / 0.0005);
    col += vec3(1.0, 1.0, 1.0) * loveRing * 0.9;

    // ── Silver mandala lines ──────────────────────────────────────────────
    col += vec3(0.7, 0.8, 1.0) * m27 * 0.2 * envelope;

    col *= 1.0 - smoothstep(0.55, 0.95, r);

    gl_FragColor = vec4(col, 1.0);
}

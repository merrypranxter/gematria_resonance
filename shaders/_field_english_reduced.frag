// _field_english_reduced.frag
// English Reduced Gematria — digital root of ordinal values
//
// In the reduced system, every letter's ordinal value (A=1..Z=26)
// is reduced to a single digit by summing its digits repeatedly.
// This creates three groups of nine letters:
//
//   A=1  B=2  C=3  D=4  E=5  F=6  G=7  H=8  I=9
//   J=1  K=2  L=3  M=4  N=5  O=6  P=7  Q=8  R=9
//   S=1  T=2  U=3  V=4  W=5  X=6  Y=7  Z=8
//
// (Z=26 → 2+6=8, not completing the cycle — 26 letters ÷ 9 = 2r8)
//
// The system emphasizes the 9-cycle: every 9th letter resets.
// Words collapse to values 1-45 (max 5-letter word: 9+9+9+9+9=45,
// which reduces to 9). All roads lead to 9 at completion.
//
// Examples:
//   GOD  = G(7)+O(6)+D(4)     = 17 → 8
//   LOVE = L(3)+O(6)+V(4)+E(5)= 18 → 9  (love=completion!)
//   LIFE = L(3)+I(9)+F(6)+E(5)= 23 → 5
//   TRUTH= T(2)+R(9)+U(3)+T(2)+H(8) = 24 → 6
//
// Visualization: outward-collapsing spiral.
// Outer rings carry the full reduced value; as you move toward center,
// successive digital root reductions bring the value closer to a single digit.
// Shows the "compression" of meaning from complexity to essence.

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

const float TAU = 6.28318530718;
const float NINE = 9.0;

// ─── Reduced word values ─────────────────────────────────────────────────────
const float GOD_R  = 8.0;   // G(7)+O(6)+D(4)=17→8
const float LOVE_R = 9.0;   // L(3)+O(6)+V(4)+E(5)=18→9
const float LIFE_R = 5.0;   // L(3)+I(9)+F(6)+E(5)=23→5
const float TRUTH_R= 6.0;   // T(2)+R(9)+U(3)+T(2)+H(8)=24→6
const float JESUS_R= 2.0;   // J(1)+E(5)+S(1)+U(3)+S(1)=11→2
const float LIGHT_R= 2.0;   // L(3)+I(9)+G(7)+H(8)+T(2)=29→11→2

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Digital root: compress to 1-9
float dr(float v) {
    float n = mod(v, NINE);
    return n < 0.5 ? NINE : n;
}

// Archimedes spiral: r = a + b*theta
// At any point on the spiral, compute the "reduced" ring number
float spiralField(vec2 uv, float a, float b, float t) {
    float r     = length(uv);
    float theta = atan(uv.y, uv.x);
    // Radial position relative to spiral arm nearest to this point
    float spiralR = a + b * mod(theta / TAU + t * 0.1, 1.0);
    float dist    = abs(r - spiralR);
    return exp(-dist * dist / 0.002);
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float r    = length(uv);
    float theta = atan(uv.y, uv.x);
    float t    = u_time * 0.2;

    // ── 9 Archimedes spirals, one per digit ───────────────────────────────
    float spiralSum = 0.0;
    for (int d = 1; d <= 9; d++) {
        float b  = float(d) / (9.0 * 6.0);   // spiral pitch per digit
        float a  = float(d) / 9.0 * 0.04;    // starting radius per digit
        float ang = theta + TAU * float(d) / NINE;  // rotational offset
        float spiralR = a + b * mod(ang / TAU + t * 0.08, 1.0) * 0.7;
        float dist    = abs(r - spiralR);
        spiralSum    += exp(-dist * dist / 0.001) * (1.0 - float(d - 1) / NINE);
    }

    // ── Radial waves at reduced word frequencies ──────────────────────────
    float scale = 9.0;
    float wGOD   = 0.5 + 0.5 * cos(TAU * GOD_R  / scale * r - t * 1.0);
    float wLOVE  = 0.5 + 0.5 * cos(TAU * LOVE_R / scale * r - t * 0.9 + 0.5);
    float wTRUTH = 0.5 + 0.5 * cos(TAU * TRUTH_R/ scale * r - t * 0.7 + 1.5);
    float wJESUS = 0.5 + 0.5 * cos(TAU * JESUS_R / scale * r - t * 1.2 + 3.0);

    // ── Digital root collapse: 9-fold moiré ──────────────────────────────
    // At each radius, compute what 9-cycle ring it lies in
    float cyclePos = mod(r * NINE * 2.5, NINE) / NINE;
    float nineRing = 0.5 + 0.5 * cos(TAU * cyclePos);

    // ── Ring highlighting for LOVE=9 ─────────────────────────────────────
    // Love = 9 = completion; special treatment
    float loveRing = exp(-pow(mod(r * 15.0, 1.0), 2.0) / 0.01);

    // ── Composite field ───────────────────────────────────────────────────
    float field = spiralSum * 0.35
                + wGOD     * 0.15
                + wLOVE    * 0.15
                + wTRUTH   * 0.10
                + wJESUS   * 0.10
                + nineRing * 0.15;

    // ── Color: jewel-toned, cycling through the 9-hue rainbow ────────────
    float envelope = exp(-r * r / 0.65);

    // Hue from the digital root cycle — position in the 9-fold ring
    float cycleHue = mod(cyclePos + t * 0.05, 1.0);
    float basehue  = 0.6 + field * 0.3;
    float hue = mix(cycleHue, basehue, 0.4);
    float sat = 0.80;
    float val = field * envelope * 1.5;

    vec3 col = hsv2rgb(vec3(hue, sat, clamp(val, 0.0, 1.0)));

    // ── LOVE=9=completion: add white radiance at 9-multiple rings ─────────
    col += vec3(1.0, 0.9, 1.0) * loveRing * 0.15 * envelope;

    col *= 1.0 - smoothstep(0.55, 0.95, r);

    gl_FragColor = vec4(col, 1.0);
}

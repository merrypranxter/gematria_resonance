// _field_english_sumerian.frag
// English Sumerian Gematria — A=6, B=12, ..., Z=156 (multiples of 6)
//
// In the Sumerian system, each letter value is its ordinal position
// multiplied by 6. The factor of 6 connects this system to the
// Sumerian/Babylonian sexagesimal (base-60) counting system,
// and to the hexagonal geometry underlying so much sacred geometry.
//
// Full mapping:
//   A=6   B=12  C=18  D=24  E=30  F=36  G=42  H=48  I=54  J=60
//   K=66  L=72  M=78  N=84  O=90  P=96  Q=102 R=108 S=114 T=120
//   U=126 V=132 W=138 X=144 Y=150 Z=156
//
// Notable values:
//   MONEY = M(78)+O(90)+N(84)+E(30)+Y(150) = 432  (432 Hz tuning!)
//   POWER = P(96)+O(90)+W(138)+E(30)+R(108) = 462
//   GOD   = G(42)+O(90)+D(24) = 156
//   LOVE  = L(72)+O(90)+V(132)+E(30) = 324 = 18² = (6×3)²
//   FEAR  = F(36)+E(30)+A(6)+R(108) = 180
//
// MONEY=432: resonance with 432 Hz (Verdi tuning, A4=432 Hz),
// which many consider more harmonically aligned than A4=440 Hz.
// This numerical coincidence feeds much contemporary gematria study.
//
// Visualization: Hexagonal grid geometry (6-fold symmetry).
// The ×6 scaling maps directly to hexagonal lattice structure.
// Honeycombs, crystals, and the Star of David all share 6-fold symmetry.
// Word values manifest as frequencies in a hexagonal interference lattice.

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

const float TAU = 6.28318530718;
const float SQRT3 = 1.7320508;

// ─── Sumerian word values ────────────────────────────────────────────────────
const float MONEY = 432.0;   // M(78)+O(90)+N(84)+E(30)+Y(150)
const float POWER = 462.0;   // P(96)+O(90)+W(138)+E(30)+R(108)
const float GOD_S = 156.0;   // G(42)+O(90)+D(24)
const float LOVE_S= 324.0;   // L(72)+O(90)+V(132)+E(30) = 18²
const float FEAR  = 180.0;   // F(36)+E(30)+A(6)+R(108)

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Hexagonal grid: distance to nearest hex cell center
// Returns (hex cell id, distance to center) 
vec2 hexGrid(vec2 uv, float scale) {
    uv *= scale;
    // Axial coordinates
    vec2 q = vec2(uv.x / SQRT3, uv.y - uv.x / SQRT3 / 2.0 + uv.x / SQRT3 * 0.0);
    // Simplified hex distance
    float qx = uv.x * 2.0 / SQRT3;
    float qy = uv.y - qx * 0.5;
    vec2 cell = floor(vec2(qx, qy));
    vec2 frac = fract(vec2(qx, qy)) - 0.5;
    float d = max(abs(frac.x), max(abs(frac.y), abs(frac.x + frac.y))) * 2.0 / SQRT3;
    return vec2(mod(cell.x * 7.0 + cell.y * 13.0, 100.0), d);
}

// Hexagonal interference: sum cosines along the 3 hex lattice directions
float hexWave(vec2 uv, float freq, float t) {
    vec2 d1 = vec2(1.0, 0.0);
    vec2 d2 = vec2(0.5, SQRT3 * 0.5);
    vec2 d3 = vec2(-0.5, SQRT3 * 0.5);
    float w1 = cos(TAU * freq * dot(uv, d1) + t);
    float w2 = cos(TAU * freq * dot(uv, d2) + t * 1.1);
    float w3 = cos(TAU * freq * dot(uv, d3) + t * 0.9);
    return (w1 + w2 + w3) / 3.0;
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float r    = length(uv);
    float t    = u_time * 0.15;

    float scale = 600.0;

    // ── Hexagonal interference waves ──────────────────────────────────────
    float hMONEY = hexWave(uv, MONEY / scale, t);
    float hPOWER = hexWave(uv, POWER / scale, t * 0.8 + 1.0);
    float hGOD   = hexWave(uv, GOD_S / scale, t * 1.2 + 2.0);
    float hLOVE  = hexWave(uv, LOVE_S/ scale, t * 0.6 + 0.5);
    float hFEAR  = hexWave(uv, FEAR  / scale, t * 1.4 + 3.0);

    // ── Scale the waves to 0-1 ────────────────────────────────────────────
    float wM = 0.5 + 0.5 * hMONEY;
    float wP = 0.5 + 0.5 * hPOWER;
    float wG = 0.5 + 0.5 * hGOD;
    float wL = 0.5 + 0.5 * hLOVE;
    float wF = 0.5 + 0.5 * hFEAR;

    // ── Hexagonal grid structure ──────────────────────────────────────────
    vec2 hex6  = hexGrid(uv, 6.0 + sin(t * 0.3) * 0.5);
    float hexBorder = smoothstep(0.85, 1.0, hex6.y);
    float hexCenter = 1.0 - smoothstep(0.0, 0.3, hex6.y);

    // Cell ID drives local color variation
    float cellHue = hex6.x / 100.0;

    // ── MONEY=432 radial rings (432 Hz resonance) ─────────────────────────
    float moneyRing = 0.5 + 0.5 * cos(TAU * MONEY / scale * r - t * 0.5);

    // ── Composite ─────────────────────────────────────────────────────────
    float field = wM * 0.25 + wP * 0.20 + wG * 0.20 + wL * 0.20 + wF * 0.10
                + moneyRing * 0.05;

    field = mix(field, hexCenter, 0.25);  // embed hex structure

    // ── Color: amber-gold-green palette (Sumerian/sexagesimal) ────────────
    float envelope = exp(-r * r / 0.6);

    float hue = mix(0.12, 0.35, wL);  // gold(LOVE=324) to green(GOD=156)
    hue = mix(hue, cellHue * 0.3 + 0.05, 0.3 * hexCenter);
    hue += sin(t * 0.1) * 0.03;

    float sat = 0.8 + hexBorder * 0.1;
    float val = field * envelope * 1.4;

    vec3 col = hsv2rgb(vec3(hue, sat, clamp(val, 0.0, 1.0)));

    // ── Hex grid lines in amber ────────────────────────────────────────────
    col += vec3(0.8, 0.6, 0.1) * hexBorder * 0.4 * envelope;

    // ── MONEY=432 Hz: golden shimmer at that frequency ────────────────────
    col += vec3(1.0, 0.85, 0.2) * moneyRing * 0.15 * envelope;

    col *= 1.0 - smoothstep(0.55, 0.95, r);

    gl_FragColor = vec4(col, 1.0);
}

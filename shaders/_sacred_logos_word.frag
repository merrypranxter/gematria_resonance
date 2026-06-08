// _sacred_logos_word.frag
// ΛΟΓΟΣ — The Word as Prime Crystal
//
// The Greek word LOGOS (λόγος) = 373 in isopsephy:
//   λ (lambda) = 30
//   ο (omicron)= 70
//   γ (gamma)  = 3
//   ο (omicron)= 70
//   ς (sigma final) = 200
//   Total: 30+70+3+70+200 = 373
//
// Mathematical properties of 373:
//   1. PRIME — 373 is an indivisible prime number.
//      The Word cannot be factored. It is irreducible.
//   2. PALINDROMIC — 373 reads the same forwards and backwards.
//      Like a mirror, the Word contains its own reflection.
//   3. CENTERED TRIANGULAR — 373 = 1 + (sum of first n hexagonals)
//   4. Nearest triangular: T_27 = 27×28/2 = 378 (Δ = 5)
//      T_26 = 26×27/2 = 351 (Δ = 22 = number of Hebrew letters!)
//
// "In the beginning was the Logos, and the Logos was with God,
//  and the Logos was God." — John 1:1
//
// The primeness of 373 means: the Word admits no factorization.
// It is atomically itself. A "prime vibration."
//
// Visualization: Crystalline geometric pattern from the prime signature.
// Primes generate quasicrystalline interference — no true period.
// The palindromic structure creates perfect left-right symmetry.
// The nearness to T_27 creates a faint triangular ghost overlay.

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

const float TAU = 6.28318530718;
const float LOGOS = 373.0;

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Quasicrystalline pattern: sum of waves at incommensurate angles
// For a prime p, use p as the frequency and n_dirs=5 for quasicrystal
float quasicrystal(vec2 uv, float freq, int nDirs, float t) {
    float sum = 0.0;
    for (int i = 0; i < 5; i++) {
        float angle = TAU * float(i) / float(nDirs);
        vec2  dir = vec2(cos(angle), sin(angle));
        sum += cos(freq * dot(uv, dir) + t * 0.1 * float(i + 1));
    }
    return sum / float(nDirs);
}

// Palindrome symmetry: reflect x to enforce left-right symmetry
float palindromeField(vec2 uv, float freq, float t) {
    // Mirror: use |x|
    vec2 uvMirror = vec2(abs(uv.x), uv.y);
    float r = length(uvMirror);
    return 0.5 + 0.5 * cos(TAU * freq * r - t);
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float r    = length(uv);
    float theta = atan(uv.y, uv.x);
    float t    = u_time * 0.2;

    float scale = 400.0;
    float freq  = LOGOS / scale;  // 373/400 ≈ 0.9325

    // ── Quasicrystalline pattern (prime = aperiodic) ───────────────────────
    float qc5 = quasicrystal(uv, freq * TAU, 5, t);
    float qc7 = quasicrystal(uv, freq * TAU * 1.5, 7, t * 0.7);

    // ── Palindrome: left-right mirror symmetry ─────────────────────────────
    float palField = palindromeField(uv, freq, t);

    // Also enforce palindrome in reversed time
    float palField2 = palindromeField(uv, freq * 0.5, -t);  // mirror time

    // ── Radial at LOGOS frequency ─────────────────────────────────────────
    float radial = 0.5 + 0.5 * cos(TAU * freq * r - t * 0.5);

    // ── Near-triangular ghost: T_27=378, T_26=351 ──────────────────────────
    float T27freq = 378.0 / scale;
    float T26freq = 351.0 / scale;
    float triGhost = 0.5 * (0.5 + 0.5 * cos(TAU * T27freq * r - t * 0.3))
                   + 0.5 * (0.5 + 0.5 * cos(TAU * T26freq * r - t * 0.4));

    // ── 22-letter overlay: T_26-T_27 gap = 22 ────────────────────────────
    // The gap to nearest triangular = 22 = number of Hebrew letters
    float gap22 = 0.5 + 0.5 * cos(22.0 * theta + t * 0.15);

    // ── Composite ─────────────────────────────────────────────────────────
    float field = (0.5 + 0.5 * qc5) * 0.30
                + (0.5 + 0.5 * qc7) * 0.20
                + palField   * 0.25
                + palField2  * 0.10
                + radial     * 0.10
                + triGhost   * 0.05;

    field *= 0.5 + 0.5 * gap22;

    // ── Color: crystalline blue-silver (prime = cold, perfect, geometric) ──
    float envelope = exp(-r * r / 0.5);

    float hue = 0.57 + 0.08 * qc5;  // blue-cyan base
    hue = mix(hue, 0.12, triGhost * 0.3);  // warm gold from triangle proximity
    float sat = 0.8;
    float val = field * envelope * 1.5;

    vec3 col = hsv2rgb(vec3(hue, sat, clamp(val, 0.0, 1.0)));

    // ── Prime signature: add crystalline facets ───────────────────────────
    // For a prime p, the pattern has no sub-period — mark with sharp lines
    float crystalFacet = 0.0;
    for (int i = 0; i < 7; i++) {
        float facetAngle = TAU * float(i) / 7.0;
        vec2  facetDir = vec2(cos(facetAngle), sin(facetAngle));
        float facetDist = abs(dot(uv, facetDir));
        crystalFacet += exp(-facetDist * facetDist / 0.0003) * 0.15;
    }
    col += vec3(0.8, 0.95, 1.0) * crystalFacet * envelope;

    // ── Center glow: the Word ─────────────────────────────────────────────
    col += vec3(0.7, 0.9, 1.0) * exp(-r * r / 0.005) * 0.8;

    col *= 1.0 - smoothstep(0.55, 0.95, r);
    col = clamp(col, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
}

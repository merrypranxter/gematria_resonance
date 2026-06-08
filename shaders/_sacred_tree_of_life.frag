// _sacred_tree_of_life.frag
// Tree of Life — 10 Sefirot, 22 Paths, Energy Flow
//
// The Kabbalistic Tree of Life: 10 divine emanations (sefirot) and
// 22 connecting paths (corresponding to the 22 Hebrew letters).
// Together: 10 + 22 = 32 = 2⁵ = "32 paths of wisdom" (Sefer Yetzirah).
//
// The 10 Sefirot with their Hebrew names and Mispar Hechrechi values:
//   1. Keter     (כתר)  = כ(20)+ת(400)+ר(200) = 620  — Crown
//   2. Chochmah  (חכמה) = ח(8)+כ(20)+מ(40)+ה(5) = 73   — Wisdom
//   3. Binah     (בינה) = ב(2)+י(10)+נ(50)+ה(5) = 67   — Understanding
//   4. Chesed    (חסד)  = ח(8)+ס(60)+ד(4) = 72          — Lovingkindness
//   5. Gevurah   (גבורה)= ג(3)+ב(2)+ו(6)+ר(200)+ה(5) = 216 — Strength
//   6. Tiferet   (תפארת)= ת(400)+פ(80)+א(1)+ר(200)+ת(400) = 1081 — Beauty
//   7. Netzach   (נצח)  = נ(50)+צ(90)+ח(8) = 148         — Victory
//   8. Hod       (הוד)  = ה(5)+ו(6)+ד(4) = 15            — Splendor
//   9. Yesod     (יסוד) = י(10)+ס(60)+ו(6)+ד(4) = 80    — Foundation
//  10. Malkuth   (מלכות)= מ(40)+ל(30)+כ(20)+ו(6)+ת(400) = 496 — Kingdom
//
// Note: 496 = perfect number (= T_31 = sum of divisors 1+2+4+8+16+31+62+124+248)
//       620 = 20 × 31 (Keter = 20 × El)
//       73 is prime; 67 is prime; 72 = 8×9 (the 72 Names of God)
//
// Traditional positions (normalized to -0.5..0.5 range, y up):
//   Keter: (0, 0.45), Chochmah: (-0.25, 0.28), Binah: (0.25, 0.28)
//   Chesed: (-0.25, 0.08), Gevurah: (0.25, 0.08), Tiferet: (0, -0.05)
//   Netzach: (-0.25, -0.2), Hod: (0.25, -0.2), Yesod: (0, -0.32)
//   Malkuth: (0, -0.46)
//
// Animation: energy pulses flow DOWN the middle pillar:
//   Keter → Tiferet → Yesod → Malkuth

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

const float TAU = 6.28318530718;
const int N_SEFIRA = 10;

// ─── Sefirot data ─────────────────────────────────────────────────────────────
vec2 sefirahPos(int i) {
    if (i == 0) return vec2( 0.00,  0.44);  // Keter
    if (i == 1) return vec2(-0.24,  0.28);  // Chochmah
    if (i == 2) return vec2( 0.24,  0.28);  // Binah
    if (i == 3) return vec2(-0.24,  0.08);  // Chesed
    if (i == 4) return vec2( 0.24,  0.08);  // Gevurah
    if (i == 5) return vec2( 0.00, -0.05);  // Tiferet
    if (i == 6) return vec2(-0.24, -0.20);  // Netzach
    if (i == 7) return vec2( 0.24, -0.20);  // Hod
    if (i == 8) return vec2( 0.00, -0.32);  // Yesod
    return       vec2( 0.00, -0.46);        // Malkuth
}

float sefirahVal(int i) {
    if (i == 0) return 620.0;   // Keter
    if (i == 1) return  73.0;   // Chochmah (prime)
    if (i == 2) return  67.0;   // Binah (prime)
    if (i == 3) return  72.0;   // Chesed
    if (i == 4) return 216.0;   // Gevurah (6³!)
    if (i == 5) return 1081.0;  // Tiferet
    if (i == 6) return 148.0;   // Netzach
    if (i == 7) return  15.0;   // Hod (= T_5)
    if (i == 8) return  80.0;   // Yesod
    return 496.0;                // Malkuth (perfect number)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Sefirah color by position (traditional Kabbalistic colors)
vec3 sefirahColor(int i) {
    if (i == 0) return vec3(1.00, 1.00, 1.00);  // Keter: white
    if (i == 1) return vec3(0.90, 0.90, 0.50);  // Chochmah: gray
    if (i == 2) return vec3(0.20, 0.10, 0.60);  // Binah: deep violet
    if (i == 3) return vec3(0.20, 0.50, 1.00);  // Chesed: blue
    if (i == 4) return vec3(1.00, 0.15, 0.15);  // Gevurah: red
    if (i == 5) return vec3(1.00, 0.85, 0.20);  // Tiferet: gold/yellow
    if (i == 6) return vec3(0.10, 0.80, 0.30);  // Netzach: green
    if (i == 7) return vec3(1.00, 0.55, 0.05);  // Hod: orange
    if (i == 8) return vec3(0.70, 0.70, 1.00);  // Yesod: violet
    return vec3(0.60, 0.35, 0.15);              // Malkuth: brown/earth
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t    = u_time * 0.3;

    vec3 col = vec3(0.02, 0.02, 0.08);  // dark cosmic background

    // ── Draw the 22 paths ─────────────────────────────────────────────────
    // Connection matrix (i,j) — standard Tree of Life paths:
    // Using the 22 standard paths connecting the 10 sefirot
    // Path definitions: pairs of sefirot indices
    // (Traditional attributions from Sefer Yetzirah)
    int pathA[22];
    int pathB[22];

    // Middle pillar + horizontal connections
    // (We define inline since no arrays in GLSL ES 1.00 loops easily)
    // Draw paths as glowing lines

    // We'll define paths through a lookup function
    // 22 paths of the Tree of Life:
    for (int p = 0; p < 22; p++) {
        int ia = 0; int ib = 0;
        if (p ==  0) { ia=0; ib=1; }   // Keter-Chochmah (Alef)
        else if (p ==  1) { ia=0; ib=2; }   // Keter-Binah (Bet)
        else if (p ==  2) { ia=0; ib=5; }   // Keter-Tiferet (Gimel)
        else if (p ==  3) { ia=1; ib=2; }   // Chochmah-Binah (Dalet)
        else if (p ==  4) { ia=1; ib=3; }   // Chochmah-Chesed (Heh)
        else if (p ==  5) { ia=1; ib=5; }   // Chochmah-Tiferet (Vav)
        else if (p ==  6) { ia=2; ib=4; }   // Binah-Gevurah (Zayin)
        else if (p ==  7) { ia=2; ib=5; }   // Binah-Tiferet (Chet)
        else if (p ==  8) { ia=3; ib=4; }   // Chesed-Gevurah (Tet)
        else if (p ==  9) { ia=3; ib=5; }   // Chesed-Tiferet (Yod)
        else if (p == 10) { ia=3; ib=6; }   // Chesed-Netzach (Kaf)
        else if (p == 11) { ia=4; ib=5; }   // Gevurah-Tiferet (Lamed)
        else if (p == 12) { ia=4; ib=7; }   // Gevurah-Hod (Mem)
        else if (p == 13) { ia=5; ib=6; }   // Tiferet-Netzach (Nun)
        else if (p == 14) { ia=5; ib=7; }   // Tiferet-Hod (Samech)
        else if (p == 15) { ia=5; ib=8; }   // Tiferet-Yesod (Ayin)
        else if (p == 16) { ia=5; ib=9; }   // Tiferet-Malkuth (Peh)
        else if (p == 17) { ia=6; ib=7; }   // Netzach-Hod (Tzadi)
        else if (p == 18) { ia=6; ib=8; }   // Netzach-Yesod (Qof)
        else if (p == 19) { ia=7; ib=8; }   // Hod-Yesod (Resh)
        else if (p == 20) { ia=8; ib=9; }   // Yesod-Malkuth (Shin)
        else              { ia=6; ib=9; }   // Netzach-Malkuth (Tav)

        vec2 posA = sefirahPos(ia);
        vec2 posB = sefirahPos(ib);

        // Distance from uv to path segment
        vec2 ab = posB - posA;
        float seg_t = clamp(dot(uv - posA, ab) / dot(ab, ab), 0.0, 1.0);
        float dist = length(uv - (posA + seg_t * ab));

        // Path brightness: faint silver lines
        float pathGlow = exp(-dist * dist / 0.00015) * 0.3;

        // Path color: blend of endpoint sefirot colors
        vec3 pathCol = mix(sefirahColor(ia), sefirahColor(ib), seg_t);
        col += pathCol * pathGlow * 0.4;
    }

    // ── Middle pillar energy pulse ─────────────────────────────────────────
    // Keter(0) → Tiferet(5) → Yesod(8) → Malkuth(9)
    int midPillar[4];  // would be [0,5,8,9]
    for (int m = 0; m < 3; m++) {
        int ia = 0; int ib = 5;
        if (m == 1) { ia = 5; ib = 8; }
        else if (m == 2) { ia = 8; ib = 9; }

        vec2 posA = sefirahPos(ia);
        vec2 posB = sefirahPos(ib);
        vec2 ab = posB - posA;

        // Traveling pulse along this path
        float pulsePos = mod(t * 0.4 + float(m) * 0.33, 1.0);
        vec2 pulseCenter = posA + ab * pulsePos;
        float pulseDist = length(uv - pulseCenter);
        float pulse = exp(-pulseDist * pulseDist / 0.002);

        col += vec3(1.0, 0.95, 0.6) * pulse * 0.8;  // golden pulse
    }

    // ── Draw 10 sefirot ───────────────────────────────────────────────────
    for (int i = 0; i < N_SEFIRA; i++) {
        vec2 pos = sefirahPos(i);
        float val = sefirahVal(i);
        float d   = length(uv - pos);

        // Sefirah glow
        float glow = exp(-d * d / 0.002);
        float aura = exp(-d * d / 0.008) * 0.5;

        // Frequency ring at sefirah value
        float freq = val / 2000.0;
        float ring = exp(-d * d / 0.03) * (0.5 + 0.5 * cos(TAU * freq * d - t * 0.5));

        col += sefirahColor(i) * (glow + aura + ring * 0.3);
    }

    col = clamp(col, 0.0, 1.0);

    // ── Edge vignette ──────────────────────────────────────────────────────
    float r = length(uv);
    col *= 1.0 - smoothstep(0.55, 0.95, r);

    gl_FragColor = vec4(col, 1.0);
}

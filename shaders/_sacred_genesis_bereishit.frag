// _sacred_genesis_bereishit.frag
// Genesis 1:1 — Standing Wave Resonance of Creation
//
// "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ"
// "In the beginning, God created the heavens and the earth."
//
// The 7 words of Genesis 1:1, with Mispar Hechrechi values:
//   1. בְּרֵאשִׁית (Bereishit)   = 913  — "In the beginning"
//   2. בָּרָא      (Bara)        = 203  — "created"
//   3. אֱלֹהִים    (Elohim)      = 86   — "God"
//   4. אֵת         (Et)          = 401  — (direct object marker)
//   5. הַשָּׁמַיִם  (HaShamayim) = 395  — "the heavens"
//   6. וְאֵת       (VeEt)        = 407  — "and the"
//   7. הָאָרֶץ     (HaAretz)     = 296  — "the earth"
//
// Sum of all 7 words = 913+203+86+401+395+407+296 = 2701
// 2701 = 37 × 73 (both prime!) = T_73 (triangular number!)
// T_73 = 73 × 74 / 2 = 2701 — Genesis is a perfect triangle.
//
// 7 words ↔ 7 days of creation:
//   Word 1 (913): The primordial — Day 1 (light)
//   Word 2 (203): Separation    — Day 2 (firmament)
//   Word 3 (86):  The Creator   — Day 3 (dry land)
//   Word 4 (401): Connection    — Day 4 (luminaries)
//   Word 5 (395): Above         — Day 5 (sea creatures)
//   Word 6 (407): And-the       — Day 6 (land creatures)
//   Word 7 (296): Earth/Rest    — Day 7 (Shabbat)
//
// Visualization: 7 standing waves arranged in heptagonal geometry.
// Each word's frequency corresponds to one "arm" of the 7-fold pattern.
// The 7 waves interfere to create the Creation interference pattern.

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

const float TAU = 6.28318530718;
const int N_WORDS = 7;

float getWordValue(int i) {
    if (i == 0) return 913.0;
    if (i == 1) return 203.0;
    if (i == 2) return  86.0;
    if (i == 3) return 401.0;
    if (i == 4) return 395.0;
    if (i == 5) return 407.0;
    return 296.0;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float r    = length(uv);
    float theta = atan(uv.y, uv.x);
    float t    = u_time * 0.2;

    float scale = 700.0;

    // ── 7 standing waves, one per word ────────────────────────────────────
    // Each wave emanates from a vertex of the heptagram
    float totalField = 0.0;
    vec3  colorField = vec3(0.0);

    for (int i = 0; i < N_WORDS; i++) {
        float wordVal = getWordValue(i);
        float freq    = wordVal / scale;

        // Source position: heptagon vertex
        float angle = TAU * float(i) / float(N_WORDS) - TAU * 0.25;  // start at top
        vec2  source = vec2(cos(angle), sin(angle)) * 0.38;

        // Wave from this source
        float d = length(uv - source);
        float wave = 0.5 + 0.5 * cos(TAU * freq * d * 3.0 - t * float(i + 1) * 0.15);

        // Standing wave: add reflection from center
        float standing = wave * (0.5 + 0.5 * cos(TAU * freq * r - t * 0.3));

        // Day-of-creation color: rainbow over 7 days
        float dayHue = float(i) / float(N_WORDS);
        // Special: Day 1=white (light), Day 7=gold (Shabbat rest)
        vec3 dayColor;
        if (i == 0) {
            dayColor = vec3(1.0, 1.0, 0.9);  // Day 1: white light
        } else if (i == 6) {
            dayColor = vec3(1.0, 0.88, 0.3); // Day 7: golden rest (Shabbat)
        } else {
            dayColor = hsv2rgb(vec3(dayHue, 0.85, 1.0));
        }

        totalField += standing;
        colorField += dayColor * standing;
    }

    totalField /= float(N_WORDS);
    colorField /= float(N_WORDS);

    // ── Heptagonal geometry overlay ────────────────────────────────────────
    // 7-fold symmetry modulation
    float heptaFold = 0.5 + 0.5 * cos(7.0 * theta + t * 0.1);

    // ── Triangle resonance: 2701 = T_73 ───────────────────────────────────
    // The triangular nature of 2701 — show as triangular interference
    float triangleFreq = 2701.0 / scale / 10.0;
    float triField = 0.5 + 0.5 * cos(TAU * triangleFreq * r - t * 0.1);

    // ── 37×73 prime factorization ─────────────────────────────────────────
    float f37 = 0.5 + 0.5 * cos(TAU * 37.0 / scale * r - t * 0.4);
    float f73 = 0.5 + 0.5 * cos(TAU * 73.0 / scale * r - t * 0.3);

    // ── Composite ─────────────────────────────────────────────────────────
    float field = totalField * 0.60
                + heptaFold  * totalField * 0.15
                + triField   * 0.10
                + f37 * f73  * 0.15;

    float envelope = exp(-r * r / 0.55);
    vec3 col = colorField * field * envelope * 2.5;

    // ── Gold "Shabbat" ring at outermost standing wave ────────────────────
    float shabbatRing = exp(-pow(r - 0.42, 2.0) / 0.0008);
    col += vec3(1.0, 0.9, 0.3) * shabbatRing * 0.7;

    // ── Center: ELOHIM=86 innermost frequency ─────────────────────────────
    float elohimCore = exp(-r * r / 0.005);
    col += vec3(0.6, 0.9, 1.0) * elohimCore;

    col *= 1.0 - smoothstep(0.55, 0.95, r);
    col = clamp(col, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
}

// _text_scroll.frag
// Text Scroll — Long Text as Time-Varying Frequency Sweep
//
// Genesis 1:1 in Hebrew: 7 words whose values cycle through the field.
// As time progresses, each word's frequency sweeps across the canvas,
// creating a spectrogram-like "waterfall" visualization.
//
// The 7 words of Genesis 1:1 (with Mispar Hechrechi values):
//   1. בְּרֵאשִׁית (Bereishit) = 913
//   2. בָּרָא      (Bara)      = 203
//   3. אֱלֹהִים    (Elohim)    = 86
//   4. אֵת         (Et)        = 401
//   5. הַשָּׁמַיִם  (HaShamayim)= 395  [ה+ש+מ+י+מ = 5+300+40+10+40]
//   6. וְאֵת       (VeEt)      = 407  [ו+א+ת = 6+1+400]
//   7. הָאָרֶץ     (HaAretz)   = 296  [ה+א+ר+צ = 5+1+200+90]
//
// The 7 words mirror the 7 days of creation:
//   Word 1 (913): "In the beginning" — Day 0/creation frame
//   Word 2 (203): "created"         — active creation verb
//   Word 3 (86):  "God"             — the creator, lowest value
//   Word 4 (401): "the"             — connector, 20th prime?
//   Word 5 (395): "heavens"         — the celestial
//   Word 6 (407): "and the"         — connective tissue
//   Word 7 (296): "earth"           — ground frequency
//
// Visualization: Waterfall spectrogram.
// Y-axis = frequency (mapped from word values).
// X-axis = spatial position.
// Time-varying amplitude makes each word "appear" as a bright band,
// then fade, as if reading the sentence aloud into a spectrograph.

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

const float TAU = 6.28318530718;

// ─── Genesis 1:1 — 7 word values ─────────────────────────────────────────────
const int N_WORDS = 7;
float genesisWords[7];  // can't do const array in GLSL ES 1.00 — use function

float getWordValue(int i) {
    if (i == 0) return 913.0;  // Bereishit
    if (i == 1) return 203.0;  // Bara
    if (i == 2) return  86.0;  // Elohim
    if (i == 3) return 401.0;  // Et
    if (i == 4) return 395.0;  // HaShamayim
    if (i == 5) return 407.0;  // VeEt
    return 296.0;               // HaAretz
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Word hue: each of the 7 words has a distinct color (rainbow)
vec3 wordColor(int i) {
    float hue = float(i) / 7.0;
    return hsv2rgb(vec3(hue, 0.85, 1.0));
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float x    = uv.x;
    float y    = uv.y;    // -0.5 to 0.5
    float t    = u_time * 0.3;

    float scale = 700.0;

    // ── Spectrogram layout ────────────────────────────────────────────────
    // Y-axis: frequency, mapped from 0 (bottom) to 1 (top)
    // covering the range of Genesis values (86-913)
    float minVal = 86.0;
    float maxVal = 913.0;
    float freqAtY = mix(minVal, maxVal, y + 0.5);  // linear freq at this y

    // ── Time scrolling: phrase moves left, creates waterfall ─────────────
    float scrollSpeed = 0.4;
    float scrollX = x - t * scrollSpeed;

    // Total phrase duration proportional to sum of word values
    float totalPhrase = 7.0 * 2.0;  // 7 words, 2 units each

    // ── For each word, draw a horizontal spectral band ────────────────────
    vec3 spectrogramColor = vec3(0.0);
    float totalIntensity = 0.0;

    for (int i = 0; i < N_WORDS; i++) {
        float wordVal = getWordValue(i);
        float wordFreq = wordVal;

        // Temporal position: when does this word "sound"?
        float wordTime = float(i) / float(N_WORDS) * totalPhrase;
        float wordPhase = mod(scrollX + wordTime, totalPhrase) / totalPhrase;

        // Amplitude envelope: Gaussian in time around this word's moment
        float wordX = mod(t * scrollSpeed + float(i) * 2.0, totalPhrase * scrollSpeed + 1.0) - 0.5;
        float timeEnv = exp(-pow(x - wordX, 2.0) / 0.02);
        timeEnv = max(timeEnv, 0.05);  // residual presence

        // Spectral content: Gaussian band around the word's frequency
        float freqEnv = exp(-pow(freqAtY - wordFreq, 2.0) / (wordVal * wordVal * 0.05));

        // Harmonic overtones: each word excites its harmonics
        float harmonics = 0.0;
        for (int n = 1; n <= 4; n++) {
            float harmFreq = wordFreq / float(n);
            float harmEnv = exp(-pow(freqAtY - harmFreq, 2.0) / (harmFreq * harmFreq * 0.1));
            harmonics += harmEnv / float(n);
        }
        freqEnv += harmonics * 0.3;

        // Spatial ripple: the word radiates outward
        float ripple = 0.5 + 0.5 * cos(TAU * wordFreq / scale * (x - wordX) - t * 2.0);

        float intensity = freqEnv * timeEnv * ripple;

        spectrogramColor += wordColor(i) * intensity;
        totalIntensity += intensity;
    }

    // ── Background: dark with faint frequency grid ────────────────────────
    // Horizontal lines at each word's frequency
    float freqGrid = 0.0;
    for (int i = 0; i < N_WORDS; i++) {
        float wv = getWordValue(i);
        float gridLine = exp(-pow(freqAtY - wv, 2.0) / 200.0);
        freqGrid += gridLine * 0.08;
    }

    vec3 bg = hsv2rgb(vec3(0.6, 0.5, freqGrid));

    // ── Combine ───────────────────────────────────────────────────────────
    vec3 col = bg + spectrogramColor * 2.0;
    col = clamp(col, 0.0, 1.0);

    // ── Edge fade ─────────────────────────────────────────────────────────
    float edgeFade = (1.0 - smoothstep(0.4, 0.5, abs(x)))
                   * (1.0 - smoothstep(0.4, 0.5, abs(y)));
    col *= edgeFade;

    gl_FragColor = vec4(col, 1.0);
}

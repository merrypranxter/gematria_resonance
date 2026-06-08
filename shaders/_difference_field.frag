// _difference_field.frag
// Difference Field — Value Differences as Spatial Gradients
//
// The "distance" between word values in gematria space maps to a
// potential landscape — a height field where peaks represent values
// and valleys represent the negative space between them.
//
// This shader takes 8 encoded word values and visualizes their
// pairwise difference landscape as a 3D-ish heightmap with
// simulated lighting (Phong-style normal estimation).
//
// Encoded values (mixed systems for cross-language comparison):
//   v[0] = 26    YHWH (Hebrew standard)
//   v[1] = 86    ELOHIM (Hebrew standard)
//   v[2] = 373   LOGOS (Greek isopsephy)
//   v[3] = 1224  ICHTHYS (Greek isopsephy)
//   v[4] = 26    GOD (English ordinal) — same as YHWH!
//   v[5] = 54    LOVE (English ordinal)
//   v[6] = 432   MONEY (English Sumerian)
//   v[7] = 296   EARTH/ARETZ (Hebrew: ה+א+ר+צ = 5+1+200+90)
//
// Height function:
//   h(x,y) = Σ_i  A_i * exp(-((freq_i * r_i - value_i/scale)^2))
// where r_i = distance from uv to "source point" of word i.
//
// Normal estimation: sample height at ±epsilon neighbors,
// compute gradient ∇h, derive surface normal, apply lighting.
// The result: a glowing 3D potential landscape of gematria values.

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

const float TAU = 6.28318530718;
const int N_VALS = 8;

// ─── Value lookup ─────────────────────────────────────────────────────────────
float getValue(int i) {
    if (i == 0) return  26.0;
    if (i == 1) return  86.0;
    if (i == 2) return 373.0;
    if (i == 3) return 1224.0;
    if (i == 4) return  26.0;
    if (i == 5) return  54.0;
    if (i == 6) return 432.0;
    return 296.0;
}

// Source position for each value (arranged in an octagram)
vec2 getSource(int i, float t) {
    float angle = TAU * float(i) / float(N_VALS) + t * 0.05;
    float radius = 0.35;
    return vec2(cos(angle), sin(angle)) * radius;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Height field: sum of Gaussian peaks + difference modulations
float heightField(vec2 uv, float t) {
    float h = 0.0;
    float scale = 1000.0;

    for (int i = 0; i < N_VALS; i++) {
        float vi = getValue(i);
        vec2  src = getSource(i, t);
        float d   = length(uv - src);
        float freq = vi / scale;

        // Primary Gaussian peak centered at source
        h += exp(-d * d / 0.03) * 0.5;

        // Radial wave at this frequency
        h += 0.2 * (0.5 + 0.5 * cos(TAU * freq * d * 10.0 - t * 0.5));

        // Difference modulation with all other values
        for (int j = i + 1; j < N_VALS; j++) {
            float vj = getValue(j);
            vec2  sj = getSource(j, t);
            float dj = length(uv - sj);

            float diffFreq = abs(vi - vj) / scale;
            float midX = (src.x + sj.x) * 0.5;
            float midY = (src.y + sj.y) * 0.5;
            vec2 mid = vec2(midX, midY);
            float dm = length(uv - mid);

            // Difference interference between the two sources
            h += 0.04 * exp(-dm * dm / 0.1)
               * (0.5 + 0.5 * cos(TAU * diffFreq * (d - dj) * 5.0 - t));
        }
    }

    return clamp(h, 0.0, 1.0);
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t    = u_time * 0.2;

    // ── Height field ──────────────────────────────────────────────────────
    float h = heightField(uv, t);

    // ── Normal estimation by finite differences ───────────────────────────
    float eps = 0.005;
    float hx = heightField(uv + vec2(eps, 0.0), t) - heightField(uv - vec2(eps, 0.0), t);
    float hy = heightField(uv + vec2(0.0, eps), t) - heightField(uv - vec2(0.0, eps), t);
    vec3 normal = normalize(vec3(-hx / (2.0 * eps), -hy / (2.0 * eps), 0.1));

    // ── Lighting ──────────────────────────────────────────────────────────
    // Light comes from upper-left, rotates slowly
    float lightAngle = t * 0.3;
    vec3 lightDir = normalize(vec3(cos(lightAngle), sin(lightAngle), 0.8));

    float diffuse  = max(0.0, dot(normal, lightDir));
    vec3  halfVec  = normalize(lightDir + vec3(0.0, 0.0, 1.0));
    float specular = pow(max(0.0, dot(normal, halfVec)), 32.0);

    // ── Color mapping ─────────────────────────────────────────────────────
    // Height → hue: valleys are deep blue, peaks are gold
    float hue = mix(0.62, 0.12, h);
    float sat = 0.7 + h * 0.2;
    float val = 0.1 + h * 0.6;

    vec3 baseColor = hsv2rgb(vec3(hue, sat, val));
    vec3 col = baseColor * (0.3 + 0.7 * diffuse) + vec3(1.0, 0.95, 0.8) * specular * 0.5;

    // ── Highlight equal-value nodes (YHWH=GOD=26) ─────────────────────────
    // Where h is highest and two equal-value sources are near, add gold
    vec2 src0 = getSource(0, t);  // YHWH=26
    vec2 src4 = getSource(4, t);  // GOD=26
    float equalZone = exp(-length(uv - src0) / 0.08) + exp(-length(uv - src4) / 0.08);
    col += vec3(1.0, 0.9, 0.3) * equalZone * h * 0.3;

    // ── Edge vignette ──────────────────────────────────────────────────────
    float r = length(uv);
    col *= 1.0 - smoothstep(0.55, 0.95, r);

    gl_FragColor = vec4(col, 1.0);
}

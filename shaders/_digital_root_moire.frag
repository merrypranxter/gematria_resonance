// _digital_root_moire.frag
// Digital Root Moiré — 9-Cycle Interference Grid
//
// Each cell (ix, iy) in the grid carries frequency = digitalRoot(ix + iy).
// The resulting interference between adjacent cells with different
// digital roots creates a characteristic moiré pattern with 9-fold
// repetition period.
//
// Mathematical foundation:
//   digitalRoot(n) = 1 + mod(n-1, 9)  for n > 0
//   digitalRoot(n) cycles: 1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,...
//
// For coordinates (ix, iy):
//   dr(ix+iy) creates a diagonal pattern of 9-cycle stripes
//   dr(ix*iy) creates a multiplication table moiré
//   dr(ix^2+iy^2) creates circular 9-cycle rings
//
// Interference between these three patterns produces a rich moiré
// landscape that "beats" with period 9 in all directions.
//
// Time evolution: the phase of each sub-pattern drifts at slightly
// different rates, causing the interference to slowly morph while
// maintaining the 9-fold structure.
//
// Color: 9-step rainbow, one hue per digital root value.
// The 9 = completion/rest appears as a special bright region.

precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

const float TAU = 6.28318530718;
const float NINE = 9.0;

// ─── Digital root ─────────────────────────────────────────────────────────────
float dr(float n) {
    n = abs(n);
    float r = mod(n, NINE);
    return r < 0.5 ? NINE : r;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// 9-cycle hue: maps dr value (1-9) to full rainbow
vec3 drColor(float d) {
    float hue = (d - 1.0) / NINE;
    return hsv2rgb(vec3(hue, 0.9, 1.0));
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float t    = u_time * 0.25;

    // ── Grid coordinates ──────────────────────────────────────────────────
    float gridScale = 8.0;
    vec2  grid = uv * gridScale;
    float ix = floor(grid.x);
    float iy = floor(grid.y);
    vec2  frac = fract(grid) - 0.5;

    // ── Digital root of three different coordinate functions ─────────────
    float dr_sum  = dr(ix + iy);                          // diagonal stripes
    float dr_prod = dr(abs(ix * iy) + 1.0);              // multiplication table
    float dr_dist = dr(floor(sqrt(ix*ix + iy*iy)) + 1.0);// distance rings

    // ── Cell wave at its digital root frequency ───────────────────────────
    // Each cell oscillates at frequency proportional to its dr value
    float cellFreq_sum  = dr_sum  / NINE;
    float cellFreq_prod = dr_prod / NINE;
    float cellFreq_dist = dr_dist / NINE;

    float wave_sum  = 0.5 + 0.5 * cos(TAU * cellFreq_sum  * length(frac) * 4.0 - t * dr_sum  * 0.3);
    float wave_prod = 0.5 + 0.5 * cos(TAU * cellFreq_prod * length(frac) * 4.0 - t * dr_prod * 0.25);
    float wave_dist = 0.5 + 0.5 * cos(TAU * cellFreq_dist * length(frac) * 4.0 - t * dr_dist * 0.2);

    // ── Moiré: super-impose grids at different scales ─────────────────────
    // A second grid slightly offset creates the classic moiré
    float grid2Scale = gridScale * (1.0 + 0.1 * sin(t * 0.1));
    vec2  grid2 = uv * grid2Scale;
    float ix2 = floor(grid2.x);
    float iy2 = floor(grid2.y);
    float dr2 = dr(ix2 + iy2 + 3.0);  // offset by 3 (triangular number hint)
    float wave2 = 0.5 + 0.5 * cos(TAU * dr2 / NINE * length(fract(grid2) - 0.5) * 4.0 - t * 0.4);

    // ── Interference: multiply the two grids ─────────────────────────────
    float moire = wave_sum * wave2;
    float moire2 = wave_prod * wave_dist;

    // ── Composite field ───────────────────────────────────────────────────
    float field = moire * 0.45 + moire2 * 0.35 + (wave_sum + wave_prod + wave_dist) / 3.0 * 0.20;

    // ── Color: blend between the three dr colors ──────────────────────────
    vec3 col1 = drColor(dr_sum);
    vec3 col2 = drColor(dr_prod);
    vec3 col3 = drColor(dr_dist);

    vec3 col = col1 * wave_sum * 0.4 + col2 * wave_prod * 0.3 + col3 * wave_dist * 0.3;
    col *= field * 1.5;

    // ── Special: dr = 9 (completion) → bright white-gold highlight ────────
    float is9 = step(8.5, dr_sum) + step(8.5, dr_prod) + step(8.5, dr_dist);
    col = mix(col, vec3(1.0, 0.95, 0.7) * field, is9 * 0.4);

    // ── Grid cell borders ─────────────────────────────────────────────────
    float border = smoothstep(0.45, 0.5, max(abs(frac.x), abs(frac.y)));
    col = mix(col, vec3(0.05, 0.05, 0.1), border * 0.5);

    // ── Edge vignette ──────────────────────────────────────────────────────
    float r = length(uv);
    col *= 1.0 - smoothstep(0.55, 0.95, r);

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}

// _hebrew_word_fingerprint.frag
// Gematria resonance: Hebrew word value mapped to radial frequency pattern
// Mispar Hechrechi: א=1, ב=2, ..., י=10, כ=20, ..., ת=400

precision highp float;

uniform float u_time;
uniform vec2 u_resolution;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

// Hebrew letter values (simplified mapping for demo)
// We use a deterministic hash to simulate word-to-value conversion
float wordValue(float seed) {
    // Generate a value between 1-1000 for demo purposes
    return 100.0 + 900.0 * hash(vec2(seed, 0.0));
}

// Digital root: recursive reduction to single digit
float digitalRoot(float n) {
    float root = n;
    for (int i = 0; i < 5; i++) {
        if (root < 10.0) break;
        float sum = 0.0;
        float temp = root;
        for (int j = 0; j < 5; j++) {
            if (temp < 1.0) break;
            sum += floor(temp / 10.0) * 10.0; // wrong... let's just use mod
            temp = floor(temp / 10.0);
        }
        // Actually for shader, let's just use a simple approximation
        root = mod(root, 9.0);
        if (root == 0.0) root = 9.0;
    }
    return root;
}

// Radial frequency pattern from word value
float radialPattern(vec2 uv, float value, float t) {
    float r = length(uv);
    float angle = atan(uv.y, uv.x);
    
    // Frequency = value / scale
    float freq = value / 50.0;
    
    // Primary standing wave
    float wave1 = sin(r * freq * 6.28318 * 10.0 + t * 0.5);
    
    // Secondary harmonic (octave)
    float wave2 = sin(r * freq * 2.0 * 6.28318 * 10.0 + t * 0.3);
    
    // Angular modulation based on digital root
    float root = digitalRoot(value);
    float angularWave = sin(angle * root + t * 0.2);
    
    // Combine
    float pattern = wave1 * 0.5 + wave2 * 0.25 + angularWave * 0.25;
    return pattern;
}

// Multiple word interference (beat patterns)
float interferencePattern(vec2 uv, float t) {
    float pattern = 0.0;
    
    // Three words with different values creating interference
    float word1 = wordValue(1.0); // ~350
    float word2 = wordValue(2.0); // ~720
    float word3 = wordValue(3.0); // ~150
    
    float p1 = radialPattern(uv, word1, t);
    float p2 = radialPattern(uv, word2, t);
    float p3 = radialPattern(uv, word3, t);
    
    pattern = p1 * 0.4 + p2 * 0.35 + p3 * 0.25;
    
    // Beat pattern from difference frequencies
    float beat = sin((word1 - word2) * r * 0.1 + t);
    pattern += beat * 0.1;
    
    return pattern;
}

// Sacred word presets (for demo)
float tetragrammatonValue() {
    // YHWH = 10 + 5 + 6 + 5 = 26
    return 26.0;
}

float logosValue() {
    // Greek Logos = 373
    return 373.0;
}

float ichthysValue() {
    // ΙΧΘΥΣ = 1224
    return 1224.0;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    float r = length(uv);
    float angle = atan(uv.y, uv.x);
    
    // Select word based on time (cycles through presets)
    float cycle = mod(u_time * 0.2, 3.0);
    float value;
    vec3 baseColor;
    
    if (cycle < 1.0) {
        value = tetragrammatonValue();
        baseColor = vec3(0.8, 0.7, 0.5); // gold/white
    } else if (cycle < 2.0) {
        value = logosValue();
        baseColor = vec3(0.3, 0.5, 0.8); // blue/silver
    } else {
        value = ichthysValue();
        baseColor = vec3(0.6, 0.8, 0.6); // green/water
    }
    
    // Generate pattern from word value
    float pattern = radialPattern(uv, value, u_time);
    
    // Convert to color
    float patternNorm = pattern * 0.5 + 0.5; // -1..1 to 0..1
    
    // Color mapping: dark center to bright edges, modulated by pattern
    vec3 darkColor = vec3(0.02, 0.01, 0.05);
    vec3 midColor = baseColor * 0.5;
    vec3 brightColor = baseColor * 1.2;
    
    vec3 color = mix(darkColor, midColor, smoothstep(0.0, 0.5, r));
    color = mix(color, brightColor, smoothstep(0.3, 0.8, r) * patternNorm);
    
    // Add radial lines from digital root
    float root = digitalRoot(value);
    float radialLines = sin(angle * root) * 0.5 + 0.5;
    color += baseColor * radialLines * 0.1 * smoothstep(0.2, 0.9, r);
    
    // Frequency rings (harmonic series)
    for (float i = 1.0; i <= 5.0; i++) {
        float harmonic = value / i;
        float ring = smoothstep(0.02, 0.0, abs(r - harmonic / 100.0));
        color += baseColor * ring * 0.15;
    }
    
    // Central glow
    float centerGlow = exp(-r * r * 100.0) * 0.5;
    color += baseColor * centerGlow;
    
    gl_FragColor = vec4(color, 1.0);
}

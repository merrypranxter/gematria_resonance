# Shader Guide — Using the Gematria Resonance Shaders

All shaders are written in GLSL ES 1.00 style (WebGL 1 compatible). They can be run in Shadertoy, Three.js, or any WebGL environment.

---

## Quick Start

### Shadertoy

1. Go to [shadertoy.com](https://www.shadertoy.com) → New Shader
2. Paste the entire `.frag` file content into the editor
3. The `iTime` and `iResolution` uniforms are provided automatically by Shadertoy
4. **Important:** Shadertoy uses `fragColor` not `gl_FragColor`, and provides `iTime`/`iResolution` — adapt uniform names:

```glsl
// Shadertoy adaptation header (add at top of each shader):
// void mainImage(out vec4 fragColor, in vec2 fragCoord) { ... }
// Replace: u_time → iTime
// Replace: u_resolution → iResolution.xy  
// Replace: gl_FragColor → fragColor
```

### Three.js (Recommended)

```html
<canvas id="c"></canvas>
<script type="module">
import * as THREE from 'https://cdn.skypack.dev/three';

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas });
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// Load your fragment shader
const fragmentShader = `/* paste shader here */`;

const material = new THREE.ShaderMaterial({
  uniforms: {
    u_time:       { value: 0.0 },
    u_resolution: { value: new THREE.Vector2(canvas.width, canvas.height) },
    u_word_value: { value: 26.0 },  // for universal fingerprint shader
  },
  fragmentShader
});

const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
scene.add(mesh);

function animate(t) {
  requestAnimationFrame(animate);
  material.uniforms.u_time.value = t / 1000;
  renderer.render(scene, camera);
}
requestAnimationFrame(animate);
</script>
```

### The Book of Shaders Editor

At [editor.thebookofshaders.com](https://editor.thebookofshaders.com):
- Paste the shader
- `u_time` and `u_resolution` are already provided

---

## Uniforms Reference

### All Shaders (Required)

| Uniform | Type | Description |
|---------|------|-------------|
| `u_time` | float | Time in seconds (drives animation) |
| `u_resolution` | vec2 | Canvas size in pixels |

### `_word_fingerprint_universal.frag`

| Uniform | Type | Default | Description |
|---------|------|---------|-------------|
| `u_word_value` | float | 26.0 | Any gematria value. Try: 26 (YHWH), 373 (LOGOS), 1224 (ICHTHYS), 54 (LOVE), 13 (AHAVAH) |

```javascript
// Example: cycle through values
const words = [26, 86, 13, 373, 1224, 54, 441];
let i = 0;
setInterval(() => {
  material.uniforms.u_word_value.value = words[i++ % words.length];
}, 3000);
```

### `_phrase_interference.frag`

| Uniform | Type | Default | Description |
|---------|------|---------|-------------|
| `u_word1` | float | 913.0 | First word value (default: Bereishit) |
| `u_word2` | float | 203.0 | Second word value (default: Bara) |
| `u_word3` | float | 86.0 | Third word value (default: Elohim) |
| `u_word4` | float | 401.0 | Fourth word value (default: Et) |

**Preset configurations:**

```javascript
// Genesis 1:1 opening
{ u_word1: 913, u_word2: 203, u_word3: 86, u_word4: 401 }

// Gospel of John: "In the beginning was the Word"
// (approximate English ordinal)
{ u_word1: 17, u_word2: 2, u_word3: 46, u_word4: 74 }

// Greek sacred quartet: Logos, Theos, Agape, Pneuma
{ u_word1: 373, u_word2: 284, u_word3: 93, u_word4: 576 }
```

### `_ratio_mandala.frag`

| Uniform | Type | Default | Description |
|---------|------|---------|-------------|
| `u_value_a` | float | 373.0 | First value (numerator) |
| `u_value_b` | float | 1224.0 | Second value (denominator) |

**Try musical intervals:**

```javascript
// Octave: 2:1
{ u_value_a: 52, u_value_b: 26 }   // any value with its double

// Perfect Fifth: 3:2
{ u_value_a: 300, u_value_b: 200 }

// Major Third: 5:4
{ u_value_a: 125, u_value_b: 100 }

// Sacred ratio: YHWH:ELOHIM ≈ 3:10
{ u_value_a: 26, u_value_b: 86 }

// Sacred ratio: LOGOS:ICHTHYS ≈ 3:10
{ u_value_a: 373, u_value_b: 1224 }
```

---

## Shader Descriptions

| File | Description | Key Uniforms |
|------|-------------|-------------|
| `_field_hebrew_standard.frag` | Mispar Hechrechi radial interference; gold palette | — |
| `_field_hebrew_ordinal.frag` | 22-fold ordinal symmetry; silver-blue | — |
| `_field_hebrew_reduced.frag` | 9-cycle moiré; digital root rainbow | — |
| `_field_greek_isopsephy.frag` | Flower-of-life; LOGOS/ICHTHYS | — |
| `_field_english_ordinal.frag` | Lissajous grid; cross-language GOD=26 | — |
| `_field_english_reduced.frag` | Outward-collapse spiral; LOVE=9 | — |
| `_field_english_sumerian.frag` | Hexagonal grid; MONEY=432 | — |
| `_field_english_reverse.frag` | Mirror mandala; LOVE palindrome | — |
| `_word_fingerprint_universal.frag` | Any value → radial fingerprint | u_word_value |
| `_phrase_interference.frag` | 4 words → wave train superposition | u_word1..4 |
| `_ratio_mandala.frag` | 2 values → harmonic ratio mandala | u_value_a, u_value_b |
| `_text_scroll.frag` | Genesis 1:1 spectrogram waterfall | — |
| `_equal_words_network.frag` | Resonance node network | — |
| `_difference_field.frag` | 3D height field; potential landscape | — |
| `_digital_root_moire.frag` | 9-cycle moiré grid | — |
| `_cross_language.frag` | Hebrew/Greek/English LOVE comparison | — |
| `_sacred_genesis_bereishit.frag` | 7-word creation interference | — |
| `_sacred_tetragrammaton.frag` | YHWH 4-letter superposition; gold | — |
| `_sacred_logos_word.frag` | LOGOS=373 prime crystal | — |
| `_sacred_ichthys_fish.frag` | ICHTHYS=1224 vesica piscis | — |
| `_sacred_tree_of_life.frag` | 10 sefirot + 22 paths; flowing energy | — |
| `_hebrew_word_fingerprint.frag` | Original example (see shaders/README) | — |

---

## Performance Notes

- All shaders use `precision highp float` — required for accurate large-value computations (e.g., ICHTHYS=1224)
- Shaders with inner loops (e.g., `_sacred_tree_of_life.frag`) may be slower on mobile GPUs
- The `_difference_field.frag` uses a double loop (O(n²) pairs) — for 8 values this is 28 pairs, acceptable
- For best performance on mobile, reduce loop iterations in `_phrase_interference.frag` and `_ratio_mandala.frag`

---

## Passing Word Values Programmatically

To encode a word as a gematria value in JavaScript:

```javascript
// English Ordinal: A=1..Z=26
function englishOrdinal(word) {
  return word.toUpperCase().split('').reduce((sum, c) => {
    const v = c.charCodeAt(0) - 64;
    return sum + (v >= 1 && v <= 26 ? v : 0);
  }, 0);
}

// English Reduced: digital root
function digitalRoot(n) {
  while (n > 9) n = String(n).split('').reduce((s,d) => s + +d, 0);
  return n;
}
function englishReduced(word) { return digitalRoot(englishOrdinal(word)); }

// English Sumerian: ordinal × 6
function englishSumerian(word) { return englishOrdinal(word) * 6; }

// Hebrew Standard (requires Hebrew character mapping)
const HEBREW_VALUES = {
  'א':1,'ב':2,'ג':3,'ד':4,'ה':5,'ו':6,'ז':7,'ח':8,'ט':9,
  'י':10,'כ':20,'ל':30,'מ':40,'נ':50,'ס':60,'ע':70,'פ':80,'צ':90,
  'ק':100,'ר':200,'ש':300,'ת':400
};
function hebrewStandard(word) {
  return [...word].reduce((s, c) => s + (HEBREW_VALUES[c] || 0), 0);
}

// Usage
material.uniforms.u_word_value.value = englishOrdinal('LOVE');  // 54
material.uniforms.u_word1.value = hebrewStandard('בראשית');     // 913
```

---

## Extending the Shaders

To add a new word value to any system shader, simply add:

```glsl
// At the top (constants):
const float MY_WORD = 123.0;  // YOURWORD = Y(x)+O(y)+U(z)+...

// In main():
float myFreq = MY_WORD / SCALE;
float myWave = 0.5 + 0.5 * cos(TAU * myFreq * r - t * 0.8);

// Add to composite:
field += myWave * 0.10;
```

The shader will automatically incorporate your word's frequency into the interference pattern.

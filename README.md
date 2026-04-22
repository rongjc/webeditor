# MovieMaker-style WebAssembly Video SDK

This repository contains a lightweight SDK for building browser-based video editing experiences similar to classic MovieMaker:

- **Timeline editing** (tracks, clips, trim operations)
- **Fast pixel effects** with a WebAssembly core (`grayscale`, `brightness`)
- **Automatic JS fallback** when WASM is unavailable

## Structure

- `src/sdk.js` — high-level SDK entry point
- `src/timeline.js` — timeline/clip editing model
- `src/effects.js` — effects engine + JS fallback
- `src/wasm/video-core.wat` — WebAssembly text module for pixel effects
- `src/wasm/loader.js` — WASM loader + typed-array bridge

## Quick start

```js
import { MovieMakerWasmSDK } from "./src/sdk.js";

const sdk = await MovieMakerWasmSDK.create({
  wasmUrl: "/video-core.wasm" // optional, JS fallback works without this
});

const track = sdk.timeline.addTrack("video");
sdk.timeline.addClip(track, {
  source: "intro.mp4",
  startMs: 0,
  endMs: 3000
});

const project = sdk.createProject({ width: 1920, height: 1080, fps: 30 });
console.log(project);
```

## How to test

### 1) Install prerequisites

- Node.js 20+
- Optional: `wat2wasm` (from WABT) if you want to test the real WASM module in a browser

### 2) Run automated checks

```bash
npm test
npm run lint
npm run smoke
```

What each command validates:

- `npm test` checks timeline behavior and deterministic pixel effects fallback.
- `npm run lint` performs syntax validation for source and tests.
- `npm run smoke` runs both commands together.

### 3) Browser testing (JS fallback path)

```bash
npm run serve-demo
```

Then open: `http://localhost:4173/examples/basic.html`

This validates SDK creation, timeline operations, and project export in a real browser environment without requiring a `.wasm` binary.

### 4) Browser testing (WASM path)

Compile `src/wasm/video-core.wat`:

```bash
wat2wasm src/wasm/video-core.wat -o examples/video-core.wasm
```

Update demo initialization to pass:

```js
MovieMakerWasmSDK.create({ wasmUrl: "/examples/video-core.wasm" })
```

Then reload `http://localhost:4173/examples/basic.html` and verify there are no fallback warnings in devtools.

## Building the WASM artifact

`src/wasm/video-core.wat` should be compiled into a `.wasm` binary using your preferred toolchain (for example, `wat2wasm`) and then hosted at `wasmUrl`.

## Performance notes

- Pixel processing is done in-place in linear memory to reduce allocations.
- RGBA buffers are handled as `Uint8ClampedArray`.
- Timeline editing avoids heavy dependencies and keeps operations O(n log n) only when sorting clips.

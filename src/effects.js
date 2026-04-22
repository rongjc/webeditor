function grayscaleJs(pixels) {
  const out = new Uint8ClampedArray(pixels);
  for (let i = 0; i < out.length; i += 4) {
    const luma = (77 * out[i] + 150 * out[i + 1] + 29 * out[i + 2]) >> 8;
    out[i] = luma;
    out[i + 1] = luma;
    out[i + 2] = luma;
  }
  return out;
}

function brightnessJs(pixels, delta) {
  const out = new Uint8ClampedArray(pixels);
  for (let i = 0; i < out.length; i += 4) {
    out[i] = Math.min(255, Math.max(0, out[i] + delta));
    out[i + 1] = Math.min(255, Math.max(0, out[i + 1] + delta));
    out[i + 2] = Math.min(255, Math.max(0, out[i + 2] + delta));
  }
  return out;
}

export class EffectEngine {
  constructor(wasmCore = null) {
    this.wasmCore = wasmCore;
  }

  grayscale(pixels) {
    return this.wasmCore ? this.wasmCore.runGrayscale(pixels) : grayscaleJs(pixels);
  }

  brightness(pixels, delta = 0) {
    return this.wasmCore ? this.wasmCore.runBrightness(pixels, delta) : brightnessJs(pixels, delta);
  }
}

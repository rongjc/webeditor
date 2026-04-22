const PAGE_BYTES = 64 * 1024;

export class WasmVideoCore {
  #instance;
  #memory;

  static async fromUrl(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load wasm module: ${response.status}`);
    }

    const moduleBytes = await response.arrayBuffer();
    return WasmVideoCore.fromBytes(moduleBytes);
  }

  static async fromBytes(moduleBytes) {
    const { instance } = await WebAssembly.instantiate(moduleBytes, {});
    return new WasmVideoCore(instance);
  }

  constructor(instance) {
    this.#instance = instance;
    this.#memory = instance.exports.memory;

    if (!this.#memory || !instance.exports.grayscale || !instance.exports.brightness) {
      throw new Error("WASM module missing required exports: memory, grayscale, brightness");
    }
  }

  runGrayscale(pixels) {
    const ptr = this.#copyToWasm(pixels);
    this.#instance.exports.grayscale(ptr, pixels.byteLength);
    return this.#readFromWasm(ptr, pixels.byteLength);
  }

  runBrightness(pixels, delta) {
    const ptr = this.#copyToWasm(pixels);
    this.#instance.exports.brightness(ptr, pixels.byteLength, delta | 0);
    return this.#readFromWasm(ptr, pixels.byteLength);
  }

  #copyToWasm(pixels) {
    const needed = pixels.byteLength;
    const pagesNeeded = Math.ceil(needed / PAGE_BYTES);
    const currentPages = this.#memory.buffer.byteLength / PAGE_BYTES;

    if (currentPages < pagesNeeded) {
      this.#memory.grow(pagesNeeded - currentPages);
    }

    const wasmPixels = new Uint8Array(this.#memory.buffer, 0, needed);
    wasmPixels.set(pixels);
    return 0;
  }

  #readFromWasm(ptr, len) {
    const output = new Uint8ClampedArray(len);
    output.set(new Uint8Array(this.#memory.buffer, ptr, len));
    return output;
  }
}

import { Timeline } from "./timeline.js";
import { EffectEngine } from "./effects.js";
import { WasmVideoCore } from "./wasm/loader.js";

export class MovieMakerWasmSDK {
  constructor({ timeline, effects }) {
    this.timeline = timeline;
    this.effects = effects;
  }

  static async create({ wasmUrl } = {}) {
    let wasmCore = null;

    if (wasmUrl) {
      try {
        wasmCore = await WasmVideoCore.fromUrl(wasmUrl);
      } catch (error) {
        console.warn("Falling back to JS effects engine:", error.message);
      }
    }

    return new MovieMakerWasmSDK({
      timeline: new Timeline(),
      effects: new EffectEngine(wasmCore)
    });
  }

  createProject({ width = 1280, height = 720, fps = 30 } = {}) {
    return {
      metadata: {
        width,
        height,
        fps,
        createdAt: new Date().toISOString()
      },
      timeline: this.timeline.exportPlan()
    };
  }
}

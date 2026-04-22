import test from "node:test";
import assert from "node:assert/strict";
import { Timeline } from "../src/timeline.js";
import { EffectEngine } from "../src/effects.js";

test("timeline supports old-moviemaker style clip operations", () => {
  const timeline = new Timeline();
  const videoTrack = timeline.addTrack("video");

  const clipId = timeline.addClip(videoTrack, {
    source: "demo.mp4",
    startMs: 0,
    endMs: 5000
  });

  timeline.trimClip(clipId, { endMs: 3200 });

  const plan = timeline.exportPlan();
  assert.equal(plan.version, 1);
  assert.equal(plan.tracks[0].clips[0].endMs, 3200);
});

test("effects engine has deterministic JS fallback", () => {
  const pixels = new Uint8ClampedArray([255, 100, 0, 255]);
  const effects = new EffectEngine();

  const gray = effects.grayscale(pixels);
  assert.deepEqual(Array.from(gray), [135, 135, 135, 255]);

  const brighter = effects.brightness(gray, 20);
  assert.deepEqual(Array.from(brighter), [155, 155, 155, 255]);
});

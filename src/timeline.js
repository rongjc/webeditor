const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export class Timeline {
  #tracks = [];

  addTrack(kind = "video") {
    const track = { kind, clips: [] };
    this.#tracks.push(track);
    return this.#tracks.length - 1;
  }

  addClip(trackIndex, clip) {
    const track = this.#tracks[trackIndex];
    if (!track) throw new Error(`Track ${trackIndex} does not exist`);
    if (clip.endMs <= clip.startMs) throw new Error("Clip end must be > start");

    const normalized = {
      id: clip.id ?? crypto.randomUUID(),
      source: clip.source,
      startMs: Math.max(0, clip.startMs),
      endMs: clip.endMs,
      mediaStartMs: Math.max(0, clip.mediaStartMs ?? 0),
      mediaEndMs: clip.mediaEndMs ?? Infinity,
      effects: [...(clip.effects ?? [])]
    };

    track.clips.push(normalized);
    track.clips.sort((a, b) => a.startMs - b.startMs);
    return normalized.id;
  }

  trimClip(clipId, { startMs, endMs }) {
    const clip = this.#tracks.flatMap((t) => t.clips).find((c) => c.id === clipId);
    if (!clip) throw new Error(`Clip ${clipId} not found`);

    clip.startMs = clamp(startMs ?? clip.startMs, 0, Number.MAX_SAFE_INTEGER);
    clip.endMs = clamp(endMs ?? clip.endMs, clip.startMs + 1, Number.MAX_SAFE_INTEGER);
  }

  exportPlan() {
    return {
      version: 1,
      tracks: structuredClone(this.#tracks)
    };
  }
}

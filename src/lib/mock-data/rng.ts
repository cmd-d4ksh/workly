/**
 * Deterministic PRNG (mulberry32) so seed data is identical across builds —
 * no flaky snapshot diffs, no "it worked on my machine" demo data drift.
 */
export function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRng(seed: number) {
  const rand = mulberry32(seed);

  return {
    next: rand,
    int(min: number, max: number) {
      return Math.floor(rand() * (max - min + 1)) + min;
    },
    float(min: number, max: number, decimals = 1) {
      const value = rand() * (max - min) + min;
      const factor = 10 ** decimals;
      return Math.round(value * factor) / factor;
    },
    pick<T>(items: readonly T[]): T {
      return items[Math.floor(rand() * items.length)];
    },
    pickMany<T>(items: readonly T[], count: number): T[] {
      const pool = [...items];
      const result: T[] = [];
      for (let i = 0; i < count && pool.length > 0; i++) {
        const idx = Math.floor(rand() * pool.length);
        result.push(pool.splice(idx, 1)[0]);
      }
      return result;
    },
    bool(probability = 0.5) {
      return rand() < probability;
    },
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

let counter = 0;
export function makeId(prefix: string): string {
  counter += 1;
  return `${prefix}_${counter.toString(36).padStart(6, "0")}`;
}

export function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export function daysFromNowIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

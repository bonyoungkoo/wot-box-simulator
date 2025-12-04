import seedrandom from 'seedrandom';

export type Rng = () => number;

export function makeRng(seed?: string): Rng {
  const generator = seedrandom(seed ?? undefined);
  return () => generator();
}

export function roll(rng: Rng, chance: number): boolean {
  if (chance <= 0) {
    return false;
  }
  if (chance >= 1) {
    return true;
  }
  return rng() < chance;
}

// Generic weighted picker so the loot table can bring its own weighting function if needed.
export function pickWeighted<T>(rng: Rng, items: T[], getWeight: (item: T) => number): T;
export function pickWeighted<T extends { weight: number }>(
  rng: Rng,
  items: T[],
  getWeight?: (item: T) => number,
): T;
export function pickWeighted<T>(rng: Rng, items: T[], getWeight?: (item: T) => number): T {
  if (items.length === 0) {
    throw new Error('Cannot pick from an empty collection');
  }

  const weightResolver =
    getWeight ??
    ((item: T) => {
      const candidate = item as unknown as { weight?: number };
      if (typeof candidate.weight !== 'number') {
        throw new Error('Missing weight field. Provide a custom getter.');
      }
      return candidate.weight;
    });

  const totalWeight = items.reduce((sum, item) => {
    const weight = Math.max(0, weightResolver(item));
    return sum + weight;
  }, 0);

  if (totalWeight <= 0) {
    throw new Error('Total weight must be greater than zero');
  }

  let cursor = rng() * totalWeight;
  for (const item of items) {
    cursor -= Math.max(0, weightResolver(item));
    if (cursor <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}

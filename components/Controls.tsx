'use client';

import clsx from 'clsx';
import { FormEvent, useState } from 'react';
import { simulateBoxes } from '../lib/sim';
import { useSimStore } from '../store/simStore';

const parseOwnedIds = (raw: string): string[] =>
  raw
    .split(/[\s,]+/)
    .map((part) => part.trim())
    .filter(Boolean);

export default function Controls() {
  const setResult = useSimStore((state) => state.setResult);
  const [seed, setSeed] = useState('');
  const [boxes, setBoxes] = useState(10);
  const [ownedTankIdsInput, setOwnedTankIds] = useState('');

  const canRun = boxes > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canRun) {
      return;
    }

    const cleanedSeed = seed.trim();
    const ownedTankIds = parseOwnedIds(ownedTankIdsInput);
    const count = Math.max(0, Math.floor(boxes));
    const result = simulateBoxes({
      boxes: count,
      seed: cleanedSeed || undefined,
      ownedTankIds,
    });
    setResult(result);
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700" htmlFor="seed">
            Seed (optional)
          </label>
          <input
            id="seed"
            name="seed"
            type="text"
            className="input"
            placeholder="e.g. holiday-ops-2025"
            value={seed}
            onChange={(event) => setSeed(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700" htmlFor="boxes">
            Boxes
          </label>
          <input
            id="boxes"
            name="boxes"
            type="number"
            min={0}
            className="input"
            value={boxes}
            onChange={(event) => {
              const next = Number(event.target.value);
              setBoxes(Number.isNaN(next) ? 0 : next);
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-medium text-zinc-700">
            <label htmlFor="owned">Owned Tank IDs</label>
            <span className="text-xs font-normal text-zinc-500">comma or newline separated</span>
          </div>
          <textarea
            id="owned"
            name="owned"
            className="input min-h-28"
            placeholder="e.g. bzt-70, stridsyxa"
            value={ownedTankIdsInput}
            onChange={(event) => setOwnedTankIds(event.target.value)}
          />
        </div>

        <button
          type="submit"
          className={clsx('btn w-full', !canRun && 'cursor-not-allowed opacity-50')}
          disabled={!canRun}
        >
          Run Simulation
        </button>
      </form>
    </section>
  );
}

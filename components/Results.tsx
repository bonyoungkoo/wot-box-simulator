'use client';

import clsx from 'clsx';
import { useSimStore } from '../store/simStore';

export default function Results() {
  const result = useSimStore((state) => state.result);

  if (!result || result.items.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 p-6 text-center text-sm text-zinc-500">
        No runs yet. Enter your box count and owned tank IDs, then launch a simulation.
      </section>
    );
  }

  const { summary, items } = result;
  const stats = [
    { label: 'Boxes', value: summary.totalBoxes.toLocaleString() },
    { label: 'Total Gold', value: summary.totalGold.toLocaleString() },
    { label: 'Total Credits', value: summary.totalCredits.toLocaleString() },
    { label: 'Premium Days', value: summary.totalPremiumDays.toLocaleString() },
  ];

  return (
    <section className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-center"
          >
            <p className="text-xs uppercase tracking-wide text-zinc-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900">{stat.value}</p>
          </article>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-100">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-3 py-3">#</th>
              <th className="px-3 py-3">High Tank</th>
              <th className="px-3 py-3">Low Tank</th>
              <th className="px-3 py-3">Gold</th>
              <th className="px-3 py-3">Credits</th>
              <th className="px-3 py-3">Premium</th>
              <th className="px-3 py-3">Pity</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.index}
                className={clsx(
                  'border-b border-zinc-100 last:border-b-0',
                  (item.gotHighTank || item.gotLowTank) && 'bg-amber-50/40',
                )}
              >
                <td className="px-3 py-2 text-xs text-zinc-500">{item.index}</td>
                <td className="px-3 py-2 font-medium text-zinc-900">
                  {item.gotHighTank ? item.gotHighTank.name : 'None'}
                </td>
                <td className="px-3 py-2 text-zinc-700">
                  {item.gotLowTank ? item.gotLowTank.name : 'None'}
                </td>
                <td className="px-3 py-2 tabular-nums text-zinc-800">
                  {item.goldGained.toLocaleString()}
                </td>
                <td className="px-3 py-2 tabular-nums text-zinc-800">
                  {item.creditsGained.toLocaleString()}
                </td>
                <td className="px-3 py-2 tabular-nums text-zinc-800">
                  {item.premiumDaysGained.toLocaleString()}
                </td>
                <td className="px-3 py-2 tabular-nums text-zinc-600">{item.pityCounterAfter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

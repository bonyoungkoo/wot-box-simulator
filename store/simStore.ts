'use client';

import { create } from 'zustand';
import type { SimResult } from '../types/loot';

interface SimStoreState {
  result: SimResult | null;
  setResult: (result: SimResult | null) => void;
}

export const useSimStore = create<SimStoreState>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
}));

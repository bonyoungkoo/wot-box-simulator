'use client';

import { create } from 'zustand';
import type { BoxResultItem, SummaryResult } from '../types/loot';

interface BoxStoreState {
  openedBoxes: BoxResultItem[];
  summary: SummaryResult;
  currentPityCounter: number;
  ownedTankIds: string[];
  ownedStyleIds: string[];
  ownedAttachmentIds: string[];
  addBoxes: (items: BoxResultItem[]) => void;
  reset: () => void;
}

const initialSummary: SummaryResult = {
  totalBoxes: 0,
  totalGold: 0,
  totalCredits: 0,
  totalPremiumDays: 0,
  highTanks: [],
  lowTanks: [],
  styles: [],
  attachments: [],
};

export const useBoxStore = create<BoxStoreState>((set) => ({
  openedBoxes: [],
  summary: initialSummary,
  currentPityCounter: 0,
  ownedTankIds: [],
  ownedStyleIds: [],
  ownedAttachmentIds: [],
  addBoxes: (items) =>
    set((state) => {
      const newBoxes = [...items, ...state.openedBoxes].slice(0, 5); // 최근 5개만 유지

      // 새로 획득한 전차 ID 수집
      const newTankIds: string[] = [];
      items.forEach((item) => {
        if (item.gotHighTank && !state.ownedTankIds.includes(item.gotHighTank.id)) {
          newTankIds.push(item.gotHighTank.id);
        }
        if (item.gotLowTank && !state.ownedTankIds.includes(item.gotLowTank.id)) {
          newTankIds.push(item.gotLowTank.id);
        }
      });
      const updatedOwnedTankIds = [...state.ownedTankIds, ...newTankIds];

      const newStyleIds: string[] = [];
      const newAttachmentIds: string[] = [];
      items.forEach((item) => {
        if (item.gotStyle && !state.ownedStyleIds.includes(item.gotStyle.id)) {
          newStyleIds.push(item.gotStyle.id);
        }
        if (
          item.gotAttachment &&
          !(state.ownedAttachmentIds ?? []).includes(item.gotAttachment.id) &&
          !newAttachmentIds.includes(item.gotAttachment.id)
        ) {
          newAttachmentIds.push(item.gotAttachment.id);
        }
      });
      const updatedOwnedStyleIds = [...state.ownedStyleIds, ...newStyleIds];
      const updatedOwnedAttachmentIds = [...(state.ownedAttachmentIds ?? []), ...newAttachmentIds];

      // 전차가 나온 아이템이 있으면 가장 마지막에 나온 전차의 pityCounterAfter를 사용 (0으로 초기화됨)
      // 없으면 마지막 아이템의 pityCounterAfter를 사용
      const tankItems = items.filter((item) => item.gotHighTank || item.gotLowTank);
      let newPityCounter = state.currentPityCounter;

      if (tankItems.length > 0) {
        // 전차가 나온 경우, 가장 마지막에 나온 전차의 pityCounterAfter를 사용 (0으로 초기화됨)
        const lastTankItem = tankItems[tankItems.length - 1];
        newPityCounter = lastTankItem.pityCounterAfter;
      } else if (items.length > 0) {
        // 전차가 안 나온 경우, 마지막 아이템의 pityCounterAfter를 사용
        const lastItem = items[items.length - 1];
        newPityCounter = lastItem.pityCounterAfter;
      }

      const newSummary: SummaryResult = {
        totalBoxes: state.summary.totalBoxes + items.length,
        totalGold: state.summary.totalGold + items.reduce((sum, item) => sum + item.goldGained, 0),
        totalCredits:
          state.summary.totalCredits + items.reduce((sum, item) => sum + item.creditsGained, 0),
        totalPremiumDays:
          state.summary.totalPremiumDays +
          items.reduce((sum, item) => sum + item.premiumDaysGained, 0),
        highTanks: [
          ...state.summary.highTanks,
          ...items.filter((item) => item.gotHighTank).map((item) => item.gotHighTank!),
        ],
        lowTanks: [
          ...state.summary.lowTanks,
          ...items.filter((item) => item.gotLowTank).map((item) => item.gotLowTank!),
        ],
        styles: [
          ...state.summary.styles,
          ...items.filter((item) => item.gotStyle).map((item) => item.gotStyle!),
        ],
        attachments: [
          ...state.summary.attachments,
          ...items.filter((item) => item.gotAttachment).map((item) => item.gotAttachment!),
        ],
      };
      return {
        openedBoxes: newBoxes,
        summary: newSummary,
        currentPityCounter: newPityCounter,
        ownedTankIds: updatedOwnedTankIds,
        ownedStyleIds: updatedOwnedStyleIds,
        ownedAttachmentIds: updatedOwnedAttachmentIds,
      };
    }),
  reset: () =>
    set({
      openedBoxes: [],
      summary: initialSummary,
      currentPityCounter: 0,
      ownedTankIds: [],
      ownedStyleIds: [],
      ownedAttachmentIds: [],
    }),
}));

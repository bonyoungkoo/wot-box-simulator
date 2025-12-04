export type TankTier = 'II' | 'III' | 'IV' | 'V' | 'VIII' | 'IX' | 'X';

export type TankCategory = 'LOW' | 'HIGH';

export interface TankDef {
  id: string;
  name: string;
  tier: TankTier;
  valueGold: number;
  category: TankCategory;
}

export interface StyleDef {
  id: string;
  name: string;
  nameEn: string;
  forTank: string;
}

export interface AttachmentDef {
  id: string;
  setId: string;
  nameKo: string;
  nameEn: string;
}

export interface ProbConfig {
  pityEvery: number; // 50
  highTankChance: number; // 0.024
  lowTankChance: number; // 0.1166

  resourceDrop: {
    chance: number; // 0.8594 (드랍군 진입)
    premium: {
      // 등장 판정용 합계 (조건부 합계) — 0.4276
      totalChance: number;
      items: { days: 1 | 3 | 7; chance: number }[]; // 각 chance는 조건부 퍼센트(0~1)
    };
    gold: {
      totalChance: number; // 0.2521
      items: { amount: 250 | 500 | 1000; chance: number }[];
    };
    credits: {
      totalChance: number; // 0.3203
      items: { amount: 100_000 | 500_000; chance: number }[];
    };
  };

  styles: {
    chance: number; // 0.05
    // 풀 내 분배(합 1.0). 가중치가 동일하면 0.1씩
    weights: Record<string, number>;
  };

  attachments: {
    chance: number; // 0.06
    weights: Record<string, number>;
  };

  // 전차 풀 가중치(풀 내 분배): 합=1
  highTankWeights: Record<string, number>;
  lowTankWeights: Record<string, number>;
}

export interface BoxOpenInput {
  seed?: string;
  boxes: number;
  ownedTankIds: string[];
  ownedStyleIds?: string[];
  ownedAttachmentIds?: string[];
  initialPityCounter?: number;
}

export interface BoxResultItem {
  index: number;
  gotHighTank?: TankDef;
  gotLowTank?: TankDef;
  gotStyle?: StyleDef;
  gotAttachment?: AttachmentDef;
  goldGained: number;
  creditsGained: number;
  premiumDaysGained: number;
  pityCounterAfter: number;
}

export interface SummaryResult {
  totalBoxes: number;
  totalGold: number;
  totalCredits: number;
  totalPremiumDays: number;
  highTanks: TankDef[];
  lowTanks: TankDef[];
  styles: StyleDef[];
  attachments: AttachmentDef[];
}

export interface SimResult {
  items: BoxResultItem[];
  summary: SummaryResult;
}

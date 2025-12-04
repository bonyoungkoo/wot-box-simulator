import {
  ATTACHMENT_POOL,
  DEFAULT_PROB_CONFIG,
  GUARANTEED_GOLD_PER_BOX,
  HIGH_TANK_POOL,
  LOW_TANK_POOL,
  STYLE_POOL,
} from './probabilities';
import { makeRng, pickWeighted, roll, type Rng } from './random';
import type {
  AttachmentDef,
  BoxOpenInput,
  BoxResultItem,
  ProbConfig,
  SimResult,
  StyleDef,
  TankCategory,
  TankDef,
} from '../types/loot';

// Applies duplication logic: we keep the first copy of a tank and refund valueGold on duplicates.
function applyTankDrop(
  tank: TankDef | undefined,
  owned: Set<string>,
): {
  grantedTank?: TankDef;
  bonusGold: number;
} {
  if (!tank) {
    return { bonusGold: 0 };
  }

  const alreadyOwned = owned.has(tank.id);
  if (alreadyOwned) {
    return {
      grantedTank: tank,
      bonusGold: tank.valueGold,
    };
  }

  owned.add(tank.id);
  return { grantedTank: tank, bonusGold: 0 };
}

/**
 * Simulates opening Holiday Ops boxes from scratch.
 * - Enforces guaranteed gold per box and the pity timer for top-tier tanks.
 * - Resolves duplicate refunds automatically.
 * - Implements resource drop group (85.94%) with independent premium/gold/credits rolls.
 */
export function simulateBoxes(
  input: BoxOpenInput,
  config: ProbConfig = DEFAULT_PROB_CONFIG,
): SimResult {
  const rng = makeRng(input.seed);
  const boxesToOpen = Math.max(0, Math.floor(input.boxes ?? 0));
  const ownedSet = new Set<string>(input.ownedTankIds ?? []);
  const items: BoxResultItem[] = [];
  const highTanks: TankDef[] = [];
  const lowTanks: TankDef[] = [];
  const styles: StyleDef[] = [];
  const attachments: AttachmentDef[] = [];

  // 전차 획득 추적 (HIGH/LOW 통합)
  const ALL_TANK_POOL = [...HIGH_TANK_POOL, ...LOW_TANK_POOL];
  const obtainedTanks = new Set<string>(ownedSet);
  const obtainedStyles = new Set<string>(input.ownedStyleIds ?? []);
  const obtainedAttachments = new Set<string>(input.ownedAttachmentIds ?? []);

  const isCollectionComplete = () => obtainedTanks.size >= ALL_TANK_POOL.length;

  const getTankWeight = (tank: TankDef) =>
    tank.category === 'HIGH'
      ? (config.highTankWeights[tank.id] ?? 0)
      : (config.lowTankWeights[tank.id] ?? 0);

  const pickTank = (preferredCategory: TankCategory): TankDef | undefined => {
    if (isCollectionComplete()) {
      const pool = preferredCategory === 'HIGH' ? HIGH_TANK_POOL : LOW_TANK_POOL;
      return pickWeighted(rng, pool, (tank) => getTankWeight(tank));
    }

    const preferredPool = preferredCategory === 'HIGH' ? HIGH_TANK_POOL : LOW_TANK_POOL;
    const remainingPreferred = preferredPool.filter((tank) => !obtainedTanks.has(tank.id));

    if (remainingPreferred.length > 0) {
      return pickWeighted(rng, remainingPreferred, (tank) => getTankWeight(tank));
    }

    const otherPool = preferredCategory === 'HIGH' ? LOW_TANK_POOL : HIGH_TANK_POOL;
    const remainingOther = otherPool.filter((tank) => !obtainedTanks.has(tank.id));

    if (remainingOther.length > 0) {
      return pickWeighted(rng, remainingOther, (tank) => getTankWeight(tank));
    }

    // should not happen, but fallback to entire pool
    return pickWeighted(rng, ALL_TANK_POOL, (tank) => getTankWeight(tank));
  };

  let totalGold = 0;
  let totalCredits = 0;
  let totalPremiumDays = 0;
  let pityCounter = input.initialPityCounter ?? 0;

  for (let i = 0; i < boxesToOpen; i += 1) {
    let goldGained = GUARANTEED_GOLD_PER_BOX;
    let creditsGained = 0;
    let premiumDaysGained = 0;
    let gotHighTank: TankDef | undefined;
    let gotLowTank: TankDef | undefined;
    let gotStyle: StyleDef | undefined;
    let gotAttachment: AttachmentDef | undefined;

    // 1) Vehicle slot: either high-tier (with pity) or low-tier pull.
    const pityReady =
      config.pityEvery > 0 && pityCounter + 1 >= config.pityEvery && HIGH_TANK_POOL.length > 0;
    const dropHigh = HIGH_TANK_POOL.length > 0 && (pityReady || roll(rng, config.highTankChance));

    if (dropHigh) {
      const selectedTank = pickTank('HIGH');
      if (selectedTank) {
        if (selectedTank.category === 'HIGH') {
          gotHighTank = selectedTank;
        } else {
          gotLowTank = selectedTank;
        }
        obtainedTanks.add(selectedTank.id);
        pityCounter = 0;
      }
    } else {
      pityCounter = config.pityEvery > 0 ? Math.min(config.pityEvery - 1, pityCounter + 1) : 0;
      const dropLow = LOW_TANK_POOL.length > 0 && roll(rng, config.lowTankChance);
      if (dropLow) {
        const selectedTank = pickTank('LOW');
        if (selectedTank) {
          if (selectedTank.category === 'HIGH') {
            gotHighTank = selectedTank;
          } else {
            gotLowTank = selectedTank;
          }
          obtainedTanks.add(selectedTank.id);
          pityCounter = 0;
        }
      }
    }

    // 2) Duplicate handling + guaranteed gold per box.
    const highDropResult = applyTankDrop(gotHighTank, ownedSet);
    if (highDropResult.grantedTank) {
      highTanks.push(highDropResult.grantedTank);
    }
    goldGained += highDropResult.bonusGold;

    const lowDropResult = applyTankDrop(gotLowTank, ownedSet);
    if (lowDropResult.grantedTank) {
      lowTanks.push(lowDropResult.grantedTank);
    }
    goldGained += lowDropResult.bonusGold;

    // 3) Resource drop group (85.94% chance to enter)
    // Once inside, premium/gold/credits are rolled independently
    const enteredResourceDrop = roll(rng, config.resourceDrop.chance);

    if (enteredResourceDrop) {
      // Premium days (independent roll within resource drop group)
      if (roll(rng, config.resourceDrop.premium.totalChance)) {
        // Pick which premium days amount
        const premiumItems = config.resourceDrop.premium.items.map((item) => ({
          days: item.days,
          weight: item.chance, // 조건부 확률을 가중치로 사용
        }));
        const premiumRoll = pickWeighted(rng, premiumItems);
        premiumDaysGained += premiumRoll.days;
      }

      // Gold (independent roll within resource drop group)
      if (roll(rng, config.resourceDrop.gold.totalChance)) {
        // Pick which gold amount
        const goldItems = config.resourceDrop.gold.items.map((item) => ({
          amount: item.amount,
          weight: item.chance, // 조건부 확률을 가중치로 사용
        }));
        const goldRoll = pickWeighted(rng, goldItems);
        goldGained += goldRoll.amount;
      }

      // Credits (independent roll within resource drop group)
      if (roll(rng, config.resourceDrop.credits.totalChance)) {
        // Pick which credits amount
        const creditItems = config.resourceDrop.credits.items.map((item) => ({
          amount: item.amount,
          weight: item.chance, // 조건부 확률을 가중치로 사용
        }));
        const creditRoll = pickWeighted(rng, creditItems);
        creditsGained += creditRoll.amount;
      }
    }

    // 4) 3D Style drop (중복 방지)
    const canDropStyle = obtainedStyles.size < STYLE_POOL.length;
    if (canDropStyle && roll(rng, config.styles.chance) && STYLE_POOL.length > 0) {
      const availableStyles = STYLE_POOL.filter((style) => !obtainedStyles.has(style.id));

      if (availableStyles.length > 0) {
        gotStyle = pickWeighted(
          rng,
          availableStyles,
          (style) => config.styles.weights[style.id] ?? 0,
        );

        if (gotStyle) {
          obtainedStyles.add(gotStyle.id);
          styles.push(gotStyle);
        }
      }
    }

    const canDropAttachment = obtainedAttachments.size < ATTACHMENT_POOL.length;
    if (canDropAttachment && roll(rng, config.attachments.chance) && ATTACHMENT_POOL.length > 0) {
      const availableAttachments = ATTACHMENT_POOL.filter(
        (attachment) => !obtainedAttachments.has(attachment.id),
      );

      if (availableAttachments.length > 0) {
        gotAttachment = pickWeighted(
          rng,
          availableAttachments,
          (attachment) => config.attachments.weights[attachment.id] ?? 0,
        );

        if (gotAttachment) {
          obtainedAttachments.add(gotAttachment.id);
          attachments.push(gotAttachment);
        }
      }
    }

    totalGold += goldGained;
    totalCredits += creditsGained;
    totalPremiumDays += premiumDaysGained;

    items.push({
      index: i + 1,
      gotHighTank,
      gotLowTank,
      gotStyle,
      gotAttachment,
      goldGained,
      creditsGained,
      premiumDaysGained,
      pityCounterAfter: pityCounter,
    });
  }

  return {
    items,
    summary: {
      totalBoxes: boxesToOpen,
      totalGold,
      totalCredits,
      totalPremiumDays,
      highTanks,
      lowTanks,
      styles,
      attachments,
    },
  };
}

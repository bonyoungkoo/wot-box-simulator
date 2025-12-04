'use client';

import { useBoxStore } from '../store/boxStore';
import Image from 'next/image';
import styles from './RewardList.module.css';

export default function RewardList() {
  const openedBoxes = useBoxStore((state) => state.openedBoxes);

  if (openedBoxes.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyMessage}>No boxes opened yet.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {openedBoxes.map((box, index) => (
        <div key={index} className={styles.boxRow}>
          <div className={styles.boxNumber}>{openedBoxes.length - index}</div>
          <div className={styles.rewards}>
            {box.goldGained > 0 && (
              <div className={styles.rewardItem}>
                <Image
                  src="/wot-box-sim/gold.png"
                  alt="Gold"
                  width={40}
                  height={40}
                  className={styles.rewardIcon}
                />
                <span className={styles.rewardQuantity}>{box.goldGained.toLocaleString()}</span>
              </div>
            )}
            {box.creditsGained > 0 && (
              <div className={styles.rewardItem}>
                <Image
                  src="/wot-box-sim/credit.png"
                  alt="Credits"
                  width={40}
                  height={40}
                  className={styles.rewardIcon}
                />
                <span className={styles.rewardQuantity}>{box.creditsGained.toLocaleString()}</span>
              </div>
            )}
            {box.premiumDaysGained > 0 && (
              <div className={styles.rewardItem}>
                <Image
                  src="/wot-box-sim/premium.png"
                  alt="Premium"
                  width={40}
                  height={40}
                  className={styles.rewardIcon}
                />
                <span className={styles.rewardQuantity}>{box.premiumDaysGained}일</span>
              </div>
            )}
            {box.gotHighTank && (
              <div className={styles.rewardItem}>
                <Image
                  src="/wot-box-sim/tank.png"
                  alt="Tank"
                  width={40}
                  height={40}
                  className={styles.rewardIcon}
                />
                <span className={styles.rewardName}>{box.gotHighTank.name}</span>
              </div>
            )}
            {box.gotLowTank && (
              <div className={styles.rewardItem}>
                <Image
                  src="/wot-box-sim/tank.png"
                  alt="Tank"
                  width={40}
                  height={40}
                  className={styles.rewardIcon}
                />
                <span className={styles.rewardName}>{box.gotLowTank.name}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

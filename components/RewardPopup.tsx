'use client';

import { useEffect, useState } from 'react';
import { useBoxStore } from '../store/boxStore';
import Image from 'next/image';
import styles from './RewardPopup.module.css';

interface RewardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  autoCloseDelay?: number;
}

export default function RewardPopup({ isOpen, onClose, autoCloseDelay = 5000 }: RewardPopupProps) {
  const openedBoxes = useBoxStore((state) => state.openedBoxes);
  const [visibleBoxes, setVisibleBoxes] = useState<typeof openedBoxes>([]);

  useEffect(() => {
    if (isOpen && openedBoxes.length > 0) {
      // 최근 개봉한 상자들만 표시
      setVisibleBoxes(openedBoxes.slice(0, 5));

      // 자동으로 닫기
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, openedBoxes, autoCloseDelay, onClose]);

  if (!isOpen || visibleBoxes.length === 0) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>개봉 보상</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.rewardList}>
          {visibleBoxes.map((box, index) => (
            <div key={index} className={styles.boxRow}>
              <div className={styles.boxNumber}>{visibleBoxes.length - index}</div>
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
                    <span className={styles.rewardQuantity}>
                      {box.creditsGained.toLocaleString()}
                    </span>
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
                {box.gotStyle && (
                  <div className={styles.rewardItem}>
                    <Image
                      src="/wot-box-sim/style.png"
                      alt="3D Style"
                      width={40}
                      height={40}
                      className={styles.rewardIcon}
                    />
                    <span className={styles.rewardName}>{box.gotStyle.name}</span>
                  </div>
                )}
                {box.gotAttachment && (
                  <div className={styles.rewardItem}>
                    <Image
                      src="/wot-box-sim/3d_element.png"
                      alt="Attachment"
                      width={40}
                      height={40}
                      className={styles.rewardIcon}
                    />
                    <span className={styles.rewardName}>{box.gotAttachment.nameKo}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

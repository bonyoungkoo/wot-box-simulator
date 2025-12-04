'use client';

import { useState } from 'react';
import { simulateBoxes } from '../lib/sim';
import { DEFAULT_PROB_CONFIG } from '../lib/probabilities';
import { useBoxStore } from '../store/boxStore';
import BoxSelectionModal from './BoxSelectionModal';
import RewardPopup from './RewardPopup';
import styles from './BoxOpeningInterface.module.css';

export default function BoxOpeningInterface() {
  const [selectedCount, setSelectedCount] = useState<1 | 5>(5);
  const [isOpening, setIsOpening] = useState(false);
  const [availableBoxes, setAvailableBoxes] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRewardPopupOpen, setIsRewardPopupOpen] = useState(false);
  const addBoxes = useBoxStore((state) => state.addBoxes);
  const currentPityCounter = useBoxStore((state) => state.currentPityCounter);
  const ownedTankIds = useBoxStore((state) => state.ownedTankIds);
  const ownedStyleIds = useBoxStore((state) => state.ownedStyleIds);
  const ownedAttachmentIds = useBoxStore((state) => state.ownedAttachmentIds);

  const pityEvery = DEFAULT_PROB_CONFIG.pityEvery;
  const remainingBoxes = Math.max(0, pityEvery - currentPityCounter);

  const handleOpenBoxes = () => {
    if (availableBoxes === 0 || isOpening) return;

    const count = Math.min(selectedCount, availableBoxes);
    setIsOpening(true);

    // 애니메이션 효과를 위한 딜레이
    setTimeout(() => {
      const result = simulateBoxes({
        boxes: count,
        ownedTankIds: ownedTankIds,
        ownedStyleIds,
        ownedAttachmentIds,
        initialPityCounter: currentPityCounter,
      });

      addBoxes(result.items);
      setAvailableBoxes((prev) => prev - count);
      setIsOpening(false);

      // 보상 팝업 표시
      setIsRewardPopupOpen(true);
    }, 500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.boxWrapper}>
        <div className={`${styles.chest} ${isOpening ? styles.chestOpening : ''}`}>
          <div className={styles.chestGlow}></div>
          <div className={styles.chestBox}>
            <div className={styles.chestTop}></div>
            <div className={styles.chestFront}>
              <div className={styles.snowflake}>❄</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.boxesInfo}>남은 상자: {availableBoxes}</div>

      <button className={styles.getBoxesButton} onClick={() => setIsModalOpen(true)}>
        <span className={styles.boxIcon}>📦</span>
        상자 구매하기
      </button>

      <div className={styles.guaranteedInfo}>
        <span className={styles.guaranteedIcon}>ⓘ</span>
        확정 보상 획득까지 남은 상자: {remainingBoxes}
      </div>

      <div className={styles.controls}>
        <div className={styles.countSelector}>
          <button
            className={`${styles.countButton} ${selectedCount === 1 ? styles.active : ''}`}
            onClick={() => setSelectedCount(1)}
            disabled={isOpening}
          >
            1개
          </button>
          <button
            className={`${styles.countButton} ${selectedCount === 5 ? styles.active : ''}`}
            onClick={() => setSelectedCount(5)}
            disabled={isOpening}
          >
            5개
          </button>
        </div>
        <button
          className={styles.openButton}
          onClick={handleOpenBoxes}
          disabled={availableBoxes === 0 || isOpening}
        >
          {isOpening ? '개봉 중...' : '개봉'}
        </button>
      </div>

      <BoxSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(count) => setAvailableBoxes((prev) => prev + count)}
      />

      <RewardPopup
        isOpen={isRewardPopupOpen}
        onClose={() => setIsRewardPopupOpen(false)}
        autoCloseDelay={5000}
      />
    </div>
  );
}

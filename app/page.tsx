'use client';

import { useState } from 'react';
import BoxOpeningInterface from '../components/BoxOpeningInterface';
import RewardModal from '../components/RewardModal';
import styles from './page.module.css';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className={styles.main}>
      <div className={styles.background}></div>

      <div className={styles.content}>
        <div className={styles.centerPanel}>
          <div className={styles.boxTitle}>연말연시 상자 시뮬레이터</div>
          <BoxOpeningInterface />
        </div>
      </div>

      <button className={styles.rewardButton} onClick={() => setIsModalOpen(true)}>
        보상 보기
      </button>

      <RewardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './BoxSelectionModal.module.css';

interface BoxOption {
  id: string;
  name: string;
  count: number;
  image: string;
}

const BOX_OPTIONS: BoxOption[] = [
  { id: 'newyear', name: '새해', count: 3, image: 'box_blue.png' },
  { id: 'christmas', name: '크리스마스', count: 11, image: 'box_green.png' },
  { id: 'lunar', name: '정월 초하루', count: 25, image: 'box_red.png' },
  { id: 'magic', name: '마법', count: 75, image: 'box_purple.png' },
];

interface BoxSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (count: number) => void;
}

export default function BoxSelectionModal({ isOpen, onClose, onSelect }: BoxSelectionModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!isOpen) return null;

  const handleSelect = () => {
    onSelect(BOX_OPTIONS[selectedIndex].count);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>상자 선택</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.boxesGrid}>
          {BOX_OPTIONS.map((option, index) => (
            <div
              key={option.id}
              className={`${styles.boxCard} ${selectedIndex === index ? styles.selected : ''}`}
              onClick={() => setSelectedIndex(index)}
            >
              <div className={styles.boxLabel}>{option.name}</div>
              <div className={styles.boxImageWrapper}>
                <Image
                  src={`/wot-box-sim/${option.image}`}
                  alt={option.name}
                  width={120}
                  height={120}
                  className={styles.boxImage}
                />
                <div className={styles.boxGlow}></div>
              </div>
              <div className={styles.boxCount}>대형 상자 {option.count}개</div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button className={styles.selectButton} onClick={handleSelect}>
            선택하기
          </button>
        </div>
      </div>
    </div>
  );
}

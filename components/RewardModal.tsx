'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useBoxStore } from '../store/boxStore';
import Image from 'next/image';
import styles from './RewardModal.module.css';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RewardModal({ isOpen, onClose }: RewardModalProps) {
  const summary = useBoxStore((state) => state.summary);
  const [hoveredTankCard, setHoveredTankCard] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [hoveredStyleCard, setHoveredStyleCard] = useState(false);
  const [styleTooltipPosition, setStyleTooltipPosition] = useState({ top: 0, left: 0 });
  const styleCardRef = useRef<HTMLDivElement>(null);
  const styleTooltipRef = useRef<HTMLDivElement>(null);

  const [hoveredAttachmentCard, setHoveredAttachmentCard] = useState(false);
  const [attachmentTooltipPosition, setAttachmentTooltipPosition] = useState({ top: 0, left: 0 });
  const attachmentCardRef = useRef<HTMLDivElement>(null);
  const attachmentTooltipRef = useRef<HTMLDivElement>(null);

  const allTanks = [...summary.highTanks, ...summary.lowTanks];
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      return;
    }
    if (hoveredTankCard && cardRef.current) {
      const updatePosition = () => {
        if (cardRef.current) {
          const rect = cardRef.current.getBoundingClientRect();
          setTooltipPosition({
            top: rect.top,
            left: isMobile ? 16 : rect.right + 16,
          });
        }
      };
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [hoveredTankCard, isOpen, isMobile]);

  useEffect(() => {
    if (!isMobile || !hoveredTankCard || !cardRef.current) {
      return;
    }
    const updatePosition = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current?.offsetHeight ?? 0;
      setTooltipPosition({
        top: Math.max(16, rect.top - tooltipHeight - 12),
        left: 16,
      });
    };
    updatePosition();
    const rafId = requestAnimationFrame(updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isMobile, hoveredTankCard, isOpen]);

  // 툴팁이 카드나 툴팁 위에 있을 때 유지
  const handleMouseEnter = () => setHoveredTankCard(true);
  const handleMouseLeave = () => setHoveredTankCard(false);

  const handleStyleMouseEnter = () => setHoveredStyleCard(true);
  const handleStyleMouseLeave = () => setHoveredStyleCard(false);

  const handleAttachmentMouseEnter = () => setHoveredAttachmentCard(true);
  const handleAttachmentMouseLeave = () => setHoveredAttachmentCard(false);

  useEffect(() => {
    if (isMobile) {
      return;
    }
    if (hoveredStyleCard && styleCardRef.current) {
      const updatePosition = () => {
        if (styleCardRef.current) {
          const rect = styleCardRef.current.getBoundingClientRect();
          setStyleTooltipPosition({
            top: rect.top,
            left: isMobile ? 16 : rect.right + 16,
          });
        }
      };
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [hoveredStyleCard, isOpen, isMobile]);

  useEffect(() => {
    if (!isMobile || !hoveredStyleCard || !styleCardRef.current) {
      return;
    }
    const updatePosition = () => {
      if (!styleCardRef.current) return;
      const rect = styleCardRef.current.getBoundingClientRect();
      const tooltipHeight = styleTooltipRef.current?.offsetHeight ?? 0;
      setStyleTooltipPosition({
        top: Math.max(16, rect.top - tooltipHeight - 12),
        left: 16,
      });
    };
    updatePosition();
    const rafId = requestAnimationFrame(updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isMobile, hoveredStyleCard, isOpen]);

  useEffect(() => {
    if (isMobile) {
      return;
    }
    if (hoveredAttachmentCard && attachmentCardRef.current) {
      const updatePosition = () => {
        if (attachmentCardRef.current) {
          const rect = attachmentCardRef.current.getBoundingClientRect();
          setAttachmentTooltipPosition({
            top: rect.top,
            left: isMobile ? 16 : rect.right + 16,
          });
        }
      };
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [hoveredAttachmentCard, isOpen, isMobile]);

  useEffect(() => {
    if (!isMobile || !hoveredAttachmentCard || !attachmentCardRef.current) {
      return;
    }
    const updatePosition = () => {
      if (!attachmentCardRef.current) return;
      const rect = attachmentCardRef.current.getBoundingClientRect();
      const tooltipHeight = attachmentTooltipRef.current?.offsetHeight ?? 0;
      setAttachmentTooltipPosition({
        top: Math.max(16, rect.top - tooltipHeight - 12),
        left: 16,
      });
    };
    updatePosition();
    const rafId = requestAnimationFrame(updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isMobile, hoveredAttachmentCard, isOpen]);

  // 툴팁을 Portal로 렌더링
  const tooltipContent =
    hoveredTankCard && allTanks.length > 0 && mounted ? (
      <div
        ref={tooltipRef}
        className={`${styles.tankTooltip} ${isMobile ? styles.mobileTooltip : ''}`}
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.tooltipHeader}>전차 획득</div>
        <div className={styles.tooltipContent}>
          {allTanks.map((tank, index) => (
            <div key={`${tank.id}-${index}`} className={styles.tooltipItem}>
              <span className={styles.tierBadge}>{tank.tier}</span>
              <span className={styles.tankName}>{tank.name}</span>
            </div>
          ))}
        </div>
      </div>
    ) : null;

  const attachmentTooltipContent =
    hoveredAttachmentCard && summary.attachments.length > 0 && mounted ? (
      <div
        ref={attachmentTooltipRef}
        className={`${styles.tankTooltip} ${isMobile ? styles.mobileTooltip : ''}`}
        style={{
          top: `${attachmentTooltipPosition.top}px`,
          left: `${attachmentTooltipPosition.left}px`,
        }}
        onMouseEnter={handleAttachmentMouseEnter}
        onMouseLeave={handleAttachmentMouseLeave}
      >
        <div className={styles.tooltipHeader}>3D 부착물 획득</div>
        <div className={styles.tooltipContent}>
          {summary.attachments.map((attachment, index) => (
            <div key={`${attachment.id}-${index}`} className={styles.attachmentItem}>
              <div className={styles.attachmentName}>{attachment.nameKo}</div>
              <div className={styles.attachmentMeta}>
                {attachment.nameEn} · {attachment.setId}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null;

  const styleTooltipContent =
    hoveredStyleCard && summary.styles.length > 0 && mounted ? (
      <div
        ref={styleTooltipRef}
        className={`${styles.tankTooltip} ${isMobile ? styles.mobileTooltip : ''}`}
        style={{
          top: `${styleTooltipPosition.top}px`,
          left: `${styleTooltipPosition.left}px`,
        }}
        onMouseEnter={handleStyleMouseEnter}
        onMouseLeave={handleStyleMouseLeave}
      >
        <div className={styles.tooltipHeader}>3D 스타일 획득</div>
        <div className={styles.tooltipContent}>
          {summary.styles.map((style, index) => (
            <div key={`${style.id}-${index}`} className={styles.styleItem}>
              <div className={styles.styleName}>{style.name}</div>
              <div className={styles.styleMeta}>
                {style.nameEn} · {style.forTank}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>상자 {summary.totalBoxes}개 개봉 완료</h2>
          <div className={styles.headerButtons}>
            <button className={styles.infoButton}>ⓘ</button>
            <button className={styles.closeButton} onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className={styles.rewardGrid}>
          {summary.highTanks.length + summary.lowTanks.length > 0 && (
            <div
              ref={cardRef}
              className={styles.rewardCard}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Image src="/tank.png" alt="전차" width={48} height={48} />
              <div className={styles.rewardInfo}>
                <div className={styles.rewardLabel}>전차</div>
                <div className={styles.rewardValue}>
                  {summary.highTanks.length + summary.lowTanks.length}개
                </div>
              </div>
            </div>
          )}

          {summary.totalPremiumDays > 0 && (
            <div className={styles.rewardCard}>
              <Image src="/premium.png" alt="프리미엄" width={48} height={48} />
              <div className={styles.rewardInfo}>
                <div className={styles.rewardLabel}>월드 오브 탱크 프리미엄 계정</div>
                <div className={styles.rewardValue}>{summary.totalPremiumDays}일</div>
              </div>
            </div>
          )}

          {summary.totalGold > 0 && (
            <div className={styles.rewardCard}>
              <Image src="/gold.png" alt="골드" width={48} height={48} />
              <div className={styles.rewardInfo}>
                <div className={styles.rewardLabel}>골드</div>
                <div className={`${styles.rewardValue} ${styles.highlight}`}>
                  {summary.totalGold.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {summary.totalCredits > 0 && (
            <div className={styles.rewardCard}>
              <Image src="/credit.png" alt="크레딧" width={48} height={48} />
              <div className={styles.rewardInfo}>
                <div className={styles.rewardLabel}>크레딧</div>
                <div className={styles.rewardValue}>{summary.totalCredits.toLocaleString()}</div>
              </div>
            </div>
          )}

          {summary.styles.length > 0 && (
            <div
              ref={styleCardRef}
              className={styles.rewardCard}
              onMouseEnter={handleStyleMouseEnter}
              onMouseLeave={handleStyleMouseLeave}
            >
              <Image src="/style.png" alt="3D 스타일" width={48} height={48} />
              <div className={styles.rewardInfo}>
                <div className={styles.rewardLabel}>3D 스타일</div>
                <div className={styles.rewardValue}>{summary.styles.length}개</div>
              </div>
            </div>
          )}

          {summary.attachments.length > 0 && (
            <div
              ref={attachmentCardRef}
              className={styles.rewardCard}
              onMouseEnter={handleAttachmentMouseEnter}
              onMouseLeave={handleAttachmentMouseLeave}
            >
              <Image src="/3d_element.png" alt="3D 부착물" width={48} height={48} />
              <div className={styles.rewardInfo}>
                <div className={styles.rewardLabel}>3D 부착물</div>
                <div className={styles.rewardValue}>{summary.attachments.length}개</div>
              </div>
            </div>
          )}
        </div>

        {/* <div className={styles.totalResources}>
          <div className={styles.totalResourcesTitle}>총 자원: 0</div>
          <div className={styles.resourcesGrid}>
            <div className={styles.resourceItem}>
              <div className={styles.resourceIcon}>💎</div>
              <div className={styles.resourceInfo}>
                <div className={styles.resourceLabel}>수정</div>
                <div className={styles.resourceValue}>0</div>
              </div>
            </div>
            <div className={styles.resourceItem}>
              <div className={styles.resourceIcon}>🧡</div>
              <div className={styles.resourceInfo}>
                <div className={styles.resourceLabel}>호박</div>
                <div className={styles.resourceValue}>0</div>
              </div>
            </div>
            <div className={styles.resourceItem}>
              <div className={styles.resourceIcon}>💚</div>
              <div className={styles.resourceInfo}>
                <div className={styles.resourceLabel}>에메랄드</div>
                <div className={styles.resourceValue}>0</div>
              </div>
            </div>
            <div className={styles.resourceItem}>
              <div className={styles.resourceIcon}>💜</div>
              <div className={styles.resourceInfo}>
                <div className={styles.resourceLabel}>운철</div>
                <div className={styles.resourceValue}>0</div>
              </div>
            </div>
          </div>
        </div> */}

        <div className={styles.footer}>
          <button
            className={styles.resetButton}
            onClick={() => {
              useBoxStore.getState().reset();
              onClose();
            }}
          >
            통계 초기화
          </button>
        </div>
      </div>
      {mounted &&
        createPortal(
          <>
            {tooltipContent}
            {styleTooltipContent}
            {attachmentTooltipContent}
          </>,
          document.body,
        )}
    </>
  );
}

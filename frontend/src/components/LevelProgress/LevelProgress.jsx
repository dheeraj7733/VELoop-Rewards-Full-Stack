import React from 'react';
import { Award, Star } from 'lucide-react';
import styles from './LevelProgress.module.css';

const LevelProgress = ({ levelProgress }) => {
  const currentLevel = levelProgress?.currentLevel || 1;
  const currentXp = levelProgress?.currentXp || 0;
  const nextLevelXp = levelProgress?.nextLevelXp || 1000;
  const xpRemaining = levelProgress?.xpRemaining || 0;
  const percent = levelProgress?.progressPercentage || 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <Award size={20} color="#F59E0B" />
          <h3 className={styles.title}>Level {String(currentLevel).padStart(2, '0')} — {levelProgress?.currentLevelName}</h3>
        </div>
        <span className={styles.percentBadge}>{percent}% Done</span>
      </div>
      <div className={styles.bar}>
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
      <div className={styles.footer}>
        <span className={styles.sub}>{currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</span>
        <span className={styles.sub}><Star size={12} color="#F59E0B" /> {xpRemaining.toLocaleString()} XP to Next Tier</span>
      </div>
    </div>
  );
};
export default LevelProgress;

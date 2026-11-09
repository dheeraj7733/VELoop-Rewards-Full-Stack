import React from 'react';
import { Coins, CircleDot, Gem, Layers, Zap, ArrowUpRight } from 'lucide-react';
import styles from './RewardAssets.module.css';

const RewardAssets = ({ rewards, onRequestWithdrawal }) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Reward Assets</h2>
      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.vesCard}`}>
          <div className={styles.top}>
            <Coins size={22} color="#F59E0B" />
            <span className={styles.assetName}>VEs</span>
          </div>
          <span className={styles.balance}>{(rewards?.ves || 0).toLocaleString()}</span>
          <button onClick={onRequestWithdrawal} className={styles.redeemBtn}>Redeem Payout <ArrowUpRight size={13} /></button>
        </div>

        <div className={`${styles.card} ${styles.svesCard}`}>
          <div className={styles.top}>
            <CircleDot size={22} color="#CBD5E1" />
            <span className={styles.assetName}>SVEs</span>
          </div>
          <span className={styles.balance}>{(rewards?.sves || 0).toLocaleString()}</span>
          <span className={styles.subText}>Staked Silver Yield</span>
        </div>

        <div className={styles.card}>
          <div className={styles.top}>
            <Gem size={22} color="#A78BFA" />
            <span className={styles.assetName}>Gems</span>
          </div>
          <span className={styles.balance}>{(rewards?.gems || 0).toLocaleString()}</span>
          <span className={styles.subText}>Utility Multipliers</span>
        </div>

        <div className={styles.card}>
          <div className={styles.top}>
            <Layers size={22} color="#60A5FA" />
            <span className={styles.assetName}>Tokens</span>
          </div>
          <span className={styles.balance}>{(rewards?.tokens || 0).toLocaleString()}</span>
          <span className={styles.subText}>Platform Points</span>
        </div>

        <div className={styles.card}>
          <div className={styles.top}>
            <Zap size={22} color="#FBBF24" />
            <span className={styles.assetName}>XP</span>
          </div>
          <span className={styles.balance}>{(rewards?.xp || 0).toLocaleString()}</span>
          <span className={styles.xpNotice}>Non-redeemable Tier XP</span>
        </div>
      </div>
    </div>
  );
};
export default RewardAssets;

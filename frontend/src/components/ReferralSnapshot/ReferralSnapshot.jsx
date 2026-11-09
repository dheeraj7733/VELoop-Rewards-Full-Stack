import React from 'react';
import { Users, Copy } from 'lucide-react';
import styles from './ReferralSnapshot.module.css';

const ReferralSnapshot = ({ referralData, showToast }) => {
  const code = referralData?.referralCode || 'VELOOP123';
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.info}><Users size={18} color="#60A5FA" /><h3 className={styles.title}>Referral Snapshot</h3></div>
        <div className={styles.codeBox}>
          <span className={styles.code}>{code}</span>
          <button onClick={() => { navigator.clipboard.writeText(code); showToast('Referral code copied!', 'success'); }} className={styles.copyBtn}><Copy size={13} /></button>
        </div>
      </div>
      <div className={styles.stats}>
        <div><span className={styles.label}>Invites</span><span className={styles.num}>{referralData?.totalReferrals || 0}</span></div>
        <div><span className={styles.label}>Successful</span><span className={`${styles.num} ${styles.green}`}>{referralData?.successfulReferrals || 0}</span></div>
        <div><span className={styles.label}>Rewards Earned</span><span className={`${styles.num} ${styles.gold}`}>+{referralData?.referralRewardsEarned || 0} VEs</span></div>
      </div>
    </div>
  );
};
export default ReferralSnapshot;

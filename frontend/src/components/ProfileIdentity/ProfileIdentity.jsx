import React from 'react';
import { Copy, Hash, User, Mail, Calendar } from 'lucide-react';
import styles from './ProfileIdentity.module.css';

const ProfileIdentity = ({ profile, showToast }) => {
  const copy = (val, label) => {
    navigator.clipboard.writeText(val);
    showToast(`${label} copied to clipboard!`, 'success');
  };

  return (
    <div className={styles.grid}>
      <div className={styles.item}>
        <Hash size={16} color="#94A3B8" />
        <div className={styles.details}>
          <span className={styles.label}>Member ID</span>
          <div className={styles.row}>
            <span className={styles.val}>{profile?.userId}</span>
            <button onClick={() => copy(profile?.userId, 'Member ID')} className={styles.copyBtn}><Copy size={12} /></button>
          </div>
        </div>
      </div>
      <div className={styles.item}>
        <User size={16} color="#F59E0B" />
        <div className={styles.details}>
          <span className={styles.label}>Referral Code</span>
          <div className={styles.row}>
            <span className={`${styles.val} ${styles.gold}`}>{profile?.referralCode}</span>
            <button onClick={() => copy(profile?.referralCode, 'Referral Code')} className={styles.copyBtn}><Copy size={12} /></button>
          </div>
        </div>
      </div>
      <div className={styles.item}>
        <Mail size={16} color="#94A3B8" />
        <div className={styles.details}>
          <span className={styles.label}>Email</span>
          <span className={styles.val}>{profile?.email}</span>
        </div>
      </div>
      <div className={styles.item}>
        <Calendar size={16} color="#94A3B8" />
        <div className={styles.details}>
          <span className={styles.label}>Member Since</span>
          <span className={styles.val}>{profile?.memberSince ? new Date(profile.memberSince).toLocaleDateString() : 'Recent'}</span>
        </div>
      </div>
    </div>
  );
};
export default ProfileIdentity;

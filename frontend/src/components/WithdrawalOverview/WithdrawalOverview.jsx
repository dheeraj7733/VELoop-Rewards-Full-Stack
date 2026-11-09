import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import styles from './WithdrawalOverview.module.css';

const WithdrawalOverview = ({ withdrawalSummary, onRequestWithdrawal }) => {
  const sum = withdrawalSummary?.summary || { totalRequests: 0, pending: 0, approved: 0, rejected: 0, totalWithdrawn: 0 };
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Withdrawal Overview</h3>
        <button onClick={onRequestWithdrawal} className={styles.payoutBtn}>New Payout <ArrowUpRight size={13} /></button>
      </div>
      <div className={styles.grid}>
        <div className={styles.box}><span className={styles.label}>Total Requests</span><span className={styles.num}>{sum.totalRequests}</span></div>
        <div className={`${styles.box} ${styles.pending}`}><span className={styles.label}>Pending</span><span className={styles.num}>{sum.pending}</span></div>
        <div className={`${styles.box} ${styles.approved}`}><span className={styles.label}>Approved</span><span className={styles.num}>{sum.approved}</span></div>
        <div className={`${styles.box} ${styles.rejected}`}><span className={styles.label}>Rejected</span><span className={styles.num}>{sum.rejected}</span></div>
        <div className={`${styles.box} ${styles.withdrawn}`}><span className={styles.label}>Total Withdrawn</span><span className={styles.num}>Rs. {sum.totalWithdrawn.toLocaleString()}</span></div>
      </div>
    </div>
  );
};
export default WithdrawalOverview;

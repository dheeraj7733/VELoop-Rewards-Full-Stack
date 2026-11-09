import React from 'react';
import { History } from 'lucide-react';
import styles from './RecentActivity.module.css';

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}><History size={18} color="#F59E0B" /><h3 className={styles.title}>Recent Activity</h3></div>
      <div className={styles.list}>
        {activities.length === 0 ? <span className={styles.empty}>No recent activity records.</span> : activities.slice(0, 5).map((act, i) => (
          <div key={i} className={styles.item}>
            <div>
              <span className={styles.desc}>{act.description}</span>
              <span className={styles.time}>{new Date(act.createdAt).toLocaleString()}</span>
            </div>
            {act.amount > 0 && <span className={styles.amount}>+{act.amount} {act.asset !== 'NONE' ? act.asset : ''}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
export default RecentActivity;

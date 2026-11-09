import React from 'react';
import { Gem, Gift, PlayCircle, Users, ArrowUpRight, Trophy } from 'lucide-react';
import styles from './QuickActions.module.css';

const QuickActions = ({ onRequestWithdrawal, onActionFeedback }) => {
  const actions = [
    { title: 'Get Gems', icon: Gem, color: '#A78BFA', fn: () => onActionFeedback('Task portal opening...') },
    { title: 'Watch Ads', icon: PlayCircle, color: '#10B981', fn: () => onActionFeedback('Rewarded video loaded (+15 Gems)') },
    { title: 'Refer Friends', icon: Users, color: '#60A5FA', fn: () => onActionFeedback('Share invite code with friends!') },
    { title: 'Redeem Payout', icon: ArrowUpRight, color: '#F59E0B', fn: onRequestWithdrawal },
    { title: 'Achievements', icon: Trophy, color: '#FBBF24', fn: () => onActionFeedback('Milestones refreshed') }
  ];

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Quick Actions</h3>
      <div className={styles.grid}>
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <button key={i} onClick={act.fn} className={styles.btn}>
              <Icon size={18} color={act.color} />
              <span>{act.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default QuickActions;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getProfileApi, updateProfileApi, getRewardsApi, getLevelProgressApi,
  getWithdrawalSummaryApi, requestWithdrawalApi, getReferralsApi, getActivityApi
} from '../../services/api';
import Navbar from '../../components/Navbar/Navbar';
import ProfileHero from '../../components/ProfileHero/ProfileHero';
import ProfileIdentity from '../../components/ProfileIdentity/ProfileIdentity';
import RewardAssets from '../../components/RewardAssets/RewardAssets';
import LevelProgress from '../../components/LevelProgress/LevelProgress';
import WithdrawalOverview from '../../components/WithdrawalOverview/WithdrawalOverview';
import QuickActions from '../../components/QuickActions/QuickActions';
import ReferralSnapshot from '../../components/ReferralSnapshot/ReferralSnapshot';
import RecentActivity from '../../components/RecentActivity/RecentActivity';
import ProfileSkeleton from '../../components/ProfileSkeleton/ProfileSkeleton';
import ProfileErrorState from '../../components/States/ProfileErrorState';
import Toast from '../../components/Toast/Toast';
import { X } from 'lucide-react';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const { user, refreshUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [rewards, setRewards] = useState(null);
  const [levelProgress, setLevelProgress] = useState(null);
  const [withdrawalSummary, setWithdrawalSummary] = useState(null);
  const [referrals, setReferrals] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [toast, setToast] = useState({ message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 4000);
  };

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('100');
  const [payoutMethod, setPayoutMethod] = useState('UPI');
  const [accountDetails, setAccountDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pRes, rRes, lRes, wRes, refRes, actRes] = await Promise.all([
        getProfileApi(), getRewardsApi(), getLevelProgressApi(),
        getWithdrawalSummaryApi(), getReferralsApi(), getActivityApi()
      ]);
      setProfileData(pRes.data.profile);
      setRewards(rRes.data.rewards);
      setLevelProgress(lRes.data.levelProgress);
      setWithdrawalSummary(wRes.data);
      setReferrals(refRes.data);
      setActivities(actRes.data.activities || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to backend API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleUpdateName = async (newName) => {
    const res = await updateProfileApi({ displayName: newName });
    setProfileData(res.data.profile);
    refreshUser();
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!accountDetails.trim()) {
      showToast('Please provide your UPI/account details', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await requestWithdrawalApi({ amount: Number(withdrawAmount), payoutMethod, accountDetails });
      showToast('Payout request submitted successfully!', 'success');
      setIsWithdrawOpen(false);
      setAccountDetails('');
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || 'Payout request failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.container}>
        {loading ? (
          <ProfileSkeleton />
        ) : error ? (
          <ProfileErrorState message={error} onRetry={fetchAll} />
        ) : (
          <>
            <ProfileHero profile={profileData} levelProgress={levelProgress} onUpdateName={handleUpdateName} showToast={showToast} />
            <ProfileIdentity profile={profileData} showToast={showToast} />
            <RewardAssets rewards={rewards} onRequestWithdrawal={() => setIsWithdrawOpen(true)} />
            <LevelProgress levelProgress={levelProgress} />
            <WithdrawalOverview withdrawalSummary={withdrawalSummary} onRequestWithdrawal={() => setIsWithdrawOpen(true)} />
            <QuickActions onRequestWithdrawal={() => setIsWithdrawOpen(true)} onActionFeedback={msg => showToast(msg, 'success')} />
            <ReferralSnapshot referralData={referrals} showToast={showToast} />
            <RecentActivity activities={activities} />
          </>
        )}
      </main>

      {isWithdrawOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalTop}>
              <h3>Request Payout</h3>
              <button onClick={() => setIsWithdrawOpen(false)} className={styles.closeBtn}><X size={16} /></button>
            </div>
            <form onSubmit={handleWithdraw} className={styles.modalForm}>
              <div>
                <label>Amount (VEs)</label>
                <input type="number" min="100" max={rewards?.ves || 0} value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} required />
              </div>
              <div>
                <label>Payout Method</label>
                <select value={payoutMethod} onChange={e => setPayoutMethod(e.target.value)}>
                  <option value="UPI">UPI (Instant)</option>
                  <option value="BANK_TRANSFER">Bank Account</option>
                </select>
              </div>
              <div>
                <label>UPI ID or Account Number</label>
                <input type="text" placeholder="e.g. mobile@upi" value={accountDetails} onChange={e => setAccountDetails(e.target.value)} required />
              </div>
              <div className={styles.modalBtns}>
                <button type="button" onClick={() => setIsWithdrawOpen(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" disabled={submitting} className={styles.submitBtn}>{submitting ? 'Submitting...' : 'Confirm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast.message && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};
export default UserProfile;

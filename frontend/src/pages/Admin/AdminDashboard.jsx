import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import {
  getAdminDashboardApi, getAdminUsersApi, updateAdminUserStatusApi,
  adjustAdminWalletApi, getAdminWithdrawalsApi, updateAdminWithdrawalStatusApi,
  getAdminAuditLogsApi, resetDemoDataApi
} from '../../services/api';
import Toast from '../../components/Toast/Toast';
import { RotateCcw } from 'lucide-react';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  const [toast, setToast] = useState({ message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 4000);
  };

  const fetchAll = async () => {
    try {
      const [sRes, uRes, wRes, aRes] = await Promise.all([
        getAdminDashboardApi(), getAdminUsersApi({}),
        getAdminWithdrawalsApi({}), getAdminAuditLogsApi()
      ]);
      setStats(sRes.data.stats);
      setUsers(uRes.data.users);
      setWithdrawals(wRes.data.withdrawals);
      setAuditLogs(aRes.data.logs);
    } catch (err) {
      showToast('Error loading admin data', 'error');
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleStatusToggle = async (id, curStatus) => {
    const newStatus = curStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const reason = prompt(`Reason to set status to ${newStatus}:`);
    if (!reason) return;
    try {
      await updateAdminUserStatusApi(id, { status: newStatus, reason });
      showToast('Status updated!', 'success');
      fetchAll();
    } catch (e) { showToast('Update failed', 'error'); }
  };

  const handleResetDemo = async () => {
    if (!confirm('Reset all demo data to seed state?')) return;
    await resetDemoDataApi();
    showToast('Demo data reset!', 'success');
    fetchAll();
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.container}>
        <div className={styles.top}>
          <h2>Admin Management Console</h2>
          <button onClick={handleResetDemo} className={styles.resetBtn}><RotateCcw size={14} /> Reset Demo DB</button>
        </div>

        <div className={styles.tabs}>
          <button className={activeTab === 'overview' ? styles.activeTab : ''} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={activeTab === 'users' ? styles.activeTab : ''} onClick={() => setActiveTab('users')}>Users ({users.length})</button>
          <button className={activeTab === 'withdrawals' ? styles.activeTab : ''} onClick={() => setActiveTab('withdrawals')}>Withdrawals</button>
          <button className={activeTab === 'audit' ? styles.activeTab : ''} onClick={() => setActiveTab('audit')}>Audit Logs</button>
        </div>

        {activeTab === 'overview' && (
          <div className={styles.grid}>
            <div className={styles.card}><span>Total Users</span><h3>{stats?.totalUsers || 0}</h3></div>
            <div className={styles.card}><span>Total VEs in Circulation</span><h3 className={styles.gold}>{(stats?.walletTotals?.ves || 0).toLocaleString()}</h3></div>
            <div className={styles.card}><span>Approved Payouts</span><h3 className={styles.green}>Rs. {(stats?.withdrawals?.totalAmountWithdrawn || 0).toLocaleString()}</h3></div>
            <div className={styles.card}><span>Pending Requests</span><h3 className={styles.amber}>{stats?.withdrawals?.pending || 0}</h3></div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className={styles.tableBox}>
            <table className={styles.table}>
              <thead><tr><th>User ID</th><th>Name / Email</th><th>Status</th><th>VEs Balance</th><th>Action</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.userId}>
                    <td>{u.userId}</td>
                    <td>{u.displayName} ({u.email})</td>
                    <td>{u.accountStatus}</td>
                    <td>{(u.wallet?.ves || 0).toLocaleString()} VEs</td>
                    <td><button onClick={() => handleStatusToggle(u.userId, u.accountStatus)} className={styles.actionBtn}>{u.accountStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className={styles.tableBox}>
            <table className={styles.table}>
              <thead><tr><th>ID</th><th>User</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {withdrawals.map(w => (
                  <tr key={w.withdrawalId}>
                    <td>{w.withdrawalId}</td>
                    <td>{w.userId}</td>
                    <td>Rs. {w.amount}</td>
                    <td>{w.status}</td>
                    <td>
                      {w.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={async () => { await updateAdminWithdrawalStatusApi(w.withdrawalId, { status: 'APPROVED' }); showToast('Approved!'); fetchAll(); }} className={styles.approveBtn}>Approve</button>
                          <button onClick={async () => { const r = prompt('Rejection reason:'); if (r) { await updateAdminWithdrawalStatusApi(w.withdrawalId, { status: 'REJECTED', reason: r }); showToast('Rejected & refunded'); fetchAll(); } }} className={styles.rejectBtn}>Reject</button>
                        </div>
                      ) : <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Processed</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className={styles.tableBox}>
            <table className={styles.table}>
              <thead><tr><th>Time</th><th>Admin</th><th>Action</th><th>Target</th><th>Reason</th></tr></thead>
              <tbody>
                {auditLogs.map(l => (
                  <tr key={l.auditId}>
                    <td>{new Date(l.createdAt).toLocaleTimeString()}</td>
                    <td>{l.adminEmail}</td>
                    <td>{l.action}</td>
                    <td>{l.targetId}</td>
                    <td>{l.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      {toast.message && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};
export default AdminDashboard;

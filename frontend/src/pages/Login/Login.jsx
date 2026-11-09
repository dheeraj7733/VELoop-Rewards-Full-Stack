import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Award, ShieldCheck, Copy } from 'lucide-react';
import Toast from '../../components/Toast/Toast';
import styles from './Login.module.css';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({ message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 4000);
  };

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(displayName, email, password);
        showToast('Account created!', 'success');
        navigate('/user-profile');
      } else {
        const u = await login(email, password);
        showToast('Signed in successfully!', 'success');
        if (u.role === 'ADMIN' || u.role === 'SUPER_ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user-profile');
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const autofill = (em, pass) => {
    setEmail(em);
    setPassword(pass);
    setIsRegister(false);
    showToast(`Autofilled ${em}`, 'success');
  };

  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <div className={styles.header}>
          <div className={styles.logoPill}><Award size={24} /></div>
          <h2>VELoop <span className={styles.gold}>Rewards</span></h2>
          <p className={styles.sub}>Full-Stack Profile & Admin Management</p>
        </div>

        <div className={styles.card}>
          <div className={styles.tabs}>
            <button className={!isRegister ? styles.activeTab : ''} onClick={() => setIsRegister(false)}>Sign In</button>
            <button className={isRegister ? styles.activeTab : ''} onClick={() => setIsRegister(true)}>Register</button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {isRegister && (
              <div>
                <label>Full Name</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} required />
              </div>
            )}
            <div>
              <label>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Please wait...' : (isRegister ? 'Register' : 'Sign In')}
            </button>
          </form>
        </div>

        {/* Demo Credentials Panel */}
        <div className={styles.demoPanel}>
          <div className={styles.demoTop}>
            <ShieldCheck size={16} color="#10B981" />
            <span className={styles.demoTitle}>Demo Evaluation Credentials</span>
          </div>
          <div className={styles.demoCards}>
            <div className={styles.demoItem}>
              <div><strong>Admin:</strong> demo-admin@example.com / Admin@12345</div>
              <button onClick={() => autofill('demo-admin@example.com', 'Admin@12345')} className={styles.autofillBtn}>Autofill</button>
            </div>
            <div className={styles.demoItem}>
              <div><strong>User:</strong> demo-user@example.com / User@12345</div>
              <button onClick={() => autofill('demo-user@example.com', 'User@12345')} className={styles.autofillBtn}>Autofill</button>
            </div>
          </div>
        </div>
      </div>
      {toast.message && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};
export default Login;

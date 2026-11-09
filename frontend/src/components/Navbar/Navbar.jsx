import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Award, ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/user-profile" className={styles.brand}>
          <div className={styles.logoPill}><Award size={22} /></div>
          <span className={styles.brandText}>VELoop <span className={styles.brandAccent}>Rewards</span></span>
        </Link>
        <nav className={styles.navLinks}>
          {user && (
            <>
              <Link to="/user-profile" className={styles.navLink}>
                <UserIcon size={16} /><span>My Profile</span>
              </Link>
              {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                <Link to="/admin/dashboard" className={`${styles.navLink} ${styles.adminLink}`}>
                  <ShieldCheck size={16} /><span>Admin Panel</span>
                </Link>
              )}
            </>
          )}
        </nav>
        <div className={styles.userActions}>
          {user ? (
            <div className={styles.profileMenu}>
              <span className={styles.userName}>{user.displayName}</span>
              <button onClick={() => { logout(); navigate('/login'); }} className={styles.logoutBtn}>
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link to="/login" className={styles.loginBtn}>Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;

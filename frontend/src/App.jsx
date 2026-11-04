
import { useState } from 'react'
import './App.css'

const menuItems = [
  'Dashboard',
  'My Profile',
  'Rewards Wallet',
  'Achievements',
  'Referrals',
  'Withdrawals',
  'Activity History',
]

const rewards = [
  { name: 'VEs Balance', amount: '2,450', symbol: 'VE', color: 'purple' },
  { name: 'SVEs Balance', amount: '850', symbol: 'SVE', color: 'blue' },
  { name: 'Gems', amount: '120', symbol: '◆', color: 'pink' },
  { name: 'Tokens', amount: '75', symbol: 'T', color: 'orange' },
]

const activities = [
  { title: 'Daily Login Reward', date: 'Today, 09:30 AM', points: '+50 VEs', type: 'Earned' },
  { title: 'Referral Bonus', date: 'Yesterday, 04:15 PM', points: '+100 VEs', type: 'Earned' },
  { title: 'Achievement Unlocked', date: 'Yesterday, 11:20 AM', points: '+25 Gems', type: 'Earned' },
]

function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  const [profile, setProfile] = useState({
    name: 'Dheeraj Sharma',
    email: 'dheeraj@example.com',
    phone: '9876543210',
    country: 'India',
    accountType: 'Member',
  })

  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">V</span>
          <span>VELoop <b>Rewards</b></span>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav className="navigation">
          {menuItems.map((item, index) => (
            <button
              key={item}
              className={`nav-item ${activePage === item ? 'active' : ''}`}
              onClick={() => setActivePage(item)}
            >
              <span className="nav-number">{String(index + 1).padStart(2, '0')}</span>
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="support-card">
            <h4>Need Help?</h4>
            <p>Contact our support team.</p>
            <button onClick={() => alert('Support feature coming soon!')}>
              Get Support
            </button>
          </div>
          <p className="version">VELoop Rewards v1.0</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Pages / {activePage}</p>
            <h2>{activePage}</h2>
          </div>

          <div className="user-info">
            <div className="notification">♧</div>
            <div className="avatar">DS</div>
            <div>
              <strong>Dheeraj Sharma</strong>
              <p>Member Account</p>
            </div>
          </div>
        </header>

        {activePage === 'Dashboard' ? (
          <>
            <section className="welcome-section">
              <div>
                <p className="eyebrow">YOUR REWARDS SPACE</p>
                <h1>Welcome back, Dheeraj! 👋</h1>
                <p>Track your rewards, explore achievements and keep growing.</p>
              </div>
              <div className="level-card">
                <span>YOUR CURRENT LEVEL</span>
                <h2>Level 05</h2>
                <div className="progress-track">
                  <div className="progress-fill" />
                </div>
                <small>750 / 1000 XP</small>
              </div>
            </section>

            <section className="section-heading">
              <div>
                <h3>Your Rewards Wallet</h3>
                <p>Overview of your available rewards</p>
              </div>
              <button className="view-button" onClick={() => setActivePage('Rewards Wallet')}>
                View Wallet →
              </button>
            </section>

            <section className="rewards-grid">
              {rewards.map((reward) => (
                <div className="reward-card" key={reward.name}>
                  <div className={`reward-symbol ${reward.color}`}>
                    {reward.symbol}
                  </div>
                  <p>{reward.name}</p>
                  <h2>{reward.amount}</h2>
                  <span>Available balance</span>
                </div>
              ))}
            </section>

            <section className="lower-grid">
              <div className="content-card">
                <div className="card-heading">
                  <div>
                    <h3>Recent Activity</h3>
                    <p>Your latest rewards and transactions</p>
                  </div>
                  <button onClick={() => setActivePage('Activity History')}>
                    View All →
                  </button>
                </div>

                {activities.map((activity) => (
                  <div className="activity-row" key={activity.title}>
                    <div className="activity-icon">↗</div>
                    <div className="activity-details">
                      <strong>{activity.title}</strong>
                      <span>{activity.date}</span>
                    </div>
                    <strong className="earned">{activity.points}</strong>
                  </div>
                ))}
              </div>

              <div className="content-card achievement-card">
                <div className="achievement-icon">🏆</div>
                <p className="eyebrow">KEEP GOING</p>
                <h3>Unlock More Achievements</h3>
                <p>Complete activities, earn rewards and reach new milestones.</p>
                <button onClick={() => setActivePage('Achievements')}>
                  Explore Achievements →
                </button>
              </div>
            </section>
          </>
        ) : activePage === 'My Profile' ? (
          <section className="content-card profile-card">
            <div className="profile-header">
              <div className="profile-avatar">DS</div>
              <div>
                <h2>{profile.name}</h2>
                <p>{profile.accountType} Account</p>
              </div>
            </div>

            <div className="profile-heading">
              <h3>Personal Information</h3>
              <button onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : '✎ Edit Profile'}
              </button>
            </div>

            <div className="profile-form">
              <label>
                Full Name
                <input value={profile.name} disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </label>

              <label>
                Email Address
                <input type="email" value={profile.email} disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </label>

              <label>
                Phone Number
                <input value={profile.phone} disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </label>

              <label>
                Country
                <input value={profile.country} disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })} />
              </label>

              <label>
                Account Type
                <input value={profile.accountType} disabled />
              </label>
            </div>

            {isEditing && (
              <button className="save-button" onClick={() => {
                setIsEditing(false)
                alert('Profile updated successfully!')
              }}>
                Save Changes
              </button>
            )}
          </section>

        ) : activePage === 'My Profile' ? (
          <section className="content-card profile-card">
            <div className="profile-header">
              <div className="profile-avatar">DS</div>
              <div>
                <h2>{profile.name}</h2>
                <p>{profile.accountType} Account</p>
              </div>
            </div>

            <div className="profile-heading">
              <h3>Personal Information</h3>
              <button onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : '✎ Edit Profile'}
              </button>
            </div>

            <div className="profile-form">
              <label>
                Full Name
                <input value={profile.name} disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </label>

              <label>
                Email Address
                <input type="email" value={profile.email} disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </label>

              <label>
                Phone Number
                <input value={profile.phone} disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </label>

              <label>
                Country
                <input value={profile.country} disabled={!isEditing}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })} />
              </label>

              <label>
                Account Type
                <input value={profile.accountType} disabled />
              </label>
            </div>

            {isEditing && (
              <button className="save-button" onClick={() => {
                setIsEditing(false)
                alert('Profile updated successfully!')
              }}>
                Save Changes
              </button>
            )}
          </section>
        ) : (
          <section className="content-card page-placeholder">
            <div className="achievement-icon">✨</div>
            <h2>{activePage}</h2>
            <p>This module will be developed in the next stages of our project.</p>
            <button onClick={() => setActivePage('Dashboard')}>
              ← Back to Dashboard
            </button>
          </section>
        )}
        <footer>
          © 2026 VELoop Rewards. All rights reserved.
        </footer>
      </main>
    </div>
  )
}

export default App

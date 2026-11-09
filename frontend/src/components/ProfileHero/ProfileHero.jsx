import React, { useState } from 'react';
import { Edit3, CheckCircle, Sparkles } from 'lucide-react';
import styles from './ProfileHero.module.css';

const ProfileHero = ({ profile, levelProgress, onUpdateName, showToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(profile?.displayName || '');

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    return parts.length === 1 ? parts[0].substring(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!newName.trim() || newName.trim() === profile.displayName) {
      setIsEditing(false);
      return;
    }
    try {
      await onUpdateName(newName.trim());
      setIsEditing(false);
      showToast('Profile name updated!', 'success');
    } catch (err) {
      showToast('Failed to update name', 'error');
    }
  };

  return (
    <div className={styles.heroCard}>
      <div className={styles.avatar}>
        <span className={styles.initials}>{getInitials(profile?.displayName)}</span>
      </div>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          {isEditing ? (
            <form onSubmit={handleSave} className={styles.editForm}>
              <input value={newName} onChange={e => setNewName(e.target.value)} className={styles.nameInput} autoFocus />
              <button type="submit" className={styles.saveBtn}>Save</button>
            </form>
          ) : (
            <>
              <h1 className={styles.name}>{profile?.displayName}</h1>
              <button onClick={() => setIsEditing(true)} className={styles.editBtn}><Edit3 size={15} /></button>
            </>
          )}
          {profile?.isVerified && <span className={styles.verifiedBadge}><CheckCircle size={13} /> Verified</span>}
          <span className={styles.statusBadge}>{profile?.accountStatus}</span>
        </div>
        <div className={styles.levelRow}>
          <Sparkles size={15} color="#F59E0B" />
          <span>Level {String(levelProgress?.currentLevel || 1).padStart(2, '0')} — {levelProgress?.currentLevelName || 'Reward Explorer'}</span>
          <span className={styles.xpText}>({(levelProgress?.currentXp || 0).toLocaleString()} / {(levelProgress?.nextLevelXp || 0).toLocaleString()} XP)</span>
        </div>
      </div>
    </div>
  );
};
export default ProfileHero;

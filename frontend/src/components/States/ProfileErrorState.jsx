import React from 'react';
import { AlertCircle } from 'lucide-react';
const ProfileErrorState = ({ message, onRetry }) => (
  <div style={{ textAlign: 'center', padding: '40px 20px', background: '#1E2238', borderRadius: 12 }}>
    <AlertCircle size={36} color="#EF4444" style={{ marginBottom: 12 }} />
    <h3 style={{ color: '#F8FAFC' }}>Unable to Load Profile</h3>
    <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: 16 }}>{message}</p>
    {onRetry && <button onClick={onRetry} style={{ background: '#3B82F6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600 }}>Try Again</button>}
  </div>
);
export default ProfileErrorState;

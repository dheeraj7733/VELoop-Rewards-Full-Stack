import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
const Toast = ({ message, type = 'success' }) => {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
      borderRadius: 8, background: '#1E2238', border: `1px solid ${type === 'success' ? '#10B981' : '#EF4444'}`,
      color: '#F8FAFC', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', fontSize: '0.9rem'
    }}>
      {type === 'success' ? <CheckCircle2 size={16} color="#10B981" /> : <AlertCircle size={16} color="#EF4444" />}
      <span>{message}</span>
    </div>
  );
};
export default Toast;

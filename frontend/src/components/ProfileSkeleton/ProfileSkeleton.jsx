import React from 'react';
const ProfileSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ height: 120, background: '#1E2238', borderRadius: 12 }} />
    <div style={{ height: 100, background: '#1E2238', borderRadius: 12 }} />
    <div style={{ height: 160, background: '#1E2238', borderRadius: 12 }} />
  </div>
);
export default ProfileSkeleton;

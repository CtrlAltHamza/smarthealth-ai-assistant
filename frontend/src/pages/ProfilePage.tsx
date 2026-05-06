import React from "react";
import { useSelector } from "react-redux";

export default function ProfilePage() {
  const user = useSelector((s: any) => s.auth.user);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Profile</h1>
      {!user ? (
        <div style={{ marginTop: 12, color: 'var(--text-secondary)' }}>You are not logged in.</div>
      ) : (
        <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
          <div style={{ fontWeight: 700 }}>{user.name}</div>
          <div style={{ color: 'var(--text-secondary)' }}>{user.email}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Role: {user.role}</div>
        </div>
      )}
    </div>
  );
}

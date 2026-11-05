import { useEffect, useState } from 'react';
import './Auth.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AuthGate({ children: App }) {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('login');
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, { credentials: 'include' })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/${mode === 'login' ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Authentication failed');
      setUser(data.user);
    } catch (err) {
      setError(err.message || 'Unable to connect to the server');
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      setUser(null);
      setForm({ name: '', email: '', password: '' });
      setMode('login');
    }
  }

  if (checking) {
    return <div className="auth-loading">Checking your session…</div>;
  }

  if (user) return <App user={user} onLogout={logout} />;

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand"><span>V</span><div>VELoop <b>Rewards</b></div></div>
        <p className="auth-eyebrow">YOUR REWARDS SPACE</p>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="auth-subtitle">
          {mode === 'login' ? 'Sign in to continue to your rewards dashboard.' : 'Join VELoop Rewards and get started.'}
        </p>

        <form onSubmit={submit} className="auth-form">
          {mode === 'register' && (
            <label>Full name
              <input name="name" value={form.name} onChange={updateField} placeholder="Enter your full name" minLength="2" maxLength="80" required />
            </label>
          )}
          <label>Email address
            <input name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} placeholder="you@example.com" required />
          </label>
          <label>Password
            <input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={form.password} onChange={updateField} placeholder="At least 8 characters" minLength="8" required />
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}</button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Create account' : 'Sign in'}
          </button>
        </p>
        <p className="auth-security">Your password is securely hashed. Your session cookie is HttpOnly.</p>
      </section>
    </main>
  );
}

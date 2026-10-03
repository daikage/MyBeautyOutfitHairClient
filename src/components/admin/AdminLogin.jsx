import { useState } from 'react';
import api from '../../api';
import { Alert } from '../ui';
import { salon } from '../../data/salon';

export default function AdminLogin({ onSuccess }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await api.adminLogin(passcode);
      onSuccess(response);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section section--ink">
      <div className="container">
        <div className="login-card">
          <span className="eyebrow">Stylist access</span>
          <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)' }}>Studio back office</h1>
          <p>
            Sign in to upload new styles, edit the menu, read appointment requests and update the text
            on the home page.
          </p>

          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="admin-passcode">Passcode</label>
              <input
                id="admin-passcode"
                type="password"
                value={passcode}
                onChange={(event) => setPasscode(event.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                autoFocus
                required
              />
            </div>

            <Alert type="error">{error}</Alert>

            <button type="submit" className="btn btn--gold btn--block" disabled={busy}>
              {busy ? 'Checking…' : 'Sign in'}
            </button>
          </form>

          <p className="field__hint" style={{ marginTop: '1.4rem' }}>
            The passcode is set in <code>server/.env</code> as <code>ADMIN_PASSCODE</code>. Ask David
            if you need it changed.
          </p>
          <p className="field__hint">{salon.name} · {salon.addressLines[1]}</p>
        </div>
      </div>
    </section>
  );
}
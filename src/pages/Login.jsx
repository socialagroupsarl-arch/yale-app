import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password
    });
    setLoading(false);
    if (error) setError(error.message);
    else navigate('/');
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  }

  return (
    <div className="screen">
      <div className="auth-header">
        <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--navy)' }}>YALE</div>
        <div className="text-muted">ON SE RETROUVE LÀ.</div>
      </div>

      <h1 className="title-xl">
        Et si votre prochaine <span style={{ color: 'var(--teal)' }}>histoire</span> commençait ici ?
      </h1>
      <p className="text-muted" style={{ margin: '10px 0 20px' }}>
        Découvrez les événements qui méritent d'être vécus.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <span className="field-icon">👤</span>
          <input
            placeholder="E-mail ou numéro de téléphone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <span className="field-icon">🔒</span>
          <input
            type={showPwd ? 'text' : 'password'}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="field-icon" style={{ cursor: 'pointer' }} onClick={() => setShowPwd(!showPwd)}>
            {showPwd ? '🙈' : '👁'}
          </span>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div style={{ textAlign: 'right', marginBottom: 16 }}>
          <Link to="/mot-de-passe-oublie" className="btn-link">Mot de passe oublié ?</Link>
        </div>

        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? 'Connexion…' : 'Se connecter →'}
        </button>
      </form>

      <div className="divider-or">ou</div>

      <button className="btn btn-outline" onClick={handleGoogle}>
        Continuer avec Google
      </button>

      <p className="text-muted" style={{ textAlign: 'center', marginTop: 20 }}>
        Pas encore de compte ?{' '}
        <Link to="/inscription" className="btn-link">Créer un compte</Link>
      </p>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function SignupParticipant() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+237');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accepted, setAccepted] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('Le mot de passe doit contenir au moins 8 caractères.');
    if (password !== confirm) return setError('Les mots de passe ne correspondent pas.');
    if (!accepted) return setError("Vous devez accepter les conditions d'utilisation.");

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone: `${countryCode}${phone}`, account_type: 'participant' }
      }
    });
    setLoading(false);
    if (error) return setError(error.message);
    navigate('/verification-email', { state: { email } });
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  }

  return (
    <div className="screen">
      <div className="auth-header">
        <div style={{ fontWeight: 800, fontSize: 20 }}>YALE</div>
      </div>
      <div className="progress-dots"><span className="active" /><span /><span /></div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div className="icon-btn active" style={{ width: 48, height: 48, borderRadius: '50%' }}>👤</div>
        <div>
          <div className="text-muted" style={{ fontSize: 13 }}>Compte</div>
          <div className="title-lg">Participant</div>
        </div>
      </div>
      <p className="text-muted" style={{ margin: '10px 0 20px' }}>
        Créez votre compte pour découvrir des événements, acheter vos billets et vivre des expériences uniques.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <span className="field-icon">👤</span>
          <input placeholder="Nom complet (Ex. Jean Dupont)" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="field">
          <span className="field-icon">✉️</span>
          <input type="email" placeholder="Adresse e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <span className="field-icon">📞</span>
          <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} style={{ width: 70 }}>
            <option value="+237">🇨🇲 +237</option>
            <option value="+33">🇫🇷 +33</option>
            <option value="+1">🇺🇸 +1</option>
          </select>
          <input placeholder="Numéro de téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="field">
          <span className="field-icon">🔒</span>
          <input type="password" placeholder="Au moins 8 caractères" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="field">
          <span className="field-icon">🔒</span>
          <input type="password" placeholder="Confirmer le mot de passe" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </div>

        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', margin: '4px 0 20px', fontSize: 13 }}>
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} style={{ marginTop: 2 }} />
          <span className="text-muted">
            J'accepte les <span style={{ color: 'var(--teal-dark)', fontWeight: 600 }}>conditions d'utilisation</span> et la{' '}
            <span style={{ color: 'var(--teal-dark)', fontWeight: 600 }}>politique de confidentialité</span>.
          </span>
        </label>

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? 'Création…' : 'Créer mon compte →'}
        </button>
      </form>

      <div className="divider-or">ou</div>
      <button className="btn btn-outline" onClick={handleGoogle}>Continuer avec Google</button>
    </div>
  );
}

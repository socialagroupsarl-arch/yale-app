import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const CODE_LENGTH = 6;
const DURATION = 600; // 10:00

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(DURATION);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  function formatTime(s) {
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${m}:${sec}`;
  }

  function handleChange(index, value) {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < CODE_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError('');
    const token = digits.join('');
    if (token.length < CODE_LENGTH) return setError('Saisissez les 6 chiffres du code.');
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
    setLoading(false);
    if (error) return setError(error.message);
    navigate('/');
  }

  async function handleResend() {
    setError('');
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) setError(error.message);
    else setSecondsLeft(DURATION);
  }

  return (
    <div className="screen">
      <div className="auth-header">
        <div style={{ fontWeight: 800, fontSize: 20 }}>YALE</div>
      </div>
      <div className="progress-dots"><span className="active" /><span className="active" /><span /></div>

      <h1 className="title-lg">Vérifiez votre <span style={{ color: 'var(--teal)' }}>e-mail</span></h1>
      <p className="text-muted" style={{ margin: '10px 0 16px' }}>
        Nous avons envoyé un code de vérification à l'adresse suivante :
      </p>
      <div className="field" style={{ marginBottom: 20 }}>
        <span className="field-icon">✉️</span>
        <span>{email}</span>
      </div>

      <form onSubmit={handleVerify}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>Entrez le code de vérification</p>
        <p className="text-muted" style={{ marginBottom: 10 }}>Saisissez le code à 6 chiffres reçu par e-mail.</p>
        <div className="otp-inputs">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={d}
              maxLength={1}
              inputMode="numeric"
              onChange={(e) => handleChange(i, e.target.value)}
            />
          ))}
        </div>

        <div className="field" style={{ justifyContent: 'space-between' }}>
          <span>⏱ Code expire dans</span>
          <strong>{formatTime(secondsLeft)}</strong>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary" disabled={loading} type="submit" style={{ marginTop: 8 }}>
          {loading ? 'Vérification…' : 'Vérifier et continuer →'}
        </button>
      </form>

      <p className="text-muted" style={{ textAlign: 'center', marginTop: 20 }}>
        Vous n'avez pas reçu le code ?{' '}
        <button className="btn-link" onClick={handleResend}>Renvoyer le code</button>
      </p>
    </div>
  );
}

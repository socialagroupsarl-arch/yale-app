import { Link, useNavigate } from 'react-router-dom';

export default function TopBar({ walletBalance = 0, hasNotification = false, showBack = false, favActive = false }) {
  const navigate = useNavigate();
  return (
    <div className="top-bar">
      {showBack ? (
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Retour">←</button>
      ) : (
        <Link to="/" style={{ fontWeight: 800, color: 'var(--navy)', textDecoration: 'none', fontSize: 18 }}>
          YALE
        </Link>
      )}
      <div className="city-pill">🇨🇲 Douala, Cameroun</div>
      <Link to="/portefeuille" className="wallet-pill">💳 {walletBalance} FCFA</Link>
      <Link to="/favoris" className={`icon-btn ${favActive ? 'active' : ''}`} aria-label="Favoris">♥</Link>
      <Link to="/notifications" className="icon-btn" aria-label="Notifications">
        🔔
        {hasNotification && <span className="dot-badge" />}
      </Link>
    </div>
  );
}

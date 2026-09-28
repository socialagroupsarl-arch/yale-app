import { Link } from 'react-router-dom';

export default function ChooseAccountType() {
  return (
    <div className="screen">
      <div className="auth-header">
        <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--navy)' }}>YALE</div>
      </div>
      <div className="progress-dots">
        <span className="active" /><span /><span />
      </div>

      <h1 className="title-lg" style={{ textAlign: 'center' }}>
        Quel type de compte souhaitez-vous <span style={{ color: 'var(--teal)' }}>créer</span> ?
      </h1>
      <p className="text-muted" style={{ textAlign: 'center', margin: '10px 0 24px' }}>
        Choisissez l'option qui correspond le mieux à vos besoins.
      </p>

      <Link to="/inscription/participant" className="card" style={{ display: 'block', marginBottom: 16, textDecoration: 'none' }}>
        <h3 style={{ fontSize: 18 }}>Participant</h3>
        <p className="text-muted" style={{ marginTop: 8 }}>
          Découvrez des événements, achetez vos billets, participez et soutenez vos artistes, projets et causes préférés.
        </p>
      </Link>

      <div className="card" style={{ opacity: 0.6 }}>
        <h3 style={{ fontSize: 18 }}>Organisateur</h3>
        <p className="text-muted" style={{ marginTop: 8 }}>
          Créez et gérez vos événements, vendez vos billets, collectez des fonds et développez votre communauté.
        </p>
        <p className="text-muted" style={{ marginTop: 8, fontSize: 12 }}>Bientôt disponible dans cette version.</p>
      </div>
    </div>
  );
}

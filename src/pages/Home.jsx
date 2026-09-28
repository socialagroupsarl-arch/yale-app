import { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { supabase } from '../lib/supabaseClient';

const CATEGORIES = [
  { icon: '🎵', label: 'Concerts' },
  { icon: '🎬', label: 'Spectacles' },
  { icon: '🎤', label: 'Conférences' },
  { icon: '🎟️', label: 'Soirées' },
  { icon: '🎪', label: 'Festivals' },
  { icon: '🤝', label: 'Solidarité' },
  { icon: '▦', label: 'Autres' }
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('Concerts');
  const [events, setEvents] = useState([]);
  const [wallet, setWallet] = useState(0);

  useEffect(() => {
    supabase
      .from('events')
      .select('id, title, cover_image_url, start_date, city')
      .eq('status', 'a_venir')
      .order('start_date', { ascending: true })
      .limit(10)
      .then(({ data }) => setEvents(data || []));

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) return;
      const { data: w } = await supabase.from('wallets').select('balance').eq('user_id', data.user.id).single();
      if (w) setWallet(w.balance);
    });
  }, []);

  return (
    <div className="app-shell">
      <TopBar walletBalance={wallet} hasNotification />
      <div className="screen">
        <div className="field" style={{ marginBottom: 0 }}>
          <span className="field-icon">🔍</span>
          <input placeholder="Rechercher un événement, un organisateur ou une cagnotte…" />
        </div>

        <div className="hero-banner" style={{ marginTop: 16 }}>
          <h1 style={{ fontSize: 22 }}>
            Vivez des moments <span className="teal">inoubliables</span>
          </h1>
          <p style={{ color: '#C7D3E0', marginTop: 8, fontSize: 14 }}>
            Découvrez des événements, soutenez des causes et vivez des expériences uniques.
          </p>
        </div>

        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className={`category-item ${activeCategory === cat.label ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.label)}
            >
              <span style={{ fontSize: 20 }}>{cat.icon}</span>
              {cat.label}
            </div>
          ))}
        </div>

        <div className="section-header">
          <h2>Événements en vedette</h2>
          <a href="#">Voir tout →</a>
        </div>
        {events.length === 0 ? (
          <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ fontSize: 28 }}>🗓️</span>
            <div>
              <strong>Les événements apparaîtront ici</strong>
              <p className="text-muted">Découvrez bientôt des événements près de chez vous.</p>
            </div>
          </div>
        ) : (
          events.map((ev) => (
            <div className="card" key={ev.id} style={{ marginBottom: 12 }}>
              <strong>{ev.title}</strong>
              <p className="text-muted">{ev.city} · {new Date(ev.start_date).toLocaleDateString('fr-FR')}</p>
            </div>
          ))
        )}

        <div className="section-header">
          <h2>Organisateurs populaires</h2>
          <a href="#">Voir tout →</a>
        </div>
        <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <span style={{ fontSize: 28 }}>👥</span>
          <div>
            <strong>Découvrez bientôt nos organisateurs</strong>
            <p className="text-muted">Les organisateurs les plus actifs apparaîtront ici.</p>
          </div>
        </div>

        <div className="section-header">
          <h2>Cagnottes en cours</h2>
          <a href="#">Voir tout →</a>
        </div>
        <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <span style={{ fontSize: 28 }}>💙</span>
          <div>
            <strong>Les cagnottes en cours apparaîtront ici</strong>
            <p className="text-muted">Soutenez des projets et des causes qui vous tiennent à cœur.</p>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

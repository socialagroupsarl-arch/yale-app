import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import EmptyState from '../components/EmptyState';
import { supabase } from '../lib/supabaseClient';

const TABS = [
  { key: 'a_venir', label: 'À venir', icon: '🎫' },
  { key: 'passe', label: 'Passés', icon: '🕒' },
  { key: 'annule', label: 'Annulés', icon: '✕' }
];

export default function Tickets() {
  const [tab, setTab] = useState('a_venir');
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;
      const { data } = await supabase
        .from('tickets')
        .select('id, status, qr_code, events(title, start_date, city)')
        .eq('user_id', auth.user.id)
        .eq('status', tab);
      setTickets(data || []);
    })();
  }, [tab]);

  return (
    <div className="app-shell">
      <TopBar />
      <div className="screen">
        <h1 className="title-lg">Mes billets</h1>
        <p className="text-muted" style={{ margin: '8px 0 20px' }}>Retrouvez ici tous vos billets d'événements.</p>

        <div className="tabs">
          {TABS.map((t) => (
            <button key={t.key} className={tab === t.key ? 'active' : ''} onClick={() => setTab(t.key)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tickets.length === 0 ? (
          <EmptyState
            icon="🎟️"
            title="Aucun billet pour le moment"
            description="Les billets que vous achetez apparaîtront ici pour un accès rapide le jour de l'événement."
            ctaLabel="Découvrir des événements"
            onCta={() => navigate('/')}
          />
        ) : (
          tickets.map((t) => (
            <div className="card" key={t.id} style={{ marginBottom: 12 }}>
              <strong>{t.events?.title}</strong>
              <p className="text-muted">
                {t.events?.city} · {t.events?.start_date && new Date(t.events.start_date).toLocaleDateString('fr-FR')}
              </p>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
}

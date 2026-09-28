import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import EmptyState from '../components/EmptyState';
import { supabase } from '../lib/supabaseClient';

export default function Favorites() {
  const [tab, setTab] = useState('evenements');
  const [events, setEvents] = useState([]);
  const [cagnottes, setCagnottes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;
      const { data: favEvents } = await supabase
        .from('favorite_events')
        .select('events(id, title, city, start_date)')
        .eq('user_id', auth.user.id);
      setEvents((favEvents || []).map((f) => f.events));

      const { data: favCagnottes } = await supabase
        .from('favorite_cagnottes')
        .select('cagnottes(id, title, goal_amount, current_amount)')
        .eq('user_id', auth.user.id);
      setCagnottes((favCagnottes || []).map((f) => f.cagnottes));
    })();
  }, []);

  return (
    <div className="app-shell">
      <TopBar favActive />
      <div className="screen">
        <h1 className="title-lg">Mes favoris</h1>
        <p className="text-muted" style={{ margin: '8px 0 20px' }}>
          Retrouvez ici les événements et les cagnottes que vous avez mis en favori.
        </p>

        <div className="tabs">
          <button className={tab === 'evenements' ? 'active' : ''} onClick={() => setTab('evenements')}>📅 Événements</button>
          <button className={tab === 'cagnottes' ? 'active' : ''} onClick={() => setTab('cagnottes')}>💙 Cagnottes</button>
        </div>

        {tab === 'evenements' ? (
          events.length === 0 ? (
            <EmptyState
              icon="📅"
              title="Aucun événement en favori"
              description="Les événements que vous ajoutez en favori apparaîtront ici pour les retrouver facilement."
              ctaLabel="Découvrir des événements"
              onCta={() => navigate('/')}
            />
          ) : (
            events.map((ev) => (
              <div className="card" key={ev.id} style={{ marginBottom: 12 }}>
                <strong>{ev.title}</strong>
                <p className="text-muted">{ev.city}</p>
              </div>
            ))
          )
        ) : cagnottes.length === 0 ? (
          <EmptyState
            icon="💙"
            title="Aucune cagnotte en favori"
            description="Les cagnottes que vous ajoutez en favori apparaîtront ici pour les retrouver facilement."
            ctaLabel="Découvrir des cagnottes"
            onCta={() => navigate('/cagnottes')}
          />
        ) : (
          cagnottes.map((c) => (
            <div className="card" key={c.id} style={{ marginBottom: 12 }}>
              <strong>{c.title}</strong>
              <p className="text-muted">{c.current_amount} / {c.goal_amount} FCFA</p>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
}

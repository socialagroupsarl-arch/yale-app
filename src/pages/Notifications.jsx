import { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import EmptyState from '../components/EmptyState';
import { supabase } from '../lib/supabaseClient';

const TABS = [
  { key: 'toutes', label: 'Toutes', icon: '🔔' },
  { key: 'billets', label: 'Billets', icon: '🎟️' },
  { key: 'evenements', label: 'Événements', icon: '♡' },
  { key: 'cagnottes', label: 'Cagnottes', icon: '💙' },
  { key: 'systeme', label: 'Système', icon: '📣' }
];

export default function Notifications() {
  const [tab, setTab] = useState('toutes');
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;
      let query = supabase.from('notifications').select('*').eq('user_id', auth.user.id).order('created_at', { ascending: false });
      if (tab !== 'toutes') query = query.eq('category', tab);
      const { data } = await query;
      setItems(data || []);
    })();
  }, [tab]);

  async function markAllRead() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', auth.user.id);
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }

  return (
    <div className="app-shell">
      <TopBar showBack />
      <div className="screen">
        <div className="section-header" style={{ margin: '0 0 8px' }}>
          <h1 className="title-lg">Notifications</h1>
          <button className="btn-link" onClick={markAllRead}>✓ Tout lire</button>
        </div>
        <p className="text-muted" style={{ marginBottom: 20 }}>Restez informé de tout ce qui compte pour vous.</p>

        <div className="tabs" style={{ flexWrap: 'wrap' }}>
          {TABS.map((t) => (
            <button key={t.key} className={tab === t.key ? 'active' : ''} onClick={() => setTab(t.key)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon="🔔"
            title="Aucune notification"
            description="Vous serez informé ici des nouveautés, de vos billets et de vos activités."
          />
        ) : (
          items.map((n) => (
            <div className="card" key={n.id} style={{ marginBottom: 10, opacity: n.is_read ? 0.6 : 1 }}>
              <strong>{n.title}</strong>
              <p className="text-muted">{n.body}</p>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
}

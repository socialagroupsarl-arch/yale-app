import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { supabase } from '../lib/supabaseClient';

const MENU = [
  { icon: '👤', title: 'Informations personnelles', desc: 'Nom, email, téléphone' },
  { icon: '🛡️', title: 'Sécurité', desc: 'Mot de passe, authentification, sessions' },
  { icon: '👥', title: 'Mes communautés', desc: 'Les communautés que vous suivez' },
  { icon: '🌐', title: 'Langue et région', desc: 'Langue, pays, devise' },
  { icon: '❓', title: 'Aide & support', desc: 'FAQ, centre d\u2019aide, nous contacter' },
  { icon: '📄', title: 'Conditions d\u2019utilisation', desc: 'Consultez nos conditions' },
  { icon: '🛡️', title: 'Politique de confidentialité', desc: 'Comment nous protégeons vos données' },
  { icon: 'ℹ️', title: 'À propos de YALE', desc: 'Version 1.0.0 · On se retrouve là.' }
];

export default function Account() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ tickets: 0, favorites: 0, cagnottes: 0, organizers: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;
      const { data: p } = await supabase.from('profiles').select('*').eq('id', auth.user.id).single();
      setProfile(p);

      const [{ count: tickets }, { count: favorites }, { count: organizers }] = await Promise.all([
        supabase.from('tickets').select('id', { count: 'exact', head: true }).eq('user_id', auth.user.id),
        supabase.from('favorite_events').select('user_id', { count: 'exact', head: true }).eq('user_id', auth.user.id),
        supabase.from('followed_organizers').select('user_id', { count: 'exact', head: true }).eq('user_id', auth.user.id)
      ]);
      setStats({ tickets: tickets || 0, favorites: favorites || 0, cagnottes: 0, organizers: organizers || 0 });
    })();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/connexion');
  }

  return (
    <div className="app-shell">
      <TopBar />
      <div className="screen">
        <h1 className="title-lg" style={{ marginBottom: 16 }}>Mon compte</h1>

        <div className="hero-banner" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <strong style={{ fontSize: 18 }}>{profile?.full_name || '—'}</strong>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '6px 0', fontSize: 12 }}>
                <span style={{ background: 'var(--teal)', borderRadius: 999, padding: '2px 8px' }}>
                  {profile?.is_verified ? '✓ Compte vérifié' : 'Non vérifié'}
                </span>
              </div>
              <p style={{ color: '#C7D3E0', fontSize: 13 }}>{profile?.email}</p>
              <p style={{ color: '#C7D3E0', fontSize: 13 }}>📞 {profile?.country_code} {profile?.phone}</p>
            </div>
            <button className="btn-outline" style={{ borderRadius: 999, padding: '8px 14px', fontSize: 12, fontWeight: 700 }}>
              ✎ Modifier
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
          {[
            ['🎟️', stats.tickets, 'Billets'],
            ['♡', stats.favorites, 'Favoris'],
            ['💙', stats.cagnottes, 'Cagnottes'],
            ['👥', stats.organizers, 'Organisateurs']
          ].map(([icon, value, label]) => (
            <div key={label} className="card" style={{ textAlign: 'center', padding: 12 }}>
              <div style={{ fontSize: 18 }}>{icon}</div>
              <strong style={{ fontSize: 18 }}>{value}</strong>
              <div className="text-muted" style={{ fontSize: 11 }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0 }}>
          {MENU.map((item, i) => (
            <div
              key={item.title}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: 16,
                borderBottom: i < MENU.length - 1 ? '1px solid var(--border)' : 'none'
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 14 }}>{item.title}</strong>
                <p className="text-muted" style={{ fontSize: 12 }}>{item.desc}</p>
              </div>
              <span className="text-muted">›</span>
            </div>
          ))}
        </div>

        <button className="btn btn-danger-outline" style={{ marginTop: 20 }} onClick={handleLogout}>
          ⇥ Se déconnecter
        </button>
      </div>
      <BottomNav />
    </div>
  );
}

import { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { supabase } from '../lib/supabaseClient';

export default function Wallet() {
  const [wallet, setWallet] = useState({ balance: 0, pending_balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [hideBalance, setHideBalance] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;
      const { data: w } = await supabase.from('wallets').select('*').eq('user_id', auth.user.id).single();
      if (w) setWallet(w);
      const { data: tx } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', auth.user.id)
        .order('created_at', { ascending: false });
      setTransactions(tx || []);
    })();
  }, []);

  return (
    <div className="app-shell">
      <TopBar walletBalance={wallet.balance} />
      <div className="screen">
        <div className="hero-banner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1 style={{ fontSize: 20 }}>
              Mon <span className="teal">portefeuille</span>
            </h1>
            <button className="btn-link" style={{ color: '#C7D3E0', fontSize: 12 }} onClick={() => setHideBalance(!hideBalance)}>
              {hideBalance ? '🙈 Afficher' : '👁 Masquer'} le solde
            </button>
          </div>
          <p style={{ color: '#C7D3E0', fontSize: 13, margin: '8px 0 20px' }}>
            Gérez votre solde, effectuez des recharges et des retraits en toute sécurité.
          </p>
          <p style={{ color: '#C7D3E0', fontSize: 13 }}>Solde disponible</p>
          <strong style={{ fontSize: 30 }}>{hideBalance ? '••••' : `${wallet.balance} FCFA`}</strong>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', margin: '14px 0' }} />
          <p style={{ color: '#C7D3E0', fontSize: 13 }}>Solde en attente</p>
          <strong style={{ fontSize: 20 }}>{hideBalance ? '••••' : `${wallet.pending_balance} FCFA`}</strong>
        </div>

        <div style={{ display: 'flex', gap: 12, margin: '16px 0 24px' }}>
          <button className="btn btn-primary" style={{ flex: 1 }}>＋ Recharger</button>
          <button className="btn btn-outline" style={{ flex: 1 }}>↗ Retirer</button>
        </div>

        <h2 style={{ fontSize: 17, marginBottom: 12 }}>Transactions récentes</h2>
        {transactions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 30 }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>📄</div>
            <strong>Aucune transaction pour le moment</strong>
            <p className="text-muted" style={{ marginTop: 6 }}>Vos recharges et retraits apparaîtront ici.</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div className="card" key={tx.id} style={{ marginBottom: 10 }}>
              <strong>{tx.type === 'recharge' ? 'Recharge' : 'Retrait'}</strong>
              <p className="text-muted">{tx.amount} FCFA · {tx.status}</p>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
}

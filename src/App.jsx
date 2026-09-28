import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';

import Login from './pages/Login';
import ChooseAccountType from './pages/ChooseAccountType';
import SignupParticipant from './pages/SignupParticipant';
import VerifyEmail from './pages/VerifyEmail';
import Home from './pages/Home';
import Account from './pages/Account';
import Tickets from './pages/Tickets';
import Notifications from './pages/Notifications';
import Favorites from './pages/Favorites';
import Wallet from './pages/Wallet';

function RequireAuth({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) return null;
  if (!session) return <Navigate to="/connexion" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<ChooseAccountType />} />
      <Route path="/inscription/participant" element={<SignupParticipant />} />
      <Route path="/verification-email" element={<VerifyEmail />} />

      <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/billets" element={<RequireAuth><Tickets /></RequireAuth>} />
      <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
      <Route path="/favoris" element={<RequireAuth><Favorites /></RequireAuth>} />
      <Route path="/portefeuille" element={<RequireAuth><Wallet /></RequireAuth>} />
      <Route path="/compte" element={<RequireAuth><Account /></RequireAuth>} />
      <Route path="/cagnottes" element={<RequireAuth><Home /></RequireAuth>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

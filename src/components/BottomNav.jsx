import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Accueil', icon: '🏠' },
  { to: '/billets', label: 'Mes billets', icon: '📅' },
  { to: '/cagnottes', label: 'Cagnottes', icon: '♡' },
  { to: '/compte', label: 'Compte', icon: '👤' }
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

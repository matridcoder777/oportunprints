import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(0,0,0,0.9)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(34,197,94,0.3)',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    gap: 12,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  logo: {
    color: '#22c55e',
    fontWeight: 800,
    fontSize: 22,
    letterSpacing: '-0.5px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'nowrap',
  },
  link: {
    color: '#ccc',
    cursor: 'pointer',
    fontSize: 13,
    transition: 'color 0.2s',
    whiteSpace: 'nowrap',
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: 'inherit',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  searchInput: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 6,
    color: '#fff',
    padding: '5px 10px',
    fontSize: 13,
    outline: 'none',
    width: 160,
  },
  cartBtn: {
    position: 'relative',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    fontSize: 22,
    lineHeight: 1,
    padding: '2px 4px',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    background: '#22c55e',
    color: '#000',
    borderRadius: '50%',
    fontSize: 10,
    fontWeight: 700,
    width: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    color: '#ccc',
    fontSize: 13,
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    background: 'rgba(34,197,94,0.15)',
    border: '1px solid rgba(34,197,94,0.4)',
    color: '#22c55e',
    borderRadius: 6,
    padding: '5px 12px',
    cursor: 'pointer',
    fontSize: 13,
    fontFamily: 'inherit',
    transition: 'background 0.2s',
  },
};

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [search, setSearch] = useState('');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const linkStyle = (key: string): React.CSSProperties => ({
    ...styles.link,
    color: hoveredLink === key ? '#22c55e' : '#ccc',
  });

  const navLinks = [
    { key: 'products', label: t('nav.productsProjects'), path: '/products' },
    { key: 'orders', label: t('nav.myOrders'), path: '/orders' },
    ...(user?.role === 'admin'
      ? [{ key: 'admin', label: t('nav.adminApprovals'), path: '/admin' }]
      : []),
    { key: 'history', label: t('nav.ordersHistory'), path: '/orders/history' },
    { key: 'cart', label: t('nav.shoppingCart'), path: '/cart' },
    {
      key: 'profile',
      label: t('nav.storeProfile'),
      path: '/store-profile',
    },
    { key: 'support', label: t('nav.support'), path: '/support' },
    { key: 'contact', label: t('nav.contactUs'), path: '/contact' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <span style={styles.logo} onClick={() => navigate('/dashboard')}>
          Oportun
        </span>
        <div style={styles.links}>
          {navLinks.map(({ key, label, path }) => (
            <button
              key={key}
              style={linkStyle(key)}
              onMouseEnter={() => setHoveredLink(key)}
              onMouseLeave={() => setHoveredLink(null)}
              onClick={() => navigate(path)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.right}>
        <input
          style={styles.searchInput}
          placeholder={t('common.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKey}
        />

        <button style={styles.cartBtn} onClick={() => navigate('/cart')}>
          🛒
          <span style={styles.badge}>{cartCount}</span>
        </button>

        {user && (
          <span style={styles.userName}>
            {user.firstName} {user.lastName}
          </span>
        )}

        <button style={styles.logoutBtn} onClick={logout}>
          {t('common.logout')}
        </button>
      </div>
    </nav>
  );
}

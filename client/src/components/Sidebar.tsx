import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/documents', label: 'Documents', icon: '📄' },
  { to: '/templates', label: 'Templates', icon: '🖨️' },
  { to: '/print-queue', label: 'Print Queue', icon: '⚙️' },
];

const Sidebar: React.FC = () => {
  const sidebarStyle: React.CSSProperties = {
    width: '240px',
    minHeight: '100%',
    background: '#1a1a2e',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '1px',
    color: 'rgba(255,255,255,0.4)',
    padding: '24px 20px 8px',
    textTransform: 'uppercase',
  };

  return (
    <aside style={sidebarStyle}>
      <div style={sectionTitleStyle}>Navigation</div>
      <nav>
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '14px',
              background: isActive ? '#00A99D' : 'transparent',
              borderLeft: isActive ? '3px solid #fff' : '3px solid transparent',
              transition: 'background 0.15s',
            })}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              if (!el.getAttribute('aria-current')) {
                el.style.background = 'rgba(0,169,157,0.2)';
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              if (!el.getAttribute('aria-current')) {
                el.style.background = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '18px' }}>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

const Navbar: React.FC = () => {
  const navStyle: React.CSSProperties = {
    height: '60px',
    background: '#00A99D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    color: '#fff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    flexShrink: 0,
  };

  const logoWrapStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.1,
  };

  const logoTextStyle: React.CSSProperties = {
    fontWeight: 'bold',
    fontSize: '20px',
    letterSpacing: '0.5px',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '11px',
    opacity: 0.85,
    letterSpacing: '0.5px',
  };

  const rightStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const adminTextStyle: React.CSSProperties = {
    fontSize: '14px',
    opacity: 0.9,
  };

  const avatarStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '13px',
    border: '2px solid rgba(255,255,255,0.5)',
  };

  return (
    <nav style={navStyle}>
      <div style={logoWrapStyle}>
        <span style={logoTextStyle}>Oportun</span>
        <span style={subtitleStyle}>Print Portal</span>
      </div>
      <div style={rightStyle}>
        <span style={adminTextStyle}>Admin User</span>
        <div style={avatarStyle}>AU</div>
      </div>
    </nav>
  );
};

export default Navbar;

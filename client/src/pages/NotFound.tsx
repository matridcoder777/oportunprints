import { useNavigate } from 'react-router-dom';

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    textAlign: 'center',
    padding: 40,
  },
  code: {
    color: '#22c55e',
    fontSize: 96,
    fontWeight: 900,
    letterSpacing: '-4px',
    margin: 0,
    lineHeight: 1,
  },
  message: {
    color: '#e5e7eb',
    fontSize: 22,
    fontWeight: 600,
    margin: 0,
  },
  sub: {
    color: '#9ca3af',
    fontSize: 15,
    margin: 0,
    maxWidth: 360,
    lineHeight: 1.5,
  },
  btn: {
    background: '#22c55e',
    border: 'none',
    borderRadius: 8,
    color: '#000',
    fontWeight: 700,
    fontSize: 14,
    padding: '10px 24px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginTop: 8,
  },
};

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={styles.page}>
      <p style={styles.code}>404</p>
      <p style={styles.message}>Page Not Found</p>
      <p style={styles.sub}>
        The page you're looking for doesn't exist or you don't have permission
        to view it.
      </p>
      <button style={styles.btn} onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </button>
    </div>
  );
}

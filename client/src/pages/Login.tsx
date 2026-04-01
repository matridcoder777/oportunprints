import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 24,
  },
  logoArea: {
    textAlign: 'center',
  },
  logoText: {
    color: '#22c55e',
    fontSize: 52,
    fontWeight: 900,
    letterSpacing: '-2px',
    margin: 0,
  },
  logoSub: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: '40px 48px',
    width: '100%',
    maxWidth: 420,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 700,
    textAlign: 'center',
    margin: 0,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: 600,
  },
  input: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    color: '#fff',
    padding: '10px 14px',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  button: {
    background: '#22c55e',
    border: 'none',
    borderRadius: 8,
    color: '#000',
    fontWeight: 700,
    fontSize: 15,
    padding: '12px 0',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'opacity 0.2s',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  error: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 8,
    color: '#f87171',
    padding: '10px 14px',
    fontSize: 13,
    textAlign: 'center',
  },
  disclaimer: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 380,
    lineHeight: 1.5,
  },
};

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(username.trim(), password);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data
      ) {
        setError(String((err.response.data as { message: string }).message));
      } else {
        setError('Invalid username or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.logoArea}>
        <p style={styles.logoText}>Oportun</p>
        <p style={styles.logoSub}>Retail Print Portal</p>
      </div>

      <form style={styles.card} onSubmit={handleSubmit} noValidate>
        <h1 style={styles.title}>{t('login.title')}</h1>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="username">
            {t('login.username')}
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="password">
            {t('login.password')}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
          disabled={loading}
        >
          {loading ? t('common.loading') : t('login.loginButton')}
        </button>
      </form>

      <p style={styles.disclaimer}>{t('login.disclaimer')}</p>
    </div>
  );
}

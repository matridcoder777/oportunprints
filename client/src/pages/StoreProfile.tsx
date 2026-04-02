import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import type { Store } from '../types';
import { useAuth } from '../context/AuthContext';

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '32px 40px',
    maxWidth: 1100,
    margin: '0 auto',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 700,
    margin: '0 0 8px',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: 14,
    margin: '0 0 28px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 20,
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  storeName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    margin: 0,
  },
  badge: {
    borderRadius: 20,
    padding: '3px 10px',
    fontSize: 11,
    fontWeight: 700,
  },
  row: {
    display: 'flex',
    gap: 8,
    alignItems: 'flex-start',
    color: '#d1d5db',
    fontSize: 13,
  },
  label: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    minWidth: 60,
  },
  loading: {
    color: '#9ca3af',
    textAlign: 'center',
    padding: 60,
    fontSize: 15,
  },
  error: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 8,
    color: '#f87171',
    padding: '14px 18px',
    fontSize: 14,
  },
  empty: {
    color: '#6b7280',
    textAlign: 'center',
    padding: 60,
    fontSize: 15,
  },
};

export default function StoreProfile() {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    apiClient
      .get<Store[]>('/stores')
      .then((res) => {
        const all = res.data ?? [];
        const myStores =
          user.role === 'admin'
            ? all
            : all.filter((s) => user.storeIds.includes(s.id));
        setStores(myStores);
      })
      .catch(() => setError('Failed to load store information.'))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Store Profile</h1>
      <p style={styles.subtitle}>
        {user?.role === 'admin'
          ? 'All stores (admin view)'
          : `Showing ${stores.length} store(s) assigned to your account`}
      </p>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div style={styles.loading}>Loading stores…</div>
      ) : stores.length === 0 ? (
        <div style={styles.empty}>No stores assigned to your account.</div>
      ) : (
        <div style={styles.grid}>
          {stores.map((store) => (
            <div key={store.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <p style={styles.storeName}>{store.name}</p>
                <span
                  style={{
                    ...styles.badge,
                    background: store.active
                      ? 'rgba(34,197,94,0.1)'
                      : 'rgba(107,114,128,0.2)',
                    color: store.active ? '#22c55e' : '#9ca3af',
                  }}
                >
                  {store.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div style={styles.row}>
                <span style={styles.label}>Address</span>
                <span>{store.address}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>City</span>
                <span>{store.city}, {store.state} {store.zip}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Type</span>
                <span>{store.type || '—'}</span>
              </div>
              <div style={styles.row}>
                <span style={styles.label}>Partner</span>
                <span>{store.partner || '—'}</span>
              </div>
              <div style={{ ...styles.row, marginTop: 4 }}>
                <span style={{ ...styles.label, color: '#4b5563', fontSize: 10 }}>
                  ID: {store.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

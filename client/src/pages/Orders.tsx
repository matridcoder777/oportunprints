import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../api/client';
import type { Order, Store } from '../types';
import OrderTable from '../components/OrderTable';
import { useAuth } from '../context/AuthContext';

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '32px 40px',
    maxWidth: 1200,
    margin: '0 auto',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 700,
    margin: '0 0 24px',
  },
  tabs: {
    display: 'flex',
    gap: 4,
    marginBottom: 24,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  tab: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: 600,
    padding: '10px 20px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    borderBottom: '2px solid transparent',
    marginBottom: -1,
    transition: 'color 0.2s',
  },
  tabActive: {
    color: '#22c55e',
    borderBottomColor: '#22c55e',
  },
  filtersRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  select: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    color: '#fff',
    padding: '8px 12px',
    fontSize: 13,
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 24,
  },
  loading: {
    color: '#9ca3af',
    textAlign: 'center',
    padding: 40,
    fontSize: 15,
  },
  error: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 8,
    color: '#f87171',
    padding: '14px 18px',
    fontSize: 14,
    marginBottom: 16,
  },
};

type TabKey = 'my' | 'history';

export default function Orders() {
  const { user } = useAuth();
  const location = useLocation();
  const isHistoryRoute = location.pathname === '/orders/history';

  const [activeTab, setActiveTab] = useState<TabKey>(
    isHistoryRoute ? 'history' : 'my'
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStore, setFilterStore] = useState('');

  const isAdmin = user?.role === 'admin';

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (filterStatus) params['status'] = filterStatus;
      if (filterStore) params['storeId'] = filterStore;
      if (activeTab === 'history') params['history'] = 'true';
      const res = await apiClient.get<Order[]>('/orders', { params });
      setOrders(res.data ?? []);
    } catch {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, filterStatus, filterStore]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (isAdmin) {
      apiClient.get<Store[]>('/stores').then((r) => setStores(r.data ?? [])).catch(() => {});
    }
  }, [isAdmin]);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );
  };

  const displayedOrders =
    activeTab === 'history'
      ? orders.filter((o) =>
          o.status === 'completed' || o.status === 'rejected'
        )
      : orders;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Orders</h1>

      <div style={styles.tabs}>
        {(['my', 'history'] as TabKey[]).map((tab) => (
          <button
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'my' ? 'My Orders' : 'Orders History'}
          </button>
        ))}
      </div>

      {isAdmin && (
        <div style={styles.filtersRow}>
          <select
            style={styles.select}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {['pending', 'approved', 'rejected', 'sent_to_vendor', 'completed'].map(
              (s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              )
            )}
          </select>
          <select
            style={styles.select}
            value={filterStore}
            onChange={(e) => setFilterStore(e.target.value)}
          >
            <option value="">All Stores</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.card}>
        {loading ? (
          <div style={styles.loading}>Loading orders…</div>
        ) : (
          <OrderTable
            orders={displayedOrders}
            isAdmin={isAdmin}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { Order } from '../types';
import apiClient from '../api/client';

interface OrderTableProps {
  orders: Order[];
  isAdmin?: boolean;
  onStatusChange?: (orderId: string, newStatus: Order['status']) => void;
}

const statusColors: Record<string, { bg: string; color: string }> = {
  pending: { bg: 'rgba(234,179,8,0.15)', color: '#eab308' },
  approved: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  rejected: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
  sent_to_vendor: { bg: 'rgba(168,85,247,0.15)', color: '#a855f7' },
  completed: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
};

const allStatuses: Order['status'][] = [
  'pending',
  'approved',
  'rejected',
  'sent_to_vendor',
  'completed',
];

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
  },
  th: {
    color: '#9ca3af',
    fontWeight: 600,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    padding: '10px 14px',
    textAlign: 'left',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: '#d1d5db',
    verticalAlign: 'middle',
  },
  badge: {
    borderRadius: 20,
    padding: '3px 10px',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'capitalize',
    display: 'inline-block',
  },
  select: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 6,
    color: '#fff',
    padding: '4px 8px',
    fontSize: 12,
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  saveBtn: {
    background: '#22c55e',
    border: 'none',
    borderRadius: 6,
    color: '#000',
    fontWeight: 700,
    fontSize: 12,
    padding: '4px 10px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginLeft: 6,
  },
  emptyRow: {
    padding: '32px 14px',
    textAlign: 'center',
    color: '#6b7280',
  },
};

export default function OrderTable({
  orders,
  isAdmin = false,
  onStatusChange,
}: OrderTableProps) {
  const [pendingStatuses, setPendingStatuses] = useState<
    Record<string, Order['status']>
  >({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({});

  const handleStatusSelect = (orderId: string, status: Order['status']) => {
    setPendingStatuses((prev) => ({ ...prev, [orderId]: status }));
  };

  const handleSave = async (orderId: string) => {
    const newStatus = pendingStatuses[orderId];
    if (!newStatus) return;
    setSaving((prev) => ({ ...prev, [orderId]: true }));
    setSaveErrors((prev) => ({ ...prev, [orderId]: '' }));
    try {
      await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
      onStatusChange?.(orderId, newStatus);
    } catch {
      setSaveErrors((prev) => ({
        ...prev,
        [orderId]: 'Save failed.',
      }));
    } finally {
      setSaving((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Order ID</th>
            <th style={styles.th}>Store</th>
            <th style={styles.th}>Items</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Date</th>
            {isAdmin && <th style={styles.th}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan={isAdmin ? 6 : 5}
                style={{ ...styles.td, ...styles.emptyRow }}
              >
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const sc = statusColors[order.status] ?? {
                bg: 'rgba(255,255,255,0.1)',
                color: '#fff',
              };
              const currentPending =
                pendingStatuses[order.id] ?? order.status;
              return (
                <tr key={order.id}>
                  <td style={styles.td}>
                    <span
                      title={order.id}
                      style={{ fontFamily: 'monospace', fontSize: 12 }}
                    >
                      {order.id.slice(0, 8)}…
                    </span>
                  </td>
                  <td style={styles.td}>{order.storeId}</td>
                  <td style={styles.td}>{order.items.length} item(s)</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        background: sc.bg,
                        color: sc.color,
                      }}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  {isAdmin && (
                    <td style={styles.td}>
                      <select
                        style={styles.select}
                        value={currentPending}
                        onChange={(e) =>
                          handleStatusSelect(
                            order.id,
                            e.target.value as Order['status']
                          )
                        }
                      >
                        {allStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                      <button
                        style={styles.saveBtn}
                        disabled={saving[order.id]}
                        onClick={() => handleSave(order.id)}
                      >
                        {saving[order.id] ? '…' : 'Save'}
                      </button>
                      {saveErrors[order.id] && (
                        <span
                          style={{
                            color: '#f87171',
                            fontSize: 11,
                            marginLeft: 6,
                          }}
                        >
                          {saveErrors[order.id]}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

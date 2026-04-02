import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import type { Store } from '../types';
import { useCart } from '../context/CartContext';

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
    margin: '0 0 28px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: 28,
    alignItems: 'flex-start',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 24,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
  },
  th: {
    color: '#9ca3af',
    fontWeight: 600,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    padding: '8px 12px',
    textAlign: 'left',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: '#d1d5db',
    verticalAlign: 'middle',
  },
  qtyInput: {
    width: 60,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 6,
    color: '#fff',
    padding: '4px 8px',
    fontSize: 13,
    outline: 'none',
    fontFamily: 'inherit',
    textAlign: 'center',
  },
  removeBtn: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 6,
    color: '#f87171',
    padding: '4px 10px',
    cursor: 'pointer',
    fontSize: 12,
    fontFamily: 'inherit',
  },
  summaryTitle: {
    color: '#22c55e',
    fontSize: 15,
    fontWeight: 700,
    margin: '0 0 20px',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 10,
  },
  divider: {
    border: 'none',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    margin: '16px 0',
  },
  checkoutBtn: {
    width: '100%',
    background: '#22c55e',
    border: 'none',
    borderRadius: 8,
    color: '#000',
    fontWeight: 700,
    fontSize: 15,
    padding: '12px 0',
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginTop: 8,
    transition: 'opacity 0.2s',
  },
  select: {
    width: '100%',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    color: '#fff',
    padding: '10px 12px',
    fontSize: 14,
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginBottom: 12,
  },
  readonlyInput: {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    color: '#9ca3af',
    padding: '10px 12px',
    fontSize: 13,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    marginBottom: 12,
  },
  fieldLabel: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 6,
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  successBox: {
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.3)',
    borderRadius: 8,
    color: '#86efac',
    padding: '14px 18px',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 8,
    color: '#f87171',
    padding: '14px 18px',
    fontSize: 14,
    marginBottom: 16,
  },
  emptyMsg: {
    color: '#6b7280',
    fontSize: 15,
    textAlign: 'center',
    padding: 40,
  },
};

export default function Cart() {
  const navigate = useNavigate();
  const { cart, fetchCart, updateQuantity, removeFromCart, clearCart } = useCart();

  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [localQty, setLocalQty] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchCart();
    apiClient.get<Store[]>('/stores').then((r) => setStores(r.data ?? [])).catch(() => {});
  }, [fetchCart]);

  useEffect(() => {
    const store = stores.find((s) => s.id === selectedStoreId) ?? null;
    setSelectedStore(store);
  }, [selectedStoreId, stores]);

  useEffect(() => {
    const map: Record<string, number> = {};
    cart.forEach((item) => { map[item.productId] = item.quantity; });
    setLocalQty(map);
  }, [cart]);

  const handleQtyChange = (productId: string, qty: number) => {
    if (qty < 1) return;
    setLocalQty((prev) => ({ ...prev, [productId]: qty }));
  };

  const handleQtyBlur = async (productId: string) => {
    const qty = localQty[productId];
    if (!qty || qty < 1) return;
    const original = cart.find((i) => i.productId === productId)?.quantity;
    if (qty === original) return;
    setUpdatingId(productId);
    try {
      await updateQuantity(productId, qty);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId: string) => {
    await removeFromCart(productId);
  };

  const handleCheckout = async () => {
    if (!selectedStoreId) {
      setError('Please select a store before submitting your order.');
      return;
    }
    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await apiClient.post('/orders', {
        storeId: selectedStoreId,
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          sku: item.sku,
          quantity: item.quantity,
        })),
      });
      await clearCart();
      setSuccess(true);
      setTimeout(() => navigate('/orders'), 2500);
    } catch {
      setError('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Shopping Cart</h1>

      {success && (
        <div style={styles.successBox}>
          ✅ Order placed successfully! Redirecting to your orders…
        </div>
      )}
      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.layout}>
        <div style={styles.card}>
          {cart.length === 0 ? (
            <div style={styles.emptyMsg}>Your cart is empty.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>SKU</th>
                  <th style={styles.th}>Qty</th>
                  <th style={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.productId}>
                    <td style={styles.td}>{item.productName}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 12 }}>
                      {item.sku}
                    </td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        min={1}
                        max={999}
                        value={localQty[item.productId] ?? item.quantity}
                        style={styles.qtyInput}
                        disabled={updatingId === item.productId}
                        onChange={(e) =>
                          handleQtyChange(
                            item.productId,
                            parseInt(e.target.value, 10) || 1
                          )
                        }
                        onBlur={() => handleQtyBlur(item.productId)}
                      />
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.removeBtn}
                        onClick={() => handleRemove(item.productId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={styles.card}>
          <p style={styles.summaryTitle}>Order Summary</p>

          <div style={styles.summaryRow}>
            <span>Total items:</span>
            <strong style={{ color: '#fff' }}>{totalItems}</strong>
          </div>
          <div style={styles.summaryRow}>
            <span>Line items:</span>
            <strong style={{ color: '#fff' }}>{cart.length}</strong>
          </div>

          <hr style={styles.divider} />

          <label style={styles.fieldLabel} htmlFor="store-select">
            Select Store *
          </label>
          <select
            id="store-select"
            style={styles.select}
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
          >
            <option value="">— Choose a store —</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {selectedStore && (
            <>
              <label style={styles.fieldLabel}>Address</label>
              <input
                readOnly
                style={styles.readonlyInput}
                value={`${selectedStore.address}, ${selectedStore.city}, ${selectedStore.state} ${selectedStore.zip}`}
              />
            </>
          )}

          <button
            style={{
              ...styles.checkoutBtn,
              opacity: submitting || cart.length === 0 ? 0.6 : 1,
              cursor:
                submitting || cart.length === 0 ? 'not-allowed' : 'pointer',
            }}
            disabled={submitting || cart.length === 0}
            onClick={handleCheckout}
          >
            {submitting ? 'Placing Order…' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

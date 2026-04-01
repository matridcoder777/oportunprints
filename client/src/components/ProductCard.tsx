import { useState } from 'react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
}

const statusColors: Record<string, string> = {
  active: '#22c55e',
  disabled: '#f97316',
  retired: '#6b7280',
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, border-color 0.2s',
  },
  img: {
    width: '100%',
    height: 160,
    objectFit: 'cover',
    background: 'rgba(255,255,255,0.03)',
  },
  imgPlaceholder: {
    width: '100%',
    height: 160,
    background: 'rgba(255,255,255,0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40,
    color: 'rgba(255,255,255,0.2)',
  },
  body: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    flex: 1,
  },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    borderRadius: 20,
    padding: '2px 10px',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'capitalize',
  },
  name: {
    color: '#fff',
    fontWeight: 600,
    fontSize: 15,
    margin: 0,
  },
  meta: {
    color: '#9ca3af',
    fontSize: 12,
    margin: 0,
  },
  desc: {
    color: '#d1d5db',
    fontSize: 13,
    margin: '4px 0 0',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  notes: {
    background: 'rgba(34,197,94,0.08)',
    border: '1px solid rgba(34,197,94,0.2)',
    borderRadius: 6,
    padding: '6px 8px',
    color: '#86efac',
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    padding: '0 16px 16px',
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  qtyInput: {
    width: 52,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 6,
    color: '#fff',
    padding: '5px 8px',
    fontSize: 13,
    outline: 'none',
  },
  addBtn: {
    flex: 1,
    background: '#22c55e',
    border: 'none',
    borderRadius: 6,
    color: '#000',
    fontWeight: 700,
    fontSize: 13,
    padding: '7px 0',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'opacity 0.2s',
  },
  addBtnDisabled: {
    flex: 1,
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: 6,
    color: '#6b7280',
    fontWeight: 700,
    fontSize: 13,
    padding: '7px 0',
    cursor: 'not-allowed',
    fontFamily: 'inherit',
  },
  feedback: {
    color: '#22c55e',
    fontSize: 12,
    textAlign: 'center',
    padding: '0 16px 8px',
  },
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  const isActive = product.status === 'active';
  const badgeColor = statusColors[product.status] ?? '#6b7280';

  const handleAdd = async () => {
    if (!isActive || adding) return;
    setAdding(true);
    setError('');
    try {
      await addToCart(product.id, product.name, product.sku, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      setError('Failed to add to cart.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={styles.card}>
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          style={styles.img}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div style={styles.imgPlaceholder}>🖨️</div>
      )}

      <div style={styles.body}>
        <div style={styles.statusRow}>
          <span
            style={{
              ...styles.badge,
              background: `${badgeColor}22`,
              color: badgeColor,
              border: `1px solid ${badgeColor}44`,
            }}
          >
            {product.status}
          </span>
          <span style={{ ...styles.meta }}>{product.category}</span>
        </div>

        <p style={styles.name}>{product.name}</p>
        <p style={styles.meta}>SKU: {product.sku}</p>
        <p style={styles.meta}>Campaign: {product.campaign}</p>
        <p style={styles.meta}>Language: {product.language}</p>
        {product.description && (
          <p style={styles.desc}>{product.description}</p>
        )}
        {user?.role === 'admin' && product.internalNotes && (
          <div style={styles.notes}>
            <strong>Notes:</strong> {product.internalNotes}
          </div>
        )}
      </div>

      {added && <div style={styles.feedback}>✓ Added to cart!</div>}
      {error && (
        <div style={{ ...styles.feedback, color: '#f87171' }}>{error}</div>
      )}

      <div style={styles.footer}>
        <input
          type="number"
          min={1}
          max={999}
          value={qty}
          style={styles.qtyInput}
          disabled={!isActive}
          onChange={(e) =>
            setQty(Math.max(1, parseInt(e.target.value, 10) || 1))
          }
        />
        <button
          style={isActive ? styles.addBtn : styles.addBtnDisabled}
          disabled={!isActive || adding}
          onClick={handleAdd}
        >
          {adding ? 'Adding…' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

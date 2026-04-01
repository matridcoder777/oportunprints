import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';
import type { User, Store, Product, Order } from '../types';
import OrderTable from '../components/OrderTable';

// ─── Styles ─────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page: { padding: '32px 40px', maxWidth: 1300, margin: '0 auto' },
  title: { color: '#fff', fontSize: 26, fontWeight: 700, margin: '0 0 24px' },
  tabs: {
    display: 'flex', gap: 4, marginBottom: 28,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  tab: {
    background: 'none', border: 'none', color: '#9ca3af', fontSize: 14,
    fontWeight: 600, padding: '10px 20px', cursor: 'pointer',
    fontFamily: 'inherit', borderBottom: '2px solid transparent',
    marginBottom: -1, transition: 'color 0.2s',
  },
  tabActive: { color: '#22c55e', borderBottomColor: '#22c55e' },
  card: {
    background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 24,
  },
  toolbar: { display: 'flex', justifyContent: 'flex-end', marginBottom: 18 },
  addBtn: {
    background: '#22c55e', border: 'none', borderRadius: 8, color: '#000',
    fontWeight: 700, fontSize: 13, padding: '8px 18px', cursor: 'pointer',
    fontFamily: 'inherit',
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: {
    color: '#9ca3af', fontWeight: 600, fontSize: 11, textTransform: 'uppercase',
    letterSpacing: 0.8, padding: '8px 12px', textAlign: 'left',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  td: {
    padding: '11px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: '#d1d5db', verticalAlign: 'middle',
  },
  actionBtn: {
    background: 'none', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 6, color: '#ccc', fontSize: 12, padding: '3px 10px',
    cursor: 'pointer', fontFamily: 'inherit', marginRight: 6,
  },
  deleteBtn: {
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 6, color: '#f87171', fontSize: 12, padding: '3px 10px',
    cursor: 'pointer', fontFamily: 'inherit',
  },
  // Modal
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
  },
  modal: {
    background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 16, padding: 32, width: 520, maxHeight: '85vh',
    overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16,
  },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 700, margin: '0 0 4px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { color: '#9ca3af', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 },
  input: {
    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8, color: '#fff', padding: '9px 12px', fontSize: 14,
    outline: 'none', fontFamily: 'inherit',
  },
  select: {
    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8, color: '#fff', padding: '9px 12px', fontSize: 14,
    outline: 'none', cursor: 'pointer', fontFamily: 'inherit',
  },
  modalFooter: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 },
  saveBtn: {
    background: '#22c55e', border: 'none', borderRadius: 8, color: '#000',
    fontWeight: 700, fontSize: 14, padding: '9px 22px', cursor: 'pointer', fontFamily: 'inherit',
  },
  cancelBtn: {
    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8, color: '#ccc', fontSize: 14, padding: '9px 18px',
    cursor: 'pointer', fontFamily: 'inherit',
  },
  errMsg: { color: '#f87171', fontSize: 13 },
  loading: { color: '#9ca3af', textAlign: 'center', padding: 40, fontSize: 15 },
  badge: { borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700, textTransform: 'capitalize', display: 'inline-block' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Field({
  label, name, value, onChange, type = 'text', options,
}: {
  label: string; name: string; value: string;
  onChange: (k: string, v: string) => void;
  type?: string; options?: string[];
}) {
  if (options) {
    return (
      <div style={s.fieldGroup}>
        <label style={s.label}>{label}</label>
        <select style={s.select} value={value} onChange={(e) => onChange(name, e.target.value)}>
          <option value="">— Select —</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  }
  return (
    <div style={s.fieldGroup}>
      <label style={s.label}>{label}</label>
      <input style={s.input} type={type} value={value} onChange={(e) => onChange(name, e.target.value)} />
    </div>
  );
}

// ─── User Tab ────────────────────────────────────────────────────────────────

function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partial<User> | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await apiClient.get<User[]>('/users'); setUsers(r.data ?? []); } catch { /* noop */ }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({}); setErr(''); setShowModal(true); };
  const openEdit = (u: User) => { setEditing(u); setForm({ username: u.username, email: u.email, firstName: u.firstName, lastName: u.lastName, role: u.role }); setErr(''); setShowModal(true); };
  const setField = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.username || !form.email || !form.role) { setErr('Username, email and role are required.'); return; }
    setSaving(true); setErr('');
    try {
      if (editing) { await apiClient.put(`/users/${editing.id}`, form); }
      else { await apiClient.post('/users', form); }
      await load(); setShowModal(false);
    } catch { setErr('Save failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try { await apiClient.delete(`/users/${id}`); await load(); } catch { /* noop */ }
  };

  return (
    <>
      <div style={s.toolbar}><button style={s.addBtn} onClick={openAdd}>+ Add User</button></div>
      {loading ? <div style={s.loading}>Loading…</div> : (
        <table style={s.table}>
          <thead><tr>
            <th style={s.th}>Username</th><th style={s.th}>Name</th>
            <th style={s.th}>Email</th><th style={s.th}>Role</th><th style={s.th}>Actions</th>
          </tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={s.td}>{u.username}</td>
                <td style={s.td}>{u.firstName} {u.lastName}</td>
                <td style={s.td}>{u.email}</td>
                <td style={s.td}><span style={{ ...s.badge, background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>{u.role}</span></td>
                <td style={s.td}>
                  <button style={s.actionBtn} onClick={() => openEdit(u)}>Edit</button>
                  <button style={s.deleteBtn} onClick={() => handleDelete(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showModal && (
        <div style={s.overlay} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={s.modal}>
            <p style={s.modalTitle}>{editing ? 'Edit User' : 'Add User'}</p>
            {err && <span style={s.errMsg}>{err}</span>}
            <Field label="Username" name="username" value={form.username ?? ''} onChange={setField} />
            <Field label="First Name" name="firstName" value={form.firstName ?? ''} onChange={setField} />
            <Field label="Last Name" name="lastName" value={form.lastName ?? ''} onChange={setField} />
            <Field label="Email" name="email" value={form.email ?? ''} onChange={setField} type="email" />
            {!editing && <Field label="Password" name="password" value={form.password ?? ''} onChange={setField} type="password" />}
            <Field label="Role" name="role" value={form.role ?? ''} onChange={setField} options={['admin', 'store_manager', 'multi_store', 'vendor']} />
            <div style={s.modalFooter}>
              <button style={s.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={s.saveBtn} disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Stores Tab ──────────────────────────────────────────────────────────────

function StoresTab() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Store> | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await apiClient.get<Store[]>('/stores'); setStores(r.data ?? []); } catch { /* noop */ }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({ active: 'true' }); setErr(''); setShowModal(true); };
  const openEdit = (s: Store) => { setEditing(s); setForm({ name: s.name, address: s.address, city: s.city, state: s.state, zip: s.zip, type: s.type, partner: s.partner, active: String(s.active) }); setErr(''); setShowModal(true); };
  const setField = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.address) { setErr('Name and address are required.'); return; }
    setSaving(true); setErr('');
    try {
      const payload = { ...form, active: form.active === 'true' };
      if (editing) { await apiClient.put(`/stores/${editing.id}`, payload); }
      else { await apiClient.post('/stores', payload); }
      await load(); setShowModal(false);
    } catch { setErr('Save failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this store?')) return;
    try { await apiClient.delete(`/stores/${id}`); await load(); } catch { /* noop */ }
  };

  return (
    <>
      <div style={s.toolbar}><button style={s.addBtn} onClick={openAdd}>+ Add Store</button></div>
      {loading ? <div style={s.loading}>Loading…</div> : (
        <table style={s.table}>
          <thead><tr>
            <th style={s.th}>Name</th><th style={s.th}>City</th>
            <th style={s.th}>State</th><th style={s.th}>Partner</th>
            <th style={s.th}>Active</th><th style={s.th}>Actions</th>
          </tr></thead>
          <tbody>
            {stores.map((st) => (
              <tr key={st.id}>
                <td style={s.td}>{st.name}</td>
                <td style={s.td}>{st.city}</td>
                <td style={s.td}>{st.state}</td>
                <td style={s.td}>{st.partner}</td>
                <td style={s.td}><span style={{ ...s.badge, background: st.active ? 'rgba(34,197,94,0.1)' : 'rgba(107,114,128,0.2)', color: st.active ? '#22c55e' : '#9ca3af' }}>{st.active ? 'Active' : 'Inactive'}</span></td>
                <td style={s.td}>
                  <button style={s.actionBtn} onClick={() => openEdit(st)}>Edit</button>
                  <button style={s.deleteBtn} onClick={() => handleDelete(st.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showModal && (
        <div style={s.overlay} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={s.modal}>
            <p style={s.modalTitle}>{editing ? 'Edit Store' : 'Add Store'}</p>
            {err && <span style={s.errMsg}>{err}</span>}
            <Field label="Name" name="name" value={form.name ?? ''} onChange={setField} />
            <Field label="Address" name="address" value={form.address ?? ''} onChange={setField} />
            <Field label="City" name="city" value={form.city ?? ''} onChange={setField} />
            <Field label="State" name="state" value={form.state ?? ''} onChange={setField} />
            <Field label="ZIP" name="zip" value={form.zip ?? ''} onChange={setField} />
            <Field label="Store Type" name="type" value={form.type ?? ''} onChange={setField} />
            <Field label="Partner" name="partner" value={form.partner ?? ''} onChange={setField} />
            <Field label="Active" name="active" value={form.active ?? 'true'} onChange={setField} options={['true', 'false']} />
            <div style={s.modalFooter}>
              <button style={s.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={s.saveBtn} disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Products Tab ────────────────────────────────────────────────────────────

function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await apiClient.get<Product[]>('/products'); setProducts(r.data ?? []); } catch { /* noop */ }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(null); setForm({ status: 'active', language: 'English' }); setErr(''); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, sku: p.sku, category: p.category, campaign: p.campaign, storeType: p.storeType, partner: p.partner, language: p.language, status: p.status, imageUrl: p.imageUrl, description: p.description, internalNotes: p.internalNotes ?? '' });
    setErr(''); setShowModal(true);
  };
  const setField = (k: string, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.sku) { setErr('Name and SKU are required.'); return; }
    setSaving(true); setErr('');
    try {
      if (editing) { await apiClient.put(`/products/${editing.id}`, form); }
      else { await apiClient.post('/products', form); }
      await load(); setShowModal(false);
    } catch { setErr('Save failed.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try { await apiClient.delete(`/products/${id}`); await load(); } catch { /* noop */ }
  };

  const statusColors: Record<string, { bg: string; color: string }> = {
    active: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e' },
    disabled: { bg: 'rgba(249,115,22,0.1)', color: '#f97316' },
    retired: { bg: 'rgba(107,114,128,0.2)', color: '#9ca3af' },
  };

  return (
    <>
      <div style={s.toolbar}><button style={s.addBtn} onClick={openAdd}>+ Add Product</button></div>
      {loading ? <div style={s.loading}>Loading…</div> : (
        <table style={s.table}>
          <thead><tr>
            <th style={s.th}>Name</th><th style={s.th}>SKU</th>
            <th style={s.th}>Category</th><th style={s.th}>Campaign</th>
            <th style={s.th}>Status</th><th style={s.th}>Actions</th>
          </tr></thead>
          <tbody>
            {products.map((p) => {
              const sc = statusColors[p.status] ?? { bg: 'rgba(255,255,255,0.1)', color: '#fff' };
              return (
                <tr key={p.id}>
                  <td style={s.td}>{p.name}</td>
                  <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 12 }}>{p.sku}</td>
                  <td style={s.td}>{p.category}</td>
                  <td style={s.td}>{p.campaign}</td>
                  <td style={s.td}><span style={{ ...s.badge, background: sc.bg, color: sc.color }}>{p.status}</span></td>
                  <td style={s.td}>
                    <button style={s.actionBtn} onClick={() => openEdit(p)}>Edit</button>
                    <button style={s.deleteBtn} onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {showModal && (
        <div style={s.overlay} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={s.modal}>
            <p style={s.modalTitle}>{editing ? 'Edit Product' : 'Add Product'}</p>
            {err && <span style={s.errMsg}>{err}</span>}
            <Field label="Name *" name="name" value={form.name ?? ''} onChange={setField} />
            <Field label="SKU *" name="sku" value={form.sku ?? ''} onChange={setField} />
            <Field label="Category" name="category" value={form.category ?? ''} onChange={setField} />
            <Field label="Campaign" name="campaign" value={form.campaign ?? ''} onChange={setField} />
            <Field label="Store Type" name="storeType" value={form.storeType ?? ''} onChange={setField} />
            <Field label="Partner" name="partner" value={form.partner ?? ''} onChange={setField} />
            <Field label="Language" name="language" value={form.language ?? ''} onChange={setField} options={['English', 'Spanish', 'Bilingual']} />
            <Field label="Status" name="status" value={form.status ?? 'active'} onChange={setField} options={['active', 'disabled', 'retired']} />
            <Field label="Image URL" name="imageUrl" value={form.imageUrl ?? ''} onChange={setField} />
            <div style={s.fieldGroup}>
              <label style={s.label}>Description</label>
              <textarea style={{ ...s.input, minHeight: 72, resize: 'vertical' }} value={form.description ?? ''} onChange={(e) => setField('description', e.target.value)} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Internal Notes</label>
              <textarea style={{ ...s.input, minHeight: 56, resize: 'vertical' }} value={form.internalNotes ?? ''} onChange={(e) => setField('internalNotes', e.target.value)} />
            </div>
            <div style={s.modalFooter}>
              <button style={s.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={s.saveBtn} disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Orders Tab (Admin) ──────────────────────────────────────────────────────

function AdminOrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await apiClient.get<Order[]>('/orders'); setOrders(r.data ?? []); } catch { /* noop */ }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleStatusChange = (id: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  return loading ? <div style={s.loading}>Loading…</div> : (
    <OrderTable orders={orders} isAdmin onStatusChange={handleStatusChange} />
  );
}

// ─── Reports Tab ─────────────────────────────────────────────────────────────

interface ReportRow { label: string; count: number; }

function ReportsTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await apiClient.get<Order[]>('/orders'); setOrders(r.data ?? []); } catch { /* noop */ }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const byStore: ReportRow[] = Object.entries(
    orders.reduce<Record<string, number>>((acc, o) => {
      acc[o.storeId] = (acc[o.storeId] ?? 0) + 1; return acc;
    }, {})
  ).map(([label, count]) => ({ label, count }));

  const byProduct: ReportRow[] = Object.entries(
    orders.flatMap((o) => o.items).reduce<Record<string, number>>((acc, item) => {
      acc[item.productName] = (acc[item.productName] ?? 0) + item.quantity; return acc;
    }, {})
  ).map(([label, count]) => ({ label, count }));

  const byMonth: ReportRow[] = Object.entries(
    orders.reduce<Record<string, number>>((acc, o) => {
      const m = new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      acc[m] = (acc[m] ?? 0) + 1; return acc;
    }, {})
  ).map(([label, count]) => ({ label, count }));

  const ReportTable = ({ title, rows }: { title: string; rows: ReportRow[] }) => (
    <div style={{ marginBottom: 32 }}>
      <p style={{ color: '#22c55e', fontWeight: 700, fontSize: 14, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.8 }}>{title}</p>
      <table style={s.table}>
        <thead><tr><th style={s.th}>Label</th><th style={s.th}>Count</th></tr></thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={2} style={{ ...s.td, textAlign: 'center', color: '#6b7280' }}>No data</td></tr>
            : rows.sort((a, b) => b.count - a.count).map((r) => (
              <tr key={r.label}><td style={s.td}>{r.label}</td><td style={s.td}><strong style={{ color: '#22c55e' }}>{r.count}</strong></td></tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) return <div style={s.loading}>Loading…</div>;
  return (
    <>
      <ReportTable title="Orders by Store" rows={byStore} />
      <ReportTable title="Units by Product" rows={byProduct} />
      <ReportTable title="Orders by Month" rows={byMonth} />
    </>
  );
}

// ─── Main AdminPanel ──────────────────────────────────────────────────────────

type TabKey = 'users' | 'stores' | 'products' | 'orders' | 'reports';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'users', label: 'Users' },
  { key: 'stores', label: 'Stores' },
  { key: 'products', label: 'Products' },
  { key: 'orders', label: 'Orders' },
  { key: 'reports', label: 'Reports' },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabKey>('users');

  return (
    <div style={s.page}>
      <h1 style={s.title}>Admin Panel</h1>

      <div style={s.tabs}>
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            style={{ ...s.tab, ...(activeTab === key ? s.tabActive : {}) }}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={s.card}>
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'stores' && <StoresTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'orders' && <AdminOrdersTab />}
        {activeTab === 'reports' && <ReportsTab />}
      </div>
    </div>
  );
}

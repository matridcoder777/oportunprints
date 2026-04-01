import { useAuth } from '../context/AuthContext';

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '32px 40px',
    maxWidth: 1200,
    margin: '0 auto',
  },
  banner: {
    background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))',
    border: '1px solid rgba(34,197,94,0.3)',
    borderRadius: 16,
    padding: '28px 32px',
    marginBottom: 32,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
  },
  dateText: {
    color: '#9ca3af',
    fontSize: 14,
    margin: '6px 0 0',
  },
  oportun: {
    color: '#22c55e',
    fontSize: 48,
    fontWeight: 900,
    letterSpacing: '-2px',
    opacity: 0.3,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    marginBottom: 24,
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 24,
  },
  cardTitle: {
    color: '#22c55e',
    fontSize: 15,
    fontWeight: 700,
    margin: '0 0 16px',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardText: {
    color: '#d1d5db',
    fontSize: 14,
    lineHeight: 1.6,
    margin: 0,
  },
  bulletList: {
    color: '#d1d5db',
    fontSize: 14,
    lineHeight: 1.8,
    paddingLeft: 20,
    margin: 0,
  },
  bottomRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 24,
  },
  infoCard: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  infoIcon: {
    fontSize: 36,
    marginBottom: 4,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    margin: 0,
  },
  infoText: {
    color: '#9ca3af',
    fontSize: 13,
    lineHeight: 1.5,
    margin: 0,
  },
  videoBox: {
    background: 'rgba(0,0,0,0.3)',
    border: '2px dashed rgba(255,255,255,0.1)',
    borderRadius: 8,
    height: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    fontSize: 13,
    flexDirection: 'column',
    gap: 8,
  },
  announcement: {
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    paddingBottom: 10,
    marginBottom: 10,
  },
  annTitle: {
    color: '#e5e7eb',
    fontSize: 13,
    fontWeight: 600,
    margin: '0 0 4px',
  },
  annDate: {
    color: '#6b7280',
    fontSize: 11,
    margin: 0,
  },
};

const ANNOUNCEMENTS = [
  { title: 'Q3 Campaign Materials Now Available', date: 'Jul 1, 2025' },
  { title: 'New Store Type: Kiosk Templates Added', date: 'Jun 20, 2025' },
  { title: 'System Maintenance Window – Jun 28', date: 'Jun 15, 2025' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div style={styles.page}>
      <div style={styles.banner}>
        <div>
          <p style={styles.welcomeText}>
            Welcome back, {user?.firstName ?? 'User'}!
          </p>
          <p style={styles.dateText}>{today}</p>
        </div>
        <span style={styles.oportun}>O</span>
      </div>

      <div style={styles.row}>
        <div style={styles.card}>
          <p style={styles.cardTitle}>Important Ordering Guidelines</p>
          <ul style={styles.bulletList}>
            <li>All orders must be placed at least 5 business days in advance.</li>
            <li>Select your store location before submitting an order.</li>
            <li>Orders over 500 units require manager approval.</li>
            <li>Retired products cannot be re-ordered.</li>
            <li>Contact support for bulk or custom print requests.</li>
            <li>Review your cart carefully before final submission.</li>
          </ul>
        </div>

        <div style={styles.card}>
          <p style={styles.cardTitle}>About This Portal</p>
          <p style={styles.cardText}>
            The Oportun Retail Print Portal enables authorized store staff to
            browse, select, and order branded print materials for their
            locations. All materials are designed to meet Oportun's brand
            standards.
          </p>
          <br />
          <p style={styles.cardText}>
            Use the navigation above to browse products, manage your cart,
            track orders, and view your store profile. If you need assistance,
            visit the Support section.
          </p>
        </div>
      </div>

      <div style={styles.bottomRow}>
        <div style={styles.infoCard}>
          <span style={styles.infoIcon}>🎬</span>
          <p style={styles.infoTitle}>Video Resources</p>
          <div style={styles.videoBox}>
            <span style={{ fontSize: 28 }}>▶</span>
            <span>Training videos coming soon</span>
          </div>
        </div>

        <div style={styles.infoCard}>
          <span style={styles.infoIcon}>📞</span>
          <p style={styles.infoTitle}>Contact Information</p>
          <p style={styles.infoText}>
            <strong style={{ color: '#d1d5db' }}>Email:</strong>{' '}
            support@oportun.com
          </p>
          <p style={styles.infoText}>
            <strong style={{ color: '#d1d5db' }}>Phone:</strong>{' '}
            1-800-OPORTUN
          </p>
          <p style={styles.infoText}>
            <strong style={{ color: '#d1d5db' }}>Hours:</strong>{' '}
            Mon–Fri, 8am–6pm PT
          </p>
        </div>

        <div style={styles.infoCard}>
          <span style={styles.infoIcon}>📢</span>
          <p style={styles.infoTitle}>Announcements</p>
          {ANNOUNCEMENTS.map((a) => (
            <div key={a.title} style={styles.announcement}>
              <p style={styles.annTitle}>{a.title}</p>
              <p style={styles.annDate}>{a.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

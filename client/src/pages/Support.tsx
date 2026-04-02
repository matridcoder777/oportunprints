import { useState } from 'react';

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '32px 40px',
    maxWidth: 900,
    margin: '0 auto',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 700,
    margin: '0 0 28px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    marginBottom: 32,
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
  infoRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 12,
    color: '#d1d5db',
    fontSize: 14,
  },
  icon: {
    fontSize: 18,
    flexShrink: 0,
  },
  faqSection: {
    marginBottom: 32,
  },
  faqTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 700,
    margin: '0 0 16px',
  },
  faqItem: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    marginBottom: 8,
    overflow: 'hidden',
  },
  faqQuestion: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px',
    cursor: 'pointer',
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: 600,
    userSelect: 'none',
  },
  faqAnswer: {
    padding: '0 18px 14px',
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 1.6,
  },
  chatBox: {
    background: 'rgba(255,255,255,0.04)',
    border: '2px dashed rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 32,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
  },
  chatIcon: {
    fontSize: 36,
    display: 'block',
    marginBottom: 10,
  },
};

const FAQS = [
  {
    q: 'How do I place an order?',
    a: 'Browse the Products & Projects section, add items to your cart, then proceed to checkout. Select your store location and click "Place Order". Orders are submitted for approval.',
  },
  {
    q: 'How long does fulfillment take?',
    a: 'Standard orders take 5–7 business days to process and ship after approval. Rush orders can be arranged by contacting support directly.',
  },
  {
    q: 'Who can I contact if a product is missing or incorrect?',
    a: 'Please email support@oportun.com or call 1-800-OPORTUN. Include your order ID in the subject line for faster resolution.',
  },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Support</h1>

      <div style={styles.grid}>
        <div style={styles.card}>
          <p style={styles.cardTitle}>Contact Us</p>
          <div style={styles.infoRow}>
            <span style={styles.icon}>📧</span>
            <div>
              <div style={{ color: '#9ca3af', fontSize: 12, marginBottom: 2 }}>Email</div>
              <a href="mailto:support@oportun.com" style={{ color: '#22c55e', textDecoration: 'none' }}>
                support@oportun.com
              </a>
            </div>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.icon}>📞</span>
            <div>
              <div style={{ color: '#9ca3af', fontSize: 12, marginBottom: 2 }}>Phone</div>
              <span style={{ color: '#e5e7eb' }}>1-800-OPORTUN</span>
            </div>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.icon}>🕐</span>
            <div>
              <div style={{ color: '#9ca3af', fontSize: 12, marginBottom: 2 }}>Hours</div>
              <span style={{ color: '#e5e7eb' }}>Mon–Fri, 8am–6pm PT</span>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <p style={styles.cardTitle}>Quick Help</p>
          <p style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            For general inquiries about print materials, order status, or account
            access, please contact our support team. For technical portal issues,
            include screenshots when possible.
          </p>
        </div>
      </div>

      <div style={styles.faqSection}>
        <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
        {FAQS.map((faq, i) => (
          <div key={i} style={styles.faqItem}>
            <div
              style={styles.faqQuestion}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <span>{faq.q}</span>
              <span style={{ color: '#22c55e', fontSize: 18 }}>
                {openFaq === i ? '−' : '+'}
              </span>
            </div>
            {openFaq === i && (
              <div style={styles.faqAnswer}>{faq.a}</div>
            )}
          </div>
        ))}
      </div>

      <div style={styles.chatBox}>
        <span style={styles.chatIcon}>💬</span>
        <strong style={{ color: '#d1d5db', display: 'block', marginBottom: 6 }}>
          Live Chat Coming Soon
        </strong>
        <span>Real-time support chat will be available in a future update.</span>
      </div>
    </div>
  );
}

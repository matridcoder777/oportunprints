import { useEffect, useState } from 'react';
import { fetchDocuments, Document } from '../api/client';

const typeColors: Record<string, string> = {
  invoice: '#2196F3',
  receipt: '#00BCD4',
  contract: '#9C27B0',
  flyer: '#FF9800',
  brochure: '#E91E63',
};

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments()
      .then(setDocuments)
      .catch(() => setError('Failed to load documents. Is the server running?'))
      .finally(() => setLoading(false));
  }, []);

  const headingStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1a1a2e',
    marginBottom: '4px',
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#666',
    marginBottom: '20px',
    fontSize: '14px',
  };

  const countStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#888',
    marginBottom: '16px',
  };

  const tableWrapStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle: React.CSSProperties = {
    background: '#f8f9fa',
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: 700,
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid #eee',
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px 16px',
    fontSize: '14px',
    borderBottom: '1px solid #f0f0f0',
    color: '#333',
  };

  const typeBadgeStyle = (type: string): React.CSSProperties => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    background: `${typeColors[type] || '#999'}22`,
    color: typeColors[type] || '#999',
    textTransform: 'capitalize',
  });

  const statusBadgeStyle = (status: string): React.CSSProperties => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    background: status === 'active' ? '#4CAF5022' : '#9E9E9E22',
    color: status === 'active' ? '#4CAF50' : '#9E9E9E',
    textTransform: 'capitalize',
  });

  const printBtnStyle: React.CSSProperties = {
    padding: '5px 14px',
    background: '#00A99D',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: 600,
  };

  if (loading) return <div style={{ padding: '40px', color: '#666' }}>Loading...</div>;
  if (error) return <div style={{ padding: '40px', color: '#F44336' }}>{error}</div>;

  return (
    <div>
      <h1 style={headingStyle}>Documents</h1>
      <p style={subtitleStyle}>Manage and print your organization's documents</p>
      <p style={countStyle}>{documents.length} document{documents.length !== 1 ? 's' : ''} found</p>

      <div style={tableWrapStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Pages</th>
              <th style={thStyle}>File Size</th>
              <th style={thStyle}>Created</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td style={{ ...tdStyle, fontWeight: 500 }}>{doc.title}</td>
                <td style={tdStyle}>
                  <span style={typeBadgeStyle(doc.type)}>{doc.type}</span>
                </td>
                <td style={tdStyle}>
                  <span style={statusBadgeStyle(doc.status)}>{doc.status}</span>
                </td>
                <td style={tdStyle}>{doc.pages}</td>
                <td style={tdStyle}>{doc.fileSize}</td>
                <td style={tdStyle}>{new Date(doc.createdAt).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  <button
                    style={printBtnStyle}
                    onClick={() =>
                      window.confirm(`Send "${doc.title}" to the print queue?`) &&
                      alert(`"${doc.title}" has been added to the print queue.`)
                    }
                  >
                    🖨️ Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Documents;

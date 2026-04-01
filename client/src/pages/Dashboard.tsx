import { useEffect, useState } from 'react';
import { fetchStats, fetchPrintJobs, Stats, PrintJob } from '../api/client';

const statusColors: Record<string, string> = {
  pending: '#FF9800',
  processing: '#2196F3',
  completed: '#4CAF50',
  failed: '#F44336',
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentJobs, setRecentJobs] = useState<PrintJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchStats(), fetchPrintJobs()])
      .then(([s, jobs]) => {
        setStats(s);
        setRecentJobs(jobs.slice(0, 5));
      })
      .catch(() => setError('Failed to load dashboard data. Is the server running?'))
      .finally(() => setLoading(false));
  }, []);

  const pageStyle: React.CSSProperties = { padding: '0' };

  const headingStyle: React.CSSProperties = {
    marginBottom: '4px',
    fontSize: '24px',
    fontWeight: 700,
    color: '#1a1a2e',
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#666',
    marginBottom: '28px',
    fontSize: '14px',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '36px',
  };

  const cardStyle = (accentColor: string): React.CSSProperties => ({
    background: '#fff',
    borderRadius: '10px',
    padding: '24px 20px',
    borderLeft: `5px solid ${accentColor}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  });

  const cardValueStyle: React.CSSProperties = {
    fontSize: '40px',
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: '8px',
  };

  const cardLabelStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#888',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1a1a2e',
    marginBottom: '16px',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
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

  const badgeStyle = (status: string): React.CSSProperties => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    background: `${statusColors[status] || '#999'}22`,
    color: statusColors[status] || '#999',
  });

  if (loading) return <div style={{ padding: '40px', color: '#666' }}>Loading...</div>;
  if (error) return <div style={{ padding: '40px', color: '#F44336' }}>{error}</div>;

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Dashboard</h1>
      <p style={subtitleStyle}>Welcome to Oportun Print Portal</p>

      <div style={gridStyle}>
        <div style={cardStyle('#2196F3')}>
          <div style={{ ...cardValueStyle, color: '#2196F3' }}>{stats?.totalDocuments}</div>
          <div style={cardLabelStyle}>Total Documents</div>
        </div>
        <div style={cardStyle('#9C27B0')}>
          <div style={{ ...cardValueStyle, color: '#9C27B0' }}>{stats?.totalTemplates}</div>
          <div style={cardLabelStyle}>Print Templates</div>
        </div>
        <div style={cardStyle('#FF9800')}>
          <div style={{ ...cardValueStyle, color: '#FF9800' }}>{stats?.pendingJobs}</div>
          <div style={cardLabelStyle}>Pending Jobs</div>
        </div>
        <div style={cardStyle('#4CAF50')}>
          <div style={{ ...cardValueStyle, color: '#4CAF50' }}>{stats?.completedJobs}</div>
          <div style={cardLabelStyle}>Completed Jobs</div>
        </div>
      </div>

      <div style={sectionTitleStyle}>Recent Print Jobs</div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Document</th>
            <th style={thStyle}>Template</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Copies</th>
            <th style={thStyle}>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {recentJobs.map((job) => (
            <tr key={job.id}>
              <td style={tdStyle}>{job.documentTitle}</td>
              <td style={tdStyle}>{job.templateName}</td>
              <td style={tdStyle}>
                <span style={badgeStyle(job.status)}>{job.status}</span>
              </td>
              <td style={tdStyle}>{job.copies}</td>
              <td style={tdStyle}>{new Date(job.submittedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;

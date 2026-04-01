import { useEffect, useState } from 'react';
import { fetchPrintJobs, updatePrintJobStatus, deletePrintJob, PrintJob } from '../api/client';

type FilterStatus = 'all' | 'pending' | 'processing' | 'completed' | 'failed';

const statusColors: Record<string, string> = {
  pending: '#FF9800',
  processing: '#2196F3',
  completed: '#4CAF50',
  failed: '#F44336',
};

const PrintQueue: React.FC = () => {
  const [jobs, setJobs] = useState<PrintJob[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = () => {
    setLoading(true);
    fetchPrintJobs()
      .then(setJobs)
      .catch(() => setError('Failed to load print jobs. Is the server running?'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleMarkComplete = async (id: string) => {
    try {
      const updated = await updatePrintJobStatus(id, 'completed');
      setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
    } catch {
      alert('Failed to update job status.');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete print job for "${title}"?`)) return;
    try {
      await deletePrintJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch {
      alert('Failed to delete print job.');
    }
  };

  const filtered = filter === 'all' ? jobs : jobs.filter((j) => j.status === filter);

  const counts = {
    all: jobs.length,
    pending: jobs.filter((j) => j.status === 'pending').length,
    processing: jobs.filter((j) => j.status === 'processing').length,
    completed: jobs.filter((j) => j.status === 'completed').length,
    failed: jobs.filter((j) => j.status === 'failed').length,
  };

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

  const tabsWrapStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 18px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    background: active ? '#00A99D' : '#fff',
    color: active ? '#fff' : '#555',
    boxShadow: active ? '0 2px 6px rgba(0,169,157,0.3)' : '0 1px 4px rgba(0,0,0,0.08)',
    transition: 'all 0.15s',
  });

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
    fontSize: '13px',
    borderBottom: '1px solid #f0f0f0',
    color: '#333',
    verticalAlign: 'middle',
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

  const completeBtnStyle: React.CSSProperties = {
    padding: '5px 10px',
    background: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: 600,
    marginRight: '6px',
  };

  const deleteBtnStyle: React.CSSProperties = {
    padding: '5px 10px',
    background: '#F44336',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: 600,
  };

  const filters: FilterStatus[] = ['all', 'pending', 'processing', 'completed', 'failed'];

  if (loading) return <div style={{ padding: '40px', color: '#666' }}>Loading...</div>;
  if (error) return <div style={{ padding: '40px', color: '#F44336' }}>{error}</div>;

  return (
    <div>
      <h1 style={headingStyle}>Print Queue</h1>
      <p style={subtitleStyle}>Manage and monitor all print jobs</p>

      <div style={tabsWrapStyle}>
        {filters.map((f) => (
          <button key={f} style={tabStyle(filter === f)} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      <div style={tableWrapStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Document</th>
              <th style={thStyle}>Template</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Copies</th>
              <th style={thStyle}>Printer</th>
              <th style={thStyle}>Submitted</th>
              <th style={thStyle}>Completed</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ ...tdStyle, textAlign: 'center', color: '#aaa', padding: '32px' }}>
                  No print jobs found.
                </td>
              </tr>
            ) : (
              filtered.map((job) => (
                <tr key={job.id}>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{job.documentTitle}</td>
                  <td style={tdStyle}>{job.templateName}</td>
                  <td style={tdStyle}>
                    <span style={badgeStyle(job.status)}>{job.status}</span>
                  </td>
                  <td style={tdStyle}>{job.copies}</td>
                  <td style={tdStyle}>{job.printer}</td>
                  <td style={tdStyle}>{new Date(job.submittedAt).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    {job.completedAt ? new Date(job.completedAt).toLocaleDateString() : '—'}
                  </td>
                  <td style={tdStyle}>
                    {(job.status === 'pending' || job.status === 'processing') && (
                      <button style={completeBtnStyle} onClick={() => handleMarkComplete(job.id)}>
                        ✓ Complete
                      </button>
                    )}
                    <button style={deleteBtnStyle} onClick={() => handleDelete(job.id, job.documentTitle)}>
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrintQueue;

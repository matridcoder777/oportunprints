import { useEffect, useState } from 'react';
import { fetchTemplates, Template } from '../api/client';

const categoryColors: Record<string, string> = {
  marketing: '#9C27B0',
  legal: '#F44336',
  financial: '#2196F3',
  operational: '#4CAF50',
};

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates()
      .then(setTemplates)
      .catch(() => setError('Failed to load templates. Is the server running?'))
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
    marginBottom: '28px',
    fontSize: '14px',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  };

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    color: '#1a1a2e',
  };

  const cardDescStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#666',
    lineHeight: 1.5,
  };

  const categoryBadgeStyle = (category: string): React.CSSProperties => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    background: `${categoryColors[category] || '#999'}22`,
    color: categoryColors[category] || '#999',
    textTransform: 'capitalize',
  });

  const metaRowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '4px',
  };

  const metaChipStyle: React.CSSProperties = {
    fontSize: '12px',
    background: '#f0f0f0',
    color: '#555',
    padding: '3px 10px',
    borderRadius: '10px',
    textTransform: 'capitalize',
  };

  const dividerStyle: React.CSSProperties = {
    borderTop: '1px solid #f0f0f0',
    margin: '4px 0',
  };

  const createdStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#aaa',
  };

  if (loading) return <div style={{ padding: '40px', color: '#666' }}>Loading...</div>;
  if (error) return <div style={{ padding: '40px', color: '#F44336' }}>{error}</div>;

  return (
    <div>
      <h1 style={headingStyle}>Print Templates</h1>
      <p style={subtitleStyle}>Browse available templates for printing your documents</p>

      <div style={gridStyle}>
        {templates.map((tpl) => (
          <div key={tpl.id} style={cardStyle}>
            <div>
              <span style={categoryBadgeStyle(tpl.category)}>{tpl.category}</span>
            </div>
            <div style={cardTitleStyle}>{tpl.name}</div>
            <div style={cardDescStyle}>{tpl.description}</div>
            <div style={dividerStyle} />
            <div style={metaRowStyle}>
              <span style={metaChipStyle}>📄 {tpl.paperSize}</span>
              <span style={metaChipStyle}>🔄 {tpl.orientation}</span>
              <span style={metaChipStyle}>{tpl.colorMode === 'color' ? '🎨 Color' : '⬛ B&W'}</span>
            </div>
            <div style={createdStyle}>Created: {new Date(tpl.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;

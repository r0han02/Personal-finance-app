export default function SkeletonLoader({ type = 'card', count = 1 }) {
  if (type === 'cards') {
    return (
      <div className="summary-grid">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="glass-card">
            <div className="skeleton skeleton-text sm" />
            <div className="skeleton skeleton-text lg" style={{ marginTop: 12 }} />
            <div className="skeleton skeleton-text sm" style={{ marginTop: 8 }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 56, borderRadius: 10 }} />
        ))}
      </div>
    );
  }

  return <div className="skeleton skeleton-card" />;
}

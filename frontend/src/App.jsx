import { useState } from 'react';
import './App.css';
import { analyzeWebsite } from './services/api.js';

function getScoreColor(score) {
  if (score >= 80) return '#147c4d';
  if (score >= 60) return '#4338ca';
  if (score >= 40) return '#ca8a04';
  return '#b91c1c';
}

function getBarColor(score) {
  if (score >= 15) return '#147c4d';
  if (score >= 10) return '#ca8a04';
  return '#b91c1c';
}

function PerformanceBar({ score, responseTime }) {
  const bars = 10;
  const filledBars = Math.max(0, Math.min(bars, Math.round((score / 20) * bars)));
  const barColor = getBarColor(score);
  
  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ color: barColor, fontWeight: 600 }}>⚡ Performance</span>
      </div>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '8px',
              borderRadius: '4px',
              background: i < filledBars ? barColor : '#e3e8f1',
            }}
          />
        ))}
      </div>
      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{responseTime}ms</p>
    </div>
  );
}

function DetailModal({ items, title, onClose }) {
  if (!items || items.length === 0) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <div className="modal-list">
          {items.map((item, idx) => (
            <div key={idx} className="modal-item">
              <span className="broken-icon">❌</span>
              <div style={{ flex: 1 }}>
                <span className="modal-url">{item.url || item.message}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                  ({item.status || item.type || 'error'})
                </span>
              </div>
            </div>
          ))}
        </div>
        <button className="modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function Recommendation({ recommendations, isFullWidth }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <article className="report-card" style={isFullWidth ? { gridColumn: 'span 3' } : {}}>
        <p className="card-label">Recommendations</p>
        <p style={{ color: 'var(--success)', margin: 0 }}>✓ All checks passed! Your website looks great.</p>
      </article>
    );
  }

  return (
    <article className="report-card" style={isFullWidth ? { gridColumn: 'span 3' } : {}}>
      <p className="card-label">Recommendations</p>
      <ol style={{ margin: '12px 0 0 0', paddingLeft: '20px', color: 'var(--text)' }}>
        {recommendations.map((rec, idx) => (
          <li key={idx} style={{ marginBottom: '8px' }}>
            {rec.text}
            {rec.items && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {rec.items.map((item, i) => (
                  <div key={i} style={{ marginLeft: '12px', wordBreak: 'break-all' }}>• {item.url || item.message}</div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </article>
  );
}

function BreakdownSection({ breakdown }) {
  const labels = [
    { key: 'status', label: 'Status', max: 20 },
    { key: 'performance', label: 'Performance', max: 20 },
    { key: 'security', label: 'Security', max: 20 },
    { key: 'seo', label: 'SEO', max: 20 },
    { key: 'links', label: 'Links', max: 20 },
    { key: 'images', label: 'Images', max: 20 },
    { key: 'console', label: 'JS Errors', max: 20 },
  ];

  return (
    <article className="report-card">
      <p className="card-label">Score Breakdown</p>
      {labels.map(({ key, label, max }) => (
        <div key={key} style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.9rem' }}>{label}</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {Math.round(breakdown[key])}/{max}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: max }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: '3px',
                  background: i < (breakdown[key] / max) * max ? getScoreColor(breakdown[key]) : '#e3e8f1',
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </article>
  );
}

function ExportButton({ report }) {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website-health-report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button className="export-btn" onClick={handleExport}>
      Download Report
    </button>
  );
}

function App() {
  const [url, setUrl] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalItems, setModalItems] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setReport(null);

    if (!url.trim()) {
      setError('Please enter a website URL.');
      return;
    }

    setLoading(true);
    try {
      const data = await analyzeWebsite(url);
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">Swym Debug Assist</p>
          <h1>Customer Experience Debugger</h1>
          <p className="subtitle">
            Enter a website URL to analyze for customer experience issues: broken elements, JavaScript errors, SEO, and performance.
          </p>
        </div>

        <form className="analyze-form" onSubmit={handleSubmit}>
          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label="Website URL"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Analyzing…' : 'Analyze'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
      </header>

      {report && (
        <section className="report-grid">
          <article className="report-card highlight-card">
            <div>
              <p className="card-label">Health Score</p>
              <p className="score-value" style={{ color: getScoreColor(report.healthScore) }}>
                {report.healthScore}/100
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="summary-text">
                {report.website.status === 'online' ? 'Website is reachable' : 'Website is unavailable'}
              </p>
              <ExportButton report={report} />
            </div>
          </article>

          <article className="report-card">
            <p className="card-label">Website Status</p>
            <p>{report.website.status}</p>
            <p>{report.website.statusCode}</p>
            <PerformanceBar score={report.website.performanceRating} responseTime={report.website.responseTime} />
          </article>

          <article className="report-card">
            <p className="card-label">Security</p>
            <p>{report.security.status}</p>
            <p>{report.security.message}</p>
          </article>

          <article className="report-card">
            <p className="card-label">SEO</p>
            <p>Score: {report.seo.score}/70</p>
            <ul>
              <li>{report.seo.title ? '✓' : '✗'} Title</li>
              <li>{report.seo.description ? '✓' : '✗'} Meta description</li>
              <li>{report.seo.h1 ? '✓' : '✗'} H1 tag</li>
              <li>{report.seo.imagesMissingAlt === 0 ? '✓' : '✗'} Alt text ({report.seo.imagesMissingAlt} missing)</li>
            </ul>
          </article>

          <article className="report-card" onClick={() => { setModalItems(report.links.links.filter(l => !l.ok)); setModalTitle('Broken Links'); }}>
            <p className="card-label">Broken Links</p>
            <p style={{ color: report.links.broken > 0 ? 'var(--danger)' : 'var(--success)', cursor: 'pointer' }}>
              {report.links.broken} broken of {report.links.total}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click to view details</p>
          </article>

          <article className="report-card" onClick={() => { setModalItems(report.images.images.filter(i => !i.ok)); setModalTitle('Broken Images'); }}>
            <p className="card-label">Broken Images</p>
            <p style={{ color: report.images.broken > 0 ? 'var(--danger)' : 'var(--success)', cursor: 'pointer' }}>
              {report.images.broken} broken of {report.images.total}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click to view details</p>
          </article>

          {report.shopify?.isShopify && (
            <article className="report-card">
              <p className="card-label">Shopify Detection</p>
              <p style={{ color: report.shopify.hasSwym ? 'var(--success)' : 'var(--danger)' }}>
                {report.shopify.hasSwym ? '✓ Swym detected' : '✗ Swym not detected'}
              </p>
              {report.shopify.issues?.length > 0 && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {report.shopify.issuesCount} integration issue{report.shopify.issuesCount > 1 ? 's' : ''} found
                </p>
              )}
            </article>
          )}

          <article className="report-card" onClick={() => { setModalItems(report.console?.errors || []); setModalTitle('JavaScript Errors'); }}>
            <p className="card-label">JavaScript Errors</p>
            <p style={{ color: report.console?.hasErrors ? 'var(--danger)' : 'var(--success)', cursor: 'pointer' }}>
              {report.console?.errorCount || 0} potential errors detected
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click to view details</p>
          </article>

          <BreakdownSection breakdown={report.breakdown} />
          <Recommendation recommendations={report.recommendations} isFullWidth={true} />
        </section>
      )}

      {modalItems && (
        <DetailModal
          items={modalItems}
          title={modalTitle}
          onClose={() => setModalItems(null)}
        />
      )}
    </main>
  );
}

export default App;
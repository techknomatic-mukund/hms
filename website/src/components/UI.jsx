import { useEffect } from 'react'

export function StatCard({ label, value, change, trend = 'neutral' }) {
  const trendClass = trend === 'up' ? 'stat-up' : trend === 'down' ? 'stat-down' : ''
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {change && <span className={`stat-change ${trendClass}`}>{change}</span>}
    </div>
  )
}

export function DataTable({ columns, rows, keyField = 'id' }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[keyField] ?? row.id ?? row.name}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Badge({ children, variant = 'default' }) {
  return <span className={`badge badge-${variant}`}>{children}</span>
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function FeatureGrid({ features }) {
  return (
    <div className="feature-grid">
      {features.map((f) => (
        <div key={f} className="feature-chip">{f}</div>
      ))}
    </div>
  )
}

export function LifecycleFlow({ steps }) {
  return (
    <div className="lifecycle-flow">
      {steps.map((step, i) => (
        <div key={step.step} className="lifecycle-item">
          <div className={`lifecycle-node lifecycle-${step.status}`}>
            <span className="lifecycle-num">{i + 1}</span>
          </div>
          <div className="lifecycle-content">
            <strong>{step.step}</strong>
            <span>{step.detail}</span>
          </div>
          {i < steps.length - 1 && <div className="lifecycle-connector" />}
        </div>
      ))}
    </div>
  )
}

export function PageShell({ title, description, children }) {
  return (
    <div className="page-shell">
      <header className="page-header">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </header>
      {children}
    </div>
  )
}

export function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return undefined

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className={`modal${wide ? ' modal-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

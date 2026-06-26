import { Badge } from './UI'

export default function TechnicianTrackingPanel({ technicians, tickets }) {
  return (
    <div className="tech-tracking-panel">
      <div className="tech-grid">
        {technicians.map((tech) => {
          const assigned = tickets.filter(
            (t) => t.technician === tech.name && !['Resolved', 'Closed'].includes(t.status),
          )
          return (
            <div key={tech.id} className={`tech-card${tech.status !== 'Active' ? ' inactive' : ''}`}>
              <div className="tech-card-head">
                <strong>{tech.name}</strong>
                <Badge variant={tech.status === 'Active' ? 'success' : 'warning'}>{tech.status}</Badge>
              </div>
              <p className="tech-specialty">{tech.specialty}</p>
              <p className="tech-shift">{tech.shift}</p>
              <div className="tech-workload">
                <span>Workload</span>
                <div className="workload-bar-track">
                  <div className="workload-bar-fill" style={{ width: `${Math.min(tech.workload * 25, 100)}%` }} />
                </div>
                <span>{tech.workload} active WO{tech.workload !== 1 ? 's' : ''}</span>
              </div>
              {assigned.length > 0 && (
                <ul className="tech-assignments">
                  {assigned.map((t) => (
                    <li key={t.id}>{t.id} — {t.asset} ({t.status})</li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

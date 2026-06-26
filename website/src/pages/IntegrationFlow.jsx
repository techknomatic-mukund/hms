import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader } from '../components/UI'

const FLOW = [
  { step: 'Guest Check-in', modules: ['Front Office'] },
  { step: 'Room Status Updated', modules: ['Housekeeping', 'Reservation'] },
  { step: 'Housekeeping Task Created', modules: ['Housekeeping'] },
  { step: 'Finance Folio Opened', modules: ['Finance'] },
  { step: 'CRM Profile Updated', modules: ['CRM'] },
  { step: 'Reports Refreshed', modules: ['Reports', 'Management'] },
]

export default function IntegrationFlow() {
  const { activityLog } = useStore()

  return (
    <PageShell
      title="Integration Flow"
      description="When one department acts, all related departments update automatically via the centralized database"
    >
      <section className="panel panel-highlight">
        <SectionHeader title="Check-in Cascade" subtitle="Core objective of the integrated ERP" />
        <div className="integration-flow">
          {FLOW.map((item, i) => (
            <div key={item.step} className="integration-step">
              <div className="integration-node">{i + 1}</div>
              <div className="integration-content">
                <strong>{item.step}</strong>
                <div className="integration-modules">
                  {item.modules.map((m) => <span key={m} className="feature-chip">{m}</span>)}
                </div>
              </div>
              {i < FLOW.length - 1 && <div className="integration-arrow">↓</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <SectionHeader title="Recent Cross-Module Events" />
        <ul className="info-list">
          {activityLog.slice(0, 10).map((log) => (
            <li key={log.id}><strong>{log.time}</strong> — [{log.module}] {log.action}: {log.detail}</li>
          ))}
        </ul>
      </section>
    </PageShell>
  )
}

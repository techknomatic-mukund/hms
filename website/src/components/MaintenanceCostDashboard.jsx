import { StatCard } from './UI'
import { maintenanceCostMetrics, formatMaintINR } from '../utils/maintenanceHelpers'

export default function MaintenanceCostDashboard({ tickets, history, spareParts }) {
  const m = maintenanceCostMetrics(tickets, history, spareParts)

  return (
    <div className="maint-cost-dashboard">
      <div className="stats-grid">
        <StatCard label="Total Maintenance Cost" value={formatMaintINR(m.totalCost)} change="This period" />
        <StatCard label="Labor Costs" value={formatMaintINR(m.laborCost)} trend="neutral" />
        <StatCard label="Parts & Materials" value={formatMaintINR(Math.round(m.partsCost))} trend="neutral" />
        <StatCard label="Open Work Orders" value={String(m.openOrders)} trend={m.openOrders > 2 ? 'down' : 'neutral'} />
        <StatCard label="Low Stock Parts" value={String(m.lowStockParts)} trend={m.lowStockParts > 0 ? 'down' : 'up'} />
        <StatCard label="Completed Jobs" value={String(m.completedThisMonth)} trend="up" />
      </div>

      <div className="cost-breakdown">
        <h4>Cost by Category (from work orders)</h4>
        <div className="cost-bars">
          {['HVAC', 'Elevator', 'Generator', 'Plumbing'].map((cat) => {
            const cost = tickets
              .filter((t) => t.asset.toLowerCase().includes(cat.toLowerCase()) || t.type === 'Preventive')
              .reduce((s, t) => s + (t.laborCost || 0) + (t.partsCost || 0), 0)
            const max = m.totalCost || 1
            return (
              <div key={cat} className="cost-bar-row">
                <span>{cat}</span>
                <div className="cost-bar-track">
                  <div className="cost-bar-fill" style={{ width: `${Math.min((cost / max) * 100, 100)}%` }} />
                </div>
                <span>{formatMaintINR(cost)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

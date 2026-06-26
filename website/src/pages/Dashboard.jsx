import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  dashboardStats, guestLifecycle as initialLifecycle, bookingSourcePerformance,
  implementationPhases, futureIntegrations, deploymentInfo,
} from '../data/initialState'
import { useStore } from '../context/StoreContext'
import { StatCard, SectionHeader, LifecycleFlow, FeatureGrid, DataTable } from '../components/UI'

const LIFECYCLE_STEPS = ['Reservation', 'Check-In', 'Room Stay', 'Consume Services', 'Billing', 'Check-Out']

export default function Dashboard() {
  const { activityLog, reservations, rooms } = useStore()
  const [lifecycle, setLifecycle] = useState(initialLifecycle)
  const [activeStep, setActiveStep] = useState(2)

  const advanceLifecycle = () => {
    setActiveStep((prev) => {
      const next = Math.min(prev + 1, LIFECYCLE_STEPS.length - 1)
      setLifecycle(LIFECYCLE_STEPS.map((step, i) => ({
        step,
        detail: initialLifecycle[i]?.detail ?? '',
        status: i < next ? 'done' : i === next ? 'active' : 'pending',
      })))
      return next
    })
  }

  const occupied = rooms.filter((r) => r.status === 'Occupied').length

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Hotel ERP Dashboard</h1>
          <p>Centralized database — all departments share one platform</p>
        </div>
        <Link to="/erp/integration" className="demo-badge">View Integration Flow →</Link>
      </header>

      <div className="stats-grid">
        {dashboardStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
        <StatCard label="Rooms Occupied" value={String(occupied)} change={`${rooms.length} total`} />
        <StatCard label="Active Reservations" value={String(reservations.length)} trend="neutral" />
      </div>

      <section className="panel">
        <SectionHeader
          title="Guest Lifecycle"
          subtitle="Check-in cascades to Housekeeping, Finance, CRM & Reports"
          action={(
            <div className="btn-group">
              <button type="button" className="btn btn-primary btn-sm" onClick={advanceLifecycle}>Advance Step</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setActiveStep(0); setLifecycle(initialLifecycle) }}>Reset</button>
            </div>
          )}
        />
        <LifecycleFlow steps={lifecycle} />
      </section>

      <div className="two-col">
        <section className="panel">
          <SectionHeader title="Live Activity Log" subtitle="Cross-module updates from central database" />
          <DataTable
            columns={[
              { key: 'time', label: 'Time' },
              { key: 'action', label: 'Action' },
              { key: 'module', label: 'Module' },
              { key: 'detail', label: 'Detail' },
            ]}
            rows={activityLog}
          />
        </section>

        <section className="panel">
          <SectionHeader title="Booking Source Performance" />
          <DataTable
            columns={[
              { key: 'source', label: 'Source' },
              { key: 'bookings', label: 'Bookings' },
              { key: 'revenue', label: 'Revenue' },
              { key: 'share', label: 'Share' },
            ]}
            rows={bookingSourcePerformance}
            keyField="source"
          />
        </section>
      </div>

      <section className="panel">
        <SectionHeader title="Platform Capabilities" />
        <FeatureGrid features={[
          'Customer + ERP dual portals', 'RBAC permissions', 'Approval workflows',
          'Centralized master & transaction data', 'GST & finance integration', 'CRM & loyalty',
          'Inventory & procurement', 'Export PDF/Excel/CSV', 'Audit logs & backup',
        ]} />
      </section>

      <section className="panel">
        <SectionHeader title="Implementation Roadmap" />
        <div className="phases-grid">
          {implementationPhases.map((p) => (
            <div key={p.phase} className="phase-card">
              <span className="phase-tag">{p.phase}</span>
              <h3>{p.title}</h3>
              <ul>{p.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <div className="two-col">
        <section className="panel">
          <SectionHeader title="Architecture" />
          <p className="info-text"><strong>{deploymentInfo.architecture}</strong></p>
          <ul className="info-list">{deploymentInfo.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
        </section>
        <section className="panel">
          <SectionHeader title="Future Enhancements" />
          <DataTable
            columns={[
              { key: 'name', label: 'Feature' },
              { key: 'status', label: 'Status' },
              { key: 'phase', label: 'Notes' },
            ]}
            rows={futureIntegrations}
            keyField="name"
          />
        </section>
      </div>
    </>
  )
}

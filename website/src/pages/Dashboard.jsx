import { useState } from 'react'
import {
  dashboardStats,
  guestLifecycle as initialLifecycle,
  bookingSourcePerformance,
  implementationPhases,
  futureIntegrations,
  deploymentInfo,
} from '../data/mockData'
import { StatCard, SectionHeader, LifecycleFlow, FeatureGrid, DataTable } from '../components/UI'

const LIFECYCLE_STEPS = ['Reservation', 'Check-In', 'Room Stay', 'Consume Services', 'Billing', 'Check-Out']

export default function Dashboard() {
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

  const resetLifecycle = () => {
    setActiveStep(0)
    setLifecycle(LIFECYCLE_STEPS.map((step, i) => ({
      step,
      detail: initialLifecycle[i]?.detail ?? '',
      status: i === 0 ? 'active' : 'pending',
    })))
  }

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Hotel ERP Dashboard</h1>
          <p>Integrated PMS — Front Office, POS, Finance, HRMS, F&B & Add-on Services</p>
        </div>
        <span className="demo-badge">Demo Mode</span>
      </header>

      <div className="stats-grid">
        {dashboardStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <section className="panel">
        <SectionHeader
          title="Guest Lifecycle"
          subtitle="End-to-end flow from reservation to check-out"
          action={(
            <div className="btn-group">
              <button type="button" className="btn btn-primary btn-sm" onClick={advanceLifecycle}>Advance Step</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={resetLifecycle}>Reset</button>
            </div>
          )}
        />
        <LifecycleFlow steps={lifecycle} />
      </section>

      <div className="two-col">
        <section className="panel">
          <SectionHeader title="Booking Source Performance" subtitle="Revenue by channel" />
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

        <section className="panel">
          <SectionHeader title="Platform Capabilities" />
          <FeatureGrid
            features={[
              'Walk-in & OTA bookings',
              'Corporate & travel agent',
              'GST & tax management',
              'Bill-to-room',
              'QR feedback collection',
              'Offline-capable hybrid deploy',
              'Legacy data migration (2-5 yrs)',
            ]}
          />
        </section>
      </div>

      <section className="panel">
        <SectionHeader title="Implementation Roadmap" subtitle="Three-phase rollout plan" />
        <div className="phases-grid">
          {implementationPhases.map((p) => (
            <div key={p.phase} className="phase-card">
              <span className="phase-tag">{p.phase}</span>
              <h3>{p.title}</h3>
              <ul>
                {p.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="two-col">
        <section className="panel">
          <SectionHeader title="Deployment Architecture" />
          <p className="info-text"><strong>{deploymentInfo.architecture}</strong></p>
          <ul className="info-list">
            {deploymentInfo.benefits.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <SectionHeader title="Future Integrations" subtitle="Not in Phase 1 — standalone first" />
          <DataTable
            columns={[
              { key: 'name', label: 'Integration' },
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

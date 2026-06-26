import { useState } from 'react'
import { reportCategories } from '../data/initialState'
import { PageShell, SectionHeader } from '../components/UI'
import ReportViewModal from '../components/ReportViewModal'
import ComparisonReportModal from '../components/ComparisonReportModal'

export default function Reports() {
  const [activeReport, setActiveReport] = useState(null)
  const [comparisonReport, setComparisonReport] = useState(null)

  return (
    <PageShell title="Reports Center" description="Dashboards for Reception, HK, Restaurant, Finance, HR, CRM — export PDF/Excel/CSV">
      <section className="panel panel-highlight">
        <SectionHeader title="Centralized Reporting" />
        <p className="info-text">All modules feed one reporting engine. Export as PDF, Excel, or CSV.</p>
      </section>
      <div className="reports-grid">
        {Object.entries(reportCategories).map(([category, reports]) => (
          <section key={category} className="panel report-category">
            <SectionHeader title={category} />
            <ul className="report-list">
              {reports.map((report) => (
                <li key={report}>
                  <button type="button" className="report-link" onClick={() => setActiveReport(report)}>
                    <span>{report}</span><span className="report-arrow">→</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="panel">
        <SectionHeader title="Comparison Reports" />
        <div className="comparison-cards">
          {['Weekly Comparison', 'Monthly Comparison', 'Yearly Comparison'].map((r) => (
            <button key={r} type="button" className="comparison-card" onClick={() => setComparisonReport(r)}>
              <strong>{r}</strong><span>Occupancy · Revenue · Bookings</span>
            </button>
          ))}
        </div>
      </section>
      <ReportViewModal open={!!activeReport} title={activeReport} onClose={() => setActiveReport(null)} />
      <ComparisonReportModal open={!!comparisonReport} title={comparisonReport} onClose={() => setComparisonReport(null)} />
    </PageShell>
  )
}

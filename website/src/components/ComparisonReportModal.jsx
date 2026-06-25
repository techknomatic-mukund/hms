import { Modal } from './UI'

const COMPARISON_DATA = {
  'Weekly Comparison': [
    { period: 'This Week', occupancy: '78%', revenue: '₹28.5L', bookings: '142' },
    { period: 'Last Week', occupancy: '72%', revenue: '₹25.1L', bookings: '128' },
    { period: 'Change', occupancy: '+6%', revenue: '+13.5%', bookings: '+10.9%' },
  ],
  'Monthly Comparison': [
    { period: 'This Month', occupancy: '75%', revenue: '₹1.24 Cr', bookings: '580' },
    { period: 'Last Month', occupancy: '71%', revenue: '₹1.08 Cr', bookings: '542' },
    { period: 'Change', occupancy: '+4%', revenue: '+14.8%', bookings: '+7%' },
  ],
  'Yearly Comparison': [
    { period: 'This Year', occupancy: '73%', revenue: '₹14.2 Cr', bookings: '6,840' },
    { period: 'Last Year', occupancy: '68%', revenue: '₹12.1 Cr', bookings: '6,120' },
    { period: 'Change', occupancy: '+5%', revenue: '+17.4%', bookings: '+11.8%' },
  ],
}

export default function ComparisonReportModal({ open, onClose, title }) {
  if (!open || !title) return null
  const rows = COMPARISON_DATA[title] ?? COMPARISON_DATA['Weekly Comparison']

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="report-view">
        <table className="data-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Occupancy</th>
              <th>Revenue</th>
              <th>Bookings</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.period}>
                <td>{row.period}</td>
                <td>{row.occupancy}</td>
                <td>{row.revenue}</td>
                <td>{row.bookings}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          <button type="button" className="btn btn-primary" onClick={onClose}>Export (Demo)</button>
        </div>
      </div>
    </Modal>
  )
}

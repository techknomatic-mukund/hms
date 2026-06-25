import { Modal } from './UI'

const SAMPLE_DATA = {
  'Check-in Reports': [
    { metric: 'Total Check-ins', value: '24' },
    { metric: 'Walk-in', value: '6' },
    { metric: 'Pre-booked', value: '18' },
    { metric: 'Avg. processing time', value: '4.2 min' },
  ],
  'Occupancy Reports': [
    { metric: 'Occupancy Rate', value: '78%' },
    { metric: 'Rooms Available', value: '42' },
    { metric: 'Rooms Occupied', value: '148' },
    { metric: 'Out of Order', value: '3' },
  ],
  'Item-wise Sales': [
    { metric: 'Butter Chicken', value: '₹1.24L' },
    { metric: 'Continental Breakfast', value: '₹86K' },
    { metric: 'Paneer Tikka', value: '₹52K' },
  ],
  'P&L Statement': [
    { metric: 'Total Revenue', value: '₹1.24 Cr' },
    { metric: 'Total Expenses', value: '₹68.5L' },
    { metric: 'Net Profit', value: '₹55.5L' },
    { metric: 'Profit Margin', value: '44.8%' },
  ],
}

function getReportRows(title) {
  if (SAMPLE_DATA[title]) return SAMPLE_DATA[title]
  return [
    { metric: 'Records', value: `${Math.floor(Math.random() * 80) + 20}` },
    { metric: 'Total Value', value: '₹4.2L' },
    { metric: 'Period', value: 'Current Month' },
    { metric: 'Trend', value: '+8.5%' },
  ]
}

export default function ReportViewModal({ open, onClose, title }) {
  if (!open || !title) return null
  const rows = getReportRows(title)

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="report-view">
        <p className="info-text">Generated report preview — {new Date().toLocaleDateString('en-GB')}</p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.metric}>
                <td>{row.metric}</td>
                <td><strong>{row.value}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          <button type="button" className="btn btn-primary" onClick={onClose}>Export PDF (Demo)</button>
        </div>
      </div>
    </Modal>
  )
}

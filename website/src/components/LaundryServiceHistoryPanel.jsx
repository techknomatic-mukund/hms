import { useMemo, useState } from 'react'
import { Badge } from './UI'
import { guestLaundryHistory } from '../utils/laundryHelpers'

export default function LaundryServiceHistoryPanel({ orders, history, customers }) {
  const guestNames = useMemo(() => {
    const names = new Set([
      ...orders.map((o) => o.guest),
      ...history.map((h) => h.guest),
      ...customers.map((c) => c.name),
    ])
    return [...names].filter(Boolean).sort()
  }, [orders, history, customers])

  const [guest, setGuest] = useState(guestNames[0] || '')

  const records = useMemo(
    () => guestLaundryHistory(orders, history, guest),
    [orders, history, guest],
  )

  return (
    <div className="laundry-history-panel">
      <label className="form-field guest-history-picker">
        <span>Select Guest</span>
        <select value={guest} onChange={(e) => setGuest(e.target.value)}>
          {guestNames.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>

      {records.length ? (
        <table className="folio-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Service</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Delivered</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.orderId}</td>
                <td>{r.service}{r.express && ' ⚡'}</td>
                <td>{r.items}</td>
                <td>{r.amount}</td>
                <td>{r.delivered}</td>
                <td><Badge variant="success">{r.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="info-text">No delivery history for {guest}.</p>
      )}
    </div>
  )
}

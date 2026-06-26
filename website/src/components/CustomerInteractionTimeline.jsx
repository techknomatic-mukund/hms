import { useMemo, useState } from 'react'
import { Badge } from './UI'
import { buildCustomerTimeline, interactionIcon } from '../utils/crmHelpers'

export default function CustomerInteractionTimeline({
  customers, customerInteractions, reservations, feedback, guestRequests, crmSupportTickets,
}) {
  const [selectedId, setSelectedId] = useState(customers[0]?.id || '')

  const customer = customers.find((c) => c.id === selectedId)

  const timeline = useMemo(() => {
    if (!customer) return []
    return buildCustomerTimeline(customer.name, {
      customerInteractions,
      reservations,
      feedback,
      guestRequests,
      crmSupportTickets,
    })
  }, [customer, customerInteractions, reservations, feedback, guestRequests, crmSupportTickets])

  return (
    <div className="crm-interaction-panel">
      <div className="guest-history-picker">
        <label className="form-field">
          <span>Select Customer</span>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — {c.loyalty}</option>
            ))}
          </select>
        </label>
      </div>

      {customer && (
        <p className="info-text crm-interaction-sub">
          Complete timeline for <strong>{customer.name}</strong> — bookings, emails, calls, complaints, feedback & service requests
        </p>
      )}

      <ul className="crm-timeline">
        {timeline.map((item) => (
          <li key={item.id} className="crm-timeline-item">
            <span className="crm-timeline-icon">{interactionIcon(item.type)}</span>
            <div className="crm-timeline-body">
              <div className="crm-timeline-head">
                <strong>{item.type}</strong>
                <Badge variant="muted">{item.channel}</Badge>
                <span className="crm-timeline-date">{item.date}</span>
              </div>
              <p>{item.detail}</p>
              <em className="crm-timeline-source">{item.source}</em>
            </div>
          </li>
        ))}
        {!timeline.length && <li className="info-text">No interactions recorded yet.</li>}
      </ul>
    </div>
  )
}

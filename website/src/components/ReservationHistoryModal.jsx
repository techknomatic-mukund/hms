import { Modal } from './UI'
import { normalizeReservation } from '../utils/reservationHelpers'

export default function ReservationHistoryModal({ open, onClose, reservation }) {
  if (!open || !reservation) return null
  const res = normalizeReservation(reservation)

  return (
    <Modal open={open} onClose={onClose} title={`Reservation History — ${res.id}`}>
      <div className="history-header">
        <p><strong>{res.guest}</strong> · {res.room} · {res.status}</p>
        {res.notes && <p className="info-text"><em>Notes:</em> {res.notes}</p>}
      </div>
      <ul className="history-timeline">
        {(res.history?.length ? res.history : [{ time: '—', action: 'No history', detail: 'No activity recorded yet' }]).map((entry, i) => (
          <li key={`${entry.time}-${i}`} className="history-item">
            <span className="history-time">{entry.time}</span>
            <div className="history-body">
              <strong>{entry.action}</strong>
              <span>{entry.detail}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="modal-actions">
        <button type="button" className="btn btn-primary" onClick={onClose}>Close</button>
      </div>
    </Modal>
  )
}

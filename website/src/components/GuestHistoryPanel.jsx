import { useState } from 'react'
import { Badge } from './UI'
import { guestReservations } from '../utils/frontOfficeHelpers'

const loyaltyVariant = (tier) => {
  if (tier === 'Platinum') return 'info'
  if (tier === 'Gold') return 'warning'
  if (tier === 'Silver') return 'default'
  return 'muted'
}

export default function GuestHistoryPanel({ crmCustomers, reservations }) {
  const [selectedId, setSelectedId] = useState(crmCustomers[0]?.id || '')

  const guest = crmCustomers.find((c) => c.id === selectedId)
  const stays = guest ? guestReservations(reservations, guest.name) : []

  return (
    <div className="guest-history-panel">
      <div className="guest-history-picker">
        <label className="form-field">
          <span>Select Guest</span>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            {crmCustomers.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — {c.loyalty}</option>
            ))}
          </select>
        </label>
      </div>

      {guest && (
        <div className="guest-history-content">
          <div className="guest-profile-card">
            <div className="guest-profile-head">
              <h3>{guest.name}</h3>
              <Badge variant={loyaltyVariant(guest.loyalty)}>{guest.loyalty} Member</Badge>
            </div>
            <p className="info-text">{guest.email} · {guest.visits} visits · Last stay: {guest.lastStay}</p>
            {guest.specialRequests && (
              <p className="guest-special"><strong>Special requests:</strong> {guest.specialRequests}</p>
            )}
          </div>

          <div className="guest-history-grid">
            <div className="guest-history-block">
              <h4>Preferences</h4>
              <div className="pref-chips">
                {(guest.preferences || []).map((p) => (
                  <span key={p} className="feature-chip">{p}</span>
                ))}
              </div>
            </div>

            <div className="guest-history-block">
              <h4>Previous Stays</h4>
              <ul className="stay-list">
                {(guest.previousStays || []).map((s) => (
                  <li key={`${s.dates}-${s.room}`}>
                    <strong>{s.dates}</strong> — {s.room} ({s.nights} night{s.nights > 1 ? 's' : ''})
                  </li>
                ))}
              </ul>
            </div>

            <div className="guest-history-block guest-history-block-full">
              <h4>Current & Upcoming Bookings</h4>
              {stays.length ? (
                <table className="folio-table">
                  <thead>
                    <tr><th>Ref</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {stays.map((r) => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.room}</td>
                        <td>{r.checkIn}</td>
                        <td>{r.checkOut}</td>
                        <td><Badge variant={r.status === 'Checked In' ? 'success' : 'info'}>{r.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="info-text">No active reservations for this guest.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

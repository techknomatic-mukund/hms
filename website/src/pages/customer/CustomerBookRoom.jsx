import { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useStore } from '../../context/StoreContext'
import { PageShell, SectionHeader } from '../../components/UI'
import { FormActions, FormField } from '../../components/FormFields'
import { formatDisplayDate } from '../../utils/helpers'
import { getRoomBookingConflicts, roomConflictLabel } from '../../utils/reservationHelpers'

const ROOMS = ['Standard 201 — ₹4,500/night', 'Deluxe 302 — ₹7,500/night', 'Suite 501 — ₹12,000/night']

export default function CustomerBookRoom() {
  const { user } = useAuth()
  const store = useStore()
  const [form, setForm] = useState({ room: 'Standard 201', checkIn: '', checkOut: '' })
  const [errors, setErrors] = useState({})
  const [booked, setBooked] = useState(false)

  const roomName = form.room.split(' —')[0]
  const roomConflicts = useMemo(
    () => getRoomBookingConflicts(store.reservations, form.checkIn, form.checkOut),
    [store.reservations, form.checkIn, form.checkOut],
  )
  const conflict = roomConflicts[roomName]?.[0]

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.checkIn) next.checkIn = 'Check-in is required'
    if (!form.checkOut) next.checkOut = 'Check-out is required'
    if (form.checkIn && form.checkOut && form.checkOut < form.checkIn) {
      next.checkOut = 'Check-out cannot be before check-in'
    }
    if (form.checkIn && form.checkOut && conflict) {
      next.room = roomConflictLabel(conflict)
    }
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    store.customerBookRoom({
      guest: user.name,
      room: roomName,
      checkIn: formatDisplayDate(form.checkIn),
      checkOut: formatDisplayDate(form.checkOut),
      checkInIso: form.checkIn,
      checkOutIso: form.checkOut,
    })
    setBooked(true)
  }

  return (
    <PageShell title="Book a Room" description="Synced to ERP Reservations, Finance & CRM automatically">
      {booked ? (
        <section className="panel panel-highlight">
          <h2>Booking Confirmed!</h2>
          <p className="info-text">Your reservation is in the ERP system. Housekeeping & Finance will update on check-in.</p>
        </section>
      ) : (
        <section className="panel">
          <SectionHeader title="Room Search & Availability" />
          <form className="entity-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <FormField label="Room Type" full error={errors.room}>
                <select value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))}>
                  {ROOMS.map((r) => {
                    const name = r.split(' —')[0]
                    const busy = form.checkIn && form.checkOut && roomConflicts[name]
                    return (
                      <option key={r} value={r} disabled={Boolean(busy)}>
                        {r}{busy ? ' — Booked on selected dates' : ''}
                      </option>
                    )
                  })}
                </select>
              </FormField>
              <FormField label="Check-in" required error={errors.checkIn}>
                <input type="date" required value={form.checkIn} onChange={(e) => setForm((p) => ({ ...p, checkIn: e.target.value }))} />
              </FormField>
              <FormField label="Check-out" required error={errors.checkOut}>
                <input type="date" required min={form.checkIn || undefined} value={form.checkOut} onChange={(e) => setForm((p) => ({ ...p, checkOut: e.target.value }))} />
                <span className="field-hint">Same as check-in for a one-day booking</span>
              </FormField>
            </div>
            <FormActions onCancel={() => {}} submitLabel="Confirm Booking" />
          </form>
        </section>
      )}
    </PageShell>
  )
}

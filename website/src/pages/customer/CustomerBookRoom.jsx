import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useStore } from '../../context/StoreContext'
import { PageShell, SectionHeader } from '../../components/UI'
import { FormActions, FormField } from '../../components/FormFields'
import { formatDisplayDate } from '../../utils/helpers'

const ROOMS = ['Standard 201 — ₹4,500/night', 'Deluxe 302 — ₹7,500/night', 'Suite 501 — ₹12,000/night']

export default function CustomerBookRoom() {
  const { user } = useAuth()
  const store = useStore()
  const [form, setForm] = useState({ room: 'Standard 201', checkIn: '', checkOut: '' })
  const [booked, setBooked] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    store.customerBookRoom({
      guest: user.name,
      room: form.room.split(' —')[0],
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
              <FormField label="Room Type" full>
                <select value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))}>
                  {ROOMS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </FormField>
              <FormField label="Check-in" required><input type="date" required value={form.checkIn} onChange={(e) => setForm((p) => ({ ...p, checkIn: e.target.value }))} /></FormField>
              <FormField label="Check-out" required>
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

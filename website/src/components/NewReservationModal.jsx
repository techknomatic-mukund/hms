import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { formatDisplayDate } from '../utils/helpers'

const BOOKING_SOURCES = ['Walk-in', 'OTA', 'Corporate', 'Phone', 'Email', 'Travel Agent']
const ROOM_TYPES = ['Standard 201', 'Standard 204', 'Deluxe 302', 'Deluxe 305', 'Suite 501', 'Suite 502']

const getEmpty = (defaultSource = 'Walk-in') => ({
  guest: '',
  source: defaultSource,
  room: 'Standard 201',
  checkIn: '',
  checkOut: '',
})

export function nextReservationId(existing) {
  const nums = existing.map((r) => parseInt(r.id.replace('RES-', ''), 10))
  const max = nums.length ? Math.max(...nums) : 1042
  return `RES-${max + 1}`
}

export default function NewReservationModal({ open, onClose, onSubmit, defaultSource = 'Walk-in' }) {
  const [form, setForm] = useState(getEmpty(defaultSource))
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm(getEmpty(defaultSource))
      setErrors({})
    }
  }, [open, defaultSource])

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const setFieldErrors = (next) => {
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const validate = () => {
    const next = {}
    if (!form.guest.trim()) next.guest = 'Guest name is required'
    if (!form.checkIn) next.checkIn = 'Check-in date is required'
    if (!form.checkOut) next.checkOut = 'Check-out date is required'
    if (form.checkIn && form.checkOut && form.checkOut <= form.checkIn) {
      next.checkOut = 'Check-out must be after check-in'
    }
    return setFieldErrors(next)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      guest: form.guest.trim(),
      source: form.source,
      room: form.room,
      checkIn: formatDisplayDate(form.checkIn),
      checkOut: formatDisplayDate(form.checkOut),
      status: 'Confirmed',
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="New Reservation">
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Guest Name" required error={errors.guest} full>
            <input
              type="text"
              value={form.guest}
              placeholder="e.g. Rajesh Kumar"
              onChange={(e) => update('guest', e.target.value)}
            />
          </FormField>
          <FormField label="Booking Source" required>
            <select value={form.source} onChange={(e) => update('source', e.target.value)}>
              {BOOKING_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Room" required>
            <select value={form.room} onChange={(e) => update('room', e.target.value)}>
              {ROOM_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </FormField>
          <FormField label="Check-in Date" required error={errors.checkIn}>
            <input type="date" value={form.checkIn} onChange={(e) => update('checkIn', e.target.value)} />
          </FormField>
          <FormField label="Check-out Date" required error={errors.checkOut}>
            <input
              type="date"
              value={form.checkOut}
              min={form.checkIn || undefined}
              onChange={(e) => update('checkOut', e.target.value)}
            />
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel="Add Reservation" />
      </form>
    </Modal>
  )
}

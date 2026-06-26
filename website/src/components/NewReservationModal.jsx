import { useEffect, useMemo, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { formatDisplayDate } from '../utils/helpers'
import { ROOM_OPTIONS, getRoomBookingConflicts, roomConflictLabel } from '../utils/reservationHelpers'

const BOOKING_SOURCES = ['Walk-in', 'OTA', 'Corporate', 'Phone', 'Email', 'Travel Agent']

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

export default function NewReservationModal({ open, onClose, onSubmit, defaultSource = 'Walk-in', editItem = null, reservations = [] }) {
  const [form, setForm] = useState(getEmpty(defaultSource))
  const [errors, setErrors] = useState({})

  const roomConflicts = useMemo(
    () => getRoomBookingConflicts(reservations, form.checkIn, form.checkOut, editItem?.id),
    [reservations, form.checkIn, form.checkOut, editItem?.id],
  )

  const datesReady = form.checkIn && form.checkOut && form.checkOut >= form.checkIn

  useEffect(() => {
    if (!open) return
    if (editItem) {
      setForm({
        guest: editItem.guest,
        source: editItem.source,
        room: editItem.room,
        checkIn: '',
        checkOut: '',
        status: editItem.status,
      })
    } else {
      setForm(getEmpty(defaultSource))
    }
    setErrors({})
  }, [open, defaultSource, editItem])

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
    if (form.checkIn && form.checkOut && form.checkOut < form.checkIn) {
      next.checkOut = 'Check-out cannot be before check-in'
    }
    if (datesReady && roomConflicts[form.room]) {
      next.room = roomConflictLabel(roomConflicts[form.room][0])
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
      rooms: [form.room],
      checkIn: form.checkIn ? formatDisplayDate(form.checkIn) : editItem?.checkIn,
      checkOut: form.checkOut ? formatDisplayDate(form.checkOut) : editItem?.checkOut,
      checkInIso: form.checkIn || editItem?.checkInIso,
      checkOutIso: form.checkOut || editItem?.checkOutIso,
      status: editItem?.status || 'Confirmed',
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Reservation' : 'New Reservation'}>
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
          <FormField label="Room" required error={errors.room}>
            <select value={form.room} onChange={(e) => update('room', e.target.value)}>
              {ROOM_OPTIONS.map((r) => {
                const conflict = datesReady ? roomConflicts[r]?.[0] : null
                return (
                  <option key={r} value={r} disabled={Boolean(conflict)}>
                    {r}{conflict ? ' — This room is booked on that day' : ''}
                  </option>
                )
              })}
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
            <span className="field-hint">Same as check-in for a one-day booking</span>
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update Reservation' : 'Add Reservation'} />
      </form>
    </Modal>
  )
}

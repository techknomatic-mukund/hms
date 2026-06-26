import { useEffect, useMemo, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { formatDisplayDate } from '../utils/helpers'
import { BOOKING_SOURCES, ROOM_OPTIONS, getRoomBookingConflicts, roomConflictLabel } from '../utils/reservationHelpers'

const emptyForm = {
  guest: '', source: 'Walk-in', rooms: ['Standard 201'],
  checkIn: '', checkOut: '', status: 'Confirmed', notes: '',
}

export default function ReservationModal({ open, onClose, onSubmit, editItem = null, reservations = [] }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [multiRoom, setMultiRoom] = useState(false)

  const roomConflicts = useMemo(
    () => getRoomBookingConflicts(reservations, form.checkIn, form.checkOut, editItem?.id),
    [reservations, form.checkIn, form.checkOut, editItem?.id],
  )

  const datesReady = form.checkIn && form.checkOut && form.checkOut >= form.checkIn

  useEffect(() => {
    if (!open) return
    if (editItem) {
      const rooms = editItem.rooms?.length ? editItem.rooms : [editItem.room]
      setForm({
        guest: editItem.guest,
        source: editItem.source,
        rooms,
        checkIn: editItem.checkInIso || '',
        checkOut: editItem.checkOutIso || '',
        status: editItem.status,
        notes: editItem.notes || '',
      })
      setMultiRoom(rooms.length > 1)
    } else {
      setForm(emptyForm)
      setMultiRoom(false)
    }
    setErrors({})
  }, [open, editItem])

  const toggleRoom = (room) => {
    if (datesReady && roomConflicts[room]) return
    setForm((prev) => {
      const has = prev.rooms.includes(room)
      const rooms = has ? prev.rooms.filter((r) => r !== room) : [...prev.rooms, room]
      return { ...prev, rooms: rooms.length ? rooms : [room] }
    })
  }

  const validate = () => {
    const next = {}
    if (!form.guest.trim()) next.guest = 'Guest name is required'
    if (!form.checkIn) next.checkIn = 'Check-in is required'
    if (!form.checkOut) next.checkOut = 'Check-out is required'
    if (form.checkIn && form.checkOut && form.checkOut < form.checkIn) next.checkOut = 'Check-out cannot be before check-in'
    if (!form.rooms.length) next.rooms = 'Select at least one room'
    if (datesReady) {
      const booked = form.rooms.filter((room) => roomConflicts[room])
      if (booked.length) {
        const first = roomConflicts[booked[0]][0]
        next.rooms = `${booked[0]}: ${roomConflictLabel(first)}`
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      guest: form.guest.trim(),
      source: form.source,
      rooms: form.rooms,
      room: form.rooms[0],
      checkIn: form.checkIn ? formatDisplayDate(form.checkIn) : editItem?.checkIn,
      checkOut: form.checkOut ? formatDisplayDate(form.checkOut) : editItem?.checkOut,
      checkInIso: form.checkIn || editItem?.checkInIso,
      checkOutIso: form.checkOut || editItem?.checkOutIso,
      status: form.status,
      notes: form.notes.trim(),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Reservation' : 'New Reservation'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Guest Name" required error={errors.guest} full>
            <input type="text" value={form.guest} placeholder="Guest or group name" onChange={(e) => setForm((p) => ({ ...p, guest: e.target.value }))} />
          </FormField>

          <FormField label="Booking Source" required>
            <select value={form.source} onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))}>
              {BOOKING_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>

          <FormField label="Status">
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
              {['Confirmed', 'Checked In', 'Checked Out', 'Cancelled', 'Waitlist'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </FormField>

          <FormField label="Check-in Date" required error={errors.checkIn}>
            <input type="date" value={form.checkIn} onChange={(e) => setForm((p) => ({ ...p, checkIn: e.target.value }))} />
          </FormField>

          <FormField label="Check-out Date" required error={errors.checkOut}>
            <input type="date" value={form.checkOut} min={form.checkIn || undefined} onChange={(e) => setForm((p) => ({ ...p, checkOut: e.target.value }))} />
            <span className="field-hint">Same as check-in for a one-day booking</span>
          </FormField>

          <div className="form-field form-field-full">
            <span>Multi-Room Booking {multiRoom && <em className="multi-room-badge">Group booking</em>}</span>
            <label className="tax-option">
              <input type="checkbox" checked={multiRoom} onChange={(e) => setMultiRoom(e.target.checked)} />
              Reserve multiple rooms under one booking
            </label>
            <div className="room-check-grid">
              {ROOM_OPTIONS.map((room) => {
                const conflict = datesReady ? roomConflicts[room]?.[0] : null
                const unavailable = Boolean(conflict)
                return (
                  <label
                    key={room}
                    className={`room-check${form.rooms.includes(room) ? ' selected' : ''}${unavailable ? ' unavailable' : ''}`}
                    title={conflict ? roomConflictLabel(conflict) : undefined}
                  >
                    <input
                      type={multiRoom ? 'checkbox' : 'radio'}
                      name="room"
                      checked={form.rooms.includes(room)}
                      disabled={unavailable}
                      onChange={() => {
                        if (unavailable) return
                        if (multiRoom) toggleRoom(room)
                        else setForm((p) => ({ ...p, rooms: [room] }))
                      }}
                    />
                    <span className="room-check-label">
                      {room}
                      {unavailable && <em className="room-booked-msg">This room is booked on that day</em>}
                    </span>
                  </label>
                )
              })}
            </div>
            {errors.rooms && <em className="form-error">{errors.rooms}</em>}
          </div>

          <FormField label="Reservation Notes" full>
            <textarea
              rows={3}
              value={form.notes}
              placeholder="Airport pickup, VIP status, extra bed, special occasions..."
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            />
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update Reservation' : 'Create Reservation'} />
      </form>
    </Modal>
  )
}

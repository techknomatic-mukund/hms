import { useEffect, useMemo, useState } from 'react'
import { Modal } from './UI'
import { FormField } from './FormFields'
import FormSection from './FormSection'
import { formatDisplayDate, todayISO } from '../utils/helpers'
import {
  ROOM_TYPES,
  ROOMS_BY_TYPE,
  getRoomBookingConflicts,
  roomConflictLabel,
  roomTypeFromRoom,
} from '../utils/reservationHelpers'

const NATIONALITIES = [
  'Indian', 'American', 'British', 'Canadian', 'Australian', 'German', 'French', 'Japanese', 'Chinese', 'Other',
]

const PAYMENT_METHODS = ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Corporate Credit']

const getEmpty = () => ({
  guest: '',
  nationality: 'Indian',
  passportNumber: '',
  mobile: '',
  email: '',
  checkIn: todayISO(),
  checkOut: '',
  adults: '1',
  children: '0',
  roomType: 'Standard',
  room: '',
  advanceAmount: '',
  paymentMethod: 'Card',
})

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  const room = editItem.room || editItem.rooms?.[0] || ''
  return {
    guest: editItem.guest || '',
    nationality: editItem.nationality || 'Indian',
    passportNumber: editItem.passportNumber || '',
    mobile: editItem.mobile || '',
    email: editItem.email || '',
    checkIn: editItem.checkInIso || '',
    checkOut: editItem.checkOutIso || '',
    adults: String(editItem.adults ?? 1),
    children: String(editItem.children ?? 0),
    roomType: roomTypeFromRoom(room),
    room,
    advanceAmount: editItem.deposit?.amount || '',
    paymentMethod: editItem.deposit?.method || 'Card',
  }
}

export default function ReservationModal({ open, onClose, onSubmit, editItem = null, reservations = [] }) {
  const [form, setForm] = useState(getEmpty())
  const [errors, setErrors] = useState({})
  const isEdit = !!editItem

  useEffect(() => {
    if (!open) return
    setForm(itemToForm(editItem))
    setErrors({})
  }, [open, editItem])

  const datesReady = form.checkIn && form.checkOut && form.checkOut >= form.checkIn

  const roomConflicts = useMemo(
    () => getRoomBookingConflicts(reservations, form.checkIn, form.checkOut, editItem?.id),
    [reservations, form.checkIn, form.checkOut, editItem?.id],
  )

  const availableRooms = useMemo(() => {
    const rooms = ROOMS_BY_TYPE[form.roomType] || []
    return rooms.map((room) => ({
      room,
      unavailable: datesReady ? Boolean(roomConflicts[room]) : false,
      conflict: datesReady ? roomConflicts[room]?.[0] : null,
    }))
  }, [form.roomType, datesReady, roomConflicts])

  useEffect(() => {
    if (!open) return
    const options = availableRooms.filter((r) => !r.unavailable).map((r) => r.room)
    setForm((prev) => {
      if (prev.room && options.includes(prev.room)) return prev
      return { ...prev, room: options[0] || '' }
    })
  }, [form.roomType, form.checkIn, form.checkOut, open, availableRooms])

  const update = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'roomType') next.room = ''
      return next
    })
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.guest.trim()) next.guest = 'Guest name is required'
    if (!form.checkIn) next.checkIn = 'Check-in is required'
    if (!form.checkOut) next.checkOut = 'Check-out is required'
    if (form.checkIn && form.checkOut && form.checkOut < form.checkIn) {
      next.checkOut = 'Check-out cannot be before check-in'
    }
    if (!form.adults || Number(form.adults) < 1) next.adults = 'At least 1 adult is required'
    if (!form.room) next.room = 'Select an available room'
    if (form.room && datesReady && roomConflicts[form.room]) {
      next.room = roomConflictLabel(roomConflicts[form.room][0])
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const buildPayload = (status) => {
    const advance = parseFloat(form.advanceAmount) || 0
    return {
      guest: form.guest.trim(),
      nationality: form.nationality,
      passportNumber: form.passportNumber.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      source: editItem?.source || 'Walk-in',
      rooms: [form.room],
      room: form.room,
      checkIn: form.checkIn ? formatDisplayDate(form.checkIn) : editItem?.checkIn,
      checkOut: form.checkOut ? formatDisplayDate(form.checkOut) : editItem?.checkOut,
      checkInIso: form.checkIn || editItem?.checkInIso,
      checkOutIso: form.checkOut || editItem?.checkOutIso,
      adults: parseInt(form.adults, 10) || 1,
      children: parseInt(form.children, 10) || 0,
      roomType: form.roomType,
      status,
      paymentStatus: advance > 0 && status === 'Confirmed' ? 'Partial' : 'Pending',
      folioBalance: advance > 0 ? advance * 4 : 0,
      deposit: {
        amount: form.advanceAmount,
        method: form.paymentMethod,
        status: advance > 0 && status === 'Confirmed' ? 'Collected' : 'Pending',
        collectedOn: advance > 0 && status === 'Confirmed' ? todayISO() : undefined,
      },
      notes: [
        form.passportNumber && `Passport: ${form.passportNumber.trim()}`,
        form.nationality && `Nationality: ${form.nationality}`,
      ].filter(Boolean).join(' | ') || editItem?.notes || '',
    }
  }

  const handleSubmit = (status) => (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(buildPayload(status))
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Booking' : 'New Booking'} wide>
      <form className="entity-form" onSubmit={handleSubmit('Confirmed')}>
        <FormSection title="Guest Information">
          <div className="form-grid">
            <FormField label="Guest Name" required error={errors.guest} full>
              <input type="text" value={form.guest} onChange={(e) => update('guest', e.target.value)} />
            </FormField>
            <FormField label="Nationality">
              <select value={form.nationality} onChange={(e) => update('nationality', e.target.value)}>
                {NATIONALITIES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </FormField>
            <FormField label="Passport Number">
              <input type="text" value={form.passportNumber} onChange={(e) => update('passportNumber', e.target.value)} />
            </FormField>
            <FormField label="Mobile">
              <input type="tel" value={form.mobile} placeholder="+91..." onChange={(e) => update('mobile', e.target.value)} />
            </FormField>
            <FormField label="Email" full>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Stay Details">
          <div className="form-grid">
            <FormField label="Check-In Date" required error={errors.checkIn}>
              <input type="date" value={form.checkIn} onChange={(e) => update('checkIn', e.target.value)} />
            </FormField>
            <FormField label="Check-Out Date" required error={errors.checkOut}>
              <input type="date" value={form.checkOut} min={form.checkIn || undefined} onChange={(e) => update('checkOut', e.target.value)} />
            </FormField>
            <FormField label="Adults" required error={errors.adults}>
              <input type="number" min="1" value={form.adults} onChange={(e) => update('adults', e.target.value)} />
            </FormField>
            <FormField label="Children">
              <input type="number" min="0" value={form.children} onChange={(e) => update('children', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Room Selection">
          <div className="form-grid">
            <FormField label="Room Type">
              <select value={form.roomType} onChange={(e) => update('roomType', e.target.value)}>
                {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Available Rooms" required error={errors.room}>
              <select value={form.room} onChange={(e) => update('room', e.target.value)}>
                <option value="">— Select room —</option>
                {availableRooms.map(({ room, unavailable, conflict }) => (
                  <option key={room} value={room} disabled={unavailable}>
                    {room}{unavailable ? ' (Booked)' : ''}{conflict ? ` — ${conflict.guest}` : ''}
                  </option>
                ))}
              </select>
              {!availableRooms.length && (
                <span className="field-hint">No rooms for this type</span>
              )}
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Payment">
          <div className="form-grid">
            <FormField label="Advance Amount">
              <input type="number" min="0" value={form.advanceAmount} placeholder="₹" onChange={(e) => update('advanceAmount', e.target.value)} />
            </FormField>
            <FormField label="Payment Method">
              <select value={form.paymentMethod} onChange={(e) => update('paymentMethod', e.target.value)}>
                {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-secondary" onClick={handleSubmit('Tentative')}>
            Save Booking
          </button>
          <button type="submit" className="btn btn-primary">
            Confirm Booking
          </button>
        </div>
      </form>
    </Modal>
  )
}

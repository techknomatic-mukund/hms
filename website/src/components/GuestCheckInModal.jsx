import { useEffect, useMemo, useState } from 'react'
import { Modal } from './UI'
import { FormField } from './FormFields'
import FormSection from './FormSection'
import {
  ROOM_OPTIONS,
  getRoomBookingConflicts,
  normalizeReservation,
  roomConflictLabel,
  roomMaxOccupancy,
} from '../utils/reservationHelpers'

const emptySearch = { bookingNumber: '', guestName: '', passport: '' }

function reservationFromSearch(reservations, search) {
  const booking = search.bookingNumber.trim().toLowerCase()
  const guest = search.guestName.trim().toLowerCase()
  const passport = search.passport.trim().toLowerCase()
  if (!booking && !guest && !passport) return null

  return reservations.find((r) => {
    const matchBooking = booking && r.id.toLowerCase().includes(booking)
    const matchGuest = guest && r.guest.toLowerCase().includes(guest)
    const matchPassport = passport && (
      (r.passportNumber || '').toLowerCase().includes(passport)
      || (r.notes || '').toLowerCase().includes(passport)
    )
    return matchBooking || matchGuest || matchPassport
  }) || null
}

function reservationToGuestForm(res) {
  const norm = normalizeReservation(res)
  return {
    guest: norm.guest || '',
    nationality: norm.nationality || 'Indian',
    passportNumber: norm.passportNumber || '',
    mobile: norm.mobile || '',
    email: norm.email || '',
    checkIn: norm.checkInIso || '',
    checkOut: norm.checkOutIso || '',
    adults: String(norm.adults ?? 1),
    children: String(norm.children ?? 0),
    room: norm.room || '',
    documents: {
      passport: norm.documents?.passport || '',
      visa: norm.documents?.visa || '',
      idCard: norm.documents?.idCard || '',
    },
  }
}

export default function GuestCheckInModal({
  open,
  onClose,
  reservation = null,
  reservations = [],
  maintenanceTickets = [],
  onCheckIn,
  onUpdate,
}) {
  const [search, setSearch] = useState(emptySearch)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [actionMessage, setActionMessage] = useState('')

  useEffect(() => {
    if (!open) return
    if (reservation) {
      setSelected(reservation)
      setSearch({
        bookingNumber: reservation.id,
        guestName: reservation.guest,
        passport: reservation.passportNumber || '',
      })
      setForm(reservationToGuestForm(reservation))
    } else {
      setSelected(null)
      setSearch(emptySearch)
      setForm(null)
    }
    setErrors({})
    setActionMessage('')
  }, [open, reservation])

  const occupancy = useMemo(() => {
    if (!form) return 1
    return (parseInt(form.adults, 10) || 0) + (parseInt(form.children, 10) || 0) || 1
  }, [form])

  const maintenanceRooms = useMemo(() => {
    const set = new Set()
    maintenanceTickets.forEach((t) => {
      if (t.room && t.room !== 'Common Area' && ['Open', 'In Progress'].includes(t.status)) {
        set.add(t.room)
      }
    })
    return set
  }, [maintenanceTickets])

  const roomConflicts = useMemo(() => {
    if (!form?.checkIn || !form?.checkOut) return {}
    return getRoomBookingConflicts(reservations, form.checkIn, form.checkOut, selected?.id)
  }, [reservations, form?.checkIn, form?.checkOut, selected?.id])

  const availableRooms = useMemo(() => ROOM_OPTIONS.map((room) => {
    const maxOcc = roomMaxOccupancy(room)
    const conflict = roomConflicts[room]?.[0]
    const underMaintenance = maintenanceRooms.has(room)
    const fitsOccupancy = maxOcc >= occupancy
    const unavailable = Boolean(conflict) || underMaintenance || !fitsOccupancy
    let reason = 'Available'
    if (!fitsOccupancy) reason = `Max ${maxOcc} guests`
    else if (underMaintenance) reason = 'Under maintenance'
    else if (conflict) reason = 'Booked'
    return { room, maxOcc, unavailable, reason, conflict }
  }), [roomConflicts, maintenanceRooms, occupancy])

  const runSearch = () => {
    const found = reservationFromSearch(reservations, search)
    if (!found) {
      setErrors({ search: 'No reservation found for the given search' })
      setSelected(null)
      setForm(null)
      return
    }
    setErrors({})
    setSelected(found)
    setForm(reservationToGuestForm(found))
    setActionMessage(`Loaded booking ${found.id}`)
  }

  const updateDoc = (key, file) => {
    setForm((prev) => ({
      ...prev,
      documents: { ...prev.documents, [key]: file?.name || '' },
    }))
  }

  const validateCheckIn = () => {
    const next = {}
    if (!selected) next.search = 'Select a reservation first'
    if (!form?.room) next.room = 'Select a room for check-in'
    if (form?.room) {
      const pick = availableRooms.find((r) => r.room === form.room)
      if (pick?.unavailable) next.room = `Room not available (${pick.reason})`
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const saveGuestDetails = (historyNote) => {
    if (!selected || !form) return
    onUpdate(selected.id, {
      guest: form.guest.trim(),
      nationality: form.nationality,
      passportNumber: form.passportNumber.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      adults: parseInt(form.adults, 10) || 1,
      children: parseInt(form.children, 10) || 0,
      room: form.room,
      rooms: [form.room],
      documents: form.documents,
      historyNote,
    })
  }

  const handleCheckIn = () => {
    if (!validateCheckIn()) return
    saveGuestDetails(`Checked in to ${form.room}`)
    if (selected.status === 'Confirmed' || selected.status === 'Tentative') {
      onCheckIn(selected.id)
    }
    onClose()
  }

  const handlePrintRegistration = () => {
    if (!selected || !form) return
    saveGuestDetails('Registration card printed')
    setActionMessage(`Registration card printed for ${form.guest} — Room ${form.room}`)
  }

  const handleKeyCard = () => {
    if (!selected || !form?.room) {
      setErrors({ room: 'Select a room before generating key card' })
      return
    }
    saveGuestDetails(`Key card generated for ${form.room}`)
    setActionMessage(`Key card generated for ${form.room}`)
  }

  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} title="Guest Check-In" wide>
      <div className="entity-form">
        <FormSection title="Reservation Search" subtitle="Search by booking number, guest name or passport">
          <div className="form-grid">
            <FormField label="Booking Number">
              <input
                type="text"
                value={search.bookingNumber}
                placeholder="RES-1042"
                onChange={(e) => setSearch((p) => ({ ...p, bookingNumber: e.target.value }))}
              />
            </FormField>
            <FormField label="Guest Name">
              <input
                type="text"
                value={search.guestName}
                onChange={(e) => setSearch((p) => ({ ...p, guestName: e.target.value }))}
              />
            </FormField>
            <FormField label="Passport">
              <input
                type="text"
                value={search.passport}
                onChange={(e) => setSearch((p) => ({ ...p, passport: e.target.value }))}
              />
            </FormField>
          </div>
          {(errors.search) && <em className="form-error">{errors.search}</em>}
          <button type="button" className="btn btn-secondary btn-sm fo-search-btn" onClick={runSearch}>
            Search Reservation
          </button>
        </FormSection>

        {form && selected && (
          <>
            <FormSection title="Guest Information" subtitle="Auto populated from reservation">
              <div className="form-grid">
                <FormField label="Guest Name" full>
                  <input type="text" value={form.guest} readOnly className="readonly-field" />
                </FormField>
                <FormField label="Nationality">
                  <input type="text" value={form.nationality} readOnly className="readonly-field" />
                </FormField>
                <FormField label="Passport Number">
                  <input type="text" value={form.passportNumber} readOnly className="readonly-field" />
                </FormField>
                <FormField label="Mobile">
                  <input type="text" value={form.mobile || '—'} readOnly className="readonly-field" />
                </FormField>
                <FormField label="Email" full>
                  <input type="text" value={form.email || '—'} readOnly className="readonly-field" />
                </FormField>
                <FormField label="Check-In">
                  <input type="text" value={selected.checkIn} readOnly className="readonly-field" />
                </FormField>
                <FormField label="Check-Out">
                  <input type="text" value={selected.checkOut} readOnly className="readonly-field" />
                </FormField>
                <FormField label="Adults">
                  <input type="text" value={form.adults} readOnly className="readonly-field" />
                </FormField>
                <FormField label="Children">
                  <input type="text" value={form.children} readOnly className="readonly-field" />
                </FormField>
              </div>
            </FormSection>

            <FormSection
              title="Room Assignment"
              subtitle={`Guest occupancy: ${occupancy} — showing rooms by capacity (1 / 2 / 3+ guests)`}
            >
              <FormField label="Select Room" required error={errors.room} full>
                <select
                  value={form.room}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, room: e.target.value }))
                    setErrors((prev) => ({ ...prev, room: '' }))
                  }}
                >
                  <option value="">— Select available room —</option>
                  {availableRooms.map(({ room, maxOcc, unavailable, reason, conflict }) => (
                    <option key={room} value={room} disabled={unavailable}>
                      {room} (max {maxOcc} guests) — {unavailable ? reason : 'Available'}
                      {conflict ? ` — ${roomConflictLabel(conflict)}` : ''}
                    </option>
                  ))}
                </select>
              </FormField>
            </FormSection>

            <FormSection title="Upload Documents">
              <div className="fo-doc-grid">
                <FormField label="Passport">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => updateDoc('passport', e.target.files?.[0])} />
                  {form.documents.passport && <span className="field-hint">{form.documents.passport}</span>}
                </FormField>
                <FormField label="Visa">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => updateDoc('visa', e.target.files?.[0])} />
                  {form.documents.visa && <span className="field-hint">{form.documents.visa}</span>}
                </FormField>
                <FormField label="ID Card">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => updateDoc('idCard', e.target.files?.[0])} />
                  {form.documents.idCard && <span className="field-hint">{form.documents.idCard}</span>}
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Actions">
              {actionMessage && <p className="save-toast">{actionMessage}</p>}
              <div className="fo-checkin-actions">
                <button type="button" className="btn btn-primary" onClick={handleCheckIn}>
                  Check-In
                </button>
                <button type="button" className="btn btn-secondary" onClick={handlePrintRegistration}>
                  Print Registration Card
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleKeyCard}>
                  Generate Key Card
                </button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Close
                </button>
              </div>
            </FormSection>
          </>
        )}
      </div>
    </Modal>
  )
}

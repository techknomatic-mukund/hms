import { useEffect, useMemo, useState } from 'react'
import { Modal, Badge } from './UI'
import { FormActions, FormField } from './FormFields'
import { formatDisplayDate } from '../utils/helpers'
import { ROOM_OPTIONS, getRoomBookingConflicts, roomConflictLabel } from '../utils/reservationHelpers'

const BOOKING_SOURCES = ['Walk-in', 'OTA', 'Corporate', 'Phone', 'Email', 'Travel Agent']
const FOLIO_TYPES = ['Room Only', 'Room + F&B', 'Full Folio']
const DEPOSIT_METHODS = ['Cash', 'Card', 'UPI', 'Corporate Credit']
const DEPOSIT_STATUSES = ['Pending', 'Collected', 'Waived']
const SERVICE_REQUEST_OPTIONS = [
  'Airport Pickup', 'Late Checkout', 'Extra Bed', 'Early Check-in',
  'Room Decoration', 'Newspaper', 'Wheelchair Access',
]

const GUEST_PREFERENCE_HINTS = {
  Gold: 'High floor, late checkout, English newspaper',
  Silver: 'Quiet room, twin beds preferred',
  Platinum: 'Suite upgrade, VIP amenity, airport transfer',
}

const getEmpty = (defaultSource = 'Walk-in') => ({
  guest: '',
  source: defaultSource,
  room: 'Standard 201',
  checkIn: '',
  checkOut: '',
  folioOpen: true,
  folioType: 'Full Folio',
  folioNote: '',
  guestPreferences: '',
  depositAmount: '',
  depositMethod: 'Card',
  depositStatus: 'Pending',
  serviceRequests: '',
})

function FormSection({ title, subtitle, children }) {
  return (
    <div className="form-section">
      <div className="form-section-head">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function roomStatusVariant(status) {
  if (status === 'Vacant') return 'success'
  if (status === 'Occupied') return 'warning'
  return 'default'
}

export function nextReservationId(existing) {
  const nums = existing.map((r) => parseInt(r.id.replace('RES-', ''), 10))
  const max = nums.length ? Math.max(...nums) : 1042
  return `RES-${max + 1}`
}

export default function NewReservationModal({
  open,
  onClose,
  onSubmit,
  defaultSource = 'Walk-in',
  editItem = null,
  reservations = [],
  rooms = [],
  crmCustomers = [],
}) {
  const [form, setForm] = useState(getEmpty(defaultSource))
  const [errors, setErrors] = useState({})

  const roomConflicts = useMemo(
    () => getRoomBookingConflicts(reservations, form.checkIn, form.checkOut, editItem?.id),
    [reservations, form.checkIn, form.checkOut, editItem?.id],
  )

  const datesReady = form.checkIn && form.checkOut && form.checkOut >= form.checkIn

  const guestProfile = useMemo(() => {
    if (!form.guest.trim()) return null
    const name = form.guest.trim().toLowerCase()
    return crmCustomers.find(
      (c) => c.name.toLowerCase() === name
        || c.name.toLowerCase().includes(name)
        || name.includes(c.name.toLowerCase()),
    )
  }, [form.guest, crmCustomers])

  const selectedRoomNumber = form.room.split(' ').pop()

  useEffect(() => {
    if (!open) return
    if (editItem) {
      setForm({
        guest: editItem.guest,
        source: editItem.source,
        room: editItem.room,
        checkIn: editItem.checkInIso || '',
        checkOut: editItem.checkOutIso || '',
        status: editItem.status,
        folioOpen: editItem.folio?.openOnCheckIn ?? true,
        folioType: editItem.folio?.type || 'Full Folio',
        folioNote: editItem.folio?.note || '',
        guestPreferences: editItem.guestPreferences || '',
        depositAmount: editItem.deposit?.amount || '',
        depositMethod: editItem.deposit?.method || 'Card',
        depositStatus: editItem.deposit?.status || 'Pending',
        serviceRequests: editItem.serviceRequests || '',
      })
    } else {
      setForm(getEmpty(defaultSource))
    }
    setErrors({})
  }, [open, defaultSource, editItem])

  useEffect(() => {
    if (!guestProfile || editItem) return
    const hint = GUEST_PREFERENCE_HINTS[guestProfile.loyalty]
    if (hint && !form.guestPreferences) {
      setForm((prev) => ({ ...prev, guestPreferences: hint }))
    }
  }, [guestProfile, editItem, form.guestPreferences])

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const toggleServiceRequest = (request) => {
    setForm((prev) => {
      const items = prev.serviceRequests
        ? prev.serviceRequests.split(', ').filter(Boolean)
        : []
      const next = items.includes(request)
        ? items.filter((r) => r !== request)
        : [...items, request]
      return { ...prev, serviceRequests: next.join(', ') }
    })
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
    if (form.depositStatus === 'Collected' && !form.depositAmount) {
      next.depositAmount = 'Enter deposit amount when marked as collected'
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
      folio: {
        openOnCheckIn: form.folioOpen,
        type: form.folioType,
        note: form.folioNote.trim(),
      },
      guestPreferences: form.guestPreferences.trim(),
      guestHistory: guestProfile
        ? { loyalty: guestProfile.loyalty, visits: guestProfile.visits, lastStay: guestProfile.lastStay }
        : null,
      deposit: {
        amount: form.depositAmount,
        method: form.depositMethod,
        status: form.depositStatus,
      },
      serviceRequests: form.serviceRequests.trim(),
      notes: [form.folioNote, form.guestPreferences, form.serviceRequests].filter(Boolean).join(' | '),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Reservation' : 'New Reservation'} wide>
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

        <FormSection title="Guest Folio" subtitle="Open and configure the guest billing folio for this stay">
          <div className="form-grid">
            <div className="form-field form-field-full">
              <label className="tax-option">
                <input type="checkbox" checked={form.folioOpen} onChange={(e) => update('folioOpen', e.target.checked)} />
                Open guest folio on check-in
              </label>
            </div>
            <FormField label="Folio Type">
              <select value={form.folioType} onChange={(e) => update('folioType', e.target.value)}>
                {FOLIO_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Folio Notes" full>
              <input
                type="text"
                value={form.folioNote}
                placeholder="Corporate billing, split folio, package inclusions..."
                onChange={(e) => update('folioNote', e.target.value)}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Room Status Board" subtitle="Live room availability — selected room highlighted">
          <div className="room-status-board">
            {rooms.map((rm) => {
              const label = `${rm.type} ${rm.number}`
              const isSelected = rm.number === selectedRoomNumber
              return (
                <div key={rm.id} className={`room-status-card${isSelected ? ' selected' : ''}`}>
                  <strong>{label}</strong>
                  <Badge variant={roomStatusVariant(rm.status)}>{rm.status}</Badge>
                  <span className="room-status-floor">Floor {rm.floor}</span>
                </div>
              )
            })}
          </div>
        </FormSection>

        <FormSection title="Guest History & Preferences" subtitle="CRM lookup and stay preferences for returning guests">
          {guestProfile ? (
            <div className="guest-history-panel">
              <div className="guest-history-meta">
                <span><strong>Loyalty:</strong> {guestProfile.loyalty}</span>
                <span><strong>Visits:</strong> {guestProfile.visits}</span>
                <span><strong>Last Stay:</strong> {guestProfile.lastStay}</span>
              </div>
            </div>
          ) : (
            <p className="field-hint guest-history-empty">Enter guest name to load CRM history (if available)</p>
          )}
          <FormField label="Guest Preferences" full>
            <textarea
              rows={2}
              value={form.guestPreferences}
              placeholder="Dietary needs, room type, pillow type, anniversary notes..."
              onChange={(e) => update('guestPreferences', e.target.value)}
            />
          </FormField>
        </FormSection>

        <FormSection title="Deposit Management" subtitle="Advance deposit collection before or during booking">
          <div className="form-grid">
            <FormField label="Deposit Amount (OMR)" error={errors.depositAmount}>
              <input
                type="number"
                min="0"
                value={form.depositAmount}
                placeholder="e.g. 5000"
                onChange={(e) => update('depositAmount', e.target.value)}
              />
            </FormField>
            <FormField label="Payment Method">
              <select value={form.depositMethod} onChange={(e) => update('depositMethod', e.target.value)}>
                {DEPOSIT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </FormField>
            <FormField label="Deposit Status">
              <select value={form.depositStatus} onChange={(e) => update('depositStatus', e.target.value)}>
                {DEPOSIT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Guest Requests / Service Requests" subtitle="Special instructions synced to housekeeping & add-on services">
          <div className="service-request-chips">
            {SERVICE_REQUEST_OPTIONS.map((req) => {
              const active = form.serviceRequests.split(', ').filter(Boolean).includes(req)
              return (
                <button
                  key={req}
                  type="button"
                  className={`chip-btn${active ? ' active' : ''}`}
                  onClick={() => toggleServiceRequest(req)}
                >
                  {req}
                </button>
              )
            })}
          </div>
          <FormField label="Additional Requests" full>
            <textarea
              rows={2}
              value={form.serviceRequests}
              placeholder="Select quick requests above or type custom requests..."
              onChange={(e) => update('serviceRequests', e.target.value)}
            />
          </FormField>
        </FormSection>

        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update Reservation' : 'Add Reservation'} />
      </form>
    </Modal>
  )
}

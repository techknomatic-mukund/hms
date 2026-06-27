import { useEffect, useMemo, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'
import { formatINR, formatTime12 } from '../utils/helpers'
import { ROOM_OPTIONS, findGuestForRoom } from '../utils/reservationHelpers'

export const ADDON_SERVICES = [
  { id: 'spa', label: 'Spa - Aromatherapy', price: 3500 },
  { id: 'gym', label: 'Gym - Personal Trainer', price: 1200 },
  { id: 'pool', label: 'Pool - Cabana', price: 2000 },
  { id: 'pickup', label: 'Airport Pickup', price: 1500 },
  { id: 'laundry', label: 'Laundry - Express', price: 850 },
  { id: 'health', label: 'Health Club - Steam', price: 900 },
]

export const MEMBERSHIP_OPTIONS = [
  { id: '', label: '— Select membership —', price: 0 },
  { id: 'monthly', label: 'Monthly Membership', price: 5000 },
  { id: 'quarterly', label: 'Quarterly Membership', price: 12000 },
  { id: 'annual', label: 'Annual Membership', price: 40000 },
]

const STATUSES = ['Booked', 'Active', 'Completed']

function resolveRoomValue(room) {
  if (!room) return ROOM_OPTIONS[0]
  if (room === 'Walk-In') return 'Walk-In'
  if (ROOM_OPTIONS.includes(room)) return room
  const byNumber = ROOM_OPTIONS.find((r) => r.split(' ').pop() === String(room))
  return byNumber || ROOM_OPTIONS[0]
}

function serviceIdFromLabel(label) {
  const found = ADDON_SERVICES.find((s) => s.label === label)
  return found?.id || ADDON_SERVICES[0].id
}

function membershipIdFromLabel(label) {
  if (!label) return ''
  const found = MEMBERSHIP_OPTIONS.find((m) => m.label === label)
  return found?.id || ''
}

const getEmpty = (reservations = []) => {
  const room = ROOM_OPTIONS[0]
  const guest = findGuestForRoom(reservations, room)
  return {
    guestType: 'inhouse',
    serviceId: ADDON_SERVICES[0].id,
    membershipId: '',
    guest: guest.guestName || '',
    room,
    time: '',
    status: 'Booked',
  }
}

function itemToForm(editItem, reservations) {
  if (!editItem) return getEmpty(reservations)

  const guestType = editItem.guestType || (editItem.room === 'Walk-In' ? 'walkin' : 'inhouse')
  const room = guestType === 'walkin' ? 'Walk-In' : resolveRoomValue(editItem.room)
  const guest = guestType === 'walkin'
    ? (editItem.guest || '')
    : (editItem.guest || findGuestForRoom(reservations, room).guestName || '')

  return {
    guestType,
    serviceId: serviceIdFromLabel(editItem.service),
    membershipId: membershipIdFromLabel(editItem.membership) || editItem.membershipId || '',
    guest,
    room,
    time: editItem.time?.includes('M') ? '' : editItem.time || '',
    status: editItem.status || 'Booked',
  }
}

export default function NewAddonBookingModal({
  open, onClose, onSubmit, editItem = null, reservations = [],
}) {
  const [form, setForm] = useState(getEmpty())
  const [errors, setErrors] = useState({})
  const isEdit = !!editItem
  const isWalkIn = form.guestType === 'walkin'

  useEffect(() => {
    if (!open) return
    setForm(itemToForm(editItem, reservations))
    setErrors({})
  }, [open, editItem, reservations])

  const selectedService = ADDON_SERVICES.find((s) => s.id === form.serviceId) || ADDON_SERVICES[0]
  const selectedMembership = MEMBERSHIP_OPTIONS.find((m) => m.id === form.membershipId) || MEMBERSHIP_OPTIONS[0]

  const amount = useMemo(
    () => selectedService.price + (selectedMembership?.price || 0),
    [selectedService, selectedMembership],
  )

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleGuestTypeChange = (guestType) => {
    if (guestType === 'walkin') {
      setForm((prev) => ({
        ...prev,
        guestType,
        room: 'Walk-In',
        guest: prev.guestType === 'walkin' ? prev.guest : '',
      }))
    } else {
      setForm((prev) => {
        const nextRoom = prev.room === 'Walk-In' ? ROOM_OPTIONS[0] : prev.room
        const nextGuest = findGuestForRoom(reservations, nextRoom)
        return {
          ...prev,
          guestType,
          room: nextRoom,
          guest: nextGuest.guestName || '',
        }
      })
    }
    setErrors({})
  }

  const handleRoomChange = (room) => {
    const guest = findGuestForRoom(reservations, room)
    setForm((prev) => ({
      ...prev,
      room,
      guest: guest.guestName || '',
    }))
    setErrors((prev) => ({ ...prev, room: '', guest: '' }))
  }

  const validate = () => {
    const next = {}
    if (isWalkIn) {
      if (!form.guest.trim()) next.guest = 'Guest name is required for walk-in'
    } else {
      if (!form.room || form.room === 'Walk-In') next.room = 'Room is required'
      if (!form.guest.trim()) next.guest = 'No checked-in guest for this room'
    }
    if (!form.membershipId && !form.serviceId) {
      next.membershipId = 'Select a membership or service'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const membershipLabel = selectedMembership?.id ? selectedMembership.label : ''
    const serviceLabel = selectedService.label

    onSubmit({
      guestType: form.guestType,
      guest: form.guest.trim(),
      room: isWalkIn ? 'Walk-In' : form.room,
      membership: membershipLabel,
      membershipId: form.membershipId,
      service: serviceLabel,
      time: form.time ? (form.time.includes('M') ? form.time : formatTime12(form.time)) : '—',
      amount: formatINR(amount),
      status: form.status,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Booking' : 'New Booking'} wide>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="service-type-toggle">
          <button
            type="button"
            className={!isWalkIn ? 'active' : ''}
            onClick={() => handleGuestTypeChange('inhouse')}
          >
            In-House Guest
          </button>
          <button
            type="button"
            className={isWalkIn ? 'active' : ''}
            onClick={() => handleGuestTypeChange('walkin')}
          >
            Visitor / Walk-In
          </button>
        </div>

        <FormSection
          title="Guest & Room"
          subtitle={isWalkIn ? 'Enter walk-in visitor details' : 'Guest name auto-fills from active reservation'}
        >
          <div className="form-grid">
            {!isWalkIn && (
              <FormField label="Room" required error={errors.room}>
                <select value={form.room} onChange={(e) => handleRoomChange(e.target.value)}>
                  {ROOM_OPTIONS.map((room) => <option key={room} value={room}>{room}</option>)}
                </select>
              </FormField>
            )}
            <FormField label="Guest Name" required error={errors.guest} full={isWalkIn}>
              <input
                type="text"
                value={form.guest || (isWalkIn ? '' : '—')}
                readOnly={!isWalkIn}
                className={!isWalkIn ? 'readonly-field' : undefined}
                placeholder={isWalkIn ? 'Enter visitor name' : 'Select a room with checked-in guest'}
                onChange={(e) => update('guest', e.target.value)}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Regular Member" subtitle="Membership plan for spa, gym and health club access">
          <div className="form-grid">
            <FormField label="Membership Plan" error={errors.membershipId} full>
              <select value={form.membershipId} onChange={(e) => update('membershipId', e.target.value)}>
                {MEMBERSHIP_OPTIONS.map((m) => (
                  <option key={m.id || 'none'} value={m.id}>
                    {m.label}{m.price ? ` (${formatINR(m.price)})` : ''}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Add-on Service" subtitle="Optional service booking billed to guest folio">
          <div className="form-grid">
            <FormField label="Service" full>
              <select value={form.serviceId} onChange={(e) => update('serviceId', e.target.value)}>
                {ADDON_SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label} ({formatINR(s.price)})</option>
                ))}
              </select>
            </FormField>
            <FormField label="Time">
              <input type="time" value={form.time} onChange={(e) => update('time', e.target.value)} />
            </FormField>
            <FormField label="Status">
              <select value={form.status} onChange={(e) => update('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Total Amount">
              <input type="text" value={formatINR(amount)} readOnly className="readonly-field" />
            </FormField>
          </div>
          {(selectedMembership?.price > 0 || selectedService.price > 0) && (
            <p className="field-hint">
              {selectedMembership?.price > 0 && `${selectedMembership.label}: ${formatINR(selectedMembership.price)}`}
              {selectedMembership?.price > 0 && selectedService.price > 0 && ' + '}
              {selectedService.price > 0 && `${selectedService.label}: ${formatINR(selectedService.price)}`}
            </p>
          )}
        </FormSection>

        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update Booking' : 'Create Booking'} />
      </form>
    </Modal>
  )
}

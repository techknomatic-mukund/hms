import { useEffect, useMemo, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { formatINR, formatTime12 } from '../utils/helpers'
import { ROOM_OPTIONS } from '../utils/reservationHelpers'

export const ADDON_SERVICES = [
  { id: 'spa', label: 'Spa - Aromatherapy', price: 3500 },
  { id: 'gym', label: 'Gym - Personal Trainer', price: 1200 },
  { id: 'pool', label: 'Pool - Cabana', price: 2000 },
  { id: 'pickup', label: 'Airport Pickup', price: 1500 },
  { id: 'laundry', label: 'Laundry - Express', price: 850 },
  { id: 'health', label: 'Health Club - Steam', price: 900 },
]

function resolveRoomValue(room) {
  if (!room) return ROOM_OPTIONS[0]
  if (ROOM_OPTIONS.includes(room)) return room
  const byNumber = ROOM_OPTIONS.find((r) => r.split(' ').pop() === String(room))
  return byNumber || ROOM_OPTIONS[0]
}

function serviceIdFromLabel(label) {
  const found = ADDON_SERVICES.find((s) => s.label === label)
  return found?.id || ADDON_SERVICES[0].id
}

const getEmpty = () => ({
  serviceId: ADDON_SERVICES[0].id,
  guest: '',
  room: ROOM_OPTIONS[0],
  time: '',
  status: 'Booked',
})

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  return {
    serviceId: serviceIdFromLabel(editItem.service),
    guest: editItem.guest || '',
    room: resolveRoomValue(editItem.room),
    time: editItem.time?.includes('M') ? '' : editItem.time || '',
    status: editItem.status || 'Booked',
  }
}

export default function NewAddonBookingModal({ open, onClose, onSubmit, editItem = null }) {
  const [form, setForm] = useState(getEmpty())
  const isEdit = !!editItem

  useEffect(() => {
    if (!open) return
    setForm(itemToForm(editItem))
  }, [open, editItem])

  const selectedService = ADDON_SERVICES.find((s) => s.id === form.serviceId) || ADDON_SERVICES[0]
  const amount = useMemo(() => selectedService.price, [selectedService])

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      service: selectedService.label,
      guest: form.guest.trim(),
      room: form.room,
      time: form.time ? (form.time.includes('M') ? form.time : formatTime12(form.time)) : '—',
      amount: formatINR(amount),
      status: form.status,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Booking' : 'New Booking'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Service" full>
            <select value={form.serviceId} onChange={(e) => update('serviceId', e.target.value)}>
              {ADDON_SERVICES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </FormField>
          <FormField label="Guest">
            <input value={form.guest} onChange={(e) => update('guest', e.target.value)} />
          </FormField>
          <FormField label="Room">
            <select value={form.room} onChange={(e) => update('room', e.target.value)}>
              {ROOM_OPTIONS.map((room) => <option key={room} value={room}>{room}</option>)}
              {!ROOM_OPTIONS.includes(form.room) && form.room && (
                <option value={form.room}>{form.room}</option>
              )}
            </select>
          </FormField>
          <FormField label="Time">
            <input type="time" value={form.time} onChange={(e) => update('time', e.target.value)} />
          </FormField>
          <FormField label="Amount">
            <input type="text" value={formatINR(amount)} readOnly />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              <option>Booked</option>
              <option>Active</option>
              <option>Completed</option>
            </select>
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update' : 'Add Booking'} />
      </form>
    </Modal>
  )
}

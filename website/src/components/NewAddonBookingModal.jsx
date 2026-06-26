import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { formatINR, formatTime12 } from '../utils/helpers'

const SERVICES = ['Spa - Aromatherapy', 'Gym - Personal Trainer', 'Pool - Cabana', 'Airport Pickup', 'Laundry - Express', 'Health Club - Steam']

export default function NewAddonBookingModal({ open, onClose, onSubmit, editItem = null }) {
  const [form, setForm] = useState({ service: SERVICES[0], guest: '', room: '302', time: '', amount: '', status: 'Booked' })

  useEffect(() => {
    if (!open) return
    setForm(editItem ? { ...editItem, amount: parseFloat(String(editItem.amount).replace(/[^\d.]/g, '')) || '' } : { service: SERVICES[0], guest: '', room: '302', time: '', amount: '', status: 'Booked' })
  }, [open, editItem])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      service: form.service, guest: form.guest, room: form.room,
      time: form.time.includes('M') ? form.time : formatTime12(form.time),
      amount: String(form.amount).includes('₹') ? form.amount : formatINR(form.amount),
      status: form.status,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Booking' : 'New Booking'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Service" full><select value={form.service} onChange={(e) => setForm((p) => ({ ...p, service: e.target.value }))}>{SERVICES.map((s) => <option key={s}>{s}</option>)}</select></FormField>
          <FormField label="Guest"><input value={form.guest} onChange={(e) => setForm((p) => ({ ...p, guest: e.target.value }))} /></FormField>
          <FormField label="Room"><input value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))} /></FormField>
          <FormField label="Time"><input type="time" value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} /></FormField>
          <FormField label="Amount (₹)"><input type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} /></FormField>
          <FormField label="Status"><select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}><option>Booked</option><option>Active</option><option>Completed</option></select></FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update' : 'Add Booking'} />
      </form>
    </Modal>
  )
}

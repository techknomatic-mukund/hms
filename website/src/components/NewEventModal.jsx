import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { formatDisplayDate } from '../utils/helpers'

const TYPES = ['Banquet', 'Event', 'Conference']

export default function NewEventModal({ open, onClose, onSubmit, editItem = null }) {
  const [form, setForm] = useState({ name: '', type: 'Banquet', date: '', guests: '', status: 'Confirmed' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setForm(editItem ? { ...editItem, date: '', guests: editItem.guests } : { name: '', type: 'Banquet', date: '', guests: '', status: 'Confirmed' })
    setErrors({})
  }, [open, editItem])

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Required'
    if (!editItem && !form.date) next.date = 'Required'
    if (!form.guests) next.guests = 'Required'
    if (Object.keys(next).length) { setErrors(next); return }
    onSubmit({
      name: form.name.trim(), type: form.type,
      date: form.date ? formatDisplayDate(form.date) : editItem?.date,
      guests: parseInt(form.guests, 10), status: form.status || 'Confirmed',
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Event' : 'New Event Booking'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Event Name" required error={errors.name} full><input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></FormField>
          <FormField label="Type"><select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></FormField>
          <FormField label="Date" required error={errors.date}><input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} /></FormField>
          <FormField label="Guests" required error={errors.guests}><input type="number" min="1" value={form.guests} onChange={(e) => setForm((p) => ({ ...p, guests: e.target.value }))} /></FormField>
          <FormField label="Status"><select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}><option>Confirmed</option><option>Planning</option><option>In Progress</option></select></FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update' : 'Book Event'} />
      </form>
    </Modal>
  )
}

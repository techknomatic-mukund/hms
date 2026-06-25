import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { useFormState } from '../hooks/useFormState'
import { formatDisplayDate } from '../utils/helpers'

const TYPES = ['Banquet', 'Event', 'Conference']
const empty = { name: '', type: 'Banquet', date: '', guests: '' }

export default function NewEventModal({ open, onClose, onSubmit }) {
  const { form, errors, update, setFieldErrors } = useFormState(empty, open)

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Event name is required'
    if (!form.date) next.date = 'Date is required'
    if (!form.guests || parseInt(form.guests, 10) <= 0) next.guests = 'Guest count is required'
    if (!setFieldErrors(next)) return
    onSubmit({
      name: form.name.trim(),
      type: form.type,
      date: formatDisplayDate(form.date),
      guests: parseInt(form.guests, 10),
      status: 'Confirmed',
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="New Event Booking">
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Event Name" required error={errors.name} full>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </FormField>
          <FormField label="Type" required>
            <select value={form.type} onChange={(e) => update('type', e.target.value)}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Date" required error={errors.date}>
            <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
          </FormField>
          <FormField label="Expected Guests" required error={errors.guests}>
            <input type="number" min="1" value={form.guests} onChange={(e) => update('guests', e.target.value)} />
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel="Book Event" />
      </form>
    </Modal>
  )
}

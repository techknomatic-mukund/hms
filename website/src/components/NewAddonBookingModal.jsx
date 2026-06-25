import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { useFormState } from '../hooks/useFormState'
import { formatINR, formatTime12 } from '../utils/helpers'

const SERVICES = [
  'Spa - Aromatherapy', 'Spa - Deep Tissue', 'Gym - Personal Trainer',
  'Pool - Cabana Rental', 'Health Club - Steam Bath', 'Laundry - Express',
]
const ROOMS = ['201', '204', '302', '305', '501', '502']
const empty = { service: SERVICES[0], guest: '', room: '302', time: '', amount: '', status: 'Booked' }

export default function NewAddonBookingModal({ open, onClose, onSubmit }) {
  const { form, errors, update, setFieldErrors } = useFormState(empty, open)

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.guest.trim()) next.guest = 'Guest name is required'
    if (!form.time) next.time = 'Time is required'
    if (!form.amount || parseFloat(form.amount) <= 0) next.amount = 'Valid amount is required'
    if (!setFieldErrors(next)) return
    onSubmit({
      service: form.service,
      guest: form.guest.trim(),
      room: form.room,
      time: formatTime12(form.time),
      amount: formatINR(parseFloat(form.amount)),
      status: form.status,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="New Add-on Booking">
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Service" required full>
            <select value={form.service} onChange={(e) => update('service', e.target.value)}>
              {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Guest Name" required error={errors.guest}>
            <input type="text" value={form.guest} onChange={(e) => update('guest', e.target.value)} />
          </FormField>
          <FormField label="Room" required>
            <select value={form.room} onChange={(e) => update('room', e.target.value)}>
              {ROOMS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </FormField>
          <FormField label="Time" required error={errors.time}>
            <input type="time" value={form.time} onChange={(e) => update('time', e.target.value)} />
          </FormField>
          <FormField label="Amount (₹)" required error={errors.amount}>
            <input type="number" min="1" value={form.amount} onChange={(e) => update('amount', e.target.value)} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              <option>Booked</option>
              <option>Active</option>
              <option>Completed</option>
            </select>
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel="Add Booking" />
      </form>
    </Modal>
  )
}

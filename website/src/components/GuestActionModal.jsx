import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { useFormState } from '../hooks/useFormState'

const empty = { reservationId: '' }

export default function GuestActionModal({
  open, onClose, type, reservations, onCheckIn, onCheckOut, onSaveRegistration,
}) {
  const { form, errors, update, setFieldErrors, setForm } = useFormState(empty, open)

  const titles = {
    'check-in': 'Check-in Guest',
    'check-out': 'Check-out Guest',
    registration: 'Registration Card',
  }

  const eligible = reservations.filter((r) => {
    if (type === 'check-in') return r.status === 'Confirmed'
    if (type === 'check-out') return r.status === 'Checked In'
    return true
  })

  const selected = reservations.find((r) => r.id === form.reservationId)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.reservationId) {
      setFieldErrors({ reservationId: 'Please select a reservation' })
      return
    }
    if (type === 'check-in') onCheckIn(form.reservationId)
    else if (type === 'check-out') onCheckOut(form.reservationId)
    else if (type === 'registration') onSaveRegistration(form.reservationId, form)
    onClose()
  }

  if (!open || !type) return null

  return (
    <Modal open={open} onClose={onClose} title={titles[type]}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Select Reservation" required error={errors.reservationId} full>
            <select
              value={form.reservationId}
              onChange={(e) => {
                const id = e.target.value
                update('reservationId', id)
                const res = reservations.find((r) => r.id === id)
                if (res && type === 'registration') {
                  setForm((prev) => ({
                    ...prev,
                    reservationId: id,
                    guest: res.guest,
                    room: res.room,
                    phone: prev.phone || '',
                    email: prev.email || '',
                    idProof: prev.idProof || '',
                  }))
                }
              }}
            >
              <option value="">— Select —</option>
              {eligible.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} — {r.guest} ({r.room})
                </option>
              ))}
            </select>
          </FormField>

          {type === 'registration' && selected && (
            <>
              <FormField label="Guest Name" full>
                <input type="text" value={form.guest || selected.guest} onChange={(e) => update('guest', e.target.value)} />
              </FormField>
              <FormField label="Phone">
                <input type="tel" value={form.phone || ''} placeholder="+91..." onChange={(e) => update('phone', e.target.value)} />
              </FormField>
              <FormField label="Email">
                <input type="email" value={form.email || ''} onChange={(e) => update('email', e.target.value)} />
              </FormField>
              <FormField label="ID Proof">
                <input type="text" value={form.idProof || ''} placeholder="Passport / Aadhaar" onChange={(e) => update('idProof', e.target.value)} />
              </FormField>
            </>
          )}

        </div>
        <FormActions
          onCancel={onClose}
          submitLabel={type === 'registration' ? 'Save Registration' : type === 'check-in' ? 'Check In' : 'Check Out'}
        />
      </form>
    </Modal>
  )
}

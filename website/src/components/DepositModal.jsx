import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { DEPOSIT_TYPES } from '../utils/frontOfficeHelpers'

const empty = {
  guest: '', reservationId: '', room: '', type: 'Advance Payment',
  amount: '', received: '', refunded: '0', status: 'Held',
}

export default function DepositModal({
  open, onClose, onSubmit, reservations, editItem = null,
}) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (!open) return
    if (editItem) {
      setForm({
        guest: editItem.guest,
        reservationId: editItem.reservationId || '',
        room: editItem.room,
        type: editItem.type,
        amount: String(editItem.amount),
        received: String(editItem.received),
        refunded: String(editItem.refunded || 0),
        status: editItem.status,
      })
    } else {
      setForm(empty)
    }
  }, [open, editItem])

  const pickReservation = (id) => {
    const res = reservations.find((r) => r.id === id)
    if (!res) return
    setForm((p) => ({ ...p, reservationId: id, guest: res.guest, room: res.room }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const amount = parseFloat(form.amount) || 0
    const received = parseFloat(form.received) || 0
    const refunded = parseFloat(form.refunded) || 0
    onSubmit({
      guest: form.guest,
      reservationId: form.reservationId,
      room: form.room,
      type: form.type,
      amount,
      received,
      refunded,
      balance: amount - received + refunded,
      status: form.status,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Update Deposit' : 'Record Deposit'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Reservation" full>
            <select value={form.reservationId} onChange={(e) => pickReservation(e.target.value)}>
              <option value="">— Select or enter manually —</option>
              {reservations.map((r) => (
                <option key={r.id} value={r.id}>{r.id} — {r.guest} ({r.room})</option>
              ))}
            </select>
          </FormField>
          <FormField label="Guest" required>
            <input type="text" value={form.guest} onChange={(e) => setForm((p) => ({ ...p, guest: e.target.value }))} />
          </FormField>
          <FormField label="Room" required>
            <input type="text" value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))} />
          </FormField>
          <FormField label="Deposit Type" required>
            <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
              {DEPOSIT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Amount (₹)" required>
            <input type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} />
          </FormField>
          <FormField label="Received (₹)" required>
            <input type="number" value={form.received} onChange={(e) => setForm((p) => ({ ...p, received: e.target.value }))} />
          </FormField>
          <FormField label="Refunded (₹)">
            <input type="number" value={form.refunded} onChange={(e) => setForm((p) => ({ ...p, refunded: e.target.value }))} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
              {['Held', 'Applied', 'Partial', 'Refunded', 'Pending'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update' : 'Save Deposit'} />
      </form>
    </Modal>
  )
}

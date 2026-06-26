import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { formatINR } from '../utils/helpers'
import { LAUNDRY_SERVICES, EXPRESS_SURCHARGE, calcExpressAmount } from '../utils/laundryHelpers'

const empty = {
  guest: '', room: '', items: '', service: 'Wash & Iron',
  amount: '', express: false, pickupDate: '', expectedDelivery: '',
}

export default function LaundryOrderModal({
  open, onClose, onSubmit, reservations, editItem = null,
}) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (!open) return
    if (editItem) {
      const amt = parseFloat(String(editItem.amount).replace(/[^\d.]/g, '')) || 0
      setForm({
        guest: editItem.guest,
        room: editItem.room,
        items: editItem.items,
        service: editItem.service,
        amount: String(amt),
        express: Boolean(editItem.express),
        pickupDate: editItem.pickupDate || '',
        expectedDelivery: editItem.expectedDelivery || '',
      })
    } else {
      setForm(empty)
    }
  }, [open, editItem])

  const pickGuest = (resId) => {
    const res = reservations.find((r) => r.id === resId)
    if (!res) return
    setForm((p) => ({ ...p, guest: res.guest, room: res.room.split(' ').pop() }))
  }

  const total = calcExpressAmount(parseFloat(form.amount) || 0, form.express)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.guest.trim() || !form.items.trim() || !form.amount) return
    const base = parseFloat(form.amount) || 0
    onSubmit({
      guest: form.guest.trim(),
      room: form.room.trim(),
      items: form.items.trim(),
      service: form.express && !form.service.startsWith('Express') ? `Express ${form.service}` : form.service,
      amount: formatINR(total),
      express: form.express,
      expressCharge: form.express ? formatINR(EXPRESS_SURCHARGE) : '',
      stage: editItem?.stage || 'Pickup',
      status: editItem?.status || 'Pickup Scheduled',
      pickupDate: form.pickupDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      expectedDelivery: form.expectedDelivery || (form.express ? 'Same day, 8 PM' : 'Next day'),
      deliveredDate: editItem?.deliveredDate || '',
      qualityCheck: editItem?.qualityCheck || null,
      history: editItem?.history || [{
        time: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        action: 'Created',
        detail: form.express ? 'Express order created' : 'Order created',
      }],
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Laundry Order' : 'New Laundry Order'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Guest Reservation" full>
            <select onChange={(e) => pickGuest(e.target.value)} defaultValue="">
              <option value="">— Pick from reservation —</option>
              {reservations.filter((r) => r.status === 'Checked In').map((r) => (
                <option key={r.id} value={r.id}>{r.guest} — {r.room}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Guest" required>
            <input type="text" value={form.guest} onChange={(e) => setForm((p) => ({ ...p, guest: e.target.value }))} />
          </FormField>
          <FormField label="Room" required>
            <input type="text" value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))} />
          </FormField>
          <FormField label="Service">
            <select value={form.service} onChange={(e) => setForm((p) => ({ ...p, service: e.target.value }))}>
              {LAUNDRY_SERVICES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Base Amount (₹)" required>
            <input type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} />
          </FormField>
          <FormField label="Pickup Date">
            <input type="text" value={form.pickupDate} placeholder="25 Jun" onChange={(e) => setForm((p) => ({ ...p, pickupDate: e.target.value }))} />
          </FormField>
          <FormField label="Expected Delivery">
            <input type="text" value={form.expectedDelivery} placeholder="26 Jun" onChange={(e) => setForm((p) => ({ ...p, expectedDelivery: e.target.value }))} />
          </FormField>
          <div className="form-field form-field-full">
            <label className="tax-option">
              <input type="checkbox" checked={form.express} onChange={(e) => setForm((p) => ({ ...p, express: e.target.checked }))} />
              Express Laundry Service (+{formatINR(EXPRESS_SURCHARGE)} surcharge, same-day delivery)
            </label>
          </div>
          {form.express && (
            <div className="form-field form-field-full express-summary">
              <span>Total with express: <strong>{formatINR(total)}</strong></span>
            </div>
          )}
          <FormField label="Items" required full>
            <textarea rows={2} value={form.items} placeholder="Shirts x3, Trousers x2" onChange={(e) => setForm((p) => ({ ...p, items: e.target.value }))} />
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update Order' : 'Create Order'} />
      </form>
    </Modal>
  )
}

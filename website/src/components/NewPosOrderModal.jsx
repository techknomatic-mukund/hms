import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { formatINR } from '../utils/helpers'

const PAYMENTS = ['Direct - UPI', 'Direct - Card', 'Direct - Cash', 'Bill to Room 302', 'Bill to Room 501']

function parseAmount(amt) {
  if (typeof amt === 'number') return amt
  return parseFloat(String(amt).replace(/[^\d.]/g, '')) || ''
}

export default function NewPosOrderModal({ open, onClose, onSubmit, editItem = null }) {
  const [form, setForm] = useState({ table: '', items: '', amount: '', payment: 'Direct - UPI', status: 'Preparing' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    if (editItem) {
      setForm({
        table: editItem.table, items: editItem.items, amount: parseAmount(editItem.amount),
        payment: editItem.payment, status: editItem.status,
      })
    } else {
      setForm({ table: '', items: '', amount: '', payment: 'Direct - UPI', status: 'Preparing' })
    }
    setErrors({})
  }, [open, editItem])

  const update = (f, v) => { setForm((p) => ({ ...p, [f]: v })); setErrors((p) => ({ ...p, [f]: '' })) }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.table.trim()) next.table = 'Table or room is required'
    if (!form.items.trim()) next.items = 'Items are required'
    if (!form.amount || parseFloat(form.amount) <= 0) next.amount = 'Valid amount is required'
    if (Object.keys(next).length) { setErrors(next); return }
    onSubmit({
      table: form.table.trim(), items: form.items.trim(),
      amount: formatINR(parseFloat(form.amount)), payment: form.payment, status: form.status,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Order' : 'New POS Order'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Table / Room" required error={errors.table}>
            <input type="text" value={form.table} onChange={(e) => update('table', e.target.value)} />
          </FormField>
          <FormField label="Payment" required>
            <select value={form.payment} onChange={(e) => update('payment', e.target.value)}>
              {PAYMENTS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </FormField>
          <FormField label="Items" required error={errors.items} full>
            <input type="text" value={form.items} onChange={(e) => update('items', e.target.value)} />
          </FormField>
          <FormField label="Amount (₹)" required error={errors.amount}>
            <input type="number" min="1" value={form.amount} onChange={(e) => update('amount', e.target.value)} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              <option>Preparing</option><option>Served</option><option>Paid</option>
            </select>
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update' : 'Create Order'} />
      </form>
    </Modal>
  )
}

import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'

export default function RecordTransactionModal({ open, onClose, onSubmit, editItem = null }) {
  const [form, setForm] = useState({ type: 'Expense', category: 'Operations', description: '', amount: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    if (editItem) {
      setForm({
        type: editItem.type,
        category: editItem.category,
        description: editItem.description,
        amount: parseFloat(String(editItem.amount).replace(/[^\d.]/g, '')) || '',
      })
    } else {
      setForm({ type: 'Expense', category: 'Operations', description: '', amount: '' })
    }
    setErrors({})
  }, [open, editItem])

  const update = (f, v) => { setForm((p) => ({ ...p, [f]: v })); setErrors((p) => ({ ...p, [f]: '' })) }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.description.trim()) next.description = 'Description is required'
    if (!form.amount || parseFloat(form.amount) <= 0) next.amount = 'Valid amount is required'
    if (Object.keys(next).length) { setErrors(next); return }
    onSubmit({ type: form.type, category: form.category, description: form.description.trim(), amount: parseFloat(form.amount) })
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Transaction' : 'Record Transaction'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Type" required>
            <select value={form.type} onChange={(e) => update('type', e.target.value)}><option>Revenue</option><option>Expense</option></select>
          </FormField>
          <FormField label="Category" required>
            <select value={form.category} onChange={(e) => update('category', e.target.value)}>
              {['Room', 'F&B', 'Add-on', 'Operations', 'Payroll', 'Utilities'].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="Description" required error={errors.description} full>
            <input type="text" value={form.description} onChange={(e) => update('description', e.target.value)} />
          </FormField>
          <FormField label="Amount (OMR)" required error={errors.amount}>
            <input type="number" min="1" value={form.amount} onChange={(e) => update('amount', e.target.value)} />
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update' : 'Record'} />
      </form>
    </Modal>
  )
}

import { formatINR } from '../utils/helpers'

export function formatTransactionRow(txn, id, date) {
  return {
    id,
    type: txn.type,
    category: txn.category,
    description: txn.description,
    amount: formatINR(txn.amount),
    date: date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
  }
}

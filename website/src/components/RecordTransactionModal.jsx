import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { useFormState } from '../hooks/useFormState'
import { formatINR } from '../utils/helpers'

const empty = { type: 'Expense', category: 'Operations', description: '', amount: '' }

export default function RecordTransactionModal({ open, onClose, onSubmit }) {
  const { form, errors, update, setFieldErrors } = useFormState(empty, open)

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.description.trim()) next.description = 'Description is required'
    if (!form.amount || parseFloat(form.amount) <= 0) next.amount = 'Valid amount is required'
    if (!setFieldErrors(next)) return
    onSubmit({
      type: form.type,
      category: form.category,
      description: form.description.trim(),
      amount: parseFloat(form.amount),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Record Transaction">
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Type" required>
            <select value={form.type} onChange={(e) => update('type', e.target.value)}>
              <option>Revenue</option>
              <option>Expense</option>
            </select>
          </FormField>
          <FormField label="Category" required>
            <select value={form.category} onChange={(e) => update('category', e.target.value)}>
              {['Room', 'F&B', 'Add-on', 'Operations', 'Payroll', 'Utilities'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Description" required error={errors.description} full>
            <input type="text" value={form.description} onChange={(e) => update('description', e.target.value)} />
          </FormField>
          <FormField label="Amount (₹)" required error={errors.amount}>
            <input type="number" min="1" value={form.amount} onChange={(e) => update('amount', e.target.value)} />
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel="Record" />
      </form>
    </Modal>
  )
}

export function formatTransactionRow(txn, id) {
  return {
    id,
    type: txn.type,
    category: txn.category,
    description: txn.description,
    amount: formatINR(txn.amount),
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
  }
}

import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { useFormState } from '../hooks/useFormState'
import { formatINR } from '../utils/helpers'

const PAYMENTS = ['Direct - UPI', 'Direct - Card', 'Direct - Cash', 'Bill to Room 302', 'Bill to Room 501']
const empty = { table: '', items: '', amount: '', payment: 'Direct - UPI', status: 'Preparing' }

export default function NewPosOrderModal({ open, onClose, onSubmit }) {
  const { form, errors, update, setFieldErrors } = useFormState(empty, open)

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.table.trim()) next.table = 'Table or room is required'
    if (!form.items.trim()) next.items = 'Items are required'
    if (!form.amount || parseFloat(form.amount) <= 0) next.amount = 'Valid amount is required'
    if (!setFieldErrors(next)) return
    onSubmit({
      table: form.table.trim(),
      items: form.items.trim(),
      amount: formatINR(parseFloat(form.amount)),
      payment: form.payment,
      status: form.status,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="New POS Order">
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Table / Room" required error={errors.table}>
            <input type="text" placeholder="T-12 or Room 501" value={form.table} onChange={(e) => update('table', e.target.value)} />
          </FormField>
          <FormField label="Payment" required>
            <select value={form.payment} onChange={(e) => update('payment', e.target.value)}>
              {PAYMENTS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </FormField>
          <FormField label="Items" required error={errors.items} full>
            <input type="text" placeholder="Butter Chicken, Naan x2" value={form.items} onChange={(e) => update('items', e.target.value)} />
          </FormField>
          <FormField label="Amount (₹)" required error={errors.amount}>
            <input type="number" min="1" value={form.amount} onChange={(e) => update('amount', e.target.value)} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              <option>Preparing</option>
              <option>Served</option>
              <option>Paid</option>
            </select>
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel="Create Order" />
      </form>
    </Modal>
  )
}

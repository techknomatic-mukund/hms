import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { useFormState } from '../hooks/useFormState'
import { formatINR } from '../utils/helpers'

const CATEGORIES = ['Starter', 'Main Course', 'Breakfast', 'Beverage', 'Dessert']
const empty = { name: '', category: 'Main Course', price: '', tax: 'GST 5%' }

export default function AddMenuItemModal({ open, onClose, onSubmit }) {
  const { form, errors, update, setFieldErrors } = useFormState(empty, open)

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Item name is required'
    if (!form.price || parseFloat(form.price) <= 0) next.price = 'Valid price is required'
    if (!setFieldErrors(next)) return
    onSubmit({
      name: form.name.trim(),
      category: form.category,
      price: formatINR(parseFloat(form.price)),
      tax: form.tax,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Menu Item">
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Item Name" required error={errors.name} full>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </FormField>
          <FormField label="Category" required>
            <select value={form.category} onChange={(e) => update('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="Price (₹)" required error={errors.price}>
            <input type="number" min="1" value={form.price} onChange={(e) => update('price', e.target.value)} />
          </FormField>
          <FormField label="Tax">
            <select value={form.tax} onChange={(e) => update('tax', e.target.value)}>
              <option>GST 5%</option>
              <option>GST 12%</option>
              <option>GST 18%</option>
            </select>
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel="Add Item" />
      </form>
    </Modal>
  )
}

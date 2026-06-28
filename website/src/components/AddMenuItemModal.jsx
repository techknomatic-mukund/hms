import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { formatINR } from '../utils/helpers'

const CATEGORIES = ['Starter', 'Main Course', 'Breakfast', 'Beverage', 'Dessert']

function parsePrice(price) {
  if (typeof price === 'number') return price
  return parseFloat(String(price).replace(/[^\d.]/g, '')) || ''
}

export default function AddMenuItemModal({ open, onClose, onSubmit, editItem = null }) {
  const [form, setForm] = useState({ name: '', category: 'Main Course', price: '', tax: 'GST 5%' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    if (editItem) {
      setForm({ name: editItem.name, category: editItem.category, price: parsePrice(editItem.price), tax: editItem.tax })
    } else {
      setForm({ name: '', category: 'Main Course', price: '', tax: 'GST 5%' })
    }
    setErrors({})
  }, [open, editItem])

  const update = (f, v) => { setForm((p) => ({ ...p, [f]: v })); setErrors((p) => ({ ...p, [f]: '' })) }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Item name is required'
    if (!form.price || parseFloat(form.price) <= 0) next.price = 'Valid price is required'
    if (Object.keys(next).length) { setErrors(next); return }
    onSubmit({ name: form.name.trim(), category: form.category, price: formatINR(parseFloat(form.price)), tax: form.tax })
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Menu Item' : 'Add Menu Item'}>
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
          <FormField label="Price (OMR)" required error={errors.price}>
            <input type="number" min="1" value={form.price} onChange={(e) => update('price', e.target.value)} />
          </FormField>
          <FormField label="Tax">
            <select value={form.tax} onChange={(e) => update('tax', e.target.value)}>
              <option>GST 5%</option><option>GST 12%</option><option>GST 18%</option>
            </select>
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update' : 'Add Item'} />
      </form>
    </Modal>
  )
}

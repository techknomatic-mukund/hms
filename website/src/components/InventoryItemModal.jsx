import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'

const CATEGORIES = ['Food', 'Linen', 'Housekeeping', 'Beverage', 'General', 'Kitchen', 'Maintenance']
const UNITS = ['kg', 'L', 'pcs', 'boxes', 'litres', 'units']
const STATUSES = ['OK', 'Low Stock', 'Out of Stock']
export const STORAGE_LOCATIONS = [
  'Store Room A — Shelf 1',
  'Store Room A — Shelf 2',
  'Store Room A — Shelf 3',
  'Main Store — Shelf A1',
  'Main Store — Shelf A2',
  'Kitchen Store',
  'Linen Room',
  'HK Store',
  'Cold Storage',
  'Beverage Cellar',
]

const getEmpty = () => ({
  name: '',
  skuCode: '',
  category: 'Food',
  unit: 'kg',
  storageLocation: STORAGE_LOCATIONS[0],
  itemDescription: '',
  stock: '',
  status: 'OK',
})

function resolveLocation(location) {
  if (!location) return STORAGE_LOCATIONS[0]
  if (STORAGE_LOCATIONS.includes(location)) return location
  return location
}

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  return {
    name: editItem.name || '',
    skuCode: editItem.skuCode || editItem.id || '',
    category: editItem.category || 'Food',
    unit: editItem.unit || 'kg',
    storageLocation: resolveLocation(editItem.storageLocation),
    itemDescription: editItem.itemDescription || '',
    stock: editItem.stock ?? '',
    status: editItem.status || 'OK',
  }
}

export default function InventoryItemModal({ open, onClose, onSubmit, editItem = null }) {
  const [form, setForm] = useState(getEmpty())
  const [errors, setErrors] = useState({})
  const isEdit = !!editItem

  useEffect(() => {
    if (!open) return
    setForm(itemToForm(editItem))
    setErrors({})
  }, [open, editItem])

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Item name is required'
    if (form.stock === '' || Number(form.stock) < 0) next.stock = 'Valid stock quantity is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const stock = Number(form.stock)
    let status = form.status
    if (stock === 0) status = 'Out of Stock'
    onSubmit({
      name: form.name.trim(),
      skuCode: form.skuCode.trim(),
      category: form.category,
      unit: form.unit,
      storageLocation: form.storageLocation,
      itemDescription: form.itemDescription.trim(),
      stock,
      status,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Inventory Item' : 'New Inventory Item'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <FormSection title="Item Master Management" subtitle="Define item details, SKU and storage location">
          <div className="form-grid">
            <FormField label="Item Name" required error={errors.name} full>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} />
            </FormField>
            <FormField label="SKU Code">
              <input type="text" value={form.skuCode} placeholder="Auto or manual SKU" onChange={(e) => update('skuCode', e.target.value)} />
            </FormField>
            <FormField label="Category">
              <select value={form.category} onChange={(e) => update('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Unit">
              <select value={form.unit} onChange={(e) => update('unit', e.target.value)}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </FormField>
            <FormField label="Storage Location">
              <select value={form.storageLocation} onChange={(e) => update('storageLocation', e.target.value)}>
                {STORAGE_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                {!STORAGE_LOCATIONS.includes(form.storageLocation) && form.storageLocation && (
                  <option value={form.storageLocation}>{form.storageLocation}</option>
                )}
              </select>
            </FormField>
            <FormField label="Description" full>
              <input type="text" value={form.itemDescription} onChange={(e) => update('itemDescription', e.target.value)} />
            </FormField>
            <FormField label="Current Stock" required error={errors.stock}>
              <input type="number" min="0" value={form.stock} onChange={(e) => update('stock', e.target.value)} />
            </FormField>
            <FormField label="Status">
              <select value={form.status} onChange={(e) => update('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>
        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update Item' : 'Create Item'} />
      </form>
    </Modal>
  )
}

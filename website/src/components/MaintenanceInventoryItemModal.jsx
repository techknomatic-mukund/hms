import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'

const CATEGORIES = ['HVAC', 'Plumbing', 'Electrical', 'General', 'Tools', 'Safety']
const UNITS = ['pcs', 'kg', 'L', 'boxes', 'units', 'rolls']
const STORAGE_LOCATIONS = [
  'Maintenance Store — Shelf A',
  'Maintenance Store — Shelf B',
  'Maintenance Workshop',
  'Basement Store',
]

const getEmpty = () => ({
  name: '',
  skuCode: '',
  category: 'HVAC',
  quantity: '',
  unit: 'pcs',
  storageLocation: STORAGE_LOCATIONS[0],
  itemDescription: '',
  remarks: '',
})

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  return {
    ...getEmpty(),
    ...editItem,
    quantity: editItem.quantity ?? editItem.stock ?? '',
  }
}

export default function MaintenanceInventoryItemModal({
  open, onClose, onSubmit, editItem = null, requiresApproval = false,
}) {
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
    if (!form.quantity || Number(form.quantity) < 0) next.quantity = 'Valid quantity is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      name: form.name.trim(),
      skuCode: form.skuCode.trim(),
      quantity: Number(form.quantity),
      stock: Number(form.quantity),
      itemDescription: form.itemDescription.trim(),
      remarks: form.remarks.trim(),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Item' : 'Add Maintenance Inventory'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <FormSection title="Item Details" subtitle="Spare parts & maintenance supplies">
          <div className="form-grid">
            <FormField label="Item Name" required error={errors.name} full>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="AC filter, pipe wrench..." />
            </FormField>
            <FormField label="SKU Code">
              <input type="text" value={form.skuCode} onChange={(e) => update('skuCode', e.target.value)} placeholder="MNT-HVAC-01" />
            </FormField>
            <FormField label="Category">
              <select value={form.category} onChange={(e) => update('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Quantity" required error={errors.quantity}>
              <input type="number" min="0" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} />
            </FormField>
            <FormField label="Unit">
              <select value={form.unit} onChange={(e) => update('unit', e.target.value)}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </FormField>
            <FormField label="Storage Location">
              <select value={form.storageLocation} onChange={(e) => update('storageLocation', e.target.value)}>
                {STORAGE_LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </FormField>
            <FormField label="Description" full>
              <textarea rows={2} value={form.itemDescription} onChange={(e) => update('itemDescription', e.target.value)} />
            </FormField>
            <FormField label="Remarks" full>
              <input type="text" value={form.remarks} onChange={(e) => update('remarks', e.target.value)} placeholder="Usage notes, reorder reason..." />
            </FormField>
          </div>
        </FormSection>

        {requiresApproval && !isEdit && (
          <p className="field-hint">Item is sent to Operations for approval before it is added to stock.</p>
        )}

        <FormActions
          onCancel={onClose}
          submitLabel={isEdit ? 'Update Item' : (requiresApproval ? 'Submit for Approval' : 'Save Item')}
        />
      </form>
    </Modal>
  )
}

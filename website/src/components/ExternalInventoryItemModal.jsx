import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'
import { STORAGE_LOCATIONS } from './InventoryItemModal'
import { todayISO } from '../utils/helpers'

const CATEGORIES = ['Food', 'Linen', 'Housekeeping', 'Beverage', 'General', 'Kitchen', 'Maintenance']
const UNITS = ['kg', 'L', 'pcs', 'boxes', 'litres', 'units']

const getEmpty = () => ({
  name: '',
  skuCode: '',
  category: 'Food',
  vendor: '',
  quantity: '',
  unit: 'kg',
  storageLocation: STORAGE_LOCATIONS[0],
  purchaseDate: todayISO(),
  purchaseAmount: '',
  invoiceRef: '',
  itemDescription: '',
  remarks: '',
})

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  return {
    ...getEmpty(),
    ...editItem,
    quantity: editItem.quantity ?? editItem.stock ?? '',
    purchaseAmount: String(editItem.purchaseAmount || '').replace(/[^\d.]/g, '') || editItem.purchaseAmount || '',
  }
}

export default function ExternalInventoryItemModal({
  open, onClose, onSubmit, editItem = null, requiresGmApproval = true,
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
    if (!form.vendor.trim()) next.vendor = 'Vendor is required'
    if (!form.quantity || Number(form.quantity) <= 0) next.quantity = 'Valid quantity is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      name: form.name.trim(),
      vendor: form.vendor.trim(),
      skuCode: form.skuCode.trim(),
      quantity: Number(form.quantity),
      stock: Number(form.quantity),
      itemDescription: form.itemDescription.trim(),
      remarks: form.remarks.trim(),
      invoiceRef: form.invoiceRef.trim(),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit External Item' : 'Add External Inventory'} wide>
      <form className="entity-form" onSubmit={handleSubmit}>
        <FormSection title="External Purchase" subtitle="Inventory purchased from outside vendors">
          <div className="form-grid">
            <FormField label="Item Name" required error={errors.name} full>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} />
            </FormField>
            <FormField label="Vendor" required error={errors.vendor}>
              <input type="text" value={form.vendor} onChange={(e) => update('vendor', e.target.value)} placeholder="Supplier name" />
            </FormField>
            <FormField label="SKU Code">
              <input type="text" value={form.skuCode} onChange={(e) => update('skuCode', e.target.value)} placeholder="EXT-SKU-01" />
            </FormField>
            <FormField label="Category">
              <select value={form.category} onChange={(e) => update('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Quantity" required error={errors.quantity}>
              <input type="number" min="1" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} />
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
            <FormField label="Purchase Date">
              <input type="date" value={form.purchaseDate} onChange={(e) => update('purchaseDate', e.target.value)} />
            </FormField>
            <FormField label="Purchase Amount (OMR)">
              <input type="number" min="0" step="0.01" value={form.purchaseAmount} onChange={(e) => update('purchaseAmount', e.target.value)} />
            </FormField>
            <FormField label="Invoice / PO Ref">
              <input type="text" value={form.invoiceRef} onChange={(e) => update('invoiceRef', e.target.value)} placeholder="INV-EXT-001" />
            </FormField>
            <FormField label="Description" full>
              <textarea rows={2} value={form.itemDescription} onChange={(e) => update('itemDescription', e.target.value)} />
            </FormField>
            <FormField label="Remarks" full>
              <input type="text" value={form.remarks} onChange={(e) => update('remarks', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        {requiresGmApproval && !isEdit && (
          <p className="field-hint">External stock entries are sent to the General Manager for approval.</p>
        )}

        <FormActions
          onCancel={onClose}
          submitLabel={isEdit ? 'Update Item' : (requiresGmApproval ? 'Submit for GM Approval' : 'Save Item')}
        />
      </form>
    </Modal>
  )
}

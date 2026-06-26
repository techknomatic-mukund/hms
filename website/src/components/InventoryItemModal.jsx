import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'

const CATEGORIES = ['Food', 'Linen', 'Housekeeping', 'Beverage', 'General', 'Kitchen', 'Maintenance']
const UNITS = ['kg', 'L', 'pcs', 'boxes', 'litres', 'units']
const STATUSES = ['OK', 'Low Stock', 'Out of Stock']
const ADJUSTMENT_REASONS = ['Damage', 'Expiry', 'Theft', 'Count Correction', 'Other']
const REPORT_CATEGORIES = ['Stock Valuation', 'Consumption', 'Wastage', 'Reorder', 'Category Summary']

const getEmpty = () => ({
  name: '', category: 'Food', stock: '', unit: 'kg', reorder: 10, status: 'OK',
  skuCode: '', itemDescription: '', storageLocation: '',
  stockInQty: '', stockEntryDate: '', stockEntryRef: '', stockEntryNote: '',
  stockOutQty: '', issuedTo: '', issueReason: '',
  transferFrom: '', transferTo: '', transferQty: '',
  alertEnabled: true, alertThreshold: '',
  adjustmentQty: '', adjustmentReason: 'Count Correction', adjustmentDate: '',
  batchNumber: '', expiryDate: '', manufacturingDate: '',
  lastCountDate: '', countedQty: '', countVariance: '',
  reportCategory: 'Stock Valuation', analyticsNotes: '',
})

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  return { ...getEmpty(), ...editItem, stock: editItem.stock ?? '', reorder: editItem.reorder ?? 10 }
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
    const reorder = Number(form.reorder) || 0
    const status = stock <= reorder ? 'Low Stock' : (form.status === 'Out of Stock' && stock > 0 ? 'OK' : form.status)
    onSubmit({
      ...form,
      name: form.name.trim(),
      stock,
      reorder,
      status: stock === 0 ? 'Out of Stock' : status,
      alertThreshold: form.alertThreshold || String(reorder),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Inventory Item' : 'New Inventory Item'} wide>
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
              <input type="text" value={form.storageLocation} placeholder="Store room A, Shelf 3" onChange={(e) => update('storageLocation', e.target.value)} />
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

        <FormSection title="Stock Entry" subtitle="Record incoming stock from purchases or transfers">
          <div className="form-grid">
            <FormField label="Entry Quantity">
              <input type="number" min="0" value={form.stockInQty} onChange={(e) => update('stockInQty', e.target.value)} />
            </FormField>
            <FormField label="Entry Date">
              <input type="date" value={form.stockEntryDate} onChange={(e) => update('stockEntryDate', e.target.value)} />
            </FormField>
            <FormField label="Entry Reference">
              <input type="text" value={form.stockEntryRef} placeholder="GRN-201, PO-202" onChange={(e) => update('stockEntryRef', e.target.value)} />
            </FormField>
            <FormField label="Entry Notes" full>
              <input type="text" value={form.stockEntryNote} onChange={(e) => update('stockEntryNote', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Stock Issue" subtitle="Issue stock to departments or consumption points">
          <div className="form-grid">
            <FormField label="Issue Quantity">
              <input type="number" min="0" value={form.stockOutQty} onChange={(e) => update('stockOutQty', e.target.value)} />
            </FormField>
            <FormField label="Issued To">
              <input type="text" value={form.issuedTo} placeholder="Kitchen, Housekeeping, F&B" onChange={(e) => update('issuedTo', e.target.value)} />
            </FormField>
            <FormField label="Issue Reason" full>
              <input type="text" value={form.issueReason} onChange={(e) => update('issueReason', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Stock Transfer" subtitle="Move stock between stores or locations">
          <div className="form-grid">
            <FormField label="Transfer From">
              <input type="text" value={form.transferFrom} placeholder="Main Store" onChange={(e) => update('transferFrom', e.target.value)} />
            </FormField>
            <FormField label="Transfer To">
              <input type="text" value={form.transferTo} placeholder="Kitchen Store" onChange={(e) => update('transferTo', e.target.value)} />
            </FormField>
            <FormField label="Transfer Quantity">
              <input type="number" min="0" value={form.transferQty} onChange={(e) => update('transferQty', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Low Stock Alert" subtitle="Configure reorder levels and alert thresholds">
          <div className="form-grid">
            <FormField label="Reorder Level">
              <input type="number" min="0" value={form.reorder} onChange={(e) => update('reorder', e.target.value)} />
            </FormField>
            <FormField label="Alert Threshold">
              <input type="number" min="0" value={form.alertThreshold} placeholder="Same as reorder" onChange={(e) => update('alertThreshold', e.target.value)} />
            </FormField>
            <div className="form-field form-field-full">
              <label className="tax-option">
                <input type="checkbox" checked={form.alertEnabled} onChange={(e) => update('alertEnabled', e.target.checked)} />
                Enable low stock email/SMS alerts
              </label>
            </div>
          </div>
        </FormSection>

        <FormSection title="Inventory Adjustment" subtitle="Correct stock for damage, expiry or count differences">
          <div className="form-grid">
            <FormField label="Adjustment Qty (+/-)">
              <input type="number" value={form.adjustmentQty} placeholder="-2 or +5" onChange={(e) => update('adjustmentQty', e.target.value)} />
            </FormField>
            <FormField label="Reason">
              <select value={form.adjustmentReason} onChange={(e) => update('adjustmentReason', e.target.value)}>
                {ADJUSTMENT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </FormField>
            <FormField label="Adjustment Date">
              <input type="date" value={form.adjustmentDate} onChange={(e) => update('adjustmentDate', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Batch & Expiry Tracking" subtitle="Track batch numbers and expiry for perishable items">
          <div className="form-grid">
            <FormField label="Batch Number">
              <input type="text" value={form.batchNumber} onChange={(e) => update('batchNumber', e.target.value)} />
            </FormField>
            <FormField label="Manufacturing Date">
              <input type="date" value={form.manufacturingDate} onChange={(e) => update('manufacturingDate', e.target.value)} />
            </FormField>
            <FormField label="Expiry Date">
              <input type="date" value={form.expiryDate} onChange={(e) => update('expiryDate', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Physical Stock Count" subtitle="Record physical verification and variance">
          <div className="form-grid">
            <FormField label="Last Count Date">
              <input type="date" value={form.lastCountDate} onChange={(e) => update('lastCountDate', e.target.value)} />
            </FormField>
            <FormField label="Counted Quantity">
              <input type="number" min="0" value={form.countedQty} onChange={(e) => update('countedQty', e.target.value)} />
            </FormField>
            <FormField label="Variance">
              <input type="text" value={form.countVariance} placeholder="e.g. -2 kg" onChange={(e) => update('countVariance', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Inventory Reports" subtitle="Tag items for stock valuation and analytics">
          <div className="form-grid">
            <FormField label="Report Category">
              <select value={form.reportCategory} onChange={(e) => update('reportCategory', e.target.value)}>
                {REPORT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Analytics Notes" full>
              <input type="text" value={form.analyticsNotes} onChange={(e) => update('analyticsNotes', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update Item' : 'Create Item'} />
      </form>
    </Modal>
  )
}

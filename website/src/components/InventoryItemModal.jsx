import { useEffect, useMemo, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'
import { todayISO } from '../utils/helpers'

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

function buildIssuedToOptions(employees = []) {
  const empOptions = employees.map((e) => ({
    value: `emp:${e.id}`,
    label: `${e.name} (${e.dept})`,
  }))
  const departments = [...new Set(employees.map((e) => e.dept).filter(Boolean))]
  const deptOptions = departments.map((d) => ({
    value: `dept:${d}`,
    label: `${d} Department`,
  }))
  return [...empOptions, ...deptOptions]
}

function issuedToLabel(value, employees) {
  const options = buildIssuedToOptions(employees)
  return options.find((o) => o.value === value)?.label || value || ''
}

function resolveIssuedToValue(editItem, employees) {
  if (editItem?.issuedToKey) return editItem.issuedToKey
  if (!editItem?.issuedTo) return ''
  const match = buildIssuedToOptions(employees).find((o) => o.label === editItem.issuedTo)
  return match?.value || editItem.issuedTo
}

const getEmpty = (employees = []) => {
  const issuedToOptions = buildIssuedToOptions(employees)
  return {
    name: '',
    skuCode: '',
    category: 'Food',
    unit: 'kg',
    storageLocation: STORAGE_LOCATIONS[0],
    itemDescription: '',
    stock: '',
    status: 'OK',
    quantityIssued: '',
    issuedToKey: issuedToOptions[0]?.value || '',
    issueDate: todayISO(),
    requestedBy: employees[0]?.name || '',
    purposeRemarks: '',
    approvalStatus: 'Pending',
  }
}

function resolveLocation(location) {
  if (!location) return STORAGE_LOCATIONS[0]
  if (STORAGE_LOCATIONS.includes(location)) return location
  return location
}

function itemToForm(editItem, employees) {
  if (!editItem) return getEmpty(employees)
  return {
    name: editItem.name || '',
    skuCode: editItem.skuCode || editItem.id || '',
    category: editItem.category || 'Food',
    unit: editItem.unit || 'kg',
    storageLocation: resolveLocation(editItem.storageLocation),
    itemDescription: editItem.itemDescription || '',
    stock: editItem.stock ?? '',
    status: editItem.status || 'OK',
    quantityIssued: editItem.quantityIssued ?? '',
    issuedToKey: resolveIssuedToValue(editItem, employees),
    issueDate: editItem.issueDate || todayISO(),
    requestedBy: editItem.requestedBy || employees[0]?.name || '',
    purposeRemarks: editItem.purposeRemarks || '',
    approvalStatus: editItem.approvalStatus || 'Pending',
    approvedBy: editItem.approvedBy || '',
    approvalDate: editItem.approvalDate || '',
  }
}

export default function InventoryItemModal({
  open, onClose, onSubmit, editItem = null, employees = [],
}) {
  const [form, setForm] = useState(getEmpty())
  const [errors, setErrors] = useState({})
  const isEdit = !!editItem

  const issuedToOptions = useMemo(() => buildIssuedToOptions(employees), [employees])
  const employeeNames = useMemo(() => employees.map((e) => e.name), [employees])

  useEffect(() => {
    if (!open) return
    setForm(itemToForm(editItem, employees))
    setErrors({})
  }, [open, editItem, employees])

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Item name is required'
    if (form.stock === '' || Number(form.stock) < 0) next.stock = 'Valid stock quantity is required'
    if (form.quantityIssued === '' || Number(form.quantityIssued) <= 0) {
      next.quantityIssued = 'Quantity issued is required'
    } else if (Number(form.quantityIssued) > Number(form.stock)) {
      next.quantityIssued = 'Cannot issue more than current stock'
    }
    if (!form.issuedToKey) next.issuedToKey = 'Issued to is required'
    if (!form.issueDate) next.issueDate = 'Issue date is required'
    if (!form.requestedBy) next.requestedBy = 'Requested by is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const stock = Number(form.stock)
    let status = form.status
    if (stock === 0) status = 'Out of Stock'
    else if (stock <= 15) status = 'Low Stock'

    onSubmit({
      name: form.name.trim(),
      skuCode: form.skuCode.trim(),
      category: form.category,
      unit: form.unit,
      storageLocation: form.storageLocation,
      itemDescription: form.itemDescription.trim(),
      stock,
      status,
      quantityIssued: Number(form.quantityIssued),
      issuedTo: issuedToLabel(form.issuedToKey, employees),
      issuedToKey: form.issuedToKey,
      issueDate: form.issueDate,
      requestedBy: form.requestedBy,
      purposeRemarks: form.purposeRemarks.trim(),
      approvalStatus: isEdit ? form.approvalStatus : 'Pending',
      approvedBy: form.approvedBy || '',
      approvalDate: form.approvalDate || '',
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

        <FormSection title="Issue Details" subtitle="Record stock issued to employee or department">
          <div className="form-grid">
            <FormField label="Quantity Issued" required error={errors.quantityIssued}>
              <input
                type="number"
                min="1"
                value={form.quantityIssued}
                onChange={(e) => update('quantityIssued', e.target.value)}
              />
            </FormField>
            <FormField label="Issued To (Employee/Department)" required error={errors.issuedToKey}>
              <select value={form.issuedToKey} onChange={(e) => update('issuedToKey', e.target.value)}>
                <option value="">— Select employee or department —</option>
                {issuedToOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Issue Date" required error={errors.issueDate}>
              <input type="date" value={form.issueDate} onChange={(e) => update('issueDate', e.target.value)} />
            </FormField>
            <FormField label="Requested By" required error={errors.requestedBy}>
              <select value={form.requestedBy} onChange={(e) => update('requestedBy', e.target.value)}>
                <option value="">— Select requester —</option>
                {employeeNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Purpose / Remarks" full>
              <textarea
                rows={2}
                value={form.purposeRemarks}
                placeholder="Reason for issue, requisition ref, etc."
                onChange={(e) => update('purposeRemarks', e.target.value)}
              />
            </FormField>
          </div>
          {!isEdit && (
            <p className="field-hint">Issue requests are sent to the General Manager for approval.</p>
          )}
        </FormSection>

        {isEdit && form.approvalStatus && form.approvalStatus !== 'Pending' && (
          <FormSection title="GM Approval" subtitle="Approval decision by General Manager">
            <div className="form-grid">
              <FormField label="Approval Status">
                <input type="text" value={form.approvalStatus} readOnly className="readonly-field" />
              </FormField>
              <FormField label="Approved By">
                <input type="text" value={form.approvedBy || '—'} readOnly className="readonly-field" />
              </FormField>
              <FormField label="Approval Date">
                <input type="text" value={form.approvalDate || '—'} readOnly className="readonly-field" />
              </FormField>
            </div>
          </FormSection>
        )}

        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update Item' : 'Submit for Approval'} />
      </form>
    </Modal>
  )
}

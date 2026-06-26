import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'

const SERVICES = ['Wash & Iron', 'Dry Clean', 'Express', 'Iron Only']
const STATUSES = ['Pickup Scheduled', 'In Progress', 'Quality Check', 'Ready', 'Delivered']
const TRACKING_STEPS = ['Received', 'Washing', 'Drying', 'Ironing', 'Quality Check', 'Ready', 'Delivered']
const INSPECTION_STATUSES = ['Pending', 'Passed', 'Failed', 'Rework Required']

const getEmpty = () => ({
  guest: '',
  room: '',
  items: '',
  service: 'Wash & Iron',
  amount: '',
  status: 'Pickup Scheduled',
  trackingStatus: 'Received',
  pickupTime: '',
  deliveryTime: '',
  itemTag: '',
  garmentCount: '',
  expressService: false,
  expressDeadline: '',
  inspectionStatus: 'Pending',
  inspectionNote: '',
  inspectedBy: '',
  serviceHistory: '',
  historyNote: '',
})

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  return {
    ...getEmpty(),
    ...editItem,
    amount: String(editItem.amount || '').replace(/[^\d.]/g, ''),
  }
}

export default function LaundryOrderModal({ open, onClose, onSubmit, editItem = null }) {
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

  const appendHistory = () => {
    if (!form.historyNote.trim()) return
    const stamp = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    const line = `${stamp} — ${form.trackingStatus}: ${form.historyNote.trim()}`
    setForm((prev) => ({
      ...prev,
      serviceHistory: prev.serviceHistory ? `${line}\n${prev.serviceHistory}` : line,
      historyNote: '',
    }))
  }

  const validate = () => {
    const next = {}
    if (!form.guest.trim()) next.guest = 'Guest is required'
    if (!form.room.trim()) next.room = 'Room is required'
    if (!form.items.trim()) next.items = 'Items are required'
    if (!form.amount) next.amount = 'Amount is required'
    if (form.expressService && !form.expressDeadline) next.expressDeadline = 'Express deadline is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      guest: form.guest.trim(),
      room: form.room.trim(),
      items: form.items.trim(),
      itemTag: form.itemTag.trim() || `TAG-${Date.now().toString().slice(-6)}`,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Laundry Order' : 'New Laundry Order'} wide>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Guest" required error={errors.guest}>
            <input type="text" value={form.guest} onChange={(e) => update('guest', e.target.value)} />
          </FormField>
          <FormField label="Room" required error={errors.room}>
            <input type="text" value={form.room} placeholder="e.g. 501" onChange={(e) => update('room', e.target.value)} />
          </FormField>
          <FormField label="Items" required error={errors.items} full>
            <input type="text" value={form.items} placeholder="Shirts x3, Trousers x2" onChange={(e) => update('items', e.target.value)} />
          </FormField>
          <FormField label="Service">
            <select value={form.service} onChange={(e) => update('service', e.target.value)}>
              {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Amount (₹)" required error={errors.amount}>
            <input type="number" min="0" value={form.amount} onChange={(e) => update('amount', e.target.value)} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
        </div>

        <FormSection title="Laundry Tracking" subtitle="Track order from pickup through delivery">
          <div className="form-grid">
            <FormField label="Tracking Stage">
              <select value={form.trackingStatus} onChange={(e) => update('trackingStatus', e.target.value)}>
                {TRACKING_STEPS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Pickup Time">
              <input type="datetime-local" value={form.pickupTime} onChange={(e) => update('pickupTime', e.target.value)} />
            </FormField>
            <FormField label="Delivery Time">
              <input type="datetime-local" value={form.deliveryTime} onChange={(e) => update('deliveryTime', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Item Inventory & Tagging" subtitle="Tag garments and track item counts">
          <div className="form-grid">
            <FormField label="Item Tag / Barcode">
              <input type="text" value={form.itemTag} placeholder="Auto-generated if blank" onChange={(e) => update('itemTag', e.target.value)} />
            </FormField>
            <FormField label="Garment Count">
              <input type="number" min="1" value={form.garmentCount} placeholder="Total pieces" onChange={(e) => update('garmentCount', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Express Laundry Service" subtitle="Priority turnaround for urgent guest requests">
          <div className="form-grid">
            <div className="form-field form-field-full">
              <label className="tax-option">
                <input type="checkbox" checked={form.expressService} onChange={(e) => update('expressService', e.target.checked)} />
                Express service (4-hour turnaround)
              </label>
            </div>
            <FormField label="Express Deadline" error={errors.expressDeadline}>
              <input type="datetime-local" value={form.expressDeadline} onChange={(e) => update('expressDeadline', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Quality Inspection" subtitle="Pre-delivery quality check and sign-off">
          <div className="form-grid">
            <FormField label="Inspection Status">
              <select value={form.inspectionStatus} onChange={(e) => update('inspectionStatus', e.target.value)}>
                {INSPECTION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Inspected By">
              <input type="text" value={form.inspectedBy} placeholder="Staff name" onChange={(e) => update('inspectedBy', e.target.value)} />
            </FormField>
            <FormField label="Inspection Notes" full>
              <textarea rows={2} value={form.inspectionNote} placeholder="Stain treatment, damage notes..." onChange={(e) => update('inspectionNote', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Laundry Service History" subtitle="Full audit trail of order status changes">
          {form.serviceHistory && <pre className="interaction-log">{form.serviceHistory}</pre>}
          <FormField label="Add History Entry" full>
            <div className="inline-field-row">
              <input type="text" value={form.historyNote} placeholder="e.g. Items sent to dry clean section" onChange={(e) => update('historyNote', e.target.value)} />
              <button type="button" className="btn btn-secondary btn-sm" onClick={appendHistory}>Add Entry</button>
            </div>
          </FormField>
        </FormSection>

        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update Order' : 'Create Order'} />
      </form>
    </Modal>
  )
}

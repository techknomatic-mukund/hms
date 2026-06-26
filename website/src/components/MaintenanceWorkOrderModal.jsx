import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent']
const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed']
const MAINTENANCE_TYPES = ['Corrective', 'Preventive', 'Emergency', 'Inspection']
const TRACKING_STATUSES = ['Assigned', 'En Route', 'On Site', 'Parts Ordered', 'Completed']
const COST_CATEGORIES = ['Room Repair', 'HVAC', 'Plumbing', 'Electrical', 'Elevator', 'General']

const getEmpty = () => ({
  asset: '',
  complaint: '',
  priority: 'Medium',
  assignee: 'Maintenance Team',
  status: 'Open',
  scheduledDate: '',
  scheduledTime: '',
  maintenanceType: 'Corrective',
  assetHistory: '',
  historyNote: '',
  spareParts: '',
  partsCost: '',
  technicianPhone: '',
  trackingStatus: 'Assigned',
  laborCost: '',
  totalCost: '',
  costCategory: 'General',
})

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  return { ...getEmpty(), ...editItem }
}

export default function MaintenanceWorkOrderModal({ open, onClose, onSubmit, editItem = null, technicians = [] }) {
  const [form, setForm] = useState(getEmpty())
  const [errors, setErrors] = useState({})
  const isEdit = !!editItem

  useEffect(() => {
    if (!open) return
    setForm(itemToForm(editItem))
    setErrors({})
  }, [open, editItem])

  const update = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'laborCost' || field === 'partsCost') {
        const labor = parseFloat(field === 'laborCost' ? value : prev.laborCost) || 0
        const parts = parseFloat(field === 'partsCost' ? value : prev.partsCost) || 0
        next.totalCost = labor + parts > 0 ? String(labor + parts) : ''
      }
      return next
    })
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const appendHistory = () => {
    if (!form.historyNote.trim()) return
    const stamp = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    const line = `${stamp} — ${form.maintenanceType}: ${form.historyNote.trim()}`
    setForm((prev) => ({
      ...prev,
      assetHistory: prev.assetHistory ? `${line}\n${prev.assetHistory}` : line,
      historyNote: '',
    }))
  }

  const validate = () => {
    const next = {}
    if (!form.asset.trim()) next.asset = 'Asset is required'
    if (!form.complaint.trim()) next.complaint = 'Complaint description is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      asset: form.asset.trim(),
      complaint: form.complaint.trim(),
      spareParts: form.spareParts.trim(),
    })
  }

  const techList = technicians.length ? technicians : ['Maintenance Team', 'Karan Singh', 'Electrical Team', 'HVAC Team']

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Work Order' : 'New Work Order'} wide>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Asset" required error={errors.asset} full>
            <input type="text" value={form.asset} placeholder="e.g. AC Unit — Room 305" onChange={(e) => update('asset', e.target.value)} />
          </FormField>
          <FormField label="Complaint" required error={errors.complaint} full>
            <textarea rows={2} value={form.complaint} onChange={(e) => update('complaint', e.target.value)} />
          </FormField>
          <FormField label="Priority">
            <select value={form.priority} onChange={(e) => update('priority', e.target.value)}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
        </div>

        <FormSection title="Maintenance Scheduling" subtitle="Plan preventive or corrective maintenance visits">
          <div className="form-grid">
            <FormField label="Maintenance Type">
              <select value={form.maintenanceType} onChange={(e) => update('maintenanceType', e.target.value)}>
                {MAINTENANCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Scheduled Date">
              <input type="date" value={form.scheduledDate} onChange={(e) => update('scheduledDate', e.target.value)} />
            </FormField>
            <FormField label="Scheduled Time">
              <input type="time" value={form.scheduledTime} onChange={(e) => update('scheduledTime', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Asset Maintenance History" subtitle="Complete service history for this asset">
          {form.assetHistory && <pre className="interaction-log">{form.assetHistory}</pre>}
          <FormField label="Add History Entry" full>
            <div className="inline-field-row">
              <input type="text" value={form.historyNote} placeholder="e.g. Filter replaced, coolant topped up" onChange={(e) => update('historyNote', e.target.value)} />
              <button type="button" className="btn btn-secondary btn-sm" onClick={appendHistory}>Add Entry</button>
            </div>
          </FormField>
        </FormSection>

        <FormSection title="Spare Parts Inventory" subtitle="Parts used and inventory deduction">
          <div className="form-grid">
            <FormField label="Spare Parts Used" full>
              <input type="text" value={form.spareParts} placeholder="e.g. AC filter x1, Capacitor x1" onChange={(e) => update('spareParts', e.target.value)} />
            </FormField>
            <FormField label="Parts Cost (₹)">
              <input type="number" min="0" value={form.partsCost} onChange={(e) => update('partsCost', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Technician Assignment & Tracking" subtitle="Assign technician and track field progress">
          <div className="form-grid">
            <FormField label="Technician">
              <select value={form.assignee} onChange={(e) => update('assignee', e.target.value)}>
                {techList.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Contact Phone">
              <input type="tel" value={form.technicianPhone} placeholder="+91..." onChange={(e) => update('technicianPhone', e.target.value)} />
            </FormField>
            <FormField label="Tracking Status">
              <select value={form.trackingStatus} onChange={(e) => update('trackingStatus', e.target.value)}>
                {TRACKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Maintenance Cost Analysis" subtitle="Labor, parts and total cost breakdown">
          <div className="form-grid">
            <FormField label="Cost Category">
              <select value={form.costCategory} onChange={(e) => update('costCategory', e.target.value)}>
                {COST_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Labor Cost (₹)">
              <input type="number" min="0" value={form.laborCost} onChange={(e) => update('laborCost', e.target.value)} />
            </FormField>
            <FormField label="Parts Cost (₹)">
              <input type="number" min="0" value={form.partsCost} onChange={(e) => update('partsCost', e.target.value)} />
            </FormField>
            <FormField label="Total Cost (₹)">
              <input type="number" min="0" value={form.totalCost} readOnly placeholder="Auto-calculated" />
            </FormField>
          </div>
        </FormSection>

        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update Work Order' : 'Create Work Order'} />
      </form>
    </Modal>
  )
}

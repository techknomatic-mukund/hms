import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { WO_TYPES, autoAssignTechnician } from '../utils/maintenanceHelpers'

const empty = {
  asset: '', complaint: '', type: 'Corrective', priority: 'Medium',
  assignee: '', technician: '', estCompletion: '', laborCost: '', partsCost: '',
  sparePartsUsed: '', status: 'Open', autoAssign: true,
}

export default function WorkOrderModal({ open, onClose, onSubmit, technicians, editItem = null }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (!open) return
    if (editItem) {
      setForm({
        asset: editItem.asset,
        complaint: editItem.complaint,
        type: editItem.type || 'Corrective',
        priority: editItem.priority,
        assignee: editItem.assignee,
        technician: editItem.technician || editItem.assignee,
        estCompletion: editItem.estCompletion || '',
        laborCost: String(editItem.laborCost || ''),
        partsCost: String(editItem.partsCost || ''),
        sparePartsUsed: editItem.sparePartsUsed || '',
        status: editItem.status,
        autoAssign: false,
      })
    } else {
      const tech = autoAssignTechnician(technicians)
      setForm({ ...empty, assignee: tech, technician: tech })
    }
  }, [open, editItem, technicians])

  const handleAutoAssign = () => {
    const tech = autoAssignTechnician(technicians)
    setForm((p) => ({ ...p, assignee: tech, technician: tech, autoAssign: true }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.asset.trim() || !form.complaint.trim()) return
    const tech = form.autoAssign && !editItem ? autoAssignTechnician(technicians) : form.technician
    onSubmit({
      asset: form.asset.trim(),
      complaint: form.complaint.trim(),
      type: form.type,
      priority: form.priority,
      assignee: tech,
      technician: tech,
      estCompletion: form.estCompletion || 'TBD',
      laborCost: parseFloat(form.laborCost) || 0,
      partsCost: parseFloat(form.partsCost) || 0,
      sparePartsUsed: form.sparePartsUsed.trim(),
      status: editItem ? form.status : 'Open',
      scheduledDate: editItem?.scheduledDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      history: editItem?.history || [{
        time: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        action: 'Created',
        detail: form.complaint.slice(0, 60),
      }],
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Work Order' : 'New Work Order'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Asset" required full>
            <input type="text" value={form.asset} onChange={(e) => setForm((p) => ({ ...p, asset: e.target.value }))} />
          </FormField>
          <FormField label="Complaint / Task" required full>
            <textarea rows={2} value={form.complaint} onChange={(e) => setForm((p) => ({ ...p, complaint: e.target.value }))} />
          </FormField>
          <FormField label="Type">
            <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
              {WO_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Priority">
            <select value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}>
              {['Low', 'Normal', 'Medium', 'High', 'Urgent'].map((p) => <option key={p}>{p}</option>)}
            </select>
          </FormField>
          <FormField label="Technician">
            <div className="assignee-row">
              <select value={form.technician} onChange={(e) => setForm((p) => ({ ...p, technician: e.target.value, assignee: e.target.value, autoAssign: false }))}>
                <option value="Maintenance Team">Maintenance Team</option>
                {technicians.filter((t) => t.status === 'Active').map((t) => (
                  <option key={t.id} value={t.name}>{t.name} — {t.specialty}</option>
                ))}
              </select>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleAutoAssign}>Auto-assign</button>
            </div>
          </FormField>
          <FormField label="Est. Completion">
            <input type="text" value={form.estCompletion} placeholder="25 Jun, 6 PM" onChange={(e) => setForm((p) => ({ ...p, estCompletion: e.target.value }))} />
          </FormField>
          <FormField label="Labor Cost (₹)">
            <input type="number" value={form.laborCost} onChange={(e) => setForm((p) => ({ ...p, laborCost: e.target.value }))} />
          </FormField>
          <FormField label="Parts Cost (₹)">
            <input type="number" value={form.partsCost} onChange={(e) => setForm((p) => ({ ...p, partsCost: e.target.value }))} />
          </FormField>
          <FormField label="Spare Parts Used" full>
            <input type="text" value={form.sparePartsUsed} placeholder="AC Filter, Refrigerant" onChange={(e) => setForm((p) => ({ ...p, sparePartsUsed: e.target.value }))} />
          </FormField>
          {editItem && (
            <FormField label="Status">
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                {['Open', 'Scheduled', 'In Progress', 'Resolved', 'Closed'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </FormField>
          )}
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update' : 'Create Work Order'} />
      </form>
    </Modal>
  )
}

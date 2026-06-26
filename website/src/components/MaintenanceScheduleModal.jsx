import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { formatDisplayDate } from '../utils/helpers'
import { MAINTENANCE_CATEGORIES, SCHEDULE_FREQUENCIES } from '../utils/maintenanceHelpers'

const empty = {
  asset: '', category: 'HVAC', frequency: 'Monthly',
  lastDone: '', nextDue: '', assignee: '', status: 'Scheduled', description: '',
}

export default function MaintenanceScheduleModal({ open, onClose, onSubmit, technicians, editItem = null }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (!open) return
    if (editItem) {
      setForm({
        asset: editItem.asset,
        category: editItem.category,
        frequency: editItem.frequency,
        lastDone: editItem.lastDoneIso || '',
        nextDue: editItem.nextDueIso || '',
        assignee: editItem.assignee,
        status: editItem.status,
        description: editItem.description || '',
      })
    } else {
      setForm(empty)
    }
  }, [open, editItem])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.asset.trim()) return
    onSubmit({
      asset: form.asset.trim(),
      category: form.category,
      frequency: form.frequency,
      lastDone: form.lastDone ? formatDisplayDate(form.lastDone) : '—',
      lastDoneIso: form.lastDone || '',
      nextDue: form.nextDue ? formatDisplayDate(form.nextDue) : '—',
      nextDueIso: form.nextDue || '',
      assignee: form.assignee || 'Unassigned',
      status: form.status,
      description: form.description.trim(),
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Schedule' : 'Schedule Preventive Maintenance'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Asset" required full>
            <input type="text" value={form.asset} placeholder="HVAC — Floor 3" onChange={(e) => setForm((p) => ({ ...p, asset: e.target.value }))} />
          </FormField>
          <FormField label="Category">
            <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
              {MAINTENANCE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="Frequency">
            <select value={form.frequency} onChange={(e) => setForm((p) => ({ ...p, frequency: e.target.value }))}>
              {SCHEDULE_FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </FormField>
          <FormField label="Last Done">
            <input type="date" value={form.lastDone} onChange={(e) => setForm((p) => ({ ...p, lastDone: e.target.value }))} />
          </FormField>
          <FormField label="Next Due">
            <input type="date" value={form.nextDue} min={form.lastDone || undefined} onChange={(e) => setForm((p) => ({ ...p, nextDue: e.target.value }))} />
          </FormField>
          <FormField label="Assignee">
            <select value={form.assignee} onChange={(e) => setForm((p) => ({ ...p, assignee: e.target.value }))}>
              <option value="">Unassigned</option>
              {technicians.filter((t) => t.status === 'Active').map((t) => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
              {['Scheduled', 'Due Soon', 'Upcoming', 'In Progress', 'Completed', 'Overdue'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Description" full>
            <textarea rows={2} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update' : 'Schedule'} />
      </form>
    </Modal>
  )
}

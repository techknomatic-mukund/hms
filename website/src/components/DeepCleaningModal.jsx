import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { formatDisplayDate } from '../utils/helpers'
import { DEEP_CLEAN_FREQUENCIES } from '../utils/housekeepingHelpers'

const empty = {
  area: '', type: 'Room', frequency: 'Monthly',
  lastDone: '', nextDue: '', assignee: '', status: 'Scheduled',
}

export default function DeepCleaningModal({ open, onClose, onSubmit, staff, editItem = null }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (!open) return
    if (editItem) {
      setForm({
        area: editItem.area,
        type: editItem.type,
        frequency: editItem.frequency,
        lastDone: editItem.lastDoneIso || '',
        nextDue: editItem.nextDueIso || '',
        assignee: editItem.assignee,
        status: editItem.status,
      })
    } else {
      setForm(empty)
    }
  }, [open, editItem])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.area.trim()) return
    onSubmit({
      area: form.area.trim(),
      type: form.type,
      frequency: form.frequency,
      lastDone: form.lastDone ? formatDisplayDate(form.lastDone) : '—',
      lastDoneIso: form.lastDone || '',
      nextDue: form.nextDue ? formatDisplayDate(form.nextDue) : '—',
      nextDueIso: form.nextDue || '',
      assignee: form.assignee || 'Unassigned',
      status: form.status,
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Deep Cleaning' : 'Schedule Deep Cleaning'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Area / Room" required full>
            <input type="text" value={form.area} placeholder="e.g. Deluxe 302 or Lobby" onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))} />
          </FormField>
          <FormField label="Type">
            <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
              {['Room', 'Public Area', 'Facility'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Frequency">
            <select value={form.frequency} onChange={(e) => setForm((p) => ({ ...p, frequency: e.target.value }))}>
              {DEEP_CLEAN_FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
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
              {staff.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
              {['Scheduled', 'Due Soon', 'Upcoming', 'In Progress', 'Completed', 'Overdue'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update' : 'Schedule'} />
      </form>
    </Modal>
  )
}

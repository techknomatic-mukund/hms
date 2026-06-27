import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'
import { ROOM_OPTIONS } from '../utils/reservationHelpers'

const PRIORITIES = ['Low', 'Normal', 'High', 'Urgent']
const STATUSES = ['Pending', 'In Progress', 'Completed', 'Scheduled']
const SHIFTS = ['Morning', 'Afternoon', 'Evening', 'Night']

const getEmpty = () => ({
  room: 'Standard 201',
  task: '',
  assignee: 'Unassigned',
  priority: 'Normal',
  status: 'Pending',
  scheduledDate: '',
  scheduledTime: '',
  shift: 'Morning',
})

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  return {
    room: editItem.room || 'Standard 201',
    task: editItem.task || '',
    assignee: editItem.assignee || 'Unassigned',
    priority: editItem.priority || 'Normal',
    status: editItem.status || 'Pending',
    scheduledDate: editItem.scheduledDate || '',
    scheduledTime: editItem.scheduledTime || '',
    shift: editItem.shift || 'Morning',
  }
}

export default function HousekeepingTaskModal({ open, onClose, onSubmit, editItem = null, staff = [] }) {
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
    if (!form.room.trim()) next.room = 'Room is required'
    if (!form.task.trim()) next.task = 'Task description is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ ...form, task: form.task.trim() })
  }

  const assignees = staff.length ? staff : ['Sneha Patel', 'Ravi Menon', 'Housekeeping Team']

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Housekeeping Task' : 'New Housekeeping Task'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Room" required error={errors.room}>
            <select value={form.room} onChange={(e) => update('room', e.target.value)}>
              {ROOM_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </FormField>
          <FormField label="Task" required error={errors.task} full>
            <input type="text" value={form.task} placeholder="e.g. Daily cleaning, Turndown service" onChange={(e) => update('task', e.target.value)} />
          </FormField>
        </div>

        <FormSection title="Task Assignment & Scheduling" subtitle="Assign staff and schedule cleaning tasks by shift">
          <div className="form-grid">
            <FormField label="Assignee">
              <select value={form.assignee} onChange={(e) => update('assignee', e.target.value)}>
                {assignees.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </FormField>
            <FormField label="Shift">
              <select value={form.shift} onChange={(e) => update('shift', e.target.value)}>
                {SHIFTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Scheduled Date">
              <input type="date" value={form.scheduledDate} onChange={(e) => update('scheduledDate', e.target.value)} />
            </FormField>
            <FormField label="Scheduled Time">
              <input type="time" value={form.scheduledTime} onChange={(e) => update('scheduledTime', e.target.value)} />
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
        </FormSection>

        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update Task' : 'Create Task'} />
      </form>
    </Modal>
  )
}

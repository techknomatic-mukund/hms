import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'
import { ROOM_OPTIONS } from '../utils/reservationHelpers'

const PRIORITIES = ['Low', 'Normal', 'High', 'Urgent']
const STATUSES = ['Pending', 'In Progress', 'Completed', 'Scheduled']
const SHIFTS = ['Morning', 'Afternoon', 'Evening', 'Night']
const CHECKLIST_ITEMS = ['Bed made', 'Bathroom cleaned', 'Floors mopped', 'Dust surfaces', 'Trash emptied', 'Windows cleaned']
const AMENITY_ITEMS = ['Towels', 'Soap', 'Shampoo', 'Toilet paper', 'Tea/coffee', 'Water bottles', 'Slippers']
const DEEP_CLEAN_TYPES = ['None', 'Weekly', 'Monthly', 'Post-checkout', 'Special request']

const getEmpty = () => ({
  room: 'Standard 201',
  task: '',
  assignee: 'Unassigned',
  priority: 'Normal',
  status: 'Pending',
  scheduledDate: '',
  scheduledTime: '',
  shift: 'Morning',
  cleaningChecklist: '',
  amenitiesReplenish: '',
  deepCleanRequired: false,
  deepCleanDate: '',
  deepCleanType: 'None',
  inspector: '',
  qualityScore: '',
  performanceNote: '',
})

function toggleChip(field, value, setForm) {
  setForm((prev) => {
    const items = prev[field] ? prev[field].split(', ').filter(Boolean) : []
    const next = items.includes(value) ? items.filter((i) => i !== value) : [...items, value]
    return { ...prev, [field]: next.join(', ') }
  })
}

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  return { ...getEmpty(), ...editItem }
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
    onSubmit({ ...form, task: form.task.trim(), performanceNote: form.performanceNote.trim() })
  }

  const assignees = staff.length ? staff : ['Sneha Patel', 'Ravi Menon', 'Housekeeping Team']

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Housekeeping Task' : 'New Housekeeping Task'} wide>
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

        <FormSection title="Cleaning Checklist" subtitle="Standard room cleaning checklist items">
          <div className="service-request-chips">
            {CHECKLIST_ITEMS.map((item) => {
              const active = form.cleaningChecklist.split(', ').filter(Boolean).includes(item)
              return (
                <button key={item} type="button" className={`chip-btn${active ? ' active' : ''}`} onClick={() => toggleChip('cleaningChecklist', item, setForm)}>
                  {item}
                </button>
              )
            })}
          </div>
        </FormSection>

        <FormSection title="Amenities Replenishment" subtitle="Track towels, toiletries and in-room supplies to restock">
          <div className="service-request-chips">
            {AMENITY_ITEMS.map((item) => {
              const active = form.amenitiesReplenish.split(', ').filter(Boolean).includes(item)
              return (
                <button key={item} type="button" className={`chip-btn${active ? ' active' : ''}`} onClick={() => toggleChip('amenitiesReplenish', item, setForm)}>
                  {item}
                </button>
              )
            })}
          </div>
        </FormSection>

        <FormSection title="Deep Cleaning Schedule" subtitle="Plan periodic or post-checkout deep cleaning">
          <div className="form-grid">
            <div className="form-field form-field-full">
              <label className="tax-option">
                <input type="checkbox" checked={form.deepCleanRequired} onChange={(e) => update('deepCleanRequired', e.target.checked)} />
                Deep cleaning required for this task
              </label>
            </div>
            <FormField label="Deep Clean Type">
              <select value={form.deepCleanType} onChange={(e) => update('deepCleanType', e.target.value)}>
                {DEEP_CLEAN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Deep Clean Date">
              <input type="date" value={form.deepCleanDate} onChange={(e) => update('deepCleanDate', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Housekeeping Performance Dashboard" subtitle="Quality inspection scores and performance notes">
          <div className="form-grid">
            <FormField label="Inspector">
              <input type="text" value={form.inspector} placeholder="Supervisor name" onChange={(e) => update('inspector', e.target.value)} />
            </FormField>
            <FormField label="Quality Score (1–10)">
              <input type="number" min="1" max="10" value={form.qualityScore} onChange={(e) => update('qualityScore', e.target.value)} />
            </FormField>
            <FormField label="Performance Notes" full>
              <textarea rows={2} value={form.performanceNote} placeholder="Inspection feedback, areas for improvement..." onChange={(e) => update('performanceNote', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update Task' : 'Create Task'} />
      </form>
    </Modal>
  )
}

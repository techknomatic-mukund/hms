import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { TASK_TYPES, SHIFTS, autoAssignStaff } from '../utils/housekeepingHelpers'

const empty = {
  room: '', task: '', taskType: 'Daily', assignee: '',
  shift: 'Morning (7 AM – 3 PM)', scheduledTime: '09:00',
  priority: 'Normal', status: 'Pending', estimatedMins: '30', autoAssign: true,
}

export default function HousekeepingTaskModal({
  open, onClose, onSubmit, rooms, staff, editItem = null,
}) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (!open) return
    if (editItem) {
      setForm({
        room: editItem.room,
        task: editItem.task,
        taskType: editItem.taskType || 'Daily',
        assignee: editItem.assignee,
        shift: editItem.shift || 'Morning (7 AM – 3 PM)',
        scheduledTime: editItem.scheduledTime || '09:00',
        priority: editItem.priority,
        status: editItem.status,
        estimatedMins: String(editItem.estimatedMins || 30),
        autoAssign: false,
      })
    } else {
      setForm({ ...empty, assignee: autoAssignStaff(staff) })
    }
  }, [open, editItem, staff])

  const handleAutoAssign = () => {
    setForm((p) => ({ ...p, assignee: autoAssignStaff(staff), autoAssign: true }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.room || !form.task.trim()) return
    const assignee = form.autoAssign && !editItem ? autoAssignStaff(staff) : form.assignee
    onSubmit({
      room: form.room,
      task: form.task.trim(),
      taskType: form.taskType,
      assignee: assignee || 'Unassigned',
      shift: form.shift,
      scheduledTime: form.scheduledTime,
      priority: form.priority,
      status: editItem ? form.status : 'Pending',
      estimatedMins: parseInt(form.estimatedMins, 10) || 30,
      checklistProgress: editItem?.checklistProgress || 0,
    })
    onClose()
  }

  const roomOptions = rooms.map((r) => `${r.type} ${r.number}`)

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Task' : 'Assign Housekeeping Task'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Room" required>
            <select value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))}>
              <option value="">— Select room —</option>
              {roomOptions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </FormField>
          <FormField label="Task Type">
            <select value={form.taskType} onChange={(e) => setForm((p) => ({ ...p, taskType: e.target.value }))}>
              {TASK_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Task Description" required full>
            <input type="text" value={form.task} onChange={(e) => setForm((p) => ({ ...p, task: e.target.value }))} />
          </FormField>
          <FormField label="Shift">
            <select value={form.shift} onChange={(e) => setForm((p) => ({ ...p, shift: e.target.value }))}>
              {SHIFTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Scheduled Time">
            <input type="time" value={form.scheduledTime} onChange={(e) => setForm((p) => ({ ...p, scheduledTime: e.target.value }))} />
          </FormField>
          <FormField label="Est. Minutes">
            <input type="number" value={form.estimatedMins} onChange={(e) => setForm((p) => ({ ...p, estimatedMins: e.target.value }))} />
          </FormField>
          <FormField label="Assignee">
            <div className="assignee-row">
              <select value={form.assignee} onChange={(e) => setForm((p) => ({ ...p, assignee: e.target.value, autoAssign: false }))}>
                <option value="Unassigned">Unassigned</option>
                {staff.filter((s) => s.status === 'Active').map((s) => (
                  <option key={s.id} value={s.name}>{s.name} ({s.shift})</option>
                ))}
              </select>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleAutoAssign}>Auto-assign</button>
            </div>
          </FormField>
          <FormField label="Priority">
            <select value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}>
              {['Low', 'Normal', 'High', 'Urgent'].map((p) => <option key={p}>{p}</option>)}
            </select>
          </FormField>
          {editItem && (
            <FormField label="Status">
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                {['Pending', 'Scheduled', 'In Progress', 'Completed'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </FormField>
          )}
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update Task' : 'Assign Task'} />
      </form>
    </Modal>
  )
}

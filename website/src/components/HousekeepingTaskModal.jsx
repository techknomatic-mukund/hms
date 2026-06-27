import { useEffect, useMemo, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'
import {
  HK_CHECKLIST_ITEMS,
  availableFloors,
  emptyHousekeepingChecklist,
  findGuestForRoom,
  floorFromRoomLabel,
  parseHousekeepingChecklist,
  roomsOnFloor,
} from '../utils/reservationHelpers'

const PRIORITIES = ['Low', 'Normal', 'High', 'Urgent']
const STATUSES = ['Pending', 'In Progress', 'Completed', 'Scheduled']
const SHIFTS = ['Morning', 'Afternoon', 'Evening', 'Night']

const getEmpty = (rooms = [], reservations = []) => {
  const floors = availableFloors(rooms)
  const floor = floors[0] ?? ''
  const floorRooms = roomsOnFloor(floor, rooms)
  const room = floorRooms[0] || ''
  const guest = findGuestForRoom(reservations, room)
  return {
    floor: floor === '' ? '' : String(floor),
    room,
    guestName: guest.guestName,
    checkInDate: guest.checkInDate,
    task: '',
    assignee: 'Unassigned',
    priority: 'Normal',
    status: 'Pending',
    scheduledDate: '',
    scheduledTime: '',
    shift: 'Morning',
    checklist: emptyHousekeepingChecklist(),
  }
}

function itemToForm(editItem, reservations, rooms) {
  if (!editItem) return getEmpty(rooms, reservations)

  const floor = editItem.floor != null && editItem.floor !== ''
    ? String(editItem.floor)
    : String(floorFromRoomLabel(editItem.room) || availableFloors(rooms)[0] || '')
  const room = editItem.room || roomsOnFloor(floor, rooms)[0] || ''
  const guest = findGuestForRoom(reservations, room)

  return {
    floor,
    room,
    guestName: editItem.guestName || guest.guestName,
    checkInDate: editItem.checkInDate || guest.checkInDate,
    task: editItem.task || '',
    assignee: editItem.assignee || 'Unassigned',
    priority: editItem.priority || 'Normal',
    status: editItem.status || 'Pending',
    scheduledDate: editItem.scheduledDate || '',
    scheduledTime: editItem.scheduledTime || '',
    shift: editItem.shift || 'Morning',
    checklist: parseHousekeepingChecklist(editItem),
  }
}

export default function HousekeepingTaskModal({
  open, onClose, onSubmit, editItem = null, staff = [], reservations = [], rooms = [],
}) {
  const [form, setForm] = useState(getEmpty(rooms))
  const [errors, setErrors] = useState({})
  const isEdit = !!editItem

  const floors = useMemo(() => availableFloors(rooms), [rooms])
  const floorRooms = useMemo(() => roomsOnFloor(form.floor, rooms), [form.floor, rooms])

  useEffect(() => {
    if (!open) return
    setForm(itemToForm(editItem, reservations, rooms))
    setErrors({})
  }, [open, editItem, reservations, rooms])

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleFloorChange = (floor) => {
    const nextRooms = roomsOnFloor(floor, rooms)
    const room = nextRooms[0] || ''
    const guest = findGuestForRoom(reservations, room)
    setForm((prev) => ({
      ...prev,
      floor,
      room,
      guestName: guest.guestName,
      checkInDate: guest.checkInDate,
    }))
    setErrors((prev) => ({ ...prev, floor: '', room: '' }))
  }

  const handleRoomChange = (room) => {
    const guest = findGuestForRoom(reservations, room)
    setForm((prev) => ({
      ...prev,
      room,
      guestName: guest.guestName,
      checkInDate: guest.checkInDate,
    }))
    setErrors((prev) => ({ ...prev, room: '' }))
  }

  const toggleChecklist = (key) => {
    setForm((prev) => ({
      ...prev,
      checklist: { ...prev.checklist, [key]: !prev.checklist[key] },
    }))
  }

  const validate = () => {
    const next = {}
    if (form.floor === '') next.floor = 'Floor is required'
    if (!form.room.trim()) next.room = 'Room is required'
    if (!form.task.trim()) next.task = 'Task description is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      floor: Number(form.floor),
      task: form.task.trim(),
      guestName: form.guestName || '—',
      checkInDate: form.checkInDate || '—',
    })
  }

  const assignees = staff.length ? staff : ['Sneha Patel', 'Ravi Menon', 'Housekeeping Team']
  const checklistDone = HK_CHECKLIST_ITEMS.filter(({ key }) => form.checklist[key]).length

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Housekeeping Task' : 'New Housekeeping Task'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <FormSection title="Room Details" subtitle="Select floor and room — guest details auto-fill from active reservation">
          <div className="form-grid">
            <FormField label="Floor" required error={errors.floor}>
              <select value={form.floor} onChange={(e) => handleFloorChange(e.target.value)}>
                <option value="">— Select floor —</option>
                {floors.map((f) => <option key={f} value={String(f)}>Floor {f}</option>)}
              </select>
            </FormField>
            <FormField label="Room" required error={errors.room}>
              <select
                value={form.room}
                onChange={(e) => handleRoomChange(e.target.value)}
                disabled={!form.floor || !floorRooms.length}
              >
                {!floorRooms.length && <option value="">No rooms on this floor</option>}
                {floorRooms.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </FormField>
            <FormField label="Guest Name">
              <input type="text" value={form.guestName || '—'} readOnly className="readonly-field" />
            </FormField>
            <FormField label="Check-In Date">
              <input type="text" value={form.checkInDate || '—'} readOnly className="readonly-field" />
            </FormField>
            <FormField label="Task" required error={errors.task} full>
              <input
                type="text"
                value={form.task}
                placeholder="e.g. Daily cleaning, Turndown service"
                onChange={(e) => update('task', e.target.value)}
              />
            </FormField>
          </div>
        </FormSection>

        {isEdit && (
          <FormSection
            title="Cleaning Checklist"
            subtitle={`${checklistDone} of ${HK_CHECKLIST_ITEMS.length} items completed`}
          >
            <ul className="hk-checklist">
              {HK_CHECKLIST_ITEMS.map(({ key, label }) => (
                <li key={key}>
                  <label className="hk-checklist-item">
                    <input
                      type="checkbox"
                      checked={Boolean(form.checklist[key])}
                      onChange={() => toggleChecklist(key)}
                    />
                    <span>{label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </FormSection>
        )}

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

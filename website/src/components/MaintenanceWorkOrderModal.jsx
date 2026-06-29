import { useEffect, useMemo, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'
import { todayISO } from '../utils/helpers'
import { ROOM_OPTIONS } from '../utils/reservationHelpers'

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent']
const STATUSES = ['Pending', 'On-going', 'Completed']
const COMMON_AREA = 'Common Area'
const GENERIC_TEAM = 'Maintenance Team'

const ROOM_ASSET_TYPES = ['AC Unit', 'Plumbing', 'Electrical', 'HVAC', 'Door Lock', 'TV / Entertainment']
const BUILDING_ASSETS = [
  'Elevator A',
  'Elevator B',
  'Boiler Room',
  'Generator',
  'Kitchen Exhaust System',
  'Pool Pump',
  'Laundry Equipment',
  'Main Electrical Panel',
  'Fire Safety System',
]

function resolveRoomValue(room) {
  if (!room) return ROOM_OPTIONS[0]
  if (room === COMMON_AREA) return COMMON_AREA
  if (ROOM_OPTIONS.includes(room)) return room
  const byNumber = ROOM_OPTIONS.find((r) => r.split(' ').pop() === String(room).replace(/^Room\s+/i, ''))
  return byNumber || ROOM_OPTIONS[0]
}

function parseAssetFields(editItem) {
  const asset = editItem?.asset || ''
  const storedRoom = editItem?.room

  if (storedRoom) {
    const room = resolveRoomValue(storedRoom)
    if (room === COMMON_AREA) {
      const assetType = BUILDING_ASSETS.includes(asset) ? asset : BUILDING_ASSETS[0]
      return { room, assetType }
    }
    if (asset.includes(' — ')) {
      const assetType = asset.split(' — ')[0].trim()
      return {
        room,
        assetType: ROOM_ASSET_TYPES.includes(assetType) ? assetType : ROOM_ASSET_TYPES[0],
      }
    }
    return { room, assetType: ROOM_ASSET_TYPES[0] }
  }

  if (BUILDING_ASSETS.includes(asset)) {
    return { room: COMMON_AREA, assetType: asset }
  }

  if (asset.includes(' — ')) {
    const [assetType, ...rest] = asset.split(' — ')
    const roomPart = rest.join(' — ').trim()
    const room = ROOM_OPTIONS.find(
      (r) => r === roomPart || r.split(' ').pop() === roomPart.replace(/^Room\s+/i, ''),
    ) || ROOM_OPTIONS[0]
    return {
      room,
      assetType: ROOM_ASSET_TYPES.includes(assetType.trim()) ? assetType.trim() : ROOM_ASSET_TYPES[0],
    }
  }

  return { room: ROOM_OPTIONS[0], assetType: ROOM_ASSET_TYPES[0] }
}

function buildAssetLabel(room, assetType) {
  return room === COMMON_AREA ? assetType : `${assetType} — ${room}`
}

function resolveStaffId(technicians, editItem) {
  if (editItem?.employeeId && technicians.some((t) => t.id === editItem.employeeId)) {
    return editItem.employeeId
  }
  if (editItem?.assignee === GENERIC_TEAM) return GENERIC_TEAM
  const byName = technicians.find((t) => t.name === editItem?.assignee)
  return byName?.id || GENERIC_TEAM
}

const getEmpty = (technicians = []) => {
  const defaultTech = technicians[0]
  return {
    room: ROOM_OPTIONS[0],
    assetType: ROOM_ASSET_TYPES[0],
    complaint: '',
    priority: 'Medium',
    staffId: defaultTech?.id || GENERIC_TEAM,
    assignee: defaultTech?.name || GENERIC_TEAM,
    employeeId: defaultTech?.id || '',
    scheduledDate: todayISO(),
    scheduledTime: '09:00',
    status: 'Pending',
  }
}

function itemToForm(editItem, technicians) {
  if (!editItem) return getEmpty(technicians)
  const { room, assetType } = parseAssetFields(editItem)
  const staffId = resolveStaffId(technicians, editItem)
  const isGeneric = staffId === GENERIC_TEAM
  return {
    room,
    assetType,
    complaint: editItem.complaint || '',
    priority: editItem.priority || 'Medium',
    staffId,
    assignee: editItem.assignee || GENERIC_TEAM,
    employeeId: isGeneric ? '' : (editItem.employeeId || staffId),
    scheduledDate: editItem.scheduledDate || todayISO(),
    scheduledTime: editItem.scheduledTime || '09:00',
    status: editItem.status || 'Open',
  }
}

export default function MaintenanceWorkOrderModal({
  open, onClose, onSubmit, editItem = null, technicians = [], requestOnly = false,
}) {
  const [form, setForm] = useState(getEmpty())
  const [errors, setErrors] = useState({})
  const isEdit = !!editItem

  useEffect(() => {
    if (!open) return
    setForm(itemToForm(editItem, technicians))
    setErrors({})
  }, [open, editItem, technicians])

  const assetOptions = useMemo(
    () => (form.room === COMMON_AREA ? BUILDING_ASSETS : ROOM_ASSET_TYPES),
    [form.room],
  )

  const update = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'room') {
        const options = value === COMMON_AREA ? BUILDING_ASSETS : ROOM_ASSET_TYPES
        if (!options.includes(prev.assetType)) {
          next.assetType = options[0]
        }
      }
      return next
    })
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleStaffChange = (staffId) => {
    if (staffId === GENERIC_TEAM) {
      setForm((prev) => ({
        ...prev,
        staffId: GENERIC_TEAM,
        assignee: GENERIC_TEAM,
        employeeId: '',
      }))
    } else {
      const tech = technicians.find((t) => t.id === staffId)
      setForm((prev) => ({
        ...prev,
        staffId,
        assignee: tech?.name || GENERIC_TEAM,
        employeeId: tech?.id || '',
      }))
    }
    setErrors((prev) => ({ ...prev, staffId: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.room) next.room = 'Room is required'
    if (!form.assetType) next.assetType = 'Asset is required'
    if (!form.complaint.trim()) next.complaint = 'Complaint description is required'
    if (!requestOnly) {
      if (!form.staffId) next.staffId = 'Select assigned person'
      if (!form.scheduledDate) next.scheduledDate = 'Scheduled date is required'
      if (!form.scheduledTime) next.scheduledTime = 'Time is required'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const payload = {
      room: form.room,
      asset: buildAssetLabel(form.room, form.assetType),
      complaint: form.complaint.trim(),
      priority: form.priority,
    }
    if (requestOnly) {
      onSubmit(payload)
      return
    }
    onSubmit({
      ...payload,
      assignee: form.assignee,
      employeeId: form.employeeId || '',
      scheduledDate: form.scheduledDate,
      scheduledTime: form.scheduledTime,
      status: form.status,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Work Order' : (requestOnly ? 'Raise Maintenance Request' : 'New Work Order')}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <FormSection title={requestOnly ? 'Maintenance Request' : 'Work Order Details'} subtitle={requestOnly ? 'Describe the issue — Maintenance team will review' : undefined}>
          <div className="form-grid">
            <FormField label="Room" required error={errors.room}>
              <select value={form.room} onChange={(e) => update('room', e.target.value)}>
                {ROOM_OPTIONS.map((room) => <option key={room} value={room}>{room}</option>)}
                <option value={COMMON_AREA}>{COMMON_AREA}</option>
              </select>
            </FormField>
            <FormField label="Asset" required error={errors.assetType}>
              <select value={form.assetType} onChange={(e) => update('assetType', e.target.value)}>
                {assetOptions.map((a) => <option key={a} value={a}>{a}</option>)}
                {!assetOptions.includes(form.assetType) && form.assetType && (
                  <option value={form.assetType}>{form.assetType}</option>
                )}
              </select>
            </FormField>
            <FormField label="Complaint" required error={errors.complaint} full>
              <textarea rows={2} value={form.complaint} onChange={(e) => update('complaint', e.target.value)} />
            </FormField>
            <FormField label="Priority">
              <select value={form.priority} onChange={(e) => update('priority', e.target.value)}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormField>
            {!requestOnly && (
              <FormField label="Status">
                <select value={form.status} onChange={(e) => update('status', e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>
            )}
          </div>
        </FormSection>

        {!requestOnly && (
          <FormSection title="Task Assignment" subtitle="Schedule time and assign technician">
            <div className="form-grid">
              <FormField label="Assigned To" required error={errors.staffId}>
                <select value={form.staffId} onChange={(e) => handleStaffChange(e.target.value)}>
                  <option value={GENERIC_TEAM}>{GENERIC_TEAM}</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Employee ID">
                <input type="text" value={form.employeeId || '—'} readOnly className="readonly-field" />
              </FormField>
              <FormField label="Scheduled Date" required error={errors.scheduledDate}>
                <input type="date" value={form.scheduledDate} onChange={(e) => update('scheduledDate', e.target.value)} />
              </FormField>
              <FormField label="Time" required error={errors.scheduledTime}>
                <input type="time" value={form.scheduledTime} onChange={(e) => update('scheduledTime', e.target.value)} />
              </FormField>
            </div>
          </FormSection>
        )}

        {requestOnly && (
          <p className="field-hint">Your request will be sent to the Maintenance team for approval.</p>
        )}

        <FormActions
          onCancel={onClose}
          submitLabel={isEdit ? 'Update Work Order' : (requestOnly ? 'Submit Request' : 'Create Work Order')}
        />
      </form>
    </Modal>
  )
}

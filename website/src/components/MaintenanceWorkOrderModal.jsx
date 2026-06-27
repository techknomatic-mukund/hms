import { useEffect, useMemo, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { ROOM_OPTIONS } from '../utils/reservationHelpers'

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent']
const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed']
const COMMON_AREA = 'Common Area'

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

const getEmpty = () => ({
  room: ROOM_OPTIONS[0],
  assetType: ROOM_ASSET_TYPES[0],
  complaint: '',
  priority: 'Medium',
  assignee: 'Maintenance Team',
  status: 'Open',
})

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  const { room, assetType } = parseAssetFields(editItem)
  return {
    room,
    assetType,
    complaint: editItem.complaint || '',
    priority: editItem.priority || 'Medium',
    assignee: editItem.assignee || 'Maintenance Team',
    status: editItem.status || 'Open',
  }
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

  const validate = () => {
    const next = {}
    if (!form.room) next.room = 'Room is required'
    if (!form.assetType) next.assetType = 'Asset is required'
    if (!form.complaint.trim()) next.complaint = 'Complaint description is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      room: form.room,
      asset: buildAssetLabel(form.room, form.assetType),
      complaint: form.complaint.trim(),
      priority: form.priority,
      assignee: form.assignee,
      status: form.status,
    })
  }

  const techList = technicians.length ? technicians : ['Maintenance Team', 'Karan Singh', 'Electrical Team', 'HVAC Team']

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Work Order' : 'New Work Order'}>
      <form className="entity-form" onSubmit={handleSubmit}>
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
          <FormField label="Status">
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Technician" full>
            <select value={form.assignee} onChange={(e) => update('assignee', e.target.value)}>
              {techList.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update Work Order' : 'Create Work Order'} />
      </form>
    </Modal>
  )
}

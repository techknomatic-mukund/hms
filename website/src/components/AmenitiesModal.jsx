import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { AMENITY_ITEMS } from '../utils/housekeepingHelpers'

const empty = {
  room: '', staff: '', items: [], notes: '', status: 'Pending',
}

export default function AmenitiesModal({ open, onClose, onSubmit, rooms, staff, editItem = null }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (!open) return
    if (editItem) {
      setForm({
        room: editItem.room,
        staff: editItem.staff,
        items: editItem.items.split(', ').filter(Boolean),
        notes: '',
        status: editItem.status,
      })
    } else {
      setForm(empty)
    }
  }, [open, editItem])

  const toggleItem = (item) => {
    setForm((p) => ({
      ...p,
      items: p.items.includes(item) ? p.items.filter((x) => x !== item) : [...p.items, item],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.room || !form.items.length) return
    onSubmit({
      room: form.room,
      staff: form.staff || 'Unassigned',
      items: form.items.join(', '),
      status: editItem ? form.status : 'Pending',
      date: editItem?.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    })
    onClose()
  }

  const roomOptions = rooms.map((r) => `${r.type} ${r.number}`)

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Update Replenishment' : 'Record Amenities Replenishment'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Room" required>
            <select value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))}>
              <option value="">— Select —</option>
              {roomOptions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </FormField>
          <FormField label="Staff">
            <select value={form.staff} onChange={(e) => setForm((p) => ({ ...p, staff: e.target.value }))}>
              <option value="">Unassigned</option>
              {staff.filter((s) => s.status === 'Active').map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </FormField>
          {editItem && (
            <FormField label="Status">
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                {['Pending', 'In Progress', 'Completed'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </FormField>
          )}
          <div className="form-field form-field-full">
            <span>Items Replenished *</span>
            <div className="amenity-check-grid">
              {AMENITY_ITEMS.map((item) => (
                <label key={item} className={`room-check${form.items.includes(item) ? ' selected' : ''}`}>
                  <input type="checkbox" checked={form.items.includes(item)} onChange={() => toggleItem(item)} />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update' : 'Save Record'} />
      </form>
    </Modal>
  )
}

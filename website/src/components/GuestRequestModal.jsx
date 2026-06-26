import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { REQUEST_TYPES } from '../utils/frontOfficeHelpers'

const empty = {
  guest: '', room: '', requestType: 'Housekeeping', department: 'Housekeeping',
  priority: 'Normal', notes: '', status: 'Open',
}

export default function GuestRequestModal({
  open, onClose, onSubmit, reservations, editItem = null,
}) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (!open) return
    if (editItem) {
      setForm({
        guest: editItem.guest,
        room: editItem.room,
        requestType: editItem.requestType,
        department: editItem.department,
        priority: editItem.priority,
        notes: editItem.notes || '',
        status: editItem.status,
      })
    } else {
      setForm(empty)
    }
  }, [open, editItem])

  const pickGuest = (resId) => {
    const res = reservations.find((r) => r.id === resId)
    if (!res) return
    setForm((p) => ({ ...p, guest: res.guest, room: res.room }))
  }

  const setRequestType = (type) => {
    setForm((p) => ({
      ...p,
      requestType: type,
      department: REQUEST_TYPES[type] || p.department,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.guest.trim() || !form.room.trim()) return
    onSubmit({
      guest: form.guest.trim(),
      room: form.room.trim(),
      requestType: form.requestType,
      department: form.department,
      priority: form.priority,
      notes: form.notes.trim(),
      status: editItem ? form.status : 'Open',
      created: editItem?.created || new Date().toLocaleString('en-GB', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      }),
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Update Service Request' : 'New Guest Request'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Guest Reservation" full>
            <select onChange={(e) => pickGuest(e.target.value)} defaultValue="">
              <option value="">— Pick from reservation —</option>
              {reservations.filter((r) => r.status !== 'Checked Out').map((r) => (
                <option key={r.id} value={r.id}>{r.guest} — {r.room}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Guest Name" required>
            <input type="text" value={form.guest} onChange={(e) => setForm((p) => ({ ...p, guest: e.target.value }))} />
          </FormField>
          <FormField label="Room" required>
            <input type="text" value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))} />
          </FormField>
          <FormField label="Request Type" required>
            <select value={form.requestType} onChange={(e) => setRequestType(e.target.value)}>
              {Object.keys(REQUEST_TYPES).map((t) => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Routed To">
            <input type="text" readOnly value={form.department} className="readonly-field" />
          </FormField>
          <FormField label="Priority">
            <select value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}>
              {['Low', 'Normal', 'Medium', 'High', 'Urgent'].map((p) => <option key={p}>{p}</option>)}
            </select>
          </FormField>
          {editItem && (
            <FormField label="Status">
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                {['Open', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </FormField>
          )}
          <FormField label="Notes / Instructions" full>
            <textarea rows={3} value={form.notes} placeholder="Details for the department..." onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update Request' : 'Submit Request'} />
      </form>
    </Modal>
  )
}

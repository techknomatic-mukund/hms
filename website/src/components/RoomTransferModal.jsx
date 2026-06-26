import { useEffect, useMemo, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { ROOM_OPTIONS, getRoomBookingConflicts, normalizeReservation, roomConflictLabel } from '../utils/reservationHelpers'

const TRANSFER_TYPES = ['Room Upgrade', 'Room Downgrade', 'Room Transfer']

export default function RoomTransferModal({ open, onClose, onSubmit, reservations, preselected = null }) {
  const [form, setForm] = useState({ reservationId: '', newRoom: '', transferType: 'Room Transfer', reason: '' })

  useEffect(() => {
    if (!open) return
    setForm({
      reservationId: preselected?.id || '',
      newRoom: '',
      transferType: 'Room Transfer',
      reason: '',
    })
  }, [open, preselected])

  const selected = reservations.find((r) => r.id === form.reservationId)
  const stay = selected ? normalizeReservation(selected) : null

  const roomConflicts = useMemo(() => {
    if (!stay?.checkInIso || !stay?.checkOutIso) return {}
    return getRoomBookingConflicts(reservations, stay.checkInIso, stay.checkOutIso, selected?.id)
  }, [reservations, stay?.checkInIso, stay?.checkOutIso, selected?.id])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.reservationId || !form.newRoom) return
    if (roomConflicts[form.newRoom]) return
    onSubmit(form.reservationId, {
      newRoom: form.newRoom,
      transferType: form.transferType,
      reason: form.reason.trim(),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Room Upgrade / Transfer">
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Reservation" required full>
            <select value={form.reservationId} onChange={(e) => setForm((p) => ({ ...p, reservationId: e.target.value }))}>
              <option value="">— Select reservation —</option>
              {reservations.filter((r) => r.status !== 'Checked Out' && r.status !== 'Cancelled').map((r) => (
                <option key={r.id} value={r.id}>{r.id} — {r.guest} ({r.room})</option>
              ))}
            </select>
          </FormField>

          {selected && (
            <FormField label="Current Room" full>
              <input type="text" readOnly value={`${selected.room}${selected.rooms?.length > 1 ? ` (+${selected.rooms.length - 1} more)` : ''}`} />
            </FormField>
          )}

          <FormField label="Transfer Type" required>
            <select value={form.transferType} onChange={(e) => setForm((p) => ({ ...p, transferType: e.target.value }))}>
              {TRANSFER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>

          <FormField label="New Room" required>
            <select value={form.newRoom} onChange={(e) => setForm((p) => ({ ...p, newRoom: e.target.value }))}>
              <option value="">— Select new room —</option>
              {ROOM_OPTIONS.filter((rm) => rm !== selected?.room).map((r) => {
                const conflict = roomConflicts[r]?.[0]
                return (
                  <option key={r} value={r} disabled={Boolean(conflict)}>
                    {r}{conflict ? ' — This room is booked on that day' : ''}
                  </option>
                )
              })}
            </select>
            {form.newRoom && roomConflicts[form.newRoom] && (
              <em className="form-error">{roomConflictLabel(roomConflicts[form.newRoom][0])}</em>
            )}
          </FormField>

          <FormField label="Reason / Notes" full>
            <textarea rows={2} value={form.reason} placeholder="Guest request, maintenance, upgrade offer..." onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} />
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel="Apply Transfer" />
      </form>
    </Modal>
  )
}

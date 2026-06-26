import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { todayDisplay } from '../utils/helpers'

const CHANNELS = ['QR Code', 'Voice of Customer', 'Front Desk', 'Customer Portal']

export default function CollectFeedbackModal({ open, onClose, onSubmit, editItem = null }) {
  const [form, setForm] = useState({ guest: '', rating: '5', channel: 'QR Code', comment: '' })

  useEffect(() => {
    if (!open) return
    setForm(editItem ? { guest: editItem.guest, rating: String(editItem.rating), channel: editItem.channel, comment: editItem.comment } : { guest: '', rating: '5', channel: 'QR Code', comment: '' })
  }, [open, editItem])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.comment.trim()) return
    onSubmit({
      guest: form.guest.trim() || 'Anonymous',
      rating: parseInt(form.rating, 10),
      channel: form.channel,
      comment: form.comment.trim(),
      date: editItem?.date || todayDisplay(),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Feedback' : 'Collect Feedback'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Guest"><input value={form.guest} onChange={(e) => setForm((p) => ({ ...p, guest: e.target.value }))} /></FormField>
          <FormField label="Channel"><select value={form.channel} onChange={(e) => setForm((p) => ({ ...p, channel: e.target.value }))}>{CHANNELS.map((c) => <option key={c}>{c}</option>)}</select></FormField>
          <FormField label="Rating" full><select value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))}>{[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} ★</option>)}</select></FormField>
          <FormField label="Comment" required full><textarea rows={3} value={form.comment} onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))} /></FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update' : 'Submit'} />
      </form>
    </Modal>
  )
}

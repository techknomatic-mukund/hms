import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { useFormState } from '../hooks/useFormState'
import { todayDisplay } from '../utils/helpers'

const CHANNELS = ['QR Code', 'Voice of Customer', 'Front Desk', 'Email']
const empty = { guest: '', rating: '5', channel: 'QR Code', comment: '' }

export default function CollectFeedbackModal({ open, onClose, onSubmit }) {
  const { form, errors, update, setFieldErrors } = useFormState(empty, open)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.comment.trim()) {
      setFieldErrors({ comment: 'Feedback comment is required' })
      return
    }
    onSubmit({
      guest: form.guest.trim() || 'Anonymous',
      rating: parseInt(form.rating, 10),
      channel: form.channel,
      comment: form.comment.trim(),
      date: todayDisplay(),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Collect Feedback">
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Guest Name">
            <input type="text" placeholder="Anonymous if empty" value={form.guest} onChange={(e) => update('guest', e.target.value)} />
          </FormField>
          <FormField label="Channel" required>
            <select value={form.channel} onChange={(e) => update('channel', e.target.value)}>
              {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="Rating" required full>
            <select value={form.rating} onChange={(e) => update('rating', e.target.value)}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ★</option>)}
            </select>
          </FormField>
          <FormField label="Comment" required error={errors.comment} full>
            <textarea rows={3} value={form.comment} onChange={(e) => update('comment', e.target.value)} />
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel="Submit Feedback" />
      </form>
    </Modal>
  )
}

import { useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'

const PRIORITIES = ['Normal', 'High', 'Urgent']

export default function AddNotificationModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', message: '', priority: 'Normal' })
  const [errors, setErrors] = useState({})

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleClose = () => {
    setForm({ title: '', message: '', priority: 'Normal' })
    setErrors({})
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.title.trim()) next.title = 'Title is required'
    if (!form.message.trim()) next.message = 'Message is required'
    setErrors(next)
    if (Object.keys(next).length) return

    onSubmit({
      title: form.title.trim(),
      message: form.message.trim(),
      priority: form.priority,
    })
    handleClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Notification">
      <form className="entity-form" onSubmit={handleSubmit}>
        <FormField label="Title" required error={errors.title} full>
          <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Brief headline for all staff" />
        </FormField>
        <FormField label="Message" required error={errors.message} full>
          <textarea rows={3} value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Details visible to all roles" />
        </FormField>
        <FormField label="Priority">
          <select value={form.priority} onChange={(e) => update('priority', e.target.value)}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </FormField>
        <p className="field-hint">This notification will be visible to all staff and customer portal users.</p>
        <FormActions onCancel={handleClose} submitLabel="Publish Notification" />
      </form>
    </Modal>
  )
}

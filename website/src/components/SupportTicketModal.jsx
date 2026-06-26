import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { TICKET_DEPARTMENTS } from '../utils/crmHelpers'

const empty = {
  guest: '', email: '', subject: '', description: '',
  department: 'Front Office', priority: 'Normal', status: 'Open',
}

export default function SupportTicketModal({
  open, onClose, onSubmit, customers, editItem = null,
}) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (!open) return
    if (editItem) {
      setForm({
        guest: editItem.guest,
        email: editItem.email,
        subject: editItem.subject,
        description: editItem.description || '',
        department: editItem.department,
        priority: editItem.priority,
        status: editItem.status,
      })
    } else {
      setForm(empty)
    }
  }, [open, editItem])

  const pickCustomer = (id) => {
    const c = customers.find((x) => x.id === id)
    if (!c) return
    setForm((p) => ({ ...p, guest: c.name, email: c.email }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.guest.trim() || !form.subject.trim()) return
    onSubmit({
      guest: form.guest.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      description: form.description.trim(),
      department: form.department,
      priority: form.priority,
      status: editItem ? form.status : 'Open',
      created: editItem?.created || new Date().toLocaleString('en-GB', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      }),
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Update Support Ticket' : 'New Support Ticket'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Customer" full>
            <select onChange={(e) => pickCustomer(e.target.value)} defaultValue="">
              <option value="">— Pick customer —</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormField>
          <FormField label="Guest Name" required>
            <input type="text" value={form.guest} onChange={(e) => setForm((p) => ({ ...p, guest: e.target.value }))} />
          </FormField>
          <FormField label="Email" required>
            <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </FormField>
          <FormField label="Subject" required full>
            <input type="text" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} />
          </FormField>
          <FormField label="Assign Department" required>
            <select value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}>
              {TICKET_DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </FormField>
          <FormField label="Priority">
            <select value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}>
              {['Low', 'Normal', 'High', 'Urgent'].map((p) => <option key={p}>{p}</option>)}
            </select>
          </FormField>
          {editItem && (
            <FormField label="Status">
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                {['Open', 'In Progress', 'Resolved', 'Closed'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </FormField>
          )}
          <FormField label="Description" full>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update Ticket' : 'Submit Ticket'} />
      </form>
    </Modal>
  )
}

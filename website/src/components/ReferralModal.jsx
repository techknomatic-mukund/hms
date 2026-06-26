import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { REFERRAL_REWARDS } from '../utils/crmHelpers'

const empty = {
  referrerId: '', referrer: '', referredGuest: '', referredEmail: '',
  reward: '500 Loyalty Points', status: 'Pending',
}

export default function ReferralModal({ open, onClose, onSubmit, customers, editItem = null }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (!open) return
    if (editItem) {
      setForm({
        referrerId: editItem.referrerId || '',
        referrer: editItem.referrer,
        referredGuest: editItem.referredGuest,
        referredEmail: editItem.referredEmail,
        reward: editItem.reward,
        status: editItem.status,
      })
    } else {
      setForm(empty)
    }
  }, [open, editItem])

  const pickReferrer = (id) => {
    const c = customers.find((x) => x.id === id)
    if (!c) return
    setForm((p) => ({ ...p, referrerId: id, referrer: c.name }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.referrer || !form.referredEmail.trim()) return
    onSubmit({
      referrerId: form.referrerId,
      referrer: form.referrer,
      referredGuest: form.referredGuest.trim() || 'Pending signup',
      referredEmail: form.referredEmail.trim(),
      reward: form.reward,
      status: form.status,
      date: editItem?.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Update Referral' : 'Record Referral'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Referring Guest" required full>
            <select value={form.referrerId} onChange={(e) => pickReferrer(e.target.value)}>
              <option value="">— Select customer —</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.loyalty})</option>)}
            </select>
          </FormField>
          <FormField label="Referred Guest Name">
            <input type="text" value={form.referredGuest} placeholder="New guest name" onChange={(e) => setForm((p) => ({ ...p, referredGuest: e.target.value }))} />
          </FormField>
          <FormField label="Referred Email" required>
            <input type="email" value={form.referredEmail} onChange={(e) => setForm((p) => ({ ...p, referredEmail: e.target.value }))} />
          </FormField>
          <FormField label="Reward">
            <select value={form.reward} onChange={(e) => setForm((p) => ({ ...p, reward: e.target.value }))}>
              {REFERRAL_REWARDS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
              {['Pending', 'Booked', 'Rewarded', 'Expired'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update' : 'Save Referral'} />
      </form>
    </Modal>
  )
}

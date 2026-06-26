import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'

const LOYALTY_TIERS = ['Bronze', 'Silver', 'Gold', 'Platinum']
const INTERACTION_TYPES = ['Call', 'Email', 'Walk-in', 'Feedback', 'Complaint', 'WhatsApp']
const OFFER_TYPES = ['None', '10% Off Stay', '15% Off F&B', 'Spa Package', 'Free Breakfast', 'Room Upgrade']
const REFERRAL_STATUSES = ['Active', 'Pending', 'Completed']
const TICKET_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent']
const TICKET_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed']
const CAMPAIGN_TYPES = ['Birthday Offer', 'Anniversary Package', 'Both', 'None']

const getEmpty = () => ({
  name: '',
  email: '',
  loyalty: 'Bronze',
  visits: 0,
  lastStay: '-',
  interactionHistory: '',
  lastInteractionType: 'Call',
  lastInteractionNote: '',
  offerType: 'None',
  couponCode: '',
  offerExpiry: '',
  referralCode: '',
  referredBy: '',
  referralStatus: 'Active',
  supportSubject: '',
  supportPriority: 'Medium',
  supportStatus: 'Open',
  birthday: '',
  anniversary: '',
  campaignOptIn: true,
  campaignType: 'Both',
})

function FormSection({ title, subtitle, children }) {
  return (
    <div className="form-section">
      <div className="form-section-head">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  return {
    name: editItem.name || '',
    email: editItem.email || '',
    loyalty: editItem.loyalty || 'Bronze',
    visits: editItem.visits ?? 0,
    lastStay: editItem.lastStay || '-',
    interactionHistory: editItem.interactionHistory || '',
    lastInteractionType: editItem.lastInteractionType || 'Call',
    lastInteractionNote: editItem.lastInteractionNote || '',
    offerType: editItem.offerType || 'None',
    couponCode: editItem.couponCode || '',
    offerExpiry: editItem.offerExpiry || '',
    referralCode: editItem.referralCode || '',
    referredBy: editItem.referredBy || '',
    referralStatus: editItem.referralStatus || 'Active',
    supportSubject: editItem.supportSubject || '',
    supportPriority: editItem.supportPriority || 'Medium',
    supportStatus: editItem.supportStatus || 'Open',
    birthday: editItem.birthday || '',
    anniversary: editItem.anniversary || '',
    campaignOptIn: editItem.campaignOptIn ?? true,
    campaignType: editItem.campaignType || 'Both',
  }
}

export default function CustomerModal({ open, onClose, onSubmit, editItem = null }) {
  const [form, setForm] = useState(getEmpty())
  const [errors, setErrors] = useState({})
  const isEdit = !!editItem

  useEffect(() => {
    if (!open) return
    setForm(itemToForm(editItem))
    setErrors({})
  }, [open, editItem])

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const appendInteraction = () => {
    if (!form.lastInteractionNote.trim()) return
    const stamp = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    const line = `${stamp} — ${form.lastInteractionType}: ${form.lastInteractionNote.trim()}`
    setForm((prev) => ({
      ...prev,
      interactionHistory: prev.interactionHistory ? `${line}\n${prev.interactionHistory}` : line,
      lastInteractionNote: '',
    }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    if (form.offerType !== 'None' && !form.couponCode.trim()) {
      next.couponCode = 'Coupon code required when an offer is selected'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      visits: Number(form.visits) || 0,
      couponCode: form.couponCode.trim(),
      referralCode: form.referralCode.trim() || form.name.trim().split(' ')[0].toUpperCase() + '-REF',
      referredBy: form.referredBy.trim(),
      supportSubject: form.supportSubject.trim(),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Customer' : 'New Customer'} wide>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Name" required error={errors.name}>
            <input type="text" value={form.name} placeholder="Guest full name" onChange={(e) => update('name', e.target.value)} />
          </FormField>
          <FormField label="Email" required error={errors.email}>
            <input type="email" value={form.email} placeholder="guest@email.com" onChange={(e) => update('email', e.target.value)} />
          </FormField>
          <FormField label="Loyalty Tier">
            <select value={form.loyalty} onChange={(e) => update('loyalty', e.target.value)}>
              {LOYALTY_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Visits">
            <input type="number" min="0" value={form.visits} onChange={(e) => update('visits', e.target.value)} />
          </FormField>
          <FormField label="Last Stay">
            <input type="text" value={form.lastStay} placeholder="e.g. 25 Jun" onChange={(e) => update('lastStay', e.target.value)} />
          </FormField>
        </div>

        <FormSection title="Customer Interaction History" subtitle="Log calls, emails, feedback and all guest touchpoints">
          {form.interactionHistory && (
            <pre className="interaction-log">{form.interactionHistory}</pre>
          )}
          <div className="form-grid">
            <FormField label="Interaction Type">
              <select value={form.lastInteractionType} onChange={(e) => update('lastInteractionType', e.target.value)}>
                {INTERACTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Add Interaction" full>
              <div className="inline-field-row">
                <input
                  type="text"
                  value={form.lastInteractionNote}
                  placeholder="e.g. Called about late checkout request"
                  onChange={(e) => update('lastInteractionNote', e.target.value)}
                />
                <button type="button" className="btn btn-secondary btn-sm" onClick={appendInteraction}>
                  Add to History
                </button>
              </div>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Offers & Coupon Management" subtitle="Assign promotional offers and track coupon validity">
          <div className="form-grid">
            <FormField label="Active Offer">
              <select value={form.offerType} onChange={(e) => update('offerType', e.target.value)}>
                {OFFER_TYPES.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </FormField>
            <FormField label="Coupon Code" error={errors.couponCode}>
              <input
                type="text"
                value={form.couponCode}
                placeholder="e.g. GOLD10"
                onChange={(e) => update('couponCode', e.target.value)}
              />
            </FormField>
            <FormField label="Offer Expiry">
              <input type="date" value={form.offerExpiry} onChange={(e) => update('offerExpiry', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Referral Program" subtitle="Track referral codes and referred-by relationships">
          <div className="form-grid">
            <FormField label="Referral Code">
              <input
                type="text"
                value={form.referralCode}
                placeholder="Auto-generated if left blank"
                onChange={(e) => update('referralCode', e.target.value)}
              />
            </FormField>
            <FormField label="Referred By">
              <input
                type="text"
                value={form.referredBy}
                placeholder="Name or referral code of referrer"
                onChange={(e) => update('referredBy', e.target.value)}
              />
            </FormField>
            <FormField label="Referral Status">
              <select value={form.referralStatus} onChange={(e) => update('referralStatus', e.target.value)}>
                {REFERRAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Customer Support Tickets" subtitle="Raise and track guest support requests">
          <div className="form-grid">
            <FormField label="Ticket Subject" full>
              <input
                type="text"
                value={form.supportSubject}
                placeholder="e.g. AC not working in room 305"
                onChange={(e) => update('supportSubject', e.target.value)}
              />
            </FormField>
            <FormField label="Priority">
              <select value={form.supportPriority} onChange={(e) => update('supportPriority', e.target.value)}>
                {TICKET_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormField>
            <FormField label="Ticket Status">
              <select value={form.supportStatus} onChange={(e) => update('supportStatus', e.target.value)}>
                {TICKET_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Birthday & Anniversary Campaigns" subtitle="Automated offers for special occasions">
          <div className="form-grid">
            <FormField label="Birthday">
              <input type="date" value={form.birthday} onChange={(e) => update('birthday', e.target.value)} />
            </FormField>
            <FormField label="Anniversary">
              <input type="date" value={form.anniversary} onChange={(e) => update('anniversary', e.target.value)} />
            </FormField>
            <FormField label="Campaign Type">
              <select value={form.campaignType} onChange={(e) => update('campaignType', e.target.value)}>
                {CAMPAIGN_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <div className="form-field form-field-full">
              <label className="tax-option">
                <input type="checkbox" checked={form.campaignOptIn} onChange={(e) => update('campaignOptIn', e.target.checked)} />
                Enroll in birthday & anniversary email/SMS campaigns
              </label>
            </div>
          </div>
        </FormSection>

        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update Customer' : 'Create Customer'} />
      </form>
    </Modal>
  )
}

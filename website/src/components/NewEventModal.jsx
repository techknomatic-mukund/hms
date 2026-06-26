import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'
import { formatDisplayDate } from '../utils/helpers'

const EVENT_TYPES = ['Banquet', 'Event', 'Conference', 'Wedding', 'Corporate']
const STATUSES = ['Inquiry', 'Quotation Sent', 'Confirmed', 'Planning', 'In Progress', 'Completed']
const INQUIRY_SOURCES = ['Phone', 'Email', 'Walk-in', 'Website', 'Travel Agent', 'Corporate']
const QUOTATION_STATUSES = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired']
const VENUES = ['Grand Ballroom', 'Conference Hall A', 'Garden Lawn', 'Poolside Deck', 'Private Dining']
const PAYMENT_STATUSES = ['Pending', 'Advance Received', 'Partial', 'Fully Paid']
const EXECUTION_STATUSES = ['Not Started', 'Setup', 'In Progress', 'Completed']
const REPORT_CATEGORIES = ['Revenue', 'Occupancy', 'Catering', 'Corporate', 'Wedding']

const getEmpty = () => ({
  name: '', type: 'Banquet', date: '', guests: '', status: 'Confirmed',
  inquirySource: 'Phone', inquiryDate: '', contactPerson: '', contactPhone: '',
  quotedAmount: '', quotationStatus: 'Draft', validUntil: '',
  venue: 'Grand Ballroom', hallSetup: '',
  staffAssigned: '', equipment: '',
  menuPackage: '', cateringNotes: '',
  advanceAmount: '', paymentStatus: 'Pending', balance: '',
  executionStatus: 'Not Started', milestoneNotes: '',
  feedbackScore: '', feedbackNotes: '',
  reportCategory: 'Revenue', analyticsNotes: '',
})

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  return { ...getEmpty(), ...editItem, date: editItem.dateIso || '', guests: editItem.guests ?? '' }
}

export default function NewEventModal({ open, onClose, onSubmit, editItem = null }) {
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

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Event name is required'
    if (!editItem && !form.date) next.date = 'Date is required'
    if (!form.guests) next.guests = 'Guest count is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      name: form.name.trim(),
      date: form.date ? formatDisplayDate(form.date) : editItem?.date,
      dateIso: form.date || editItem?.dateIso,
      guests: parseInt(form.guests, 10),
      contactPerson: form.contactPerson.trim(),
      staffAssigned: form.staffAssigned.trim(),
      menuPackage: form.menuPackage.trim(),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Event' : 'New Event Booking'} wide>
      <form className="entity-form" onSubmit={handleSubmit}>
        <FormSection title="Event Inquiry Management" subtitle="Capture initial event inquiries and contact details">
          <div className="form-grid">
            <FormField label="Event Name" required error={errors.name} full>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} />
            </FormField>
            <FormField label="Inquiry Source">
              <select value={form.inquirySource} onChange={(e) => update('inquirySource', e.target.value)}>
                {INQUIRY_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Inquiry Date">
              <input type="date" value={form.inquiryDate} onChange={(e) => update('inquiryDate', e.target.value)} />
            </FormField>
            <FormField label="Contact Person">
              <input type="text" value={form.contactPerson} onChange={(e) => update('contactPerson', e.target.value)} />
            </FormField>
            <FormField label="Contact Phone">
              <input type="tel" value={form.contactPhone} onChange={(e) => update('contactPhone', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Quotation Management" subtitle="Prepare and track event quotations">
          <div className="form-grid">
            <FormField label="Quoted Amount (₹)">
              <input type="number" min="0" value={form.quotedAmount} onChange={(e) => update('quotedAmount', e.target.value)} />
            </FormField>
            <FormField label="Quotation Status">
              <select value={form.quotationStatus} onChange={(e) => update('quotationStatus', e.target.value)}>
                {QUOTATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Valid Until">
              <input type="date" value={form.validUntil} onChange={(e) => update('validUntil', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Booking & Confirmation" subtitle="Confirm event type, date and guest count">
          <div className="form-grid">
            <FormField label="Event Type">
              <select value={form.type} onChange={(e) => update('type', e.target.value)}>
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Event Date" required error={errors.date}>
              <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
            </FormField>
            <FormField label="Guests" required error={errors.guests}>
              <input type="number" min="1" value={form.guests} onChange={(e) => update('guests', e.target.value)} />
            </FormField>
            <FormField label="Booking Status">
              <select value={form.status} onChange={(e) => update('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Venue Allocation" subtitle="Assign banquet hall or event space">
          <div className="form-grid">
            <FormField label="Venue">
              <select value={form.venue} onChange={(e) => update('venue', e.target.value)}>
                {VENUES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </FormField>
            <FormField label="Hall Setup" full>
              <input type="text" value={form.hallSetup} placeholder="Theatre, U-shape, banquet rounds..." onChange={(e) => update('hallSetup', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Resource & Staff Allocation" subtitle="Assign event staff and equipment">
          <div className="form-grid">
            <FormField label="Staff Assigned" full>
              <input type="text" value={form.staffAssigned} placeholder="Banquet manager, 4 waiters, AV team" onChange={(e) => update('staffAssigned', e.target.value)} />
            </FormField>
            <FormField label="Equipment" full>
              <input type="text" value={form.equipment} placeholder="Projector, sound system, stage lighting" onChange={(e) => update('equipment', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Catering & Menu Management" subtitle="Plan food packages and catering requirements">
          <div className="form-grid">
            <FormField label="Menu Package" full>
              <input type="text" value={form.menuPackage} placeholder="Premium veg + non-veg buffet" onChange={(e) => update('menuPackage', e.target.value)} />
            </FormField>
            <FormField label="Catering Notes" full>
              <textarea rows={2} value={form.cateringNotes} placeholder="Jain food, live counters, bar setup..." onChange={(e) => update('cateringNotes', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Billing & Payment Management" subtitle="Track advances, balances and payment status">
          <div className="form-grid">
            <FormField label="Advance Amount (₹)">
              <input type="number" min="0" value={form.advanceAmount} onChange={(e) => update('advanceAmount', e.target.value)} />
            </FormField>
            <FormField label="Payment Status">
              <select value={form.paymentStatus} onChange={(e) => update('paymentStatus', e.target.value)}>
                {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Balance Due (₹)">
              <input type="number" min="0" value={form.balance} onChange={(e) => update('balance', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Event Execution Tracking" subtitle="Monitor setup and on-day event progress">
          <div className="form-grid">
            <FormField label="Execution Status">
              <select value={form.executionStatus} onChange={(e) => update('executionStatus', e.target.value)}>
                {EXECUTION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Milestone Notes" full>
              <textarea rows={2} value={form.milestoneNotes} placeholder="Setup complete, guests arrived, dinner served..." onChange={(e) => update('milestoneNotes', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Customer Feedback Management" subtitle="Post-event feedback and satisfaction scores">
          <div className="form-grid">
            <FormField label="Feedback Score (1–5)">
              <input type="number" min="1" max="5" value={form.feedbackScore} onChange={(e) => update('feedbackScore', e.target.value)} />
            </FormField>
            <FormField label="Feedback Notes" full>
              <textarea rows={2} value={form.feedbackNotes} placeholder="Client comments after event..." onChange={(e) => update('feedbackNotes', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Reports & Analytics" subtitle="Categorise events for revenue and performance reporting">
          <div className="form-grid">
            <FormField label="Report Category">
              <select value={form.reportCategory} onChange={(e) => update('reportCategory', e.target.value)}>
                {REPORT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Analytics Notes" full>
              <input type="text" value={form.analyticsNotes} placeholder="Revenue target, repeat client..." onChange={(e) => update('analyticsNotes', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update Event' : 'Book Event'} />
      </form>
    </Modal>
  )
}

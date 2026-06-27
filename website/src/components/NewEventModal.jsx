import { useEffect, useMemo, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'
import { formatDisplayDate, formatINR } from '../utils/helpers'

const EVENT_TYPES = ['Banquet', 'Event', 'Conference', 'Wedding', 'Corporate']
const STATUSES = ['Inquiry', 'Quotation Sent', 'Confirmed', 'Planning', 'In Progress', 'Completed']
const INQUIRY_SOURCES = ['Phone', 'Email', 'Walk-in', 'Website', 'Travel Agent', 'Corporate']
const QUOTATION_STATUSES = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired']
const VENUES = ['Grand Ballroom', 'Conference Hall A', 'Garden Lawn', 'Poolside Deck', 'Private Dining']

export const VENUE_RATES = {
  'Grand Ballroom': { baseFee: 50000, perGuest: 5000 },
  'Conference Hall A': { baseFee: 25000, perGuest: 3500 },
  'Garden Lawn': { baseFee: 100000, perGuest: 5500 },
  'Poolside Deck': { baseFee: 40000, perGuest: 4500 },
  'Private Dining': { baseFee: 15000, perGuest: 2800 },
}

const DEFAULT_STAFF = ['Ravi Menon', 'Banquet Team Lead', 'Events Coordinator', 'Unassigned']

export function calculateEventQuote(venue, guests) {
  const rates = VENUE_RATES[venue]
  if (!rates) return { baseFee: 0, guestCharge: 0, total: 0 }
  const guestCount = Math.max(parseInt(guests, 10) || 0, 0)
  const guestCharge = guestCount * rates.perGuest
  return { baseFee: rates.baseFee, guestCharge, total: rates.baseFee + guestCharge }
}

function computeBalance(quotedAmount, status, editItem, quoteChanged) {
  const quoted = parseFloat(quotedAmount) || 0
  if (status === 'Completed') return { balance: 0, balanceStatus: 'Paid' }
  if (quoted <= 0) return { balance: 0, balanceStatus: '—' }
  if (editItem?.balanceStatus === 'Partial' && !quoteChanged) {
    return { balance: editItem.balance, balanceStatus: editItem.balanceStatus }
  }
  return { balance: quoted, balanceStatus: 'Pending' }
}

const getEmpty = (staffList) => ({
  name: '',
  type: 'Banquet',
  date: '',
  guests: '',
  status: 'Confirmed',
  inquirySource: 'Phone',
  inquiryDate: '',
  contactPerson: '',
  contactPhone: '',
  quotationStatus: 'Draft',
  validUntil: '',
  venue: 'Grand Ballroom',
  hallSetup: '',
  staffAssigned: staffList[0] || DEFAULT_STAFF[0],
  equipment: '',
})

function itemToForm(editItem, staffList) {
  if (!editItem) return getEmpty(staffList)
  const staff = staffList.includes(editItem.staffAssigned)
    ? editItem.staffAssigned
    : editItem.staffAssigned || staffList[0] || DEFAULT_STAFF[0]
  return {
    ...getEmpty(staffList),
    ...editItem,
    date: editItem.dateIso || '',
    guests: editItem.guests ?? '',
    staffAssigned: staff,
  }
}

export default function NewEventModal({ open, onClose, onSubmit, editItem = null, staff = [] }) {
  const staffList = staff.length ? staff : DEFAULT_STAFF
  const [form, setForm] = useState(getEmpty(staffList))
  const [errors, setErrors] = useState({})
  const isEdit = !!editItem

  useEffect(() => {
    if (!open) return
    setForm(itemToForm(editItem, staffList))
    setErrors({})
  }, [open, editItem, staffList])

  const quote = useMemo(
    () => calculateEventQuote(form.venue, form.guests),
    [form.venue, form.guests],
  )

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Event name is required'
    if (!editItem && !form.date) next.date = 'Date is required'
    if (!form.guests || parseInt(form.guests, 10) < 1) next.guests = 'Guest count is required'
    if (quote.total <= 0) next.guests = next.guests || 'Enter guests to calculate quote'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const quoteChanged = isEdit && String(quote.total) !== String(editItem?.quotedAmount)
    const { balance, balanceStatus } = computeBalance(quote.total, form.status, editItem, quoteChanged)
    onSubmit({
      name: form.name.trim(),
      type: form.type,
      date: form.date ? formatDisplayDate(form.date) : editItem?.date,
      dateIso: form.date || editItem?.dateIso,
      guests: parseInt(form.guests, 10),
      status: form.status,
      inquirySource: form.inquirySource,
      inquiryDate: form.inquiryDate,
      contactPerson: form.contactPerson.trim(),
      contactPhone: form.contactPhone,
      quotedAmount: quote.total,
      quotationStatus: form.quotationStatus,
      validUntil: form.validUntil,
      venue: form.venue,
      hallSetup: form.hallSetup,
      staffAssigned: form.staffAssigned,
      equipment: form.equipment,
      balance,
      balanceStatus,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Event' : 'New Event Booking'}>
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

        <FormSection title="Booking & Confirmation" subtitle="Confirm event type, date, guest count and venue">
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

        <FormSection title="Quotation Management" subtitle="Auto-calculated from venue hire + per-guest rate">
          <div className="pos-billing-summary">
            <div className="laundry-total-row">
              <span>Venue base fee</span>
              <span>{formatINR(quote.baseFee)}</span>
            </div>
            <div className="laundry-total-row">
              <span>Guest charge ({form.guests || 0} × {formatINR(VENUE_RATES[form.venue]?.perGuest || 0)})</span>
              <span>{formatINR(quote.guestCharge)}</span>
            </div>
            <div className="laundry-total-row">
              <strong>Quoted Amount</strong>
              <span>{formatINR(quote.total)}</span>
            </div>
          </div>
          <div className="form-grid">
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

        <FormSection title="Resource & Staff Allocation" subtitle="Assign event staff and equipment">
          <div className="form-grid">
            <FormField label="Staff Assigned">
              <select value={form.staffAssigned} onChange={(e) => update('staffAssigned', e.target.value)}>
                {staffList.map((s) => <option key={s} value={s}>{s}</option>)}
                {!staffList.includes(form.staffAssigned) && form.staffAssigned && (
                  <option value={form.staffAssigned}>{form.staffAssigned}</option>
                )}
              </select>
            </FormField>
            <FormField label="Equipment" full>
              <input type="text" value={form.equipment} placeholder="Projector, sound system, stage lighting" onChange={(e) => update('equipment', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update Event' : 'Book Event'} />
      </form>
    </Modal>
  )
}

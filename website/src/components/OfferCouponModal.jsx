import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { formatDisplayDate } from '../utils/helpers'
import { parseDisplayDateToIso } from '../utils/reservationHelpers'
import { OFFER_TYPES } from '../utils/crmHelpers'

const empty = {
  code: '', title: '', discount: '', type: 'Discount Coupon',
  validFrom: '', validTo: '', status: 'Active', uses: '0',
}

export default function OfferCouponModal({ open, onClose, onSubmit, editItem = null }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (!open) return
    if (editItem) {
      setForm({
        code: editItem.code,
        title: editItem.title,
        discount: editItem.discount,
        type: editItem.type,
        validFrom: editItem.validFromIso || parseDisplayDateToIso(editItem.validFrom) || '',
        validTo: editItem.validToIso || parseDisplayDateToIso(editItem.validTo) || '',
        status: editItem.status,
        uses: String(editItem.uses || 0),
      })
    } else {
      setForm(empty)
    }
  }, [open, editItem])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.code.trim() || !form.title.trim()) return
    if (form.validFrom && form.validTo && form.validTo < form.validFrom) return
    onSubmit({
      code: form.code.trim().toUpperCase(),
      title: form.title.trim(),
      discount: form.discount.trim(),
      type: form.type,
      validFrom: form.validFrom ? formatDisplayDate(form.validFrom) : '—',
      validTo: form.validTo ? formatDisplayDate(form.validTo) : '—',
      validFromIso: form.validFrom || '',
      validToIso: form.validTo || '',
      status: form.status,
      uses: parseInt(form.uses, 10) || 0,
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Offer / Coupon' : 'Create Offer / Coupon'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Coupon Code" required>
            <input type="text" value={form.code} placeholder="SUMMER25" onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} />
          </FormField>
          <FormField label="Offer Title" required full>
            <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          </FormField>
          <FormField label="Discount" required>
            <input type="text" value={form.discount} placeholder="25% or ₹500 off" onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))} />
          </FormField>
          <FormField label="Type">
            <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
              {OFFER_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Valid From">
            <input type="date" value={form.validFrom} onChange={(e) => setForm((p) => ({ ...p, validFrom: e.target.value }))} />
          </FormField>
          <FormField label="Valid To">
            <input type="date" value={form.validTo} min={form.validFrom || undefined} onChange={(e) => setForm((p) => ({ ...p, validTo: e.target.value }))} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
              {['Active', 'Expired', 'Paused'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update Offer' : 'Create Offer'} />
      </form>
    </Modal>
  )
}

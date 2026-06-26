import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'
import { formatINR } from '../utils/helpers'

const PAYMENTS = ['Direct - UPI', 'Direct - Card', 'Direct - Cash', 'Bill to Room 302', 'Bill to Room 501', 'Corporate Account']
const ORDER_STATUSES = ['Preparing', 'Served', 'Paid', 'Cancelled']
const ORDER_TYPES = ['Dine-in', 'Takeaway', 'Room Service', 'Banquet']
const DISCOUNT_TYPES = ['None', 'Percentage', 'Flat Amount', 'Coupon', 'Loyalty']
const MENU_CATEGORIES = ['Starter', 'Main Course', 'Breakfast', 'Beverage', 'Dessert']
const TRACKING_STEPS = ['Order Placed', 'Sent to Kitchen', 'Preparing', 'Ready', 'Served', 'Billed', 'Paid']

function parseAmount(amt) {
  if (typeof amt === 'number') return amt
  return parseFloat(String(amt).replace(/[^\d.]/g, '')) || ''
}

const getEmpty = () => ({
  table: '', items: '', amount: '', payment: 'Direct - UPI', status: 'Preparing',
  orderType: 'Dine-in', waiter: '', orderNote: '',
  reservedTable: '', reservationTime: '', reservationGuests: '',
  sendToKitchen: true, kitchenNote: '', kitchenPriority: 'Normal',
  billingNote: '', billNumber: '',
  roomCharge: false, roomNumber: '', guestName: '',
  discountType: 'None', discountValue: '', couponCode: '',
  splitBilling: false, splitCount: '2', splitDetails: '',
  trackingStatus: 'Order Placed', statusHistory: '', trackingNote: '',
  menuCategory: 'Main Course', linkedMenuItems: '',
  reportTag: '', analyticsNote: '',
})

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  return { ...getEmpty(), ...editItem, amount: parseAmount(editItem.amount) }
}

export default function NewPosOrderModal({ open, onClose, onSubmit, editItem = null }) {
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
    if (!form.table.trim()) next.table = 'Table or room is required'
    if (!form.items.trim()) next.items = 'Items are required'
    if (!form.amount || parseFloat(form.amount) <= 0) next.amount = 'Valid amount is required'
    if (form.roomCharge && !form.roomNumber.trim()) next.roomNumber = 'Room number required for room charge'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      table: form.table.trim(),
      items: form.items.trim(),
      amount: formatINR(parseFloat(form.amount)),
      payment: form.roomCharge ? `Bill to Room ${form.roomNumber}` : form.payment,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit POS Order' : 'New POS Order'} wide>
      <form className="entity-form" onSubmit={handleSubmit}>
        <FormSection title="Order Management" subtitle="Create and manage restaurant food orders">
          <div className="form-grid">
            <FormField label="Table / Room" required error={errors.table}>
              <input type="text" value={form.table} placeholder="T-12 or Room 501" onChange={(e) => update('table', e.target.value)} />
            </FormField>
            <FormField label="Order Type">
              <select value={form.orderType} onChange={(e) => update('orderType', e.target.value)}>
                {ORDER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Waiter / Server">
              <input type="text" value={form.waiter} onChange={(e) => update('waiter', e.target.value)} />
            </FormField>
            <FormField label="Items" required error={errors.items} full>
              <input type="text" value={form.items} placeholder="Butter Chicken, Naan x2" onChange={(e) => update('items', e.target.value)} />
            </FormField>
            <FormField label="Order Notes" full>
              <input type="text" value={form.orderNote} placeholder="Special instructions..." onChange={(e) => update('orderNote', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Table Reservation Management" subtitle="Link order to a reserved table and guest count">
          <div className="form-grid">
            <FormField label="Reserved Table">
              <input type="text" value={form.reservedTable} placeholder="T-08" onChange={(e) => update('reservedTable', e.target.value)} />
            </FormField>
            <FormField label="Reservation Time">
              <input type="datetime-local" value={form.reservationTime} onChange={(e) => update('reservationTime', e.target.value)} />
            </FormField>
            <FormField label="Guest Count">
              <input type="number" min="1" value={form.reservationGuests} onChange={(e) => update('reservationGuests', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Kitchen Integration" subtitle="Send order to kitchen display system automatically">
          <div className="form-grid">
            <div className="form-field form-field-full">
              <label className="tax-option">
                <input type="checkbox" checked={form.sendToKitchen} onChange={(e) => update('sendToKitchen', e.target.checked)} />
                Send to kitchen on order creation
              </label>
            </div>
            <FormField label="Kitchen Priority">
              <select value={form.kitchenPriority} onChange={(e) => update('kitchenPriority', e.target.value)}>
                {['Low', 'Normal', 'High', 'Rush'].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormField>
            <FormField label="Kitchen Notes" full>
              <input type="text" value={form.kitchenNote} placeholder="No spice, allergy alert..." onChange={(e) => update('kitchenNote', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Billing & Payment Management" subtitle="Process payments and generate bills">
          <div className="form-grid">
            <FormField label="Amount (₹)" required error={errors.amount}>
              <input type="number" min="1" value={form.amount} onChange={(e) => update('amount', e.target.value)} />
            </FormField>
            <FormField label="Payment Method">
              <select value={form.payment} onChange={(e) => update('payment', e.target.value)}>
                {PAYMENTS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormField>
            <FormField label="Bill Number">
              <input type="text" value={form.billNumber} placeholder="Auto-generated" onChange={(e) => update('billNumber', e.target.value)} />
            </FormField>
            <FormField label="Billing Notes" full>
              <input type="text" value={form.billingNote} onChange={(e) => update('billingNote', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Room Charge Posting" subtitle="Post restaurant charges directly to guest room folio">
          <div className="form-grid">
            <div className="form-field form-field-full">
              <label className="tax-option">
                <input type="checkbox" checked={form.roomCharge} onChange={(e) => update('roomCharge', e.target.checked)} />
                Post charges to guest room folio
              </label>
            </div>
            <FormField label="Room Number" error={errors.roomNumber}>
              <input type="text" value={form.roomNumber} placeholder="501" onChange={(e) => update('roomNumber', e.target.value)} />
            </FormField>
            <FormField label="Guest Name">
              <input type="text" value={form.guestName} onChange={(e) => update('guestName', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Discount & Offer Management" subtitle="Apply promotional discounts and coupon codes">
          <div className="form-grid">
            <FormField label="Discount Type">
              <select value={form.discountType} onChange={(e) => update('discountType', e.target.value)}>
                {DISCOUNT_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </FormField>
            <FormField label="Discount Value">
              <input type="text" value={form.discountValue} placeholder="10% or ₹100" onChange={(e) => update('discountValue', e.target.value)} />
            </FormField>
            <FormField label="Coupon Code">
              <input type="text" value={form.couponCode} onChange={(e) => update('couponCode', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Split Billing" subtitle="Divide bill among multiple payers">
          <div className="form-grid">
            <div className="form-field form-field-full">
              <label className="tax-option">
                <input type="checkbox" checked={form.splitBilling} onChange={(e) => update('splitBilling', e.target.checked)} />
                Enable split billing
              </label>
            </div>
            <FormField label="Number of Splits">
              <input type="number" min="2" max="10" value={form.splitCount} onChange={(e) => update('splitCount', e.target.value)} />
            </FormField>
            <FormField label="Split Details" full>
              <textarea rows={2} value={form.splitDetails} placeholder="Guest 1: ₹500, Guest 2: ₹740..." onChange={(e) => update('splitDetails', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Order Status Tracking" subtitle="Track order from placement to payment">
          <div className="form-grid">
            <FormField label="Current Status">
              <select value={form.status} onChange={(e) => update('status', e.target.value)}>
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Tracking Stage">
              <select value={form.trackingStatus} onChange={(e) => update('trackingStatus', e.target.value)}>
                {TRACKING_STEPS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Status Notes" full>
              <input type="text" value={form.trackingNote} onChange={(e) => update('trackingNote', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Menu Management" subtitle="Link order items to menu categories">
          <div className="form-grid">
            <FormField label="Menu Category">
              <select value={form.menuCategory} onChange={(e) => update('menuCategory', e.target.value)}>
                {MENU_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Linked Menu Items" full>
              <input type="text" value={form.linkedMenuItems} placeholder="MENU-1, MENU-2" onChange={(e) => update('linkedMenuItems', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Restaurant Reports & Analytics" subtitle="Tag orders for sales and performance reporting">
          <div className="form-grid">
            <FormField label="Report Tag">
              <select value={form.reportTag} onChange={(e) => update('reportTag', e.target.value)}>
                {['', 'Peak Hour', 'Corporate', 'Walk-in', 'Room Service', 'Banquet'].map((t) => (
                  <option key={t || 'none'} value={t}>{t || '— None —'}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Analytics Notes" full>
              <input type="text" value={form.analyticsNote} placeholder="Revenue category, campaign tracking..." onChange={(e) => update('analyticsNote', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update Order' : 'Create Order'} />
      </form>
    </Modal>
  )
}

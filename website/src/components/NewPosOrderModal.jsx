import { useEffect, useMemo, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'
import { formatINR } from '../utils/helpers'
import { ROOM_OPTIONS } from '../utils/reservationHelpers'

const TABLE_OPTIONS = Array.from({ length: 20 }, (_, i) => `T-${String(i + 1).padStart(2, '0')}`)
export const TABLE_ROOM_OPTIONS = [
  ...TABLE_OPTIONS,
  ...ROOM_OPTIONS.map((room) => `Room — ${room}`),
]

const WAITERS = ['Ravi Menon', 'Anita Verma', 'Suresh Kumar', 'Priya Nair', 'Unassigned']
const PAYMENTS = ['Direct - UPI', 'Direct - Card', 'Direct - Cash', ...ROOM_OPTIONS.map((r) => `Bill to ${r}`)]
const ORDER_STATUSES = ['Preparing', 'Served', 'Paid', 'Cancelled']

const emptyLine = () => ({ itemId: '', quantity: 1 })

function parseMenuPrice(price) {
  return parseFloat(String(price).replace(/[^\d.]/g, '')) || 0
}

function parseTaxRate(tax) {
  const match = String(tax || '').match(/(\d+(?:\.\d+)?)\s*%/)
  return match ? parseFloat(match[1]) / 100 : 0.05
}

function parseItemsToLines(itemsStr, menuItems) {
  if (!itemsStr?.trim()) return [emptyLine()]
  const lines = itemsStr.split(',').map((part) => {
    const match = part.trim().match(/^(.+?)\s+x(\d+)$/i)
    if (!match) {
      const byName = menuItems.find((m) => m.name.toLowerCase() === part.trim().toLowerCase())
      return byName ? { itemId: byName.id, quantity: 1 } : emptyLine()
    }
    const name = match[1].trim()
    const qty = parseInt(match[2], 10) || 1
    const found = menuItems.find(
      (m) => m.name.toLowerCase() === name.toLowerCase() || `${m.name}`.toLowerCase() === name.toLowerCase(),
    )
    return found ? { itemId: found.id, quantity: qty } : emptyLine()
  })
  return lines.length ? lines : [emptyLine()]
}

function resolveTableValue(table) {
  if (!table) return TABLE_ROOM_OPTIONS[0]
  if (TABLE_ROOM_OPTIONS.includes(table)) return table
  const roomMatch = ROOM_OPTIONS.find((r) => table.includes(r) || table.includes(r.split(' ').pop()))
  if (roomMatch) return `Room — ${roomMatch}`
  return table
}

const getEmpty = () => ({
  table: TABLE_ROOM_OPTIONS[0],
  waiter: WAITERS[0],
  lineItems: [emptyLine()],
  payment: PAYMENTS[0],
  status: 'Preparing',
})

function itemToForm(editItem, menuItems) {
  if (!editItem) return getEmpty()
  return {
    table: resolveTableValue(editItem.table),
    waiter: WAITERS.includes(editItem.waiter) ? editItem.waiter : editItem.waiter || WAITERS[0],
    lineItems: parseItemsToLines(editItem.items, menuItems),
    payment: PAYMENTS.includes(editItem.payment) ? editItem.payment : editItem.payment || PAYMENTS[0],
    status: editItem.status || 'Preparing',
  }
}

export default function NewPosOrderModal({ open, onClose, onSubmit, editItem = null, menuItems = [] }) {
  const [form, setForm] = useState(getEmpty())
  const [errors, setErrors] = useState({})
  const isEdit = !!editItem

  useEffect(() => {
    if (!open) return
    setForm(itemToForm(editItem, menuItems))
    setErrors({})
  }, [open, editItem, menuItems])

  const billing = useMemo(() => {
    let subtotal = 0
    let taxTotal = 0
    form.lineItems.forEach((line) => {
      const menuItem = menuItems.find((m) => m.id === line.itemId)
      if (!menuItem) return
      const price = parseMenuPrice(menuItem.price)
      const qty = Number(line.quantity) || 0
      const lineSub = price * qty
      const rate = parseTaxRate(menuItem.tax)
      subtotal += lineSub
      taxTotal += lineSub * rate
    })
    return { subtotal, taxTotal, total: subtotal + taxTotal }
  }, [form.lineItems, menuItems])

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const updateLine = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((line, i) => (i === index ? { ...line, [field]: value } : line)),
    }))
    setErrors((prev) => ({ ...prev, lineItems: '' }))
  }

  const addLine = () => setForm((prev) => ({ ...prev, lineItems: [...prev.lineItems, emptyLine()] }))

  const removeLine = (index) => {
    setForm((prev) => ({
      ...prev,
      lineItems: prev.lineItems.length > 1 ? prev.lineItems.filter((_, i) => i !== index) : [emptyLine()],
    }))
  }

  const validate = () => {
    const next = {}
    if (!form.table) next.table = 'Table or room is required'
    if (!form.waiter) next.waiter = 'Waiter is required'
    const validLines = form.lineItems.filter((l) => l.itemId && Number(l.quantity) > 0)
    if (!validLines.length) next.lineItems = 'Add at least one menu item'
    if (billing.total <= 0) next.lineItems = next.lineItems || 'Total must be greater than zero'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const validLines = form.lineItems.filter((l) => l.itemId && Number(l.quantity) > 0)
    const items = validLines.map((line) => {
      const menuItem = menuItems.find((m) => m.id === line.itemId)
      return `${menuItem.name} x${line.quantity}`
    }).join(', ')

    onSubmit({
      table: form.table,
      waiter: form.waiter,
      items,
      subtotal: billing.subtotal,
      taxAmount: billing.taxTotal,
      amount: formatINR(billing.total),
      payment: form.payment,
      status: form.status,
      sendToKitchen: true,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit POS Order' : 'New POS Order'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Table / Room" required error={errors.table}>
            <select value={form.table} onChange={(e) => update('table', e.target.value)}>
              {TABLE_ROOM_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              {!TABLE_ROOM_OPTIONS.includes(form.table) && form.table && (
                <option value={form.table}>{form.table}</option>
              )}
            </select>
          </FormField>
          <FormField label="Waiter / Server" required error={errors.waiter}>
            <select value={form.waiter} onChange={(e) => update('waiter', e.target.value)}>
              {WAITERS.map((w) => <option key={w} value={w}>{w}</option>)}
              {!WAITERS.includes(form.waiter) && form.waiter && (
                <option value={form.waiter}>{form.waiter}</option>
              )}
            </select>
          </FormField>
        </div>

        <div className="laundry-lines-section">
          <div className="laundry-lines-head">
            <span>Menu Items</span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addLine}>+ Add Item</button>
          </div>
          {errors.lineItems && <em className="form-error">{errors.lineItems}</em>}
          {form.lineItems.map((line, index) => {
            const menuItem = menuItems.find((m) => m.id === line.itemId)
            const unit = menuItem ? parseMenuPrice(menuItem.price) : 0
            const qty = Number(line.quantity) || 0
            const lineSub = unit * qty
            const lineTax = menuItem ? lineSub * parseTaxRate(menuItem.tax) : 0
            return (
              <div key={index} className="laundry-line-row">
                <FormField label={index === 0 ? 'Item' : undefined}>
                  <select value={line.itemId} onChange={(e) => updateLine(index, 'itemId', e.target.value)}>
                    <option value="">— Select from menu —</option>
                    {menuItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.price}{item.tax ? ` + ${item.tax}` : ''})
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label={index === 0 ? 'Qty' : undefined}>
                  <input
                    type="number"
                    min="1"
                    value={line.quantity}
                    onChange={(e) => updateLine(index, 'quantity', e.target.value)}
                  />
                </FormField>
                <FormField label={index === 0 ? 'Line Total' : undefined}>
                  <input
                    type="text"
                    readOnly
                    className="readonly-field"
                    value={line.itemId ? formatINR(lineSub + lineTax) : '—'}
                  />
                </FormField>
                <button
                  type="button"
                  className="btn-icon btn-icon-danger laundry-line-remove"
                  title="Remove"
                  onClick={() => removeLine(index)}
                  aria-label="Remove item"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>

        <FormSection title="Billing" subtitle="Auto-calculated from menu with GST">
          <div className="pos-billing-summary">
            <div className="laundry-total-row">
              <span>Subtotal</span>
              <span>{formatINR(billing.subtotal)}</span>
            </div>
            <div className="laundry-total-row">
              <span>Tax (GST)</span>
              <span>{formatINR(billing.taxTotal)}</span>
            </div>
            <div className="laundry-total-row">
              <strong>Total Amount</strong>
              <span>{formatINR(billing.total)}</span>
            </div>
          </div>
          <div className="form-grid">
            <FormField label="Payment Method">
              <select value={form.payment} onChange={(e) => update('payment', e.target.value)}>
                {PAYMENTS.map((p) => <option key={p} value={p}>{p}</option>)}
                {!PAYMENTS.includes(form.payment) && form.payment && (
                  <option value={form.payment}>{form.payment}</option>
                )}
              </select>
            </FormField>
            <FormField label="Status">
              <select value={form.status} onChange={(e) => update('status', e.target.value)}>
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update Order' : 'Create Order'} />
      </form>
    </Modal>
  )
}

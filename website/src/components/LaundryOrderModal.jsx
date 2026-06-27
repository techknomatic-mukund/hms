import { useEffect, useMemo, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { formatINR } from '../utils/helpers'
import { ROOM_OPTIONS } from '../utils/reservationHelpers'

const STATUSES = ['Pickup Scheduled', 'In Progress', 'Ready', 'Delivered']

export const LAUNDRY_ITEMS = [
  { id: 'shirt', label: 'Shirt', normalPrice: 80, expressPrice: 120 },
  { id: 'trouser', label: 'Trouser', normalPrice: 100, expressPrice: 150 },
  { id: 'suit', label: 'Suit', normalPrice: 400, expressPrice: 600 },
  { id: 'saree', label: 'Saree', normalPrice: 200, expressPrice: 300 },
  { id: 'bedsheet', label: 'Bedsheet', normalPrice: 150, expressPrice: 225 },
  { id: 'towel', label: 'Towel', normalPrice: 60, expressPrice: 90 },
  { id: 'blouse', label: 'Blouse', normalPrice: 70, expressPrice: 105 },
]

const emptyLine = () => ({ itemId: '', quantity: 1 })

function parseItemsToLines(itemsStr) {
  if (!itemsStr?.trim()) return [emptyLine()]
  const lines = itemsStr.split(',').map((part) => {
    const match = part.trim().match(/^(.+?)\s+x(\d+)$/i)
    if (!match) return emptyLine()
    const label = match[1].trim().replace(/s$/i, '').toLowerCase()
    const qty = parseInt(match[2], 10) || 1
    const found = LAUNDRY_ITEMS.find(
      (i) => i.label.toLowerCase() === label || i.label.toLowerCase() + 's' === match[1].trim().toLowerCase(),
    )
    return found ? { itemId: found.id, quantity: qty } : emptyLine()
  })
  return lines.length ? lines : [emptyLine()]
}

const getEmpty = () => ({
  guest: '',
  room: ROOM_OPTIONS[0],
  serviceType: 'normal',
  lineItems: [emptyLine()],
  status: 'Pickup Scheduled',
})

function resolveRoomValue(room) {
  if (!room) return ROOM_OPTIONS[0]
  if (ROOM_OPTIONS.includes(room)) return room
  const byNumber = ROOM_OPTIONS.find((r) => r.split(' ').pop() === String(room))
  return byNumber || room
}

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  return {
    guest: editItem.guest || '',
    room: resolveRoomValue(editItem.room),
    serviceType: editItem.expressService || editItem.serviceType === 'express' ? 'express' : 'normal',
    lineItems: parseItemsToLines(editItem.items),
    status: editItem.status || 'Pickup Scheduled',
  }
}

function lineUnitPrice(itemId, serviceType) {
  const item = LAUNDRY_ITEMS.find((i) => i.id === itemId)
  if (!item) return 0
  return serviceType === 'express' ? item.expressPrice : item.normalPrice
}

export default function LaundryOrderModal({ open, onClose, onSubmit, editItem = null }) {
  const [form, setForm] = useState(getEmpty())
  const [errors, setErrors] = useState({})
  const isEdit = !!editItem

  useEffect(() => {
    if (!open) return
    setForm(itemToForm(editItem))
    setErrors({})
  }, [open, editItem])

  const totalAmount = useMemo(
    () => form.lineItems.reduce((sum, line) => {
      const qty = Number(line.quantity) || 0
      if (!line.itemId || qty < 1) return sum
      return sum + lineUnitPrice(line.itemId, form.serviceType) * qty
    }, 0),
    [form.lineItems, form.serviceType],
  )

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

  const addLine = () => {
    setForm((prev) => ({ ...prev, lineItems: [...prev.lineItems, emptyLine()] }))
  }

  const removeLine = (index) => {
    setForm((prev) => ({
      ...prev,
      lineItems: prev.lineItems.length > 1 ? prev.lineItems.filter((_, i) => i !== index) : [emptyLine()],
    }))
  }

  const validate = () => {
    const next = {}
    if (!form.guest.trim()) next.guest = 'Guest is required'
    if (!form.room.trim()) next.room = 'Room is required'
    const validLines = form.lineItems.filter((l) => l.itemId && Number(l.quantity) > 0)
    if (!validLines.length) next.lineItems = 'Add at least one item with quantity'
    if (totalAmount <= 0) next.lineItems = next.lineItems || 'Total amount must be greater than zero'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const validLines = form.lineItems.filter((l) => l.itemId && Number(l.quantity) > 0)
    const items = validLines.map((line) => {
      const item = LAUNDRY_ITEMS.find((i) => i.id === line.itemId)
      return `${item.label} x${line.quantity}`
    }).join(', ')

    onSubmit({
      guest: form.guest.trim(),
      room: form.room.includes(' ') ? form.room.split(' ').pop() : form.room.trim(),
      items,
      service: form.serviceType === 'express' ? 'Express Laundry' : 'Normal Laundry',
      serviceType: form.serviceType,
      expressService: form.serviceType === 'express',
      lineItems: validLines,
      amount: totalAmount,
      status: form.status,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Laundry Order' : 'New Laundry Order'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="service-type-toggle">
          <button
            type="button"
            className={form.serviceType === 'normal' ? 'active' : ''}
            onClick={() => update('serviceType', 'normal')}
          >
            Normal Laundry Service
          </button>
          <button
            type="button"
            className={form.serviceType === 'express' ? 'active' : ''}
            onClick={() => update('serviceType', 'express')}
          >
            Express Laundry Service
          </button>
        </div>

        <div className="form-grid">
          <FormField label="Guest" required error={errors.guest}>
            <input type="text" value={form.guest} onChange={(e) => update('guest', e.target.value)} />
          </FormField>
          <FormField label="Room" required error={errors.room}>
            <select value={form.room} onChange={(e) => update('room', e.target.value)}>
              {ROOM_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              {!ROOM_OPTIONS.includes(form.room) && form.room && (
                <option value={form.room}>{form.room}</option>
              )}
            </select>
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
        </div>

        <div className="laundry-lines-section">
          <div className="laundry-lines-head">
            <span>Items</span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addLine}>+ Add Item</button>
          </div>
          {errors.lineItems && <em className="form-error">{errors.lineItems}</em>}
          {form.lineItems.map((line, index) => {
            const unit = lineUnitPrice(line.itemId, form.serviceType)
            const lineTotal = unit * (Number(line.quantity) || 0)
            return (
              <div key={index} className="laundry-line-row">
                <FormField label={index === 0 ? 'Item' : undefined}>
                  <select value={line.itemId} onChange={(e) => updateLine(index, 'itemId', e.target.value)}>
                    <option value="">— Select item —</option>
                    {LAUNDRY_ITEMS.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label} ({formatINR(form.serviceType === 'express' ? item.expressPrice : item.normalPrice)} each)
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
                  <input type="text" readOnly value={line.itemId ? formatINR(lineTotal) : '—'} className="readonly-field" />
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

        <div className="laundry-total-row">
          <strong>Total Amount</strong>
          <span>{formatINR(totalAmount)}</span>
        </div>

        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update Order' : 'Create Order'} />
      </form>
    </Modal>
  )
}

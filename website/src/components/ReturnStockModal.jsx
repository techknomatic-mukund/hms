import { useEffect, useMemo, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'
import { todayISO } from '../utils/helpers'

function stockStatus(stock) {
  if (stock === 0) return 'Out of Stock'
  if (stock <= 15) return 'Low Stock'
  return 'OK'
}

export default function ReturnStockModal({
  open, onClose, onSubmit, inventoryItems = [], employees = [],
}) {
  const [itemId, setItemId] = useState('')
  const [returnQuantity, setReturnQuantity] = useState('')
  const [returnDate, setReturnDate] = useState(todayISO())
  const [returnedBy, setReturnedBy] = useState('')
  const [remarks, setRemarks] = useState('')
  const [errors, setErrors] = useState({})

  const selectedItem = useMemo(
    () => inventoryItems.find((i) => i.id === itemId) || null,
    [inventoryItems, itemId],
  )

  const maxReturn = selectedItem ? Number(selectedItem.stock) || 0 : 0

  useEffect(() => {
    if (!open) return
    const first = inventoryItems[0]
    setItemId(first?.id || '')
    setReturnQuantity('')
    setReturnDate(todayISO())
    setReturnedBy(employees[0]?.name || '')
    setRemarks('')
    setErrors({})
  }, [open, inventoryItems, employees])

  const handleItemChange = (id) => {
    setItemId(id)
    setReturnQuantity('')
    setErrors((prev) => ({ ...prev, itemId: '', returnQuantity: '' }))
  }

  const validate = () => {
    const next = {}
    if (!itemId) next.itemId = 'Select an inventory item'
    if (!selectedItem) next.itemId = 'Select a valid inventory item'
    if (maxReturn <= 0) {
      next.returnQuantity = 'No stock available to return for this item'
    } else if (returnQuantity === '' || Number(returnQuantity) <= 0) {
      next.returnQuantity = 'Enter a valid return quantity'
    } else if (Number(returnQuantity) > maxReturn) {
      next.returnQuantity = `Cannot return more than current stock (${maxReturn} ${selectedItem?.unit || ''})`
    }
    if (!returnDate) next.returnDate = 'Return date is required'
    if (!returnedBy) next.returnedBy = 'Select who is returning the stock'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate() || !selectedItem) return
    const qty = Number(returnQuantity)
    const newStock = maxReturn - qty

    onSubmit({
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      returnQuantity: qty,
      returnDate,
      returnedBy,
      remarks: remarks.trim(),
      previousStock: maxReturn,
      newStock,
      status: stockStatus(newStock),
      unit: selectedItem.unit,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Return Stock">
      <form className="entity-form" onSubmit={handleSubmit}>
        <FormSection
          title="Select Item"
          subtitle="Return quantity cannot exceed current stock on hand"
        >
          <div className="form-grid">
            <FormField label="Inventory Item" required error={errors.itemId} full>
              <select value={itemId} onChange={(e) => handleItemChange(e.target.value)}>
                <option value="">— Select item —</option>
                {inventoryItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — {item.stock} {item.unit} in stock
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Item Name">
              <input type="text" value={selectedItem?.name || '—'} readOnly className="readonly-field" />
            </FormField>
            <FormField label="Current Stock">
              <input
                type="text"
                value={selectedItem ? `${maxReturn} ${selectedItem.unit}` : '—'}
                readOnly
                className="readonly-field"
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Return Details">
          <div className="form-grid">
            <FormField label="Return Quantity" required error={errors.returnQuantity}>
              <input
                type="number"
                min="1"
                max={maxReturn || undefined}
                value={returnQuantity}
                placeholder={maxReturn > 0 ? `Max ${maxReturn}` : 'No stock'}
                disabled={!selectedItem || maxReturn <= 0}
                onChange={(e) => {
                  setReturnQuantity(e.target.value)
                  setErrors((prev) => ({ ...prev, returnQuantity: '' }))
                }}
              />
              {selectedItem && maxReturn > 0 && (
                <span className="field-hint">
                  Maximum returnable: {maxReturn} {selectedItem.unit}
                </span>
              )}
            </FormField>
            <FormField label="Return Date" required error={errors.returnDate}>
              <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
            </FormField>
            <FormField label="Returned By" required error={errors.returnedBy}>
              <select value={returnedBy} onChange={(e) => setReturnedBy(e.target.value)}>
                <option value="">— Select employee —</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.name}>{e.name} ({e.dept})</option>
                ))}
              </select>
            </FormField>
            <FormField label="Purpose / Remarks" full>
              <textarea
                rows={2}
                value={remarks}
                placeholder="Return to vendor, damaged goods, expiry, etc."
                onChange={(e) => setRemarks(e.target.value)}
              />
            </FormField>
          </div>
          {selectedItem && maxReturn > 0 && returnQuantity && Number(returnQuantity) <= maxReturn && (
            <p className="field-hint">
              Stock after return: {maxReturn - Number(returnQuantity)} {selectedItem.unit}
            </p>
          )}
        </FormSection>

        <FormActions onCancel={onClose} submitLabel="Confirm Return" />
      </form>
    </Modal>
  )
}

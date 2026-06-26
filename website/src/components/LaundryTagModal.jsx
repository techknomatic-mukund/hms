import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'

const empty = { tag: '', orderId: '', item: '', guest: '', room: '', status: 'Pickup' }

export default function LaundryTagModal({ open, onClose, onSubmit, orders, editItem = null }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (!open) return
    if (editItem) {
      setForm({
        tag: editItem.tag,
        orderId: editItem.orderId,
        item: editItem.item,
        guest: editItem.guest,
        room: editItem.room,
        status: editItem.status,
      })
    } else {
      setForm(empty)
    }
  }, [open, editItem])

  const pickOrder = (id) => {
    const order = orders.find((o) => o.id === id)
    if (!order) return
    setForm((p) => ({
      ...p,
      orderId: id,
      guest: order.guest,
      room: order.room,
      status: order.stage,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.item.trim() || !form.orderId) return
    onSubmit({
      tag: form.tag || undefined,
      orderId: form.orderId,
      item: form.item.trim(),
      guest: form.guest,
      room: form.room,
      status: form.status,
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Item Tag' : 'Tag Laundry Item'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Laundry Order" required full>
            <select value={form.orderId} onChange={(e) => pickOrder(e.target.value)}>
              <option value="">— Select order —</option>
              {orders.map((o) => <option key={o.id} value={o.id}>{o.id} — {o.guest}</option>)}
            </select>
          </FormField>
          {editItem && (
            <FormField label="Tag / Barcode">
              <input type="text" readOnly value={form.tag} className="readonly-field" />
            </FormField>
          )}
          <FormField label="Item Description" required full>
            <input type="text" value={form.item} placeholder="Shirt — Blue formal" onChange={(e) => setForm((p) => ({ ...p, item: e.target.value }))} />
          </FormField>
          <FormField label="Guest">
            <input type="text" readOnly value={form.guest} className="readonly-field" />
          </FormField>
          <FormField label="Room">
            <input type="text" readOnly value={form.room} className="readonly-field" />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
              {['Pickup', 'Washing', 'Drying', 'Ironing', 'Quality Check', 'Delivery', 'Delivered'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update Tag' : 'Create Tag'} />
      </form>
    </Modal>
  )
}

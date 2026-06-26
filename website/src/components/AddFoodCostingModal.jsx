import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { calcMargin, formatINR } from '../utils/helpers'

export default function AddFoodCostingModal({ open, onClose, onSubmit, editItem = null }) {
  const [form, setForm] = useState({ name: '', cost: '', sell: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setForm(editItem ? { name: editItem.name, cost: editItem.cost, sell: editItem.sell } : { name: '', cost: '', sell: '' })
    setErrors({})
  }, [open, editItem])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.cost || !form.sell) { setErrors({ name: 'Fill all fields' }); return }
    const cost = parseFloat(form.cost); const sell = parseFloat(form.sell)
    onSubmit({ name: form.name.trim(), cost, sell, margin: calcMargin(cost, sell) })
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Costing' : 'Add Food Costing'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Dish" required full><input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></FormField>
          <FormField label="Cost (₹)"><input type="number" value={form.cost} onChange={(e) => setForm((p) => ({ ...p, cost: e.target.value }))} /></FormField>
          <FormField label="Sell (₹)"><input type="number" value={form.sell} onChange={(e) => setForm((p) => ({ ...p, sell: e.target.value }))} /></FormField>
        </div>
        {form.cost && form.sell && <p className="form-preview">Margin: {calcMargin(form.cost, form.sell)}</p>}
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update' : 'Add'} />
      </form>
    </Modal>
  )
}

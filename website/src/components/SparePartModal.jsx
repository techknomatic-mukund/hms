import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { MAINTENANCE_CATEGORIES } from '../utils/maintenanceHelpers'

const empty = { name: '', category: 'HVAC', stock: '', unit: 'pcs', reorder: '', status: 'OK' }

export default function SparePartModal({ open, onClose, onSubmit, editItem = null }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (!open) return
    if (editItem) {
      setForm({
        name: editItem.name,
        category: editItem.category,
        stock: String(editItem.stock),
        unit: editItem.unit,
        reorder: String(editItem.reorder),
        status: editItem.status,
      })
    } else {
      setForm(empty)
    }
  }, [open, editItem])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    const stock = parseInt(form.stock, 10) || 0
    const reorder = parseInt(form.reorder, 10) || 0
    let status = form.status
    if (stock === 0) status = 'Out of Stock'
    else if (stock <= reorder) status = 'Low Stock'
    else status = 'OK'
    onSubmit({
      name: form.name.trim(),
      category: form.category,
      stock,
      unit: form.unit,
      reorder,
      status,
      lastUsed: editItem?.lastUsed || '—',
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Spare Part' : 'Add Spare Part'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Part Name" required full>
            <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </FormField>
          <FormField label="Category">
            <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
              {MAINTENANCE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="Stock" required>
            <input type="number" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} />
          </FormField>
          <FormField label="Unit">
            <select value={form.unit} onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}>
              {['pcs', 'kits', 'cans', 'L', 'm'].map((u) => <option key={u}>{u}</option>)}
            </select>
          </FormField>
          <FormField label="Reorder Level">
            <input type="number" value={form.reorder} onChange={(e) => setForm((p) => ({ ...p, reorder: e.target.value }))} />
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update' : 'Add Part'} />
      </form>
    </Modal>
  )
}

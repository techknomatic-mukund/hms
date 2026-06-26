import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'

const DEPTS = ['Front Office', 'F&B', 'Housekeeping', 'Finance', 'Spa', 'Maintenance']

export default function AddEmployeeModal({ open, onClose, onSubmit, editItem = null }) {
  const [form, setForm] = useState({ name: '', dept: 'Front Office', attendance: 'Present', leave: '0 pending' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setForm(editItem ? { ...editItem } : { name: '', dept: 'Front Office', attendance: 'Present', leave: '0 pending' })
    setErrors({})
  }, [open, editItem])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setErrors({ name: 'Required' }); return }
    onSubmit({ name: form.name.trim(), dept: form.dept, attendance: form.attendance, leave: form.leave })
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Employee' : 'Add Employee'}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Full Name" required error={errors.name} full>
            <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </FormField>
          <FormField label="Department">
            <select value={form.dept} onChange={(e) => setForm((p) => ({ ...p, dept: e.target.value }))}>{DEPTS.map((d) => <option key={d}>{d}</option>)}</select>
          </FormField>
          <FormField label="Attendance">
            <select value={form.attendance} onChange={(e) => setForm((p) => ({ ...p, attendance: e.target.value }))}>
              <option>Present</option><option>On Leave</option><option>Absent</option>
            </select>
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel={editItem ? 'Update' : 'Add Employee'} />
      </form>
    </Modal>
  )
}

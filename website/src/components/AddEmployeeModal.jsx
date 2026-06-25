import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { useFormState } from '../hooks/useFormState'

const DEPTS = ['Front Office', 'F&B', 'Housekeeping', 'Finance', 'Spa', 'Maintenance']
const empty = { name: '', dept: 'Front Office', attendance: 'Present' }

export default function AddEmployeeModal({ open, onClose, onSubmit }) {
  const { form, errors, update, setFieldErrors } = useFormState(empty, open)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setFieldErrors({ name: 'Employee name is required' })
      return
    }
    onSubmit({
      name: form.name.trim(),
      dept: form.dept,
      attendance: form.attendance,
      leave: '0 pending',
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Employee">
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Full Name" required error={errors.name} full>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </FormField>
          <FormField label="Department" required>
            <select value={form.dept} onChange={(e) => update('dept', e.target.value)}>
              {DEPTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </FormField>
          <FormField label="Today's Attendance">
            <select value={form.attendance} onChange={(e) => update('attendance', e.target.value)}>
              <option>Present</option>
              <option>On Leave</option>
              <option>Absent</option>
            </select>
          </FormField>
        </div>
        <FormActions onCancel={onClose} submitLabel="Add Employee" />
      </form>
    </Modal>
  )
}

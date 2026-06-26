import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'
import { PERMISSIONS } from '../data/roles'

const DEPTS = ['Front Office', 'F&B', 'Housekeeping', 'Finance', 'Spa', 'Maintenance', 'HR']
const SHIFTS = ['Morning', 'Afternoon', 'Evening', 'Night', 'Rotational']
const ATTENDANCE = ['Present', 'On Leave', 'Absent', 'Half Day', 'WFH']
const PAYROLL_CYCLES = ['Monthly', 'Bi-weekly', 'Weekly']
const RECRUITMENT_STATUSES = ['Open', 'Interviewing', 'Offered', 'Hired', 'Closed']
const DOC_TYPES = ['ID Proof', 'Contract', 'Resume', 'Certification', 'Payslip']

const getEmpty = () => ({
  name: '', dept: 'Front Office', attendance: 'Present', leave: '0 pending',
  email: '', phone: '', joinDate: '',
  shift: 'Morning', checkInTime: '',
  leaveBalance: '12', leaveStatus: '0 pending',
  salary: '', payrollCycle: 'Monthly',
  positionApplied: '', recruitmentStatus: 'Hired',
  performanceRating: '', reviewDate: '',
  documentType: 'Contract', documentRef: '',
  reportTag: '', analyticsNotes: '',
  systemRole: 'Staff', assignedPermissions: '',
  notifyEmail: true, notifySms: false,
})

function togglePerm(perm, setForm) {
  setForm((prev) => {
    const items = prev.assignedPermissions ? prev.assignedPermissions.split(', ').filter(Boolean) : []
    const next = items.includes(perm) ? items.filter((p) => p !== perm) : [...items, perm]
    return { ...prev, assignedPermissions: next.join(', ') }
  })
}

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  return { ...getEmpty(), ...editItem }
}

export default function EmployeeModal({ open, onClose, onSubmit, editItem = null }) {
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
    if (!form.name.trim()) next.name = 'Name is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      name: form.name.trim(),
      leave: form.leaveStatus || form.leave,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Employee' : 'Add Employee'} wide>
      <form className="entity-form" onSubmit={handleSubmit}>
        <FormSection title="Employee Management" subtitle="Core employee profile and contact details">
          <div className="form-grid">
            <FormField label="Full Name" required error={errors.name} full>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} />
            </FormField>
            <FormField label="Department">
              <select value={form.dept} onChange={(e) => update('dept', e.target.value)}>
                {DEPTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </FormField>
            <FormField label="Email">
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </FormField>
            <FormField label="Phone">
              <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </FormField>
            <FormField label="Join Date">
              <input type="date" value={form.joinDate} onChange={(e) => update('joinDate', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Attendance Management" subtitle="Daily attendance, shift and check-in tracking">
          <div className="form-grid">
            <FormField label="Today's Status">
              <select value={form.attendance} onChange={(e) => update('attendance', e.target.value)}>
                {ATTENDANCE.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </FormField>
            <FormField label="Shift">
              <select value={form.shift} onChange={(e) => update('shift', e.target.value)}>
                {SHIFTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Check-in Time">
              <input type="time" value={form.checkInTime} onChange={(e) => update('checkInTime', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Leave Management" subtitle="Leave balance and current leave status">
          <div className="form-grid">
            <FormField label="Leave Balance (days)">
              <input type="number" min="0" value={form.leaveBalance} onChange={(e) => update('leaveBalance', e.target.value)} />
            </FormField>
            <FormField label="Leave Status">
              <input type="text" value={form.leaveStatus} placeholder="0 pending" onChange={(e) => update('leaveStatus', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Payroll Management" subtitle="Salary and payroll cycle configuration">
          <div className="form-grid">
            <FormField label="Monthly Salary (₹)">
              <input type="number" min="0" value={form.salary} onChange={(e) => update('salary', e.target.value)} />
            </FormField>
            <FormField label="Payroll Cycle">
              <select value={form.payrollCycle} onChange={(e) => update('payrollCycle', e.target.value)}>
                {PAYROLL_CYCLES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Recruitment Management" subtitle="Hiring pipeline and position details">
          <div className="form-grid">
            <FormField label="Position">
              <input type="text" value={form.positionApplied} placeholder="Front Desk Executive" onChange={(e) => update('positionApplied', e.target.value)} />
            </FormField>
            <FormField label="Recruitment Status">
              <select value={form.recruitmentStatus} onChange={(e) => update('recruitmentStatus', e.target.value)}>
                {RECRUITMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Performance Management" subtitle="Performance ratings and review schedule">
          <div className="form-grid">
            <FormField label="Performance Rating (1–5)">
              <input type="number" min="1" max="5" value={form.performanceRating} onChange={(e) => update('performanceRating', e.target.value)} />
            </FormField>
            <FormField label="Last Review Date">
              <input type="date" value={form.reviewDate} onChange={(e) => update('reviewDate', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Employee Document Management" subtitle="Store references to employee documents">
          <div className="form-grid">
            <FormField label="Document Type">
              <select value={form.documentType} onChange={(e) => update('documentType', e.target.value)}>
                {DOC_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </FormField>
            <FormField label="Document Reference">
              <input type="text" value={form.documentRef} placeholder="DOC-EMP-101" onChange={(e) => update('documentRef', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Reports & Analytics" subtitle="HR reporting tags and notes">
          <div className="form-grid">
            <FormField label="Report Tag">
              <input type="text" value={form.reportTag} onChange={(e) => update('reportTag', e.target.value)} />
            </FormField>
            <FormField label="Analytics Notes" full>
              <input type="text" value={form.analyticsNotes} onChange={(e) => update('analyticsNotes', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Role & Permission Management" subtitle="System role and module permissions">
          <div className="form-grid">
            <FormField label="System Role">
              <select value={form.systemRole} onChange={(e) => update('systemRole', e.target.value)}>
                {['Staff', 'Supervisor', 'Manager', 'Admin'].map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </FormField>
          </div>
          <div className="service-request-chips">
            {PERMISSIONS.map((perm) => {
              const active = form.assignedPermissions.split(', ').filter(Boolean).includes(perm)
              return (
                <button key={perm} type="button" className={`chip-btn${active ? ' active' : ''}`} onClick={() => togglePerm(perm, setForm)}>
                  {perm}
                </button>
              )
            })}
          </div>
        </FormSection>

        <FormSection title="Notification Management" subtitle="Email and SMS notification preferences">
          <div className="form-field form-field-full">
            <label className="tax-option">
              <input type="checkbox" checked={form.notifyEmail} onChange={(e) => update('notifyEmail', e.target.checked)} />
              Email notifications (leave, payroll, announcements)
            </label>
          </div>
          <div className="form-field form-field-full">
            <label className="tax-option">
              <input type="checkbox" checked={form.notifySms} onChange={(e) => update('notifySms', e.target.checked)} />
              SMS notifications
            </label>
          </div>
        </FormSection>

        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update Employee' : 'Add Employee'} />
      </form>
    </Modal>
  )
}

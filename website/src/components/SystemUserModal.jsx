import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'
import { PERMISSIONS, ROLES } from '../data/roles'

const ROLE_OPTIONS = Object.values(ROLES).map((r) => r.label)
const STATUSES = ['Active', 'Inactive', 'Suspended', 'Pending']
const AUTH_METHODS = ['Email/Password', 'SSO', 'LDAP', 'OTP']
const TIMEZONES = ['Asia/Kolkata', 'UTC', 'Asia/Dubai', 'Europe/London']
const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']
const PASSWORD_POLICIES = ['Standard', 'Strong', 'Enterprise']
const MODULES = ['Front Office', 'Housekeeping', 'POS', 'Finance', 'HRMS', 'CRM', 'Admin', 'Reports']

const getEmpty = () => ({
  name: '', email: '', role: 'Receptionist', status: 'Active',
  assignedPermissions: 'View, Create, Update',
  accessLevel: 'Standard', moduleAccess: 'Front Office, POS',
  auditNote: '',
  timezone: 'Asia/Kolkata', dateFormat: 'DD/MM/YYYY',
  authMethod: 'Email/Password', mfaEnabled: false,
  lastBackup: '', backupEnabled: true,
  lastLogin: '', loginCount: '',
  emailAlerts: true,
  department: '', costCenter: '',
  passwordPolicy: 'Standard', ipRestriction: '',
  reportTag: '', analyticsNotes: '',
})

function togglePerm(perm, setForm) {
  setForm((prev) => {
    const items = prev.assignedPermissions ? prev.assignedPermissions.split(', ').filter(Boolean) : []
    const next = items.includes(perm) ? items.filter((p) => p !== perm) : [...items, perm]
    return { ...prev, assignedPermissions: next.join(', ') }
  })
}

function toggleModule(mod, setForm) {
  setForm((prev) => {
    const items = prev.moduleAccess ? prev.moduleAccess.split(', ').filter(Boolean) : []
    const next = items.includes(mod) ? items.filter((m) => m !== mod) : [...items, mod]
    return { ...prev, moduleAccess: next.join(', ') }
  })
}

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  return { ...getEmpty(), ...editItem }
}

export default function SystemUserModal({ open, onClose, onSubmit, editItem = null }) {
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
    if (!form.email.trim()) next.email = 'Email is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ ...form, name: form.name.trim(), email: form.email.trim() })
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit System User' : 'Add System User'} wide>
      <form className="entity-form" onSubmit={handleSubmit}>
        <FormSection title="User Management" subtitle="Create and manage system user accounts">
          <div className="form-grid">
            <FormField label="Full Name" required error={errors.name}>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} />
            </FormField>
            <FormField label="Email" required error={errors.email}>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Role Management" subtitle="Assign ERP role to user">
          <FormField label="Role" full>
            <select value={form.role} onChange={(e) => update('role', e.target.value)}>
              {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="Permission Management" subtitle="Granular action permissions">
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

        <FormSection title="RBAC (Role-Based Access Control)" subtitle="Module-level access control">
          <div className="form-grid">
            <FormField label="Access Level">
              <select value={form.accessLevel} onChange={(e) => update('accessLevel', e.target.value)}>
                {['Read Only', 'Standard', 'Elevated', 'Full Access'].map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </FormField>
          </div>
          <p className="field-hint">Module access</p>
          <div className="service-request-chips">
            {MODULES.map((mod) => {
              const active = form.moduleAccess.split(', ').filter(Boolean).includes(mod)
              return (
                <button key={mod} type="button" className={`chip-btn${active ? ' active' : ''}`} onClick={() => toggleModule(mod, setForm)}>
                  {mod}
                </button>
              )
            })}
          </div>
        </FormSection>

        <FormSection title="Audit Log Management" subtitle="Notes for user-related audit entries">
          <FormField label="Audit Notes" full>
            <textarea rows={2} value={form.auditNote} placeholder="Role change, access granted..." onChange={(e) => update('auditNote', e.target.value)} />
          </FormField>
        </FormSection>

        <FormSection title="System Settings" subtitle="Locale and display preferences for user">
          <div className="form-grid">
            <FormField label="Timezone">
              <select value={form.timezone} onChange={(e) => update('timezone', e.target.value)}>
                {TIMEZONES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Date Format">
              <select value={form.dateFormat} onChange={(e) => update('dateFormat', e.target.value)}>
                {DATE_FORMATS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="User Authentication" subtitle="Login method and multi-factor authentication">
          <div className="form-grid">
            <FormField label="Auth Method">
              <select value={form.authMethod} onChange={(e) => update('authMethod', e.target.value)}>
                {AUTH_METHODS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </FormField>
            <div className="form-field form-field-full">
              <label className="tax-option">
                <input type="checkbox" checked={form.mfaEnabled} onChange={(e) => update('mfaEnabled', e.target.checked)} />
                Enable multi-factor authentication (MFA)
              </label>
            </div>
          </div>
        </FormSection>

        <FormSection title="User Status Management" subtitle="Account active/inactive status">
          <FormField label="Status" full>
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="Backup & Restore" subtitle="User data backup configuration">
          <div className="form-grid">
            <FormField label="Last Backup">
              <input type="date" value={form.lastBackup} onChange={(e) => update('lastBackup', e.target.value)} />
            </FormField>
            <div className="form-field form-field-full">
              <label className="tax-option">
                <input type="checkbox" checked={form.backupEnabled} onChange={(e) => update('backupEnabled', e.target.checked)} />
                Include user in automated backups
              </label>
            </div>
          </div>
        </FormSection>

        <FormSection title="Access Monitoring" subtitle="Login activity and session tracking">
          <div className="form-grid">
            <FormField label="Last Login">
              <input type="datetime-local" value={form.lastLogin} onChange={(e) => update('lastLogin', e.target.value)} />
            </FormField>
            <FormField label="Login Count">
              <input type="number" min="0" value={form.loginCount} onChange={(e) => update('loginCount', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Notification Management" subtitle="System alert preferences">
          <div className="form-field form-field-full">
            <label className="tax-option">
              <input type="checkbox" checked={form.emailAlerts} onChange={(e) => update('emailAlerts', e.target.checked)} />
              Send security and system alerts via email
            </label>
          </div>
        </FormSection>

        <FormSection title="Master Data Management" subtitle="Department and cost centre assignment">
          <div className="form-grid">
            <FormField label="Department">
              <input type="text" value={form.department} onChange={(e) => update('department', e.target.value)} />
            </FormField>
            <FormField label="Cost Centre">
              <input type="text" value={form.costCenter} placeholder="CC-ADMIN" onChange={(e) => update('costCenter', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Security Management" subtitle="Password policy and IP restrictions">
          <div className="form-grid">
            <FormField label="Password Policy">
              <select value={form.passwordPolicy} onChange={(e) => update('passwordPolicy', e.target.value)}>
                {PASSWORD_POLICIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormField>
            <FormField label="IP Restriction">
              <input type="text" value={form.ipRestriction} placeholder="192.168.1.0/24 or leave blank" onChange={(e) => update('ipRestriction', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Reports & Analytics" subtitle="Admin reporting tags">
          <div className="form-grid">
            <FormField label="Report Tag">
              <input type="text" value={form.reportTag} onChange={(e) => update('reportTag', e.target.value)} />
            </FormField>
            <FormField label="Analytics Notes" full>
              <input type="text" value={form.analyticsNotes} onChange={(e) => update('analyticsNotes', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update User' : 'Create User'} />
      </form>
    </Modal>
  )
}

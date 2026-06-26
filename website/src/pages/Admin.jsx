import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import SystemUserModal from '../components/SystemUserModal'
import { Badge, SectionHeader } from '../components/UI'
import { PERMISSIONS } from '../data/roles'

const features = [
  'User Management', 'Role Management', 'Permission Management', 'RBAC (Role-Based Access Control)',
  'Audit Log Management', 'System Settings', 'User Authentication', 'User Status Management',
  'Backup & Restore', 'Access Monitoring', 'Notification Management', 'Master Data Management',
  'Security Management', 'Reports & Analytics',
]

const viewFields = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'accessLevel', label: 'Access Level' },
  { key: 'moduleAccess', label: 'Modules' },
  { key: 'assignedPermissions', label: 'Permissions' },
  { key: 'authMethod', label: 'Auth' },
  { key: 'mfaEnabled', label: 'MFA', render: (r) => (r.mfaEnabled ? 'Enabled' : 'Disabled') },
]

export default function Admin() {
  const store = useStore()
  const key = 'systemUsers'

  return (
    <CrudModule
      title="Administration"
      description="System users, roles, permissions & audit"
      features={features}
      createLabel="+ Add User"
      data={store.systemUsers}
      moduleName="System User"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'accessLevel', label: 'Access', render: (r) => r.accessLevel || '—' },
        { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'Active' ? 'success' : 'warning'}>{r.status}</Badge> },
      ]}
      viewFields={viewFields}
      onCreate={(f) => store.create(key, 'USR-', 'Admin', f)}
      onUpdate={(id, f) => store.update(key, 'Admin', id, f)}
      onDelete={(id) => store.remove(key, 'Admin', id)}
      customModal={(props) => <SystemUserModal {...props} />}
      extra={(
        <>
          <section className="panel">
            <SectionHeader title="RBAC Permission Model" subtitle="View · Create · Update · Delete · Approve · Export" />
            <div className="perm-grid">
              {PERMISSIONS.map((p) => <span key={p} className="feature-chip">{p}</span>)}
            </div>
          </section>
          <section className="panel">
            <SectionHeader title="Audit Log" />
            <ul className="info-list">
              {store.activityLog.slice(0, 8).map((l) => (
                <li key={l.id}><strong>{l.time}</strong> [{l.module}] {l.action}: {l.detail}</li>
              ))}
            </ul>
          </section>
        </>
      )}
    />
  )
}

import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import { Badge, SectionHeader } from '../components/UI'
import { PERMISSIONS } from '../data/roles'

const features = ['Users', 'Roles', 'Permissions', 'Audit Logs', 'Settings', 'Backup']

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
        { key: 'status', label: 'Status', render: (r) => <Badge variant="success">{r.status}</Badge> },
      ]}
      formFields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'email', label: 'Email', required: true },
        { name: 'role', label: 'Role', type: 'select', options: ['Receptionist', 'Housekeeping', 'Restaurant', 'Finance', 'HR', 'Manager', 'Administrator'], default: 'Receptionist' },
        { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], default: 'Active' },
      ]}
      onCreate={(f) => store.create(key, 'USR-', 'Admin', f)}
      onUpdate={(id, f) => store.update(key, 'Admin', id, f)}
      onDelete={(id) => store.remove(key, 'Admin', id)}
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

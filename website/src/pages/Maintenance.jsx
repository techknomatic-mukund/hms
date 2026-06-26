import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import { Badge } from '../components/UI'

const features = ['Complaint', 'Work Order', 'Asset Register', 'Preventive Maintenance']

export default function Maintenance() {
  const store = useStore()
  const key = 'maintenanceTickets'

  return (
    <CrudModule
      title="Maintenance"
      description="Asset maintenance & work orders"
      features={features}
      createLabel="+ New Work Order"
      data={store.maintenanceTickets}
      moduleName="Work Order"
      columns={[
        { key: 'id', label: 'Ref' },
        { key: 'asset', label: 'Asset' },
        { key: 'complaint', label: 'Complaint' },
        { key: 'priority', label: 'Priority', render: (r) => <Badge variant={r.priority === 'High' ? 'warning' : 'default'}>{r.priority}</Badge> },
        { key: 'assignee', label: 'Assignee' },
        { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'Open' ? 'warning' : 'info'}>{r.status}</Badge> },
      ]}
      formFields={[
        { name: 'asset', label: 'Asset', required: true, full: true },
        { name: 'complaint', label: 'Complaint', type: 'textarea', required: true, full: true },
        { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'], default: 'Medium' },
        { name: 'assignee', label: 'Assignee', default: 'Maintenance Team' },
        { name: 'status', label: 'Status', type: 'select', options: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
      ]}
      onCreate={(f) => store.create(key, 'WO-', 'Maintenance', f)}
      onUpdate={(id, f) => store.update(key, 'Maintenance', id, f)}
      onDelete={(id) => store.remove(key, 'Maintenance', id)}
    />
  )
}

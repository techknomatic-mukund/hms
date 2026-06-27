import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import MaintenanceWorkOrderModal from '../components/MaintenanceWorkOrderModal'
import { Badge } from '../components/UI'

const viewFields = [
  { key: 'id', label: 'Ref' },
  { key: 'room', label: 'Room', render: (r) => r.room || '—' },
  { key: 'asset', label: 'Asset' },
  { key: 'complaint', label: 'Complaint' },
  { key: 'priority', label: 'Priority' },
  { key: 'assignee', label: 'Technician' },
  { key: 'status', label: 'Status' },
]

export default function Maintenance() {
  const store = useStore()
  const key = 'maintenanceTickets'

  return (
    <CrudModule
      title="Maintenance"
      description="Asset maintenance & work orders"
      createLabel="+ New Work Order"
      data={store.maintenanceTickets}
      moduleName="Work Order"
      columns={[
        { key: 'id', label: 'Ref' },
        { key: 'room', label: 'Room', render: (r) => r.room || '—' },
        { key: 'asset', label: 'Asset' },
        { key: 'complaint', label: 'Complaint' },
        { key: 'priority', label: 'Priority', render: (r) => <Badge variant={r.priority === 'High' ? 'warning' : 'default'}>{r.priority}</Badge> },
        { key: 'assignee', label: 'Technician' },
        { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'Open' ? 'warning' : 'info'}>{r.status}</Badge> },
      ]}
      viewFields={viewFields}
      onCreate={(f) => store.create(key, 'WO-', 'Maintenance', f)}
      onUpdate={(id, f) => store.update(key, 'Maintenance', id, f)}
      onDelete={(id) => store.remove(key, 'Maintenance', id)}
      customModal={(props) => <MaintenanceWorkOrderModal {...props} />}
    />
  )
}

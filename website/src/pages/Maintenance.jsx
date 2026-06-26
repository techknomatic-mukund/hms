import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import MaintenanceWorkOrderModal from '../components/MaintenanceWorkOrderModal'
import { Badge } from '../components/UI'

const features = [
  'Maintenance Scheduling', 'Asset Maintenance History', 'Spare Parts Inventory',
  'Technician Assignment & Tracking', 'Maintenance Cost Analysis',
]

const viewFields = [
  { key: 'id', label: 'Ref' },
  { key: 'asset', label: 'Asset' },
  { key: 'complaint', label: 'Complaint' },
  { key: 'maintenanceType', label: 'Type' },
  { key: 'scheduledDate', label: 'Scheduled' },
  { key: 'assignee', label: 'Technician' },
  { key: 'trackingStatus', label: 'Tracking' },
  { key: 'spareParts', label: 'Spare Parts' },
  { key: 'totalCost', label: 'Total Cost', render: (r) => (r.totalCost ? `₹${r.totalCost}` : '—') },
  { key: 'assetHistory', label: 'Asset History' },
  { key: 'status', label: 'Status' },
]

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
        { key: 'maintenanceType', label: 'Type', render: (r) => r.maintenanceType || '—' },
        { key: 'priority', label: 'Priority', render: (r) => <Badge variant={r.priority === 'High' ? 'warning' : 'default'}>{r.priority}</Badge> },
        { key: 'assignee', label: 'Assignee' },
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

import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import LaundryOrderModal from '../components/LaundryOrderModal'
import { Badge } from '../components/UI'
import { formatINR } from '../utils/helpers'

const features = [
  'Laundry Tracking', 'Item Inventory & Tagging', 'Express Laundry Service',
  'Quality Inspection', 'Laundry Service History',
]

const viewFields = [
  { key: 'id', label: 'Ref' },
  { key: 'guest', label: 'Guest' },
  { key: 'room', label: 'Room' },
  { key: 'items', label: 'Items' },
  { key: 'itemTag', label: 'Item Tag' },
  { key: 'trackingStatus', label: 'Tracking' },
  { key: 'expressService', label: 'Express', render: (r) => (r.expressService ? 'Yes' : 'No') },
  { key: 'inspectionStatus', label: 'Inspection' },
  { key: 'serviceHistory', label: 'History' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
]

export default function Laundry() {
  const store = useStore()
  const key = 'laundryOrders'

  return (
    <CrudModule
      title="Laundry"
      description="Guest laundry services — billed to room folio"
      features={features}
      createLabel="+ New Order"
      data={store.laundryOrders}
      moduleName="Laundry Order"
      columns={[
        { key: 'id', label: 'Ref' },
        { key: 'guest', label: 'Guest' },
        { key: 'room', label: 'Room' },
        { key: 'items', label: 'Items' },
        { key: 'service', label: 'Service' },
        { key: 'trackingStatus', label: 'Tracking', render: (r) => r.trackingStatus || '—' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status', render: (r) => <Badge variant="info">{r.status}</Badge> },
      ]}
      viewFields={viewFields}
      onCreate={(f) => store.create(key, 'LD-', 'Laundry', { ...f, amount: formatINR(f.amount) })}
      onUpdate={(id, f) => store.update(key, 'Laundry', id, { ...f, amount: f.amount.toString().includes('₹') ? f.amount : formatINR(f.amount) })}
      onDelete={(id) => store.remove(key, 'Laundry', id)}
      customModal={(props) => <LaundryOrderModal {...props} />}
    />
  )
}

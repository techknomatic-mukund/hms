import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import { Badge } from '../components/UI'
import { formatINR } from '../utils/helpers'

const features = ['Laundry Booking', 'Pickup', 'Washing', 'Dry Cleaning', 'Ironing', 'Delivery', 'Billing']

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
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status', render: (r) => <Badge variant="info">{r.status}</Badge> },
      ]}
      formFields={[
        { name: 'guest', label: 'Guest', required: true },
        { name: 'room', label: 'Room', required: true },
        { name: 'items', label: 'Items', required: true, full: true },
        { name: 'service', label: 'Service', type: 'select', options: ['Wash & Iron', 'Dry Clean', 'Express', 'Iron Only'], default: 'Wash & Iron' },
        { name: 'amount', label: 'Amount (₹)', type: 'number', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['Pickup Scheduled', 'In Progress', 'Ready', 'Delivered'], default: 'Pickup Scheduled' },
      ]}
      onCreate={(f) => store.create(key, 'LD-', 'Laundry', { ...f, amount: formatINR(f.amount) })}
      onUpdate={(id, f) => store.update(key, 'Laundry', id, { ...f, amount: f.amount.toString().includes('₹') ? f.amount : formatINR(f.amount) })}
      onDelete={(id) => store.remove(key, 'Laundry', id)}
    />
  )
}

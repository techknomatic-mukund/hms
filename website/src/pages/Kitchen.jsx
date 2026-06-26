import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import { Badge } from '../components/UI'

const features = ['Kitchen Orders', 'Recipe Management', 'Ingredient Consumption', 'Food Waste']

export default function Kitchen() {
  const store = useStore()
  const key = 'kitchenOrders'

  return (
    <CrudModule
      title="Kitchen"
      description="Kitchen order management — synced from Restaurant POS"
      features={features}
      createLabel="+ New Kitchen Order"
      data={store.kitchenOrders}
      moduleName="Kitchen Order"
      columns={[
        { key: 'id', label: 'Ref' },
        { key: 'orderRef', label: 'POS Ref' },
        { key: 'dish', label: 'Dish' },
        { key: 'qty', label: 'Qty' },
        { key: 'station', label: 'Station' },
        { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'Cooking' ? 'warning' : 'info'}>{r.status}</Badge> },
      ]}
      formFields={[
        { name: 'orderRef', label: 'POS Order Ref', required: true },
        { name: 'dish', label: 'Dish', required: true, full: true },
        { name: 'qty', label: 'Quantity', type: 'number', required: true, default: 1 },
        { name: 'station', label: 'Station', type: 'select', options: ['Main Kitchen', 'Room Service', 'Pastry', 'Grill'], default: 'Main Kitchen' },
        { name: 'status', label: 'Status', type: 'select', options: ['Queued', 'Cooking', 'Ready', 'Served'], default: 'Queued' },
      ]}
      onCreate={(f) => store.create(key, 'KIT-', 'Kitchen', { ...f, qty: Number(f.qty) })}
      onUpdate={(id, f) => store.update(key, 'Kitchen', id, { ...f, qty: Number(f.qty) })}
      onDelete={(id) => store.remove(key, 'Kitchen', id)}
    />
  )
}

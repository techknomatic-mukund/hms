import { useMemo } from 'react'
import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import KitchenOrderModal from '../components/KitchenOrderModal'
import { Badge } from '../components/UI'

const features = [
  'Kitchen Order Management', 'Kitchen Queue Management', 'Food Preparation Tracking',
  'Chef Assignment', 'Kitchen Station Management', 'Recipe & Ingredient Management',
  'Order Status Tracking', 'Ingredient Consumption Tracking', 'Food Waste Management',
  'Kitchen Reports & Analytics',
]

const viewFields = [
  { key: 'id', label: 'Ref' },
  { key: 'orderRef', label: 'POS Ref' },
  { key: 'dish', label: 'Dish' },
  { key: 'qty', label: 'Qty' },
  { key: 'chefName', label: 'Chef' },
  { key: 'station', label: 'Station' },
  { key: 'prepStage', label: 'Prep Stage' },
  { key: 'queuePriority', label: 'Queue Priority' },
  { key: 'ingredientsUsed', label: 'Ingredients Used' },
  { key: 'wasteAmount', label: 'Waste' },
  { key: 'performanceScore', label: 'Score' },
  { key: 'status', label: 'Status' },
]

export default function Kitchen() {
  const store = useStore()
  const key = 'kitchenOrders'

  const chefs = useMemo(
    () => store.employees.filter((e) => e.dept === 'F&B').map((e) => e.name).concat(['Chef Ravi', 'Head Chef']),
    [store.employees],
  )

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
        { key: 'chefName', label: 'Chef', render: (r) => r.chefName || '—' },
        { key: 'station', label: 'Station' },
        { key: 'prepStage', label: 'Prep', render: (r) => r.prepStage || '—' },
        { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'Cooking' ? 'warning' : 'info'}>{r.status}</Badge> },
      ]}
      viewFields={viewFields}
      onCreate={(f) => store.create(key, 'KIT-', 'Kitchen', f)}
      onUpdate={(id, f) => store.update(key, 'Kitchen', id, f)}
      onDelete={(id) => store.remove(key, 'Kitchen', id)}
      customModal={(props) => <KitchenOrderModal {...props} chefs={chefs} />}
    />
  )
}

import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import { Badge } from '../components/UI'

const features = ['Stock Entry', 'Stock Issue', 'Stock Transfer', 'Low Stock Alerts', 'Inventory Reports']

export default function Inventory() {
  const store = useStore()
  const key = 'inventoryItems'

  return (
    <CrudModule
      title="Inventory"
      description="Stock management across kitchen, housekeeping & F&B"
      features={features}
      createLabel="+ Add Item"
      data={store.inventoryItems}
      moduleName="Inventory Item"
      columns={[
        { key: 'id', label: 'SKU' },
        { key: 'name', label: 'Item' },
        { key: 'category', label: 'Category' },
        { key: 'stock', label: 'Stock' },
        { key: 'unit', label: 'Unit' },
        { key: 'reorder', label: 'Reorder Level' },
        { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'Low Stock' ? 'warning' : 'success'}>{r.status}</Badge> },
      ]}
      formFields={[
        { name: 'name', label: 'Item Name', required: true, full: true },
        { name: 'category', label: 'Category', type: 'select', options: ['Food', 'Linen', 'Housekeeping', 'Beverage', 'General'], default: 'Food' },
        { name: 'stock', label: 'Stock', type: 'number', required: true },
        { name: 'unit', label: 'Unit', default: 'kg' },
        { name: 'reorder', label: 'Reorder Level', type: 'number', default: 10 },
        { name: 'status', label: 'Status', type: 'select', options: ['OK', 'Low Stock'], default: 'OK' },
      ]}
      onCreate={(f) => store.create(key, 'INV-', 'Inventory', { ...f, stock: Number(f.stock), reorder: Number(f.reorder) })}
      onUpdate={(id, f) => store.update(key, 'Inventory', id, { ...f, stock: Number(f.stock), reorder: Number(f.reorder) })}
      onDelete={(id) => store.remove(key, 'Inventory', id)}
    />
  )
}

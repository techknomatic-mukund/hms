import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import InventoryItemModal from '../components/InventoryItemModal'
import { Badge } from '../components/UI'

const viewFields = [
  { key: 'skuCode', label: 'SKU Code', render: (r) => r.skuCode || r.id || '—' },
  { key: 'name', label: 'Item' },
  { key: 'category', label: 'Category' },
  { key: 'stock', label: 'Stock' },
  { key: 'unit', label: 'Unit' },
  { key: 'storageLocation', label: 'Location' },
  { key: 'itemDescription', label: 'Description', render: (r) => r.itemDescription || '—' },
  { key: 'status', label: 'Status' },
]

export default function Inventory() {
  const store = useStore()
  const key = 'inventoryItems'

  return (
    <CrudModule
      title="Inventory"
      description="Stock management across kitchen, housekeeping & F&B"
      createLabel="+ Add Item"
      data={store.inventoryItems}
      moduleName="Inventory Item"
      columns={[
        { key: 'skuCode', label: 'SKU', render: (r) => r.skuCode || r.id },
        { key: 'name', label: 'Item' },
        { key: 'category', label: 'Category' },
        { key: 'stock', label: 'Stock' },
        { key: 'unit', label: 'Unit' },
        { key: 'storageLocation', label: 'Location', render: (r) => r.storageLocation || '—' },
        { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'Low Stock' ? 'warning' : r.status === 'Out of Stock' ? 'danger' : 'success'}>{r.status}</Badge> },
      ]}
      viewFields={viewFields}
      onCreate={(f) => store.create(key, 'INV-', 'Inventory', f)}
      onUpdate={(id, f) => store.update(key, 'Inventory', id, f)}
      onDelete={(id) => store.remove(key, 'Inventory', id)}
      customModal={(props) => <InventoryItemModal {...props} />}
    />
  )
}

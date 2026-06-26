import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import InventoryItemModal from '../components/InventoryItemModal'
import { Badge } from '../components/UI'

const features = [
  'Item Master Management', 'Stock Entry', 'Stock Issue', 'Stock Transfer',
  'Low Stock Alert', 'Inventory Adjustment', 'Batch & Expiry Tracking',
  'Physical Stock Count', 'Inventory Reports',
]

const viewFields = [
  { key: 'id', label: 'SKU' },
  { key: 'name', label: 'Item' },
  { key: 'category', label: 'Category' },
  { key: 'stock', label: 'Stock' },
  { key: 'unit', label: 'Unit' },
  { key: 'reorder', label: 'Reorder Level' },
  { key: 'storageLocation', label: 'Location' },
  { key: 'batchNumber', label: 'Batch' },
  { key: 'expiryDate', label: 'Expiry' },
  { key: 'lastCountDate', label: 'Last Count' },
  { key: 'status', label: 'Status' },
]

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
        { key: 'storageLocation', label: 'Location', render: (r) => r.storageLocation || '—' },
        { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'Low Stock' ? 'warning' : 'success'}>{r.status}</Badge> },
      ]}
      viewFields={viewFields}
      onCreate={(f) => store.create(key, 'INV-', 'Inventory', f)}
      onUpdate={(id, f) => store.update(key, 'Inventory', id, f)}
      onDelete={(id) => store.remove(key, 'Inventory', id)}
      customModal={(props) => <InventoryItemModal {...props} />}
    />
  )
}

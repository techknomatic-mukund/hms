import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import InventoryItemModal from '../components/InventoryItemModal'
import ReturnStockModal from '../components/ReturnStockModal'
import { Badge } from '../components/UI'

const viewFields = [
  { key: 'skuCode', label: 'SKU Code', render: (r) => r.skuCode || r.id || '—' },
  { key: 'name', label: 'Item Name' },
  { key: 'category', label: 'Category' },
  { key: 'stock', label: 'Stock' },
  { key: 'unit', label: 'Unit' },
  { key: 'storageLocation', label: 'Location' },
  { key: 'quantityIssued', label: 'Quantity Issued', render: (r) => r.quantityIssued ?? '—' },
  { key: 'issuedTo', label: 'Issued To', render: (r) => r.issuedTo || '—' },
  { key: 'issueDate', label: 'Issue Date', render: (r) => r.issueDate || '—' },
  { key: 'approvedBy', label: 'Approved By', render: (r) => r.approvedBy || '—' },
  { key: 'purposeRemarks', label: 'Purpose / Remarks', render: (r) => r.purposeRemarks || '—' },
  { key: 'lastReturnQty', label: 'Last Return Qty', render: (r) => r.lastReturnQty ?? '—' },
  { key: 'lastReturnDate', label: 'Last Return Date', render: (r) => r.lastReturnDate || '—' },
  { key: 'itemDescription', label: 'Description', render: (r) => r.itemDescription || '—' },
  { key: 'status', label: 'Status' },
]

export default function Inventory() {
  const store = useStore()
  const key = 'inventoryItems'
  const [returnOpen, setReturnOpen] = useState(false)

  const handleReturnStock = (payload) => {
    const item = store.inventoryItems.find((i) => i.id === payload.itemId)
    if (!item) return

    store.update(key, 'Inventory', payload.itemId, {
      ...item,
      stock: payload.newStock,
      status: payload.status,
      lastReturnQty: payload.returnQuantity,
      lastReturnDate: payload.returnDate,
      lastReturnedBy: payload.returnedBy,
      lastReturnReason: payload.remarks,
    })
    setReturnOpen(false)
  }

  return (
    <>
      <CrudModule
        title="Inventory"
        description="Stock management across kitchen, housekeeping & F&B"
        createLabel="+ Add Item"
        data={store.inventoryItems}
        moduleName="Inventory Item"
        headerActions={(openCreate) => (
          <div className="btn-group">
            <button type="button" className="btn btn-secondary" onClick={() => setReturnOpen(true)}>
              ↩ Return Stock
            </button>
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              + Add Item
            </button>
          </div>
        )}
        columns={[
          { key: 'skuCode', label: 'SKU', render: (r) => r.skuCode || r.id },
          { key: 'name', label: 'Item Name' },
          { key: 'category', label: 'Category' },
          { key: 'stock', label: 'Stock' },
          { key: 'quantityIssued', label: 'Qty Issued', render: (r) => r.quantityIssued ?? '—' },
          { key: 'issuedTo', label: 'Issued To', render: (r) => r.issuedTo || '—' },
          { key: 'unit', label: 'Unit' },
          { key: 'storageLocation', label: 'Location', render: (r) => r.storageLocation || '—' },
          { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'Low Stock' ? 'warning' : r.status === 'Out of Stock' ? 'danger' : 'success'}>{r.status}</Badge> },
        ]}
        viewFields={viewFields}
        onCreate={(f) => store.create(key, 'INV-', 'Inventory', f)}
        onUpdate={(id, f) => store.update(key, 'Inventory', id, f)}
        onDelete={(id) => store.remove(key, 'Inventory', id)}
        customModal={(props) => (
          <InventoryItemModal {...props} employees={store.employees} />
        )}
      />

      <ReturnStockModal
        open={returnOpen}
        inventoryItems={store.inventoryItems}
        employees={store.employees}
        onClose={() => setReturnOpen(false)}
        onSubmit={handleReturnStock}
      />
    </>
  )
}

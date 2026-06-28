import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import InventoryItemModal from '../components/InventoryItemModal'
import ReturnStockModal from '../components/ReturnStockModal'
import InventoryApprovalQueue from '../components/InventoryApprovalQueue'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { nextId, todayISO } from '../utils/helpers'

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
  { key: 'requestedBy', label: 'Requested By', render: (r) => r.requestedBy || '—' },
  { key: 'approvalStatus', label: 'Issue Approval', render: (r) => r.approvalStatus || '—' },
  { key: 'returnApprovalStatus', label: 'Return Approval', render: (r) => r.returnApprovalStatus || '—' },
  { key: 'approvedBy', label: 'Approved By', render: (r) => r.approvedBy || '—' },
  { key: 'purposeRemarks', label: 'Purpose / Remarks', render: (r) => r.purposeRemarks || '—' },
  { key: 'lastReturnQty', label: 'Last Return Qty', render: (r) => r.lastReturnQty ?? '—' },
  { key: 'lastReturnDate', label: 'Last Return Date', render: (r) => r.lastReturnDate || '—' },
  { key: 'itemDescription', label: 'Description', render: (r) => r.itemDescription || '—' },
  { key: 'status', label: 'Status' },
]

function stockStatus(stock) {
  if (stock === 0) return 'Out of Stock'
  if (stock <= 15) return 'Low Stock'
  return 'OK'
}

function approvalBadge(status) {
  if (status === 'Approved') return 'success'
  if (status === 'Rejected') return 'danger'
  if (status === 'Pending') return 'warning'
  return 'muted'
}

function resolveItemApprovalStatus(item, issueRequests, returnRequests) {
  if (returnRequests.some((r) => r.itemId === item.id && r.approvalStatus === 'Pending')) {
    return 'Pending'
  }
  if (issueRequests.some((r) => r.itemId === item.id && r.approvalStatus === 'Pending')) {
    return 'Pending'
  }
  if (item.returnApprovalStatus === 'Rejected') return 'Rejected'
  if (item.approvalStatus === 'Rejected') return 'Rejected'
  if (item.returnApprovalStatus === 'Approved' || item.approvalStatus === 'Approved') return 'Approved'
  return item.approvalStatus || item.returnApprovalStatus || '—'
}

export default function Inventory() {
  const store = useStore()
  const crud = useCrudModal()
  const key = 'inventoryItems'
  const issueKey = 'inventoryIssueRequests'
  const returnKey = 'inventoryReturnRequests'
  const [returnOpen, setReturnOpen] = useState(false)
  const [itemModal, setItemModal] = useState({ open: false, item: null })

  const pendingApprovals = useMemo(() => {
    const issues = store.inventoryIssueRequests
      .filter((r) => r.approvalStatus === 'Pending')
      .map((r) => ({ ...r, requestType: 'Issue' }))
    const returns = store.inventoryReturnRequests
      .filter((r) => r.approvalStatus === 'Pending')
      .map((r) => ({ ...r, requestType: 'Return' }))
    return [...issues, ...returns]
  }, [store.inventoryIssueRequests, store.inventoryReturnRequests])

  const inventoryRows = useMemo(
    () => store.inventoryItems.map((item) => ({
      ...item,
      approvalStatus: resolveItemApprovalStatus(
        item,
        store.inventoryIssueRequests,
        store.inventoryReturnRequests,
      ),
    })),
    [store.inventoryItems, store.inventoryIssueRequests, store.inventoryReturnRequests],
  )

  const handleCreate = (f) => {
    const itemId = nextId('INV-', store.inventoryItems)
    store.create(key, 'INV-', 'Inventory', { ...f, id: itemId, approvalStatus: 'Pending' })
    store.create(issueKey, 'ISR-', 'Inventory', {
      itemId,
      itemName: f.name,
      quantityIssued: f.quantityIssued,
      issuedTo: f.issuedTo,
      issueDate: f.issueDate,
      requestedBy: f.requestedBy,
      purposeRemarks: f.purposeRemarks,
      approvalStatus: 'Pending',
      approvedBy: '',
      approvalDate: '',
      managerRemarks: '',
    }, f.name)
    setItemModal({ open: false, item: null })
  }

  const handleApproveIssue = (req) => {
    const item = store.inventoryItems.find((i) => i.id === req.itemId)
    if (item) {
      const qty = Number(req.quantityIssued)
      const newStock = Math.max(0, Number(item.stock) - qty)
      store.update(key, 'Inventory', item.id, {
        ...item,
        quantityIssued: qty,
        issuedTo: req.issuedTo,
        issueDate: req.issueDate,
        requestedBy: req.requestedBy,
        purposeRemarks: req.purposeRemarks,
        approvalStatus: 'Approved',
        approvedBy: 'Store Manager',
        approvalDate: todayISO(),
        stock: newStock,
        status: stockStatus(newStock),
      })
    }
    store.update(issueKey, 'Inventory', req.id, {
      ...req,
      approvalStatus: 'Approved',
      approvedBy: 'Store Manager',
      approvalDate: todayISO(),
    })
  }

  const handleRejectIssue = (req) => {
    store.update(issueKey, 'Inventory', req.id, {
      ...req,
      approvalStatus: 'Rejected',
      approvedBy: 'Store Manager',
      approvalDate: todayISO(),
    })
    const item = store.inventoryItems.find((i) => i.id === req.itemId)
    if (item) {
      store.update(key, 'Inventory', item.id, { ...item, approvalStatus: 'Rejected' })
    }
  }

  const handleApproveReturn = (req) => {
    const item = store.inventoryItems.find((i) => i.id === req.itemId)
    if (item) {
      const qty = Number(req.returnQuantity)
      const newStock = Math.max(0, Number(item.stock) - qty)
      store.update(key, 'Inventory', item.id, {
        ...item,
        stock: newStock,
        status: stockStatus(newStock),
        returnApprovalStatus: 'Approved',
        lastReturnQty: qty,
        lastReturnDate: req.returnDate,
        lastReturnedBy: req.returnedBy,
        lastReturnReason: req.remarks,
      })
    }
    store.update(returnKey, 'Inventory', req.id, {
      ...req,
      approvalStatus: 'Approved',
      approvedBy: 'Store Manager',
      approvalDate: todayISO(),
    })
  }

  const handleRejectReturn = (req) => {
    store.update(returnKey, 'Inventory', req.id, {
      ...req,
      approvalStatus: 'Rejected',
      approvedBy: 'Store Manager',
      approvalDate: todayISO(),
    })
    const item = store.inventoryItems.find((i) => i.id === req.itemId)
    if (item) {
      store.update(key, 'Inventory', item.id, { ...item, returnApprovalStatus: 'Rejected' })
    }
  }

  const handleApprove = (req) => {
    if (req.requestType === 'Return') handleApproveReturn(req)
    else handleApproveIssue(req)
  }

  const handleReject = (req) => {
    if (req.requestType === 'Return') handleRejectReturn(req)
    else handleRejectIssue(req)
  }

  const handleSubmitReturn = (payload) => {
    const item = store.inventoryItems.find((i) => i.id === payload.itemId)
    if (!item) return

    store.create(returnKey, 'RET-', 'Inventory', {
      itemId: payload.itemId,
      itemName: payload.itemName,
      returnQuantity: payload.returnQuantity,
      returnDate: payload.returnDate,
      returnedBy: payload.returnedBy,
      remarks: payload.remarks,
      previousStock: payload.previousStock,
      unit: payload.unit,
      approvalStatus: 'Pending',
      approvedBy: '',
      approvalDate: '',
      managerRemarks: '',
    }, payload.itemName)

    store.update(key, 'Inventory', payload.itemId, {
      ...item,
      returnApprovalStatus: 'Pending',
    })
    setReturnOpen(false)
  }

  const columns = [
    { key: 'skuCode', label: 'SKU', render: (r) => r.skuCode || r.id },
    { key: 'name', label: 'Item Name' },
    { key: 'category', label: 'Category' },
    { key: 'stock', label: 'Stock' },
    { key: 'quantityIssued', label: 'Qty Issued', render: (r) => r.quantityIssued ?? '—' },
    { key: 'issuedTo', label: 'Issued To', render: (r) => r.issuedTo || '—' },
    {
      key: 'approvalStatus',
      label: 'Approval',
      render: (r) => (
        <Badge variant={approvalBadge(r.approvalStatus)}>
          {r.approvalStatus || '—'}
        </Badge>
      ),
    },
    { key: 'unit', label: 'Unit' },
    { key: 'storageLocation', label: 'Location', render: (r) => r.storageLocation || '—' },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <Badge variant={r.status === 'Low Stock' ? 'warning' : r.status === 'Out of Stock' ? 'danger' : 'success'}>
          {r.status}
        </Badge>
      ),
    },
  ]

  return (
    <>
      <PageShell title="Inventory" description="Stock management across kitchen, housekeeping & F&B">
        <section className="panel">
          <SectionHeader
            title="Manager Approval"
            subtitle="Review issue and return requests before stock is updated"
          />
          <InventoryApprovalQueue
            requests={pendingApprovals}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </section>

        <section className="panel">
          <SectionHeader
            title="Inventory Stock"
            action={(
              <div className="btn-group">
                <button type="button" className="btn btn-secondary" onClick={() => setReturnOpen(true)}>
                  ↩ Return Stock
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setItemModal({ open: true, item: null })}>
                  + Add Item
                </button>
              </div>
            )}
          />
          <CrudTable
            columns={columns}
            rows={inventoryRows}
            onView={crud.openView}
            onEdit={(item) => setItemModal({ open: true, item: store.inventoryItems.find((i) => i.id === item.id) || item })}
            onDelete={crud.openDelete}
          />
        </section>
      </PageShell>

      <InventoryItemModal
        open={itemModal.open}
        editItem={itemModal.item}
        employees={store.employees}
        onClose={() => setItemModal({ open: false, item: null })}
        onSubmit={(f) => {
          if (itemModal.item) {
            store.update(key, 'Inventory', itemModal.item.id, f)
            setItemModal({ open: false, item: null })
          } else {
            handleCreate(f)
          }
        }}
      />

      <ReturnStockModal
        open={returnOpen}
        inventoryItems={store.inventoryItems}
        employees={store.employees}
        onClose={() => setReturnOpen(false)}
        onSubmit={handleSubmitReturn}
      />

      <ViewDetailModal
        open={crud.isView}
        onClose={crud.closeModal}
        title="Inventory Item Details"
        data={crud.item}
        fields={viewFields}
      />

      <DeleteConfirmModal
        open={!!crud.deleteTarget}
        onClose={crud.closeDelete}
        onConfirm={() => store.remove(key, 'Inventory', crud.deleteTarget.id)}
        itemName={crud.deleteTarget?.name}
      />
    </>
  )
}

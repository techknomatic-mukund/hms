import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { PageShell, SectionHeader, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import MaintenanceInventoryItemModal from '../components/MaintenanceInventoryItemModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { formatDisplayDate, todayISO } from '../utils/helpers'

const viewFields = [
  { key: 'id', label: 'Ref' },
  { key: 'skuCode', label: 'SKU', render: (r) => r.skuCode || r.id },
  { key: 'name', label: 'Item Name' },
  { key: 'category', label: 'Category' },
  { key: 'quantity', label: 'Quantity', render: (r) => `${r.quantity ?? r.stock ?? 0} ${r.unit}` },
  { key: 'storageLocation', label: 'Location' },
  { key: 'approvalStatus', label: 'Approval' },
  { key: 'requestedBy', label: 'Requested By', render: (r) => r.requestedBy || '—' },
  { key: 'requestDate', label: 'Request Date', render: (r) => (r.requestDate ? formatDisplayDate(r.requestDate) : '—') },
  { key: 'approvedBy', label: 'Approved By', render: (r) => r.approvedBy || '—' },
  { key: 'itemDescription', label: 'Description', render: (r) => r.itemDescription || '—' },
  { key: 'remarks', label: 'Remarks', render: (r) => r.remarks || '—' },
]

function approvalBadge(status) {
  if (status === 'Approved') return 'success'
  if (status === 'Rejected') return 'danger'
  if (status === 'Pending') return 'warning'
  return 'muted'
}

export default function MaintenanceInventory() {
  const store = useStore()
  const { user, isOperationsRequester } = useAuth()
  const crud = useCrudModal()
  const key = 'maintenanceInventoryItems'
  const [modal, setModal] = useState({ open: false, item: null })

  const isMaintenanceStaff = user?.role === 'maintenance'
  const canOperationsApprove = isOperationsRequester || user?.role === 'admin'

  const pendingItems = useMemo(
    () => store.maintenanceInventoryItems.filter((i) => i.approvalStatus === 'Pending'),
    [store.maintenanceInventoryItems],
  )

  const columns = [
    { key: 'skuCode', label: 'SKU', render: (r) => r.skuCode || r.id },
    { key: 'name', label: 'Item Name' },
    { key: 'category', label: 'Category' },
    {
      key: 'quantity',
      label: 'Qty',
      render: (r) => `${r.quantity ?? r.stock ?? 0} ${r.unit}`,
    },
    { key: 'storageLocation', label: 'Location', render: (r) => r.storageLocation || '—' },
    {
      key: 'approvalStatus',
      label: 'Approval',
      render: (r) => (
        <Badge variant={approvalBadge(r.approvalStatus)}>
          {r.approvalStatus || 'Pending'}
        </Badge>
      ),
    },
  ]

  const handleApprove = (item) => {
    store.update(key, 'Maintenance Inventory', item.id, {
      ...item,
      approvalStatus: 'Approved',
      approvedBy: user?.name || 'Operations',
      approvalDate: todayISO(),
    })
  }

  const handleReject = (item) => {
    store.update(key, 'Maintenance Inventory', item.id, {
      ...item,
      approvalStatus: 'Rejected',
      approvedBy: user?.name || 'Operations',
      approvalDate: todayISO(),
    })
  }

  const handleSubmit = (f) => {
    if (modal.item) {
      store.update(key, 'Maintenance Inventory', modal.item.id, { ...modal.item, ...f })
    } else {
      store.create(key, 'MINV-', 'Maintenance Inventory', {
        ...f,
        approvalStatus: 'Pending',
        requestedBy: user?.name,
        requestDate: todayISO(),
        approvedBy: '',
      }, f.name)
    }
    setModal({ open: false, item: null })
  }

  return (
    <>
      <PageShell
        title="Maintenance Inventory"
        description={isMaintenanceStaff
          ? 'Add spare parts & supplies — submitted to Operations for approval'
          : 'Review maintenance inventory submissions from the Maintenance team'}
      >
        {canOperationsApprove && (
          <section className="panel">
            <SectionHeader
              title="Operations Approval"
              subtitle="Approve or reject maintenance inventory items"
            />
            {pendingItems.length === 0 ? (
              <div className="approval-queue-empty">
                <span className="approval-queue-empty-icon" aria-hidden>✓</span>
                <p>All caught up — no pending items.</p>
              </div>
            ) : (
              <>
                <div className="approval-queue-summary">
                  <div className="approval-queue-total">
                    <span className="approval-queue-count">{pendingItems.length}</span>
                    <span className="approval-queue-label">pending item{pendingItems.length === 1 ? '' : 's'}</span>
                  </div>
                </div>
                <div className="approval-queue">
                  {pendingItems.map((item) => (
                    <article key={item.id} className="approval-card approval-card--issue">
                      <div className="approval-card-header">
                        <div className="approval-card-heading">
                          <h3 className="approval-card-title">{item.name}</h3>
                          <span className="approval-card-id">{item.id}</span>
                        </div>
                        <div className="approval-card-badges">
                          <Badge variant="info">{item.category}</Badge>
                          <Badge variant="warning">Pending</Badge>
                        </div>
                      </div>
                      <dl className="approval-card-meta">
                        <div className="approval-card-meta-item">
                          <dt>Quantity</dt>
                          <dd>{item.quantity ?? item.stock} {item.unit}</dd>
                        </div>
                        <div className="approval-card-meta-item">
                          <dt>Location</dt>
                          <dd>{item.storageLocation || '—'}</dd>
                        </div>
                        <div className="approval-card-meta-item">
                          <dt>Requested by</dt>
                          <dd>{item.requestedBy || '—'}</dd>
                        </div>
                        <div className="approval-card-meta-item">
                          <dt>Request date</dt>
                          <dd>{item.requestDate ? formatDisplayDate(item.requestDate) : '—'}</dd>
                        </div>
                      </dl>
                      {item.remarks && <blockquote className="approval-card-remarks">{item.remarks}</blockquote>}
                      <div className="approval-card-actions">
                        <button type="button" className="btn btn-success btn-sm" onClick={() => handleApprove(item)}>
                          Approve
                        </button>
                        <button type="button" className="btn btn-danger-outline btn-sm" onClick={() => handleReject(item)}>
                          Reject
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        <section className="panel">
          <SectionHeader
            title="Inventory Items"
            action={isMaintenanceStaff && (
              <button type="button" className="btn btn-primary" onClick={() => setModal({ open: true, item: null })}>
                + Add Item
              </button>
            )}
          />
          <CrudTable
            columns={columns}
            rows={store.maintenanceInventoryItems}
            onView={crud.openView}
            onEdit={isMaintenanceStaff ? (item) => setModal({ open: true, item }) : undefined}
            onDelete={isMaintenanceStaff ? crud.openDelete : undefined}
          />
        </section>
      </PageShell>

      <MaintenanceInventoryItemModal
        open={modal.open}
        editItem={modal.item}
        requiresApproval={isMaintenanceStaff}
        onClose={() => setModal({ open: false, item: null })}
        onSubmit={handleSubmit}
      />

      <ViewDetailModal
        open={crud.isView}
        onClose={crud.closeModal}
        title="Maintenance Inventory Item"
        data={crud.item}
        fields={viewFields}
      />

      <DeleteConfirmModal
        open={!!crud.deleteTarget}
        onClose={crud.closeDelete}
        onConfirm={() => store.remove(key, 'Maintenance Inventory', crud.deleteTarget.id)}
        itemName={crud.deleteTarget?.name}
      />
    </>
  )
}

import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { PageShell, SectionHeader, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import ProcurementOrderModal from '../components/ProcurementOrderModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { formatOMR, isFormattedAmount, todayISO } from '../utils/helpers'

const features = [
  'Purchase Request Management', 'GM Approval Workflow', 'Supplier Management',
  'Quotation Comparison', 'Purchase Order Creation', 'Goods Receipt Note (GRN)',
  'Quality Inspection', 'Invoice Verification', 'Payment Processing',
  'Procurement History', 'Inventory Integration', 'Low Stock Replenishment',
]

const viewFields = [
  { key: 'id', label: 'PO Ref' },
  { key: 'vendor', label: 'Supplier' },
  { key: 'items', label: 'Items' },
  { key: 'amount', label: 'Amount' },
  { key: 'requestRef', label: 'Request Ref' },
  { key: 'approvalStatus', label: 'GM Approval' },
  { key: 'poApprovedBy', label: 'Approved By', render: (r) => r.poApprovedBy || '—' },
  { key: 'grnNumber', label: 'GRN' },
  { key: 'inspectionStatus', label: 'Inspection' },
  { key: 'paymentStatus', label: 'Payment' },
  { key: 'department', label: 'Department' },
  { key: 'reportTag', label: 'Report Tag' },
  { key: 'status', label: 'Status' },
]

function approvalBadge(status) {
  if (status === 'Approved') return 'success'
  if (status === 'Rejected') return 'danger'
  if (status === 'Pending') return 'warning'
  return 'muted'
}

export default function Procurement() {
  const store = useStore()
  const { user, canGmApprove } = useAuth()
  const crud = useCrudModal()
  const key = 'purchaseOrders'
  const [modal, setModal] = useState({ open: false, item: null })

  const pendingOrders = useMemo(
    () => store.purchaseOrders.filter((po) => po.approvalStatus === 'Pending'),
    [store.purchaseOrders],
  )

  const columns = [
    { key: 'id', label: 'PO Ref' },
    { key: 'vendor', label: 'Supplier' },
    { key: 'items', label: 'Items' },
    { key: 'amount', label: 'Amount' },
    { key: 'department', label: 'Dept', render: (r) => r.department || '—' },
    {
      key: 'approvalStatus',
      label: 'GM Approval',
      render: (r) => (
        <Badge variant={approvalBadge(r.approvalStatus || 'Pending')}>
          {r.approvalStatus || 'Pending'}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => (
        <Badge variant={r.status?.includes('Pending') ? 'warning' : 'success'}>{r.status}</Badge>
      ),
    },
  ]

  const handleApprove = (po) => {
    store.update(key, 'Procurement', po.id, {
      ...po,
      approvalStatus: 'Approved',
      poApprovalStatus: 'Approved',
      status: 'Approved',
      poApprovedBy: 'General Manager',
      approvalDate: todayISO(),
    })
  }

  const handleReject = (po) => {
    store.update(key, 'Procurement', po.id, {
      ...po,
      approvalStatus: 'Rejected',
      poApprovalStatus: 'Rejected',
      status: 'Rejected',
      poApprovedBy: 'General Manager',
      approvalDate: todayISO(),
    })
  }

  const handleSubmit = (f) => {
    const amount = isFormattedAmount(f.amount) ? f.amount : formatOMR(f.amount)
    const approvalStatus = canGmApprove ? (f.approvalStatus || 'Approved') : 'Pending'
    const status = approvalStatus === 'Approved' ? 'Approved' : 'Pending Approval'
    const payload = {
      ...f,
      amount,
      approvalStatus,
      poApprovalStatus: approvalStatus,
      status,
      requestedBy: f.requestedBy || user?.name,
      poApprovedBy: approvalStatus === 'Approved' ? 'General Manager' : '',
    }

    if (modal.item) {
      store.update(key, 'Procurement', modal.item.id, payload)
    } else {
      store.create(key, 'PO-', 'Procurement', payload)
    }
    setModal({ open: false, item: null })
  }

  return (
    <PageShell title="Procurement" description="Purchase requests & supplier management with GM approval">
      {canGmApprove && (
        <section className="panel">
          <SectionHeader
            title="GM Approval"
            subtitle="Review purchase orders before procurement proceeds"
          />
          {pendingOrders.length === 0 ? (
            <div className="approval-queue-empty">
              <span className="approval-queue-empty-icon" aria-hidden>✓</span>
              <p>All caught up — no pending purchase orders.</p>
            </div>
          ) : (
            <>
              <div className="approval-queue-summary">
                <div className="approval-queue-total">
                  <span className="approval-queue-count">{pendingOrders.length}</span>
                  <span className="approval-queue-label">pending PO{pendingOrders.length === 1 ? '' : 's'}</span>
                </div>
              </div>
              <div className="approval-queue">
                {pendingOrders.map((po) => (
                  <article key={po.id} className="approval-card approval-card--issue">
                    <div className="approval-card-header">
                      <div className="approval-card-heading">
                        <h3 className="approval-card-title">{po.vendor}</h3>
                        <span className="approval-card-id">{po.id}</span>
                      </div>
                      <div className="approval-card-badges">
                        <Badge variant="info">{po.department || 'General'}</Badge>
                        <Badge variant="warning">Pending</Badge>
                      </div>
                    </div>
                    <dl className="approval-card-meta">
                      <div className="approval-card-meta-item">
                        <dt>Items</dt>
                        <dd>{po.items}</dd>
                      </div>
                      <div className="approval-card-meta-item">
                        <dt>Amount</dt>
                        <dd>{po.amount}</dd>
                      </div>
                      <div className="approval-card-meta-item">
                        <dt>Requested by</dt>
                        <dd>{po.requestedBy || '—'}</dd>
                      </div>
                      <div className="approval-card-meta-item">
                        <dt>Request ref</dt>
                        <dd>{po.requestRef || '—'}</dd>
                      </div>
                    </dl>
                    {po.requestNotes && (
                      <blockquote className="approval-card-remarks">{po.requestNotes}</blockquote>
                    )}
                    <div className="approval-card-actions">
                      <button type="button" className="btn btn-success btn-sm" onClick={() => handleApprove(po)}>
                        Approve
                      </button>
                      <button type="button" className="btn btn-danger-outline btn-sm" onClick={() => handleReject(po)}>
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
        <SectionHeader title="Module Features" />
        <div className="feature-grid">
          {features.map((f) => <div key={f} className="feature-chip">{f}</div>)}
        </div>
      </section>

      <section className="panel">
        <SectionHeader
          title="Purchase Orders"
          action={(
            <button type="button" className="btn btn-primary" onClick={() => setModal({ open: true, item: null })}>
              + New Purchase Order
            </button>
          )}
        />
        <CrudTable
          columns={columns}
          rows={store.purchaseOrders}
          onView={crud.openView}
          onEdit={(item) => setModal({ open: true, item })}
          onDelete={crud.openDelete}
        />
      </section>

      <ProcurementOrderModal
        open={modal.open}
        editItem={modal.item}
        requiresGmApproval={!canGmApprove}
        onClose={() => setModal({ open: false, item: null })}
        onSubmit={handleSubmit}
      />

      <ViewDetailModal
        open={crud.isView}
        onClose={crud.closeModal}
        title="Purchase Order"
        data={crud.item}
        fields={viewFields}
      />

      <DeleteConfirmModal
        open={!!crud.deleteTarget}
        onClose={crud.closeDelete}
        onConfirm={() => store.remove(key, 'Procurement', crud.deleteTarget.id)}
        itemName={crud.deleteTarget?.id}
      />
    </PageShell>
  )
}

import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { PageShell, SectionHeader, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import MaintenanceWorkOrderModal from '../components/MaintenanceWorkOrderModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { formatDisplayDate, todayISO } from '../utils/helpers'

const viewFields = [
  { key: 'id', label: 'Ref' },
  { key: 'room', label: 'Room', render: (r) => r.room || '—' },
  { key: 'asset', label: 'Asset' },
  { key: 'complaint', label: 'Complaint' },
  { key: 'priority', label: 'Priority' },
  { key: 'requestedBy', label: 'Requested By', render: (r) => r.requestedBy || '—' },
  { key: 'requestDate', label: 'Request Date', render: (r) => (r.requestDate ? formatDisplayDate(r.requestDate) : '—') },
  { key: 'requestApprovalStatus', label: 'Approval', render: (r) => r.requestApprovalStatus || '—' },
  { key: 'reviewedBy', label: 'Reviewed By', render: (r) => r.reviewedBy || '—' },
  { key: 'assignee', label: 'Assigned To', render: (r) => r.assignee || '—' },
  { key: 'employeeId', label: 'Employee ID', render: (r) => r.employeeId || '—' },
  { key: 'scheduledDate', label: 'Scheduled Date', render: (r) => r.scheduledDate || '—' },
  { key: 'scheduledTime', label: 'Time', render: (r) => r.scheduledTime || '—' },
  { key: 'status', label: 'Status' },
]

function formatSchedule(r) {
  if (!r.scheduledDate && !r.scheduledTime) return '—'
  return [r.scheduledDate, r.scheduledTime].filter(Boolean).join(' ')
}

function approvalBadge(status) {
  if (status === 'Approved') return 'success'
  if (status === 'Rejected') return 'danger'
  if (status === 'Pending') return 'warning'
  return 'muted'
}

const GENERIC_TEAM = 'Maintenance Team'

export default function Maintenance() {
  const store = useStore()
  const { user, canMaintenanceApprove, isOperationsRequester } = useAuth()
  const crud = useCrudModal()
  const key = 'maintenanceTickets'
  const [modal, setModal] = useState({ open: false, item: null })

  const technicians = useMemo(
    () => store.employees.filter((e) => e.dept === 'Maintenance'),
    [store.employees],
  )

  const pendingRequests = useMemo(
    () => store.maintenanceTickets.filter((t) => t.requestApprovalStatus === 'Pending'),
    [store.maintenanceTickets],
  )

  const columns = [
    { key: 'id', label: 'Ref' },
    { key: 'room', label: 'Room', render: (r) => r.room || '—' },
    { key: 'asset', label: 'Asset' },
    { key: 'complaint', label: 'Complaint' },
    {
      key: 'priority',
      label: 'Priority',
      render: (r) => <Badge variant={r.priority === 'High' || r.priority === 'Urgent' ? 'warning' : 'default'}>{r.priority}</Badge>,
    },
    {
      key: 'requestApprovalStatus',
      label: 'Approval',
      render: (r) => (
        <Badge variant={approvalBadge(r.requestApprovalStatus || 'Approved')}>
          {r.requestApprovalStatus || 'Approved'}
        </Badge>
      ),
    },
    ...(canMaintenanceApprove ? [
      { key: 'assignee', label: 'Assigned To', render: (r) => r.assignee || '—' },
      { key: 'scheduledTime', label: 'Schedule', render: (r) => formatSchedule(r) },
    ] : []),
    {
      key: 'status',
      label: 'Status',
      render: (r) => <Badge variant={r.status === 'Open' || r.status === 'Pending Approval' ? 'warning' : 'info'}>{r.status}</Badge>,
    },
  ]

  const handleApprove = (ticket) => {
    const defaultTech = technicians[0]
    store.update(key, 'Maintenance', ticket.id, {
      ...ticket,
      requestApprovalStatus: 'Approved',
      status: 'Open',
      reviewedBy: user?.name || 'Maintenance',
      reviewDate: todayISO(),
      assignee: defaultTech?.name || GENERIC_TEAM,
      employeeId: defaultTech?.id || '',
      scheduledDate: ticket.scheduledDate || todayISO(),
      scheduledTime: ticket.scheduledTime || '09:00',
    })
  }

  const handleReject = (ticket) => {
    store.update(key, 'Maintenance', ticket.id, {
      ...ticket,
      requestApprovalStatus: 'Rejected',
      status: 'Rejected',
      reviewedBy: user?.name || 'Maintenance',
      reviewDate: todayISO(),
    })
  }

  const handleSubmit = (f) => {
    if (isOperationsRequester) {
      store.create(key, 'WO-', 'Maintenance', {
        ...f,
        status: 'Pending Approval',
        requestApprovalStatus: 'Pending',
        requestedBy: user?.name,
        requestDate: todayISO(),
        assignee: '',
        employeeId: '',
        scheduledDate: '',
        scheduledTime: '',
      })
    } else if (modal.item) {
      store.update(key, 'Maintenance', modal.item.id, {
        ...modal.item,
        ...f,
        requestApprovalStatus: modal.item.requestApprovalStatus || 'Approved',
      })
    } else {
      store.create(key, 'WO-', 'Maintenance', {
        ...f,
        requestApprovalStatus: 'Approved',
        requestedBy: user?.name,
        requestDate: todayISO(),
        reviewedBy: user?.name,
      })
    }
    setModal({ open: false, item: null })
  }

  return (
    <>
      <PageShell
        title={isOperationsRequester ? 'Maintenance Requests' : 'Maintenance'}
        description={isOperationsRequester
          ? 'Raise maintenance requests for the Maintenance team to review'
          : 'Asset maintenance, work orders & request approvals'}
      >
        {canMaintenanceApprove && (
          <section className="panel">
            <SectionHeader
              title="Request Approval"
              subtitle="Review maintenance requests raised by Operations"
            />
            {pendingRequests.length === 0 ? (
              <div className="approval-queue-empty">
                <span className="approval-queue-empty-icon" aria-hidden>✓</span>
                <p>All caught up — no pending requests.</p>
              </div>
            ) : (
              <>
                <div className="approval-queue-summary">
                  <div className="approval-queue-total">
                    <span className="approval-queue-count">{pendingRequests.length}</span>
                    <span className="approval-queue-label">pending request{pendingRequests.length === 1 ? '' : 's'}</span>
                  </div>
                </div>
                <div className="approval-queue">
                  {pendingRequests.map((ticket) => (
                    <article key={ticket.id} className="approval-card approval-card--return">
                      <div className="approval-card-header">
                        <div className="approval-card-heading">
                          <h3 className="approval-card-title">{ticket.asset}</h3>
                          <span className="approval-card-id">{ticket.id}</span>
                        </div>
                        <div className="approval-card-badges">
                          <Badge variant={ticket.priority === 'High' || ticket.priority === 'Urgent' ? 'warning' : 'info'}>
                            {ticket.priority}
                          </Badge>
                          <Badge variant="warning">Pending</Badge>
                        </div>
                      </div>
                      <dl className="approval-card-meta">
                        <div className="approval-card-meta-item">
                          <dt>Room</dt>
                          <dd>{ticket.room || '—'}</dd>
                        </div>
                        <div className="approval-card-meta-item">
                          <dt>Requested by</dt>
                          <dd>{ticket.requestedBy || '—'}</dd>
                        </div>
                        <div className="approval-card-meta-item">
                          <dt>Request date</dt>
                          <dd>{ticket.requestDate ? formatDisplayDate(ticket.requestDate) : '—'}</dd>
                        </div>
                      </dl>
                      <blockquote className="approval-card-remarks">{ticket.complaint}</blockquote>
                      <div className="approval-card-actions">
                        <button type="button" className="btn btn-success btn-sm" onClick={() => handleApprove(ticket)}>
                          Approve
                        </button>
                        <button type="button" className="btn btn-danger-outline btn-sm" onClick={() => handleReject(ticket)}>
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
            title={isOperationsRequester ? 'My Requests' : 'Work Orders'}
            action={(
              <button type="button" className="btn btn-primary" onClick={() => setModal({ open: true, item: null })}>
                {isOperationsRequester ? '+ Raise Request' : '+ New Work Order'}
              </button>
            )}
          />
          <CrudTable
            columns={columns}
            rows={store.maintenanceTickets}
            onView={crud.openView}
            onEdit={canMaintenanceApprove ? (item) => setModal({ open: true, item }) : undefined}
            onDelete={canMaintenanceApprove ? crud.openDelete : undefined}
          />
        </section>
      </PageShell>

      <MaintenanceWorkOrderModal
        open={modal.open}
        editItem={modal.item}
        technicians={technicians}
        requestOnly={isOperationsRequester}
        onClose={() => setModal({ open: false, item: null })}
        onSubmit={handleSubmit}
      />

      <ViewDetailModal
        open={crud.isView}
        onClose={crud.closeModal}
        title="Work Order"
        data={crud.item}
        fields={viewFields}
      />

      <DeleteConfirmModal
        open={!!crud.deleteTarget}
        onClose={crud.closeDelete}
        onConfirm={() => store.remove(key, 'Maintenance', crud.deleteTarget.id)}
        itemName={crud.deleteTarget?.id}
      />
    </>
  )
}

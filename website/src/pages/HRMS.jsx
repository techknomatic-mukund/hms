import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { PageShell, SectionHeader, StatCard, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import EmployeeModal from '../components/EmployeeModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { formatDisplayDate, formatOMR, todayISO } from '../utils/helpers'

export default function HRMS() {
  const store = useStore()
  const { canGmApprove } = useAuth()
  const crud = useCrudModal()
  const [empModal, setEmpModal] = useState({ open: false, item: null })

  const pendingLeave = useMemo(
    () => store.leaveRequests.filter((l) => l.status === 'pending'),
    [store.leaveRequests],
  )

  const cols = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'dept', label: 'Department' },
    { key: 'shift', label: 'Shift', render: (r) => r.shift || '—' },
    { key: 'attendance', label: 'Today', render: (r) => <Badge variant={r.attendance === 'Present' ? 'success' : 'warning'}>{r.attendance}</Badge> },
    { key: 'leave', label: 'Leave' },
  ]

  const viewFields = [
    ...cols,
    { key: 'email', label: 'Email' },
    { key: 'salary', label: 'Salary', render: (r) => (r.salary ? formatOMR(r.salary) : '—') },
    { key: 'performanceRating', label: 'Rating' },
    { key: 'systemRole', label: 'Role' },
  ]

  const stats = useMemo(() => {
    const { employees, leaveRequests } = store
    const present = employees.filter((e) => e.attendance === 'Present').length
    const onLeave = employees.filter((e) => e.attendance === 'On Leave').length
    const pendingCount = leaveRequests.filter((l) => l.status === 'pending').length
    const payroll = employees.reduce((sum, e) => sum + (parseFloat(e.salary) || 0), 0)
    const departments = new Set(employees.map((e) => e.dept)).size
    const avgRating = employees.filter((e) => e.performanceRating).length
      ? (employees.reduce((sum, e) => sum + (parseFloat(e.performanceRating) || 0), 0)
        / employees.filter((e) => e.performanceRating).length).toFixed(1)
      : '—'

    return [
      { label: 'Total Employees', value: String(employees.length), trend: 'neutral' },
      { label: 'Present Today', value: String(present), trend: 'up' },
      { label: 'On Leave', value: String(onLeave), trend: onLeave > 0 ? 'down' : 'neutral' },
      { label: 'Pending Leave', value: String(pendingCount), trend: pendingCount > 0 ? 'down' : 'neutral' },
      { label: 'Monthly Payroll', value: formatOMR(payroll), trend: 'neutral' },
      { label: 'Departments', value: String(departments), trend: 'neutral' },
      { label: 'Avg Performance', value: avgRating === '—' ? avgRating : `${avgRating} / 5`, trend: 'up' },
    ]
  }, [store.employees, store.leaveRequests])

  const handleApproveLeave = (req) => {
    store.update('leaveRequests', 'HRMS', req.id, {
      ...req,
      status: 'approved',
      approvedBy: 'General Manager',
      approvalDate: todayISO(),
    })
    const emp = store.employees.find((e) => e.id === req.employeeId)
    if (emp) {
      store.update('employees', 'HRMS', emp.id, { ...emp, leave: '1 approved' })
    }
  }

  const handleRejectLeave = (req) => {
    store.update('leaveRequests', 'HRMS', req.id, {
      ...req,
      status: 'rejected',
      approvedBy: 'General Manager',
      approvalDate: todayISO(),
    })
  }

  return (
    <PageShell title="HRMS" description="Employees, attendance, leave & payroll">
      {canGmApprove && (
        <section className="panel">
          <SectionHeader
            title="GM Approval"
            subtitle="Review employee leave requests"
          />
          {pendingLeave.length === 0 ? (
            <div className="approval-queue-empty">
              <span className="approval-queue-empty-icon" aria-hidden>✓</span>
              <p>All caught up — no pending leave requests.</p>
            </div>
          ) : (
            <>
              <div className="approval-queue-summary">
                <div className="approval-queue-total">
                  <span className="approval-queue-count">{pendingLeave.length}</span>
                  <span className="approval-queue-label">pending leave request{pendingLeave.length === 1 ? '' : 's'}</span>
                </div>
              </div>
              <div className="approval-queue">
                {pendingLeave.map((req) => (
                  <article key={req.id} className="approval-card approval-card--return">
                    <div className="approval-card-header">
                      <div className="approval-card-heading">
                        <h3 className="approval-card-title">{req.name}</h3>
                        <span className="approval-card-id">{req.id}</span>
                      </div>
                      <div className="approval-card-badges">
                        <Badge variant="info">{req.leaveType || 'Leave'}</Badge>
                        <Badge variant="warning">Pending</Badge>
                      </div>
                    </div>
                    <dl className="approval-card-meta">
                      <div className="approval-card-meta-item">
                        <dt>Department</dt>
                        <dd>{req.department || '—'}</dd>
                      </div>
                      <div className="approval-card-meta-item">
                        <dt>From</dt>
                        <dd>{formatDisplayDate(req.fromDate)}</dd>
                      </div>
                      <div className="approval-card-meta-item">
                        <dt>To</dt>
                        <dd>{formatDisplayDate(req.toDate)}</dd>
                      </div>
                      <div className="approval-card-meta-item">
                        <dt>Requested by</dt>
                        <dd>{req.requestedBy || req.name}</dd>
                      </div>
                    </dl>
                    {req.detail && <blockquote className="approval-card-remarks">{req.detail}</blockquote>}
                    <div className="approval-card-actions">
                      <button type="button" className="btn btn-success btn-sm" onClick={() => handleApproveLeave(req)}>
                        Approve
                      </button>
                      <button type="button" className="btn btn-danger-outline btn-sm" onClick={() => handleRejectLeave(req)}>
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

      <div className="stats-grid">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} trend={s.trend} />
        ))}
      </div>

      <section className="panel">
        <SectionHeader title="Employee Directory" action={<button type="button" className="btn btn-primary" onClick={() => setEmpModal({ open: true, item: null })}>+ Add Employee</button>} />
        <CrudTable columns={cols} rows={store.employees} onView={crud.openView} onEdit={(item) => setEmpModal({ open: true, item })} onDelete={crud.openDelete} />
      </section>

      <EmployeeModal
        open={empModal.open}
        editItem={empModal.item}
        onClose={() => setEmpModal({ open: false, item: null })}
        onSubmit={(emp) => {
          if (empModal.item) store.update('employees', 'HRMS', empModal.item.id, emp)
          else store.create('employees', 'EMP-', 'HRMS', emp)
          setEmpModal({ open: false, item: null })
        }}
      />
      <ViewDetailModal open={crud.isView} onClose={crud.closeModal} title="Employee" data={crud.item} fields={viewFields} />
      <DeleteConfirmModal open={!!crud.deleteTarget} onClose={crud.closeDelete} onConfirm={() => store.remove('employees', 'HRMS', crud.deleteTarget.id)} itemName={crud.deleteTarget?.name} />
    </PageShell>
  )
}

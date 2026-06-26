import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, FeatureGrid, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import AddEmployeeModal from '../components/AddEmployeeModal'
import InfoModal from '../components/InfoModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { nextId } from '../utils/helpers'

const features = ['Employees', 'Attendance', 'Leave', 'Payroll', 'Recruitment', 'Performance Review']

export default function HRMS() {
  const store = useStore()
  const crud = useCrudModal()
  const [empModal, setEmpModal] = useState({ open: false, item: null })
  const [mobileOpen, setMobileOpen] = useState(false)

  const cols = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'dept', label: 'Department' },
    { key: 'attendance', label: 'Today', render: (r) => <Badge variant={r.attendance === 'Present' ? 'success' : 'warning'}>{r.attendance}</Badge> },
    { key: 'leave', label: 'Leave' },
  ]

  const handleLeave = (id, decision) => {
    store.update('leaveRequests', 'HRMS', id, { status: decision })
    const leave = store.leaveRequests.find((l) => l.id === id)
    if (leave && decision === 'approved') {
      store.update('employees', 'HRMS', store.employees.find((e) => e.name === leave.name)?.id, { attendance: 'On Leave', leave: 'Approved' })
    }
  }

  return (
    <PageShell title="HRMS" description="Employees, attendance, leave approvals & payroll">
      <section className="panel"><SectionHeader title="Module Features" /><FeatureGrid features={features} /></section>
      <section className="panel">
        <SectionHeader title="Employee Directory" action={<button type="button" className="btn btn-primary" onClick={() => setEmpModal({ open: true, item: null })}>+ Add Employee</button>} />
        <CrudTable columns={cols} rows={store.employees} onView={crud.openView} onEdit={(item) => setEmpModal({ open: true, item })} onDelete={crud.openDelete} />
      </section>
      <div className="two-col">
        <section className="panel">
          <SectionHeader title="Leave Approvals" subtitle="Manager → Finance → GM workflow" />
          {store.leaveRequests.map((leave) => (
            <div key={leave.id} className="approval-item">
              <div><strong>{leave.name}</strong><span>{leave.detail}</span>{leave.status !== 'pending' && <Badge variant={leave.status === 'approved' ? 'success' : 'warning'}>{leave.status}</Badge>}</div>
              {leave.status === 'pending' && (
                <div className="approval-actions">
                  <button type="button" className="btn btn-success btn-sm" onClick={() => handleLeave(leave.id, 'approved')}>Approve</button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleLeave(leave.id, 'rejected')}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </section>
        <section className="panel">
          <SectionHeader title="Mobile Access" />
          <button type="button" className="btn btn-secondary" onClick={() => setMobileOpen(true)}>Open Mobile Portal</button>
        </section>
      </div>
      <AddEmployeeModal
        open={empModal.open}
        editItem={empModal.item}
        onClose={() => setEmpModal({ open: false, item: null })}
        onSubmit={(emp) => {
          if (empModal.item) store.update('employees', 'HRMS', empModal.item.id, emp)
          else store.create('employees', 'EMP-', 'HRMS', emp)
          setEmpModal({ open: false, item: null })
        }}
      />
      <ViewDetailModal open={crud.isView} onClose={crud.closeModal} title="Employee" data={crud.item} fields={cols} />
      <DeleteConfirmModal open={!!crud.deleteTarget} onClose={crud.closeDelete} onConfirm={() => store.remove('employees', 'HRMS', crud.deleteTarget.id)} itemName={crud.deleteTarget?.name} />
      <InfoModal open={mobileOpen} onClose={() => setMobileOpen(false)} title="Mobile Portal"><p>Attendance, leave & payslip access.</p></InfoModal>
    </PageShell>
  )
}

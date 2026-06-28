import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, StatCard, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import EmployeeModal from '../components/EmployeeModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { formatOMR } from '../utils/helpers'

export default function HRMS() {
  const store = useStore()
  const crud = useCrudModal()
  const [empModal, setEmpModal] = useState({ open: false, item: null })

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
    const pendingLeave = leaveRequests.filter((l) => l.status === 'pending').length
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
      { label: 'Pending Leave', value: String(pendingLeave), trend: pendingLeave > 0 ? 'down' : 'neutral' },
      { label: 'Monthly Payroll', value: formatOMR(payroll), trend: 'neutral' },
      { label: 'Departments', value: String(departments), trend: 'neutral' },
      { label: 'Avg Performance', value: avgRating === '—' ? avgRating : `${avgRating} / 5`, trend: 'up' },
    ]
  }, [store.employees, store.leaveRequests])

  return (
    <PageShell title="HRMS" description="Employees, attendance, leave & payroll">
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

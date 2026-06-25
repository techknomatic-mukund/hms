import { useState } from 'react'
import { employees as initialEmployees } from '../data/mockData'
import { PageShell, SectionHeader, FeatureGrid, DataTable, Badge } from '../components/UI'
import AddEmployeeModal from '../components/AddEmployeeModal'
import InfoModal from '../components/InfoModal'
import { nextId } from '../utils/helpers'

const features = [
  'Employee records', 'Attendance', 'Leave management',
  'Approval workflows', 'Mobile login',
]

const initialLeaves = [
  { id: 'LV-01', name: 'Ravi Menon', detail: 'Casual Leave — 27-28 Jun', status: 'pending' },
]

const attBadge = (a) => {
  if (a === 'Present') return 'success'
  if (a === 'On Leave') return 'warning'
  return 'default'
}

export default function HRMS() {
  const [employeeList, setEmployeeList] = useState(initialEmployees)
  const [leaveList, setLeaveList] = useState(initialLeaves)
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false)
  const [mobileModalOpen, setMobileModalOpen] = useState(false)

  const handleLeave = (id, decision) => {
    setLeaveList((prev) => prev.map((l) => (l.id === id ? { ...l, status: decision } : l)))
    if (decision === 'approved') {
      const leave = leaveList.find((l) => l.id === id)
      if (leave) {
        setEmployeeList((prev) => prev.map((e) => (
          e.name === leave.name ? { ...e, attendance: 'On Leave', leave: 'Approved' } : e
        )))
      }
    }
  }

  return (
    <PageShell
      title="HRMS"
      description="Employee management, attendance, leave & approval workflows"
    >
      <section className="panel">
        <SectionHeader title="Module Features" />
        <FeatureGrid features={features} />
      </section>

      <section className="panel">
        <SectionHeader
          title="Employee Directory"
          action={<button type="button" className="btn btn-primary" onClick={() => setEmployeeModalOpen(true)}>+ Add Employee</button>}
        />
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'dept', label: 'Department' },
            {
              key: 'attendance',
              label: 'Today',
              render: (row) => <Badge variant={attBadge(row.attendance)}>{row.attendance}</Badge>,
            },
            { key: 'leave', label: 'Leave Status' },
          ]}
          rows={employeeList}
        />
      </section>

      <div className="two-col">
        <section className="panel">
          <SectionHeader title="Leave Approvals" subtitle="Pending workflow items" />
          {leaveList.length === 0 && <p className="info-text">No leave requests.</p>}
          {leaveList.map((leave) => (
            <div key={leave.id} className="approval-item">
              <div>
                <strong>{leave.name}</strong>
                <span>{leave.detail}</span>
                {leave.status !== 'pending' && (
                  <Badge variant={leave.status === 'approved' ? 'success' : 'warning'}>{leave.status}</Badge>
                )}
              </div>
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
          <p className="info-text">Employees can mark attendance and apply for leave via mobile app login.</p>
          <button type="button" className="btn btn-secondary" onClick={() => setMobileModalOpen(true)}>Open Mobile Portal (Demo)</button>
        </section>
      </div>

      <AddEmployeeModal
        open={employeeModalOpen}
        onClose={() => setEmployeeModalOpen(false)}
        onSubmit={(emp) => {
          setEmployeeList((prev) => [{ id: nextId('EMP-', prev), ...emp }, ...prev])
          setEmployeeModalOpen(false)
        }}
      />

      <InfoModal open={mobileModalOpen} onClose={() => setMobileModalOpen(false)} title="Mobile Portal">
        <p>Demo mobile login successful.</p>
        <ul className="info-list">
          <li>Mark attendance</li>
          <li>Apply for leave</li>
          <li>View payslips</li>
        </ul>
      </InfoModal>
    </PageShell>
  )
}

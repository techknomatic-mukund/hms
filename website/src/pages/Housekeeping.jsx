import { useMemo } from 'react'
import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import HousekeepingTaskModal from '../components/HousekeepingTaskModal'
import { Badge } from '../components/UI'

const viewFields = [
  { key: 'id', label: 'Ref' },
  { key: 'floor', label: 'Floor', render: (r) => r.floor ? `Floor ${r.floor}` : '—' },
  { key: 'room', label: 'Room' },
  { key: 'guestName', label: 'Guest' },
  { key: 'checkInDate', label: 'Check-In' },
  { key: 'task', label: 'Task' },
  { key: 'assignee', label: 'Assignee' },
  { key: 'shift', label: 'Shift' },
  { key: 'scheduledDate', label: 'Scheduled Date' },
  { key: 'scheduledTime', label: 'Scheduled Time' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status' },
]

export default function Housekeeping() {
  const store = useStore()
  const key = 'housekeepingTasks'

  const staff = useMemo(
    () => store.employees.filter((e) => e.dept === 'Housekeeping').map((e) => e.name).concat('Housekeeping Team'),
    [store.employees],
  )

  return (
    <CrudModule
      title="Housekeeping"
      description="Room readiness — auto-updated when guests check in/out"
      createLabel="+ New Task"
      data={store.housekeepingTasks}
      moduleName="Housekeeping Task"
      columns={[
        { key: 'id', label: 'Ref' },
        { key: 'floor', label: 'Floor', render: (r) => r.floor ? `F${r.floor}` : '—' },
        { key: 'room', label: 'Room' },
        { key: 'guestName', label: 'Guest', render: (r) => r.guestName || '—' },
        { key: 'task', label: 'Task' },
        { key: 'assignee', label: 'Assignee' },
        { key: 'shift', label: 'Shift', render: (r) => r.shift || '—' },
        { key: 'priority', label: 'Priority' },
        { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'In Progress' ? 'info' : r.status === 'Pending' ? 'warning' : 'success'}>{r.status}</Badge> },
      ]}
      viewFields={viewFields}
      onCreate={(f) => store.create(key, 'HK-', 'Housekeeping', f)}
      onUpdate={(id, f) => store.update(key, 'Housekeeping', id, f)}
      onDelete={(id) => store.remove(key, 'Housekeeping', id)}
      customModal={(props) => (
        <HousekeepingTaskModal
          {...props}
          staff={staff}
          reservations={store.reservations}
          rooms={store.rooms}
        />
      )}
    />
  )
}

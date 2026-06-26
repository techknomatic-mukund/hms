import { useMemo } from 'react'
import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import HousekeepingTaskModal from '../components/HousekeepingTaskModal'
import { Badge, SectionHeader } from '../components/UI'

const features = [
  'Task Assignment & Scheduling', 'Cleaning Checklist', 'Amenities Replenishment',
  'Deep Cleaning Schedule', 'Housekeeping Performance Dashboard',
]

const viewFields = [
  { key: 'id', label: 'Ref' },
  { key: 'room', label: 'Room' },
  { key: 'task', label: 'Task' },
  { key: 'assignee', label: 'Assignee' },
  { key: 'shift', label: 'Shift' },
  { key: 'scheduledDate', label: 'Scheduled Date' },
  { key: 'cleaningChecklist', label: 'Cleaning Checklist' },
  { key: 'amenitiesReplenish', label: 'Amenities' },
  { key: 'deepCleanType', label: 'Deep Clean' },
  { key: 'qualityScore', label: 'Quality Score' },
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
      features={features}
      createLabel="+ New Task"
      data={store.housekeepingTasks}
      moduleName="Housekeeping Task"
      columns={[
        { key: 'id', label: 'Ref' },
        { key: 'room', label: 'Room' },
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
      customModal={(props) => <HousekeepingTaskModal {...props} staff={staff} />}
      extra={(
        <section className="panel">
          <SectionHeader title="Room Status (from central DB)" />
          <div className="room-grid">
            {store.rooms.map((r) => (
              <div key={r.id} className={`room-card room-${r.status.toLowerCase().replace(' ', '-')}`}>
                <strong>{r.number}</strong>
                <span>{r.type}</span>
                <Badge variant={r.status === 'Occupied' ? 'info' : r.status === 'Dirty' ? 'warning' : 'success'}>{r.status}</Badge>
              </div>
            ))}
          </div>
        </section>
      )}
    />
  )
}

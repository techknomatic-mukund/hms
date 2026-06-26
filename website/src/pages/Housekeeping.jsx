import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import { Badge, SectionHeader } from '../components/UI'

const features = ['Room Cleaning', 'Inspection', 'Linen', 'Lost & Found', 'Room Status', 'Maintenance Request']

export default function Housekeeping() {
  const store = useStore()
  const key = 'housekeepingTasks'

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
        { key: 'priority', label: 'Priority' },
        { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'In Progress' ? 'info' : r.status === 'Pending' ? 'warning' : 'success'}>{r.status}</Badge> },
      ]}
      formFields={[
        { name: 'room', label: 'Room', required: true },
        { name: 'task', label: 'Task', required: true, full: true },
        { name: 'assignee', label: 'Assignee', default: 'Unassigned' },
        { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Normal', 'High'], default: 'Normal' },
        { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'In Progress', 'Completed', 'Scheduled'], default: 'Pending' },
      ]}
      onCreate={(f) => store.create(key, 'HK-', 'Housekeeping', f)}
      onUpdate={(id, f) => store.update(key, 'Housekeeping', id, f)}
      onDelete={(id) => store.remove(key, 'Housekeeping', id)}
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

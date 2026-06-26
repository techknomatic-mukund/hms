import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, FeatureGrid, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import HousekeepingPerformanceDashboard from '../components/HousekeepingPerformanceDashboard'
import CleaningChecklistPanel from '../components/CleaningChecklistPanel'
import HousekeepingTaskModal from '../components/HousekeepingTaskModal'
import AmenitiesModal from '../components/AmenitiesModal'
import DeepCleaningModal from '../components/DeepCleaningModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { taskStatusVariant, deepCleanVariant } from '../utils/housekeepingHelpers'

const features = [
  'Task Assignment & Scheduling', 'Cleaning Checklist', 'Amenities Replenishment',
  'Deep Cleaning Schedule', 'Housekeeping Performance Dashboard', 'Room Status',
]

export default function Housekeeping() {
  const store = useStore()
  const taskCrud = useCrudModal()
  const amenityCrud = useCrudModal()
  const deepCrud = useCrudModal()
  const [taskOpen, setTaskOpen] = useState(false)
  const [amenityOpen, setAmenityOpen] = useState(false)
  const [deepOpen, setDeepOpen] = useState(false)

  const taskCols = [
    { key: 'id', label: 'Ref' },
    { key: 'room', label: 'Room' },
    { key: 'task', label: 'Task' },
    { key: 'taskType', label: 'Type' },
    { key: 'assignee', label: 'Assignee' },
    { key: 'shift', label: 'Shift', render: (r) => r.shift?.split(' ')[0] || '—' },
    { key: 'scheduledTime', label: 'Time' },
    { key: 'priority', label: 'Priority' },
    {
      key: 'checklistProgress',
      label: 'Checklist',
      render: (r) => `${r.checklistProgress || 0}%`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <Badge variant={taskStatusVariant(r.status)}>{r.status}</Badge>,
    },
  ]

  const amenityCols = [
    { key: 'room', label: 'Room' },
    { key: 'date', label: 'Date' },
    { key: 'staff', label: 'Staff' },
    { key: 'items', label: 'Items Replenished' },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <Badge variant={taskStatusVariant(r.status)}>{r.status}</Badge>,
    },
  ]

  const deepCols = [
    { key: 'area', label: 'Area' },
    { key: 'type', label: 'Type' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'lastDone', label: 'Last Done' },
    { key: 'nextDue', label: 'Next Due' },
    { key: 'assignee', label: 'Assignee' },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <Badge variant={deepCleanVariant(r.status)}>{r.status}</Badge>,
    },
  ]

  return (
    <PageShell
      title="Housekeeping"
      description="Task scheduling, checklists, amenities, deep cleaning & performance analytics"
    >
      <section className="panel">
        <SectionHeader title="Module Features" />
        <FeatureGrid features={features} />
      </section>

      <section className="panel">
        <SectionHeader
          title="Housekeeping Performance Dashboard"
          subtitle="Staff productivity, pending rooms, avg. cleaning time & completion rate"
        />
        <HousekeepingPerformanceDashboard
          tasks={store.housekeepingTasks}
          rooms={store.rooms}
          staff={store.housekeepingStaff}
        />
      </section>

      <section className="panel">
        <SectionHeader
          title="Task Assignment & Scheduling"
          subtitle="Auto-assign by workload, shift & room priority"
          action={(
            <button type="button" className="btn btn-primary btn-sm" onClick={() => { taskCrud.closeModal(); setTaskOpen(true) }}>
              + Assign Task
            </button>
          )}
        />
        <CrudTable
          columns={taskCols}
          rows={store.housekeepingTasks}
          onEdit={(item) => { taskCrud.openEdit(item); setTaskOpen(true) }}
          onDelete={(item) => taskCrud.openDelete(item)}
        />
      </section>

      <div className="two-col">
        <section className="panel">
          <SectionHeader title="Cleaning Checklist" subtitle="Standardized checklists by room type" />
          <CleaningChecklistPanel
            checklists={store.cleaningChecklists}
            tasks={store.housekeepingTasks.filter((t) => t.status !== 'Completed')}
            onUpdateProgress={store.updateChecklistProgress}
          />
        </section>

        <section className="panel">
          <SectionHeader
            title="Amenities Replenishment"
            action={(
              <button type="button" className="btn btn-primary btn-sm" onClick={() => { amenityCrud.closeModal(); setAmenityOpen(true) }}>
                + Record
              </button>
            )}
          />
          <CrudTable
            columns={amenityCols}
            rows={store.amenitiesReplenishment}
            onEdit={(item) => { amenityCrud.openEdit(item); setAmenityOpen(true) }}
            onDelete={(item) => amenityCrud.openDelete(item)}
          />
        </section>
      </div>

      <section className="panel">
        <SectionHeader
          title="Deep Cleaning Schedule"
          subtitle="Periodic deep cleaning for rooms & public areas"
          action={(
            <button type="button" className="btn btn-primary btn-sm" onClick={() => { deepCrud.closeModal(); setDeepOpen(true) }}>
              + Schedule
            </button>
          )}
        />
        <CrudTable
          columns={deepCols}
          rows={store.deepCleaningSchedule}
          onEdit={(item) => { deepCrud.openEdit(item); setDeepOpen(true) }}
          onDelete={(item) => deepCrud.openDelete(item)}
        />
      </section>

      <section className="panel">
        <SectionHeader title="Room Status (Central DB)" />
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

      <HousekeepingTaskModal
        open={taskOpen}
        rooms={store.rooms}
        staff={store.housekeepingStaff}
        editItem={taskCrud.item}
        onClose={() => { setTaskOpen(false); taskCrud.closeModal() }}
        onSubmit={(data) => {
          if (taskCrud.item) store.update('housekeepingTasks', 'Housekeeping', taskCrud.item.id, data)
          else store.create('housekeepingTasks', 'HK-', 'Housekeeping', data)
        }}
      />

      <AmenitiesModal
        open={amenityOpen}
        rooms={store.rooms}
        staff={store.housekeepingStaff}
        editItem={amenityCrud.item}
        onClose={() => { setAmenityOpen(false); amenityCrud.closeModal() }}
        onSubmit={(data) => {
          if (amenityCrud.item) store.update('amenitiesReplenishment', 'Housekeeping', amenityCrud.item.id, data)
          else store.create('amenitiesReplenishment', 'AR-', 'Housekeeping', data)
        }}
      />

      <DeepCleaningModal
        open={deepOpen}
        staff={store.housekeepingStaff}
        editItem={deepCrud.item}
        onClose={() => { setDeepOpen(false); deepCrud.closeModal() }}
        onSubmit={(data) => {
          if (deepCrud.item) store.update('deepCleaningSchedule', 'Housekeeping', deepCrud.item.id, data)
          else store.create('deepCleaningSchedule', 'DC-', 'Housekeeping', data)
        }}
      />

      <DeleteConfirmModal
        open={!!taskCrud.deleteTarget}
        onClose={taskCrud.closeDelete}
        onConfirm={() => store.remove('housekeepingTasks', 'Housekeeping', taskCrud.deleteTarget.id)}
        itemName={taskCrud.deleteTarget?.room}
      />
      <DeleteConfirmModal
        open={!!amenityCrud.deleteTarget}
        onClose={amenityCrud.closeDelete}
        onConfirm={() => store.remove('amenitiesReplenishment', 'Housekeeping', amenityCrud.deleteTarget.id)}
        itemName={amenityCrud.deleteTarget?.room}
      />
      <DeleteConfirmModal
        open={!!deepCrud.deleteTarget}
        onClose={deepCrud.closeDelete}
        onConfirm={() => store.remove('deepCleaningSchedule', 'Housekeeping', deepCrud.deleteTarget.id)}
        itemName={deepCrud.deleteTarget?.area}
      />
    </PageShell>
  )
}

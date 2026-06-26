import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, FeatureGrid, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import MaintenanceScheduleModal from '../components/MaintenanceScheduleModal'
import WorkOrderModal from '../components/WorkOrderModal'
import AssetMaintenanceHistoryPanel from '../components/AssetMaintenanceHistoryPanel'
import SparePartModal from '../components/SparePartModal'
import TechnicianTrackingPanel from '../components/TechnicianTrackingPanel'
import MaintenanceCostDashboard from '../components/MaintenanceCostDashboard'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { ticketVariant, priorityVariant, scheduleVariant, stockVariant } from '../utils/maintenanceHelpers'

const features = [
  'Maintenance Scheduling', 'Asset Maintenance History', 'Spare Parts Inventory',
  'Technician Assignment & Tracking', 'Maintenance Cost Analysis', 'Work Orders',
]

export default function Maintenance() {
  const store = useStore()
  const woCrud = useCrudModal()
  const scheduleCrud = useCrudModal()
  const partCrud = useCrudModal()
  const [woOpen, setWoOpen] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [partOpen, setPartOpen] = useState(false)

  const woCols = [
    { key: 'id', label: 'Ref' },
    { key: 'asset', label: 'Asset' },
    { key: 'type', label: 'Type' },
    { key: 'complaint', label: 'Complaint' },
    { key: 'technician', label: 'Technician' },
    { key: 'estCompletion', label: 'ETA' },
    { key: 'priority', label: 'Priority', render: (r) => <Badge variant={priorityVariant(r.priority)}>{r.priority}</Badge> },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={ticketVariant(r.status)}>{r.status}</Badge> },
  ]

  const scheduleCols = [
    { key: 'asset', label: 'Asset' },
    { key: 'category', label: 'Category' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'lastDone', label: 'Last Done' },
    { key: 'nextDue', label: 'Next Due' },
    { key: 'assignee', label: 'Assignee' },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={scheduleVariant(r.status)}>{r.status}</Badge> },
  ]

  const partCols = [
    { key: 'id', label: 'Ref' },
    { key: 'name', label: 'Part' },
    { key: 'category', label: 'Category' },
    { key: 'stock', label: 'Stock' },
    { key: 'unit', label: 'Unit' },
    { key: 'reorder', label: 'Reorder At' },
    { key: 'lastUsed', label: 'Last Used' },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={stockVariant(r.status)}>{r.status}</Badge> },
  ]

  return (
    <PageShell
      title="Maintenance"
      description="Scheduling, asset history, spare parts, technician tracking & cost analysis"
    >
      <section className="panel">
        <SectionHeader title="Module Features" />
        <FeatureGrid features={features} />
      </section>

      <section className="panel">
        <SectionHeader title="Maintenance Cost Analysis" subtitle="Expenses, labor, parts consumption & trends" />
        <MaintenanceCostDashboard
          tickets={store.maintenanceTickets}
          history={store.assetMaintenanceHistory}
          spareParts={store.sparePartsInventory}
        />
      </section>

      <section className="panel">
        <SectionHeader
          title="Work Orders"
          action={(
            <button type="button" className="btn btn-primary btn-sm" onClick={() => { woCrud.closeModal(); setWoOpen(true) }}>
              + New Work Order
            </button>
          )}
        />
        <CrudTable
          columns={woCols}
          rows={store.maintenanceTickets}
          onEdit={(item) => { woCrud.openEdit(item); setWoOpen(true) }}
          onDelete={(item) => woCrud.openDelete(item)}
        />
      </section>

      <div className="two-col">
        <section className="panel">
          <SectionHeader
            title="Maintenance Scheduling"
            subtitle="Preventive maintenance — HVAC, elevators, generators, plumbing"
            action={(
              <button type="button" className="btn btn-primary btn-sm" onClick={() => { scheduleCrud.closeModal(); setScheduleOpen(true) }}>
                + Schedule
              </button>
            )}
          />
          <CrudTable
            columns={scheduleCols}
            rows={store.maintenanceSchedules}
            onEdit={(item) => { scheduleCrud.openEdit(item); setScheduleOpen(true) }}
            onDelete={(item) => scheduleCrud.openDelete(item)}
          />
        </section>

        <section className="panel">
          <SectionHeader title="Technician Assignment & Tracking" subtitle="Workload & active work orders" />
          <TechnicianTrackingPanel
            technicians={store.maintenanceTechnicians}
            tickets={store.maintenanceTickets}
          />
        </section>
      </div>

      <section className="panel">
        <SectionHeader title="Asset Maintenance History" subtitle="Repairs, costs, parts used & technician notes" />
        <AssetMaintenanceHistoryPanel
          history={store.assetMaintenanceHistory}
          tickets={store.maintenanceTickets}
        />
      </section>

      <section className="panel">
        <SectionHeader
          title="Spare Parts Inventory"
          subtitle="Stock levels — integrates with Inventory module"
          action={(
            <button type="button" className="btn btn-primary btn-sm" onClick={() => { partCrud.closeModal(); setPartOpen(true) }}>
              + Add Part
            </button>
          )}
        />
        <CrudTable
          columns={partCols}
          rows={store.sparePartsInventory}
          onEdit={(item) => { partCrud.openEdit(item); setPartOpen(true) }}
          onDelete={(item) => partCrud.openDelete(item)}
        />
      </section>

      <MaintenanceScheduleModal
        open={scheduleOpen}
        technicians={store.maintenanceTechnicians}
        editItem={scheduleCrud.item}
        onClose={() => { setScheduleOpen(false); scheduleCrud.closeModal() }}
        onSubmit={(data) => {
          if (scheduleCrud.item) store.update('maintenanceSchedules', 'Maintenance', scheduleCrud.item.id, data)
          else store.create('maintenanceSchedules', 'MS-', 'Maintenance', data)
        }}
      />

      <WorkOrderModal
        open={woOpen}
        technicians={store.maintenanceTechnicians}
        editItem={woCrud.item}
        onClose={() => { setWoOpen(false); woCrud.closeModal() }}
        onSubmit={(data) => {
          if (woCrud.item) store.update('maintenanceTickets', 'Maintenance', woCrud.item.id, data)
          else store.create('maintenanceTickets', 'WO-', 'Maintenance', data)
        }}
      />

      <SparePartModal
        open={partOpen}
        editItem={partCrud.item}
        onClose={() => { setPartOpen(false); partCrud.closeModal() }}
        onSubmit={(data) => {
          if (partCrud.item) store.update('sparePartsInventory', 'Maintenance', partCrud.item.id, data)
          else store.create('sparePartsInventory', 'SP-', 'Maintenance', data)
        }}
      />

      <DeleteConfirmModal
        open={!!woCrud.deleteTarget}
        onClose={woCrud.closeDelete}
        onConfirm={() => store.remove('maintenanceTickets', 'Maintenance', woCrud.deleteTarget.id)}
        itemName={woCrud.deleteTarget?.asset}
      />
      <DeleteConfirmModal
        open={!!scheduleCrud.deleteTarget}
        onClose={scheduleCrud.closeDelete}
        onConfirm={() => store.remove('maintenanceSchedules', 'Maintenance', scheduleCrud.deleteTarget.id)}
        itemName={scheduleCrud.deleteTarget?.asset}
      />
      <DeleteConfirmModal
        open={!!partCrud.deleteTarget}
        onClose={partCrud.closeDelete}
        onConfirm={() => store.remove('sparePartsInventory', 'Maintenance', partCrud.deleteTarget.id)}
        itemName={partCrud.deleteTarget?.name}
      />
    </PageShell>
  )
}

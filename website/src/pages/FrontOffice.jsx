import { useState } from 'react'
import { bookingSourcePerformance } from '../data/initialState'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, FeatureGrid, DataTable, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import NewReservationModal, { nextReservationId } from '../components/NewReservationModal'
import GuestActionModal from '../components/GuestActionModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'

const features = [
  'Guest Registration', 'Check-in', 'Check-out', 'Room Allocation', 'Room Upgrade',
  'Guest Folio', 'Room Status Board', 'Guest History & Preferences',
  'Deposit Management', 'Guest Requests',
]

const statusVariant = (s) => {
  if (s === 'Checked In') return 'success'
  if (s === 'Confirmed') return 'info'
  if (s === 'Checked Out') return 'muted'
  return 'default'
}

const QUICK_ACTIONS = {
  'Check-in Guest': 'check-in',
  'Walk-in Booking': 'walk-in',
  'Registration Card': 'registration',
  'Guest Folio': 'folio',
  'Check-out': 'check-out',
}

const resColumns = [
  { key: 'id', label: 'Ref' },
  { key: 'guest', label: 'Guest' },
  { key: 'source', label: 'Source' },
  { key: 'room', label: 'Room' },
  { key: 'checkIn', label: 'Check-in' },
  { key: 'checkOut', label: 'Check-out' },
  { key: 'status', label: 'Status', render: (row) => <Badge variant={statusVariant(row.status)}>{row.status}</Badge> },
]

export default function FrontOffice() {
  const store = useStore()
  const crud = useCrudModal()
  const [reservationModalOpen, setReservationModalOpen] = useState(false)
  const [walkInMode, setWalkInMode] = useState(false)
  const [guestAction, setGuestAction] = useState(null)
  const [editItem, setEditItem] = useState(null)

  const openCreate = () => { setEditItem(null); setWalkInMode(false); setReservationModalOpen(true) }
  const openEdit = (item) => { setEditItem(item); setReservationModalOpen(true) }

  const handleSave = (data) => {
    if (editItem) store.updateReservation(editItem.id, data)
    else store.createReservation(data)
    setReservationModalOpen(false)
    setEditItem(null)
  }

  const openQuickAction = (label) => {
    const action = QUICK_ACTIONS[label]
    if (action === 'walk-in') { setWalkInMode(true); setEditItem(null); setReservationModalOpen(true) }
    else setGuestAction(action)
  }

  return (
    <PageShell title="Front Office" description="Guest operations — integrates with Housekeeping, Finance & CRM">
      <section className="panel">
        <SectionHeader title="Module Features" />
        <FeatureGrid features={features} />
      </section>

      <section className="panel">
        <SectionHeader
          title="Active Reservations"
          action={<button type="button" className="btn btn-primary" onClick={openCreate}>+ New Reservation</button>}
        />
        <CrudTable
          columns={resColumns}
          rows={store.reservations}
          onView={crud.openView}
          onEdit={openEdit}
          onDelete={crud.openDelete}
        />
      </section>

      <div className="two-col">
        <section className="panel">
          <SectionHeader title="Quick Actions" />
          <div className="action-grid">
            {Object.keys(QUICK_ACTIONS).map((label) => (
              <button key={label} type="button" className="action-btn" onClick={() => openQuickAction(label)}>{label}</button>
            ))}
          </div>
        </section>
        <section className="panel">
          <SectionHeader title="Booking Source Report" />
          <DataTable columns={[{ key: 'source', label: 'Source' }, { key: 'bookings', label: 'Bookings' }, { key: 'revenue', label: 'Revenue' }]} rows={bookingSourcePerformance} keyField="source" />
        </section>
      </div>

      <NewReservationModal
        open={reservationModalOpen}
        reservations={store.reservations}
        rooms={store.rooms}
        crmCustomers={store.crmCustomers}
        onClose={() => { setReservationModalOpen(false); setEditItem(null) }}
        onSubmit={handleSave}
        defaultSource={walkInMode ? 'Walk-in' : 'OTA'}
        editItem={editItem}
      />

      <GuestActionModal
        open={!!guestAction}
        type={guestAction}
        onClose={() => setGuestAction(null)}
        reservations={store.reservations}
        onCheckIn={store.checkIn}
        onCheckOut={store.checkOut}
        onSaveRegistration={() => {}}
      />

      <ViewDetailModal open={crud.isView} onClose={crud.closeModal} title="Reservation Details" data={crud.item} fields={resColumns} />
      <DeleteConfirmModal
        open={!!crud.deleteTarget}
        onClose={crud.closeDelete}
        onConfirm={() => store.deleteReservation(crud.deleteTarget.id)}
        itemName={crud.deleteTarget?.guest}
      />
    </PageShell>
  )
}

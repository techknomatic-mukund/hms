import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import FrontOfficeDashboard from '../components/FrontOfficeDashboard'
import ReservationCalendar from '../components/ReservationCalendar'
import ReservationModal from '../components/ReservationModal'
import GuestCheckInModal from '../components/GuestCheckInModal'
import RoomTransferModal from '../components/RoomTransferModal'
import ReservationHistoryModal from '../components/ReservationHistoryModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { normalizeReservation } from '../utils/reservationHelpers'
import { computeFrontOfficeDashboard } from '../utils/frontOfficeMetrics'

const statusBadge = (s) => {
  if (s === 'Checked In') return 'success'
  if (s === 'Confirmed') return 'info'
  if (s === 'Checked Out') return 'muted'
  if (s === 'Cancelled') return 'warning'
  if (s === 'Tentative') return 'default'
  if (s === 'No Show') return 'warning'
  return 'default'
}

export default function Reservations() {
  const store = useStore()
  const crud = useCrudModal()
  const [resModal, setResModal] = useState({ open: false, item: null })
  const [checkInModal, setCheckInModal] = useState({ open: false, item: null })
  const [transferOpen, setTransferOpen] = useState(false)
  const [transferPreselect, setTransferPreselect] = useState(null)
  const [historyItem, setHistoryItem] = useState(null)

  const dashboardMetrics = useMemo(
    () => computeFrontOfficeDashboard(store),
    [store],
  )

  const cols = [
    { key: 'id', label: 'Ref' },
    { key: 'guest', label: 'Guest' },
    { key: 'source', label: 'Source' },
    {
      key: 'rooms',
      label: 'Room(s)',
      render: (row) => {
        const n = normalizeReservation(row)
        return n.rooms.length > 1 ? (
          <span>{n.room} <Badge variant="info">+{n.rooms.length - 1}</Badge></span>
        ) : n.room
      },
    },
    { key: 'checkIn', label: 'Check-in' },
    { key: 'checkOut', label: 'Check-out' },
    {
      key: 'notes',
      label: 'Notes',
      render: (row) => (row.notes ? `${row.notes.slice(0, 40)}${row.notes.length > 40 ? '…' : ''}` : '—'),
    },
    { key: 'status', label: 'Status', render: (row) => <Badge variant={statusBadge(row.status)}>{row.status}</Badge> },
  ]

  const viewFields = [
    ...cols,
    {
      key: 'rooms',
      label: 'All Rooms',
      render: (row) => normalizeReservation(row).rooms.join(', '),
    },
    { key: 'notes', label: 'Full Notes', render: (row) => row.notes || '—' },
  ]

  return (
    <PageShell
      title="Front Office Dashboard"
      description="Room availability, arrivals, reservations, payments & guest alerts"
    >
      <FrontOfficeDashboard metrics={dashboardMetrics} />

      <section className="panel">
        <SectionHeader
          title="Reservation Calendar"
          subtitle="Daily, weekly & monthly views — click a booking or date for details"
        />
        <ReservationCalendar
          onSelectReservation={(r) => setHistoryItem(r)}
        />
      </section>

      <section className="panel">
        <SectionHeader
          title="All Reservations"
          action={(
            <div className="btn-group">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setTransferPreselect(null); setTransferOpen(true) }}>
                Room Upgrade / Transfer
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setResModal({ open: true, item: null })}>
                + New Booking
              </button>
            </div>
          )}
        />
        <CrudTable
          columns={cols}
          rows={store.reservations}
          editTitle="Guest Check-In"
          onView={crud.openView}
          onEdit={(item) => setCheckInModal({ open: true, item })}
          onDelete={crud.openDelete}
        />
        <div className="table-extra-actions">
          <span className="info-text">Use ✏️ for Guest Check-In · View for details · Calendar click for history</span>
        </div>
      </section>

      {/* <section className="panel">
        <SectionHeader title="Quick Actions" />
        <div className="action-grid">
          {store.reservations.slice(0, 4).map((r) => (
            <button key={r.id} type="button" className="action-btn" onClick={() => setHistoryItem(r)}>
              History — {r.guest}
            </button>
          ))}
        </div>
      </section> */}

      <ReservationModal
        open={resModal.open && !resModal.item}
        editItem={null}
        reservations={store.reservations}
        onClose={() => setResModal({ open: false, item: null })}
        onSubmit={(data) => {
          store.createReservation(data)
          setResModal({ open: false, item: null })
        }}
      />

      <GuestCheckInModal
        open={checkInModal.open}
        reservation={checkInModal.item}
        reservations={store.reservations}
        maintenanceTickets={store.maintenanceTickets}
        onClose={() => setCheckInModal({ open: false, item: null })}
        onCheckIn={store.checkIn}
        onUpdate={(id, data) => store.updateReservation(id, data)}
      />

      <RoomTransferModal
        open={transferOpen}
        preselected={transferPreselect}
        reservations={store.reservations}
        onClose={() => { setTransferOpen(false); setTransferPreselect(null) }}
        onSubmit={(id, payload) => {
          store.transferRoom(id, payload)
          setTransferOpen(false)
          setTransferPreselect(null)
        }}
      />

      <ReservationHistoryModal
        open={!!historyItem}
        reservation={historyItem}
        onClose={() => setHistoryItem(null)}
      />

      <ViewDetailModal
        open={crud.isView}
        onClose={crud.closeModal}
        title="Reservation Details"
        data={crud.item}
        fields={viewFields}
      />

      <DeleteConfirmModal
        open={!!crud.deleteTarget}
        onClose={crud.closeDelete}
        onConfirm={() => store.deleteReservation(crud.deleteTarget.id)}
        itemName={crud.deleteTarget?.guest}
      />
    </PageShell>
  )
}

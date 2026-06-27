import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, FeatureGrid, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import ReservationCalendar from '../components/ReservationCalendar'
import ReservationModal from '../components/ReservationModal'
import RoomTransferModal from '../components/RoomTransferModal'
import ReservationHistoryModal from '../components/ReservationHistoryModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { normalizeReservation } from '../utils/reservationHelpers'

const features = [
  'Reservation Calendar', 'Multi-Room Booking', 'Room Upgrade / Transfer',
  'Reservation Notes', 'Reservation History', 'Corporate', 'Waitlist',
]

const statusBadge = (s) => {
  if (s === 'Checked In') return 'success'
  if (s === 'Confirmed') return 'info'
  if (s === 'Checked Out') return 'muted'
  if (s === 'Cancelled') return 'warning'
  return 'default'
}

export default function Reservations() {
  const store = useStore()
  const crud = useCrudModal()
  const [resModal, setResModal] = useState({ open: false, item: null })
  const [transferOpen, setTransferOpen] = useState(false)
  const [transferPreselect, setTransferPreselect] = useState(null)
  const [historyItem, setHistoryItem] = useState(null)

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
      title="Reservation Management"
      description="Calendar, multi-room bookings, upgrades, notes & full audit history"
    >
      {/* <section className="panel">
        <SectionHeader title="Module Features" />
        <FeatureGrid features={features} />
      </section> */}

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
          onView={crud.openView}
          onEdit={(item) => setResModal({ open: true, item })}
          onDelete={crud.openDelete}
        />
        <div className="table-extra-actions">
          <span className="info-text">Per-row: use View for details · History available via calendar click or actions below</span>
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
        open={resModal.open}
        editItem={resModal.item}
        reservations={store.reservations}
        onClose={() => setResModal({ open: false, item: null })}
        onSubmit={(data) => {
          if (resModal.item) store.updateReservation(resModal.item.id, data)
          else store.createReservation(data)
          setResModal({ open: false, item: null })
        }}
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

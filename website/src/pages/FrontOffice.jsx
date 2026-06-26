import { useState } from 'react'
import { bookingSourcePerformance } from '../data/initialState'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, FeatureGrid, DataTable, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import NewReservationModal from '../components/NewReservationModal'
import GuestActionModal from '../components/GuestActionModal'
import RoomStatusBoard from '../components/RoomStatusBoard'
import GuestFolioModal from '../components/GuestFolioModal'
import GuestHistoryPanel from '../components/GuestHistoryPanel'
import DepositModal from '../components/DepositModal'
import GuestRequestModal from '../components/GuestRequestModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { formatINRAmount } from '../utils/frontOfficeHelpers'

const features = [
  'Guest Folio', 'Room Status Board', 'Guest History & Preferences',
  'Deposit Management', 'Guest Requests', 'Check-in', 'Check-out', 'Registration',
]

const statusVariant = (s) => {
  if (s === 'Checked In') return 'success'
  if (s === 'Confirmed') return 'info'
  if (s === 'Checked Out') return 'muted'
  return 'default'
}

const depositVariant = (s) => {
  if (s === 'Held') return 'info'
  if (s === 'Applied') return 'success'
  if (s === 'Partial') return 'warning'
  if (s === 'Refunded') return 'muted'
  return 'default'
}

const requestVariant = (s) => {
  if (s === 'Completed') return 'success'
  if (s === 'In Progress') return 'info'
  if (s === 'Scheduled') return 'warning'
  if (s === 'Open') return 'default'
  return 'muted'
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
  const depositCrud = useCrudModal()
  const requestCrud = useCrudModal()
  const [reservationModalOpen, setReservationModalOpen] = useState(false)
  const [walkInMode, setWalkInMode] = useState(false)
  const [guestAction, setGuestAction] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [folioOpen, setFolioOpen] = useState(false)
  const [folioPreselect, setFolioPreselect] = useState(null)
  const [depositOpen, setDepositOpen] = useState(false)
  const [requestOpen, setRequestOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)

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
    else if (action === 'folio') { setFolioPreselect(null); setFolioOpen(true) }
    else setGuestAction(action)
  }

  const openFolioForGuest = (reservationId) => {
    const folio = store.guestFolios.find((f) => f.reservationId === reservationId)
    setFolioPreselect(folio?.id || null)
    setFolioOpen(true)
  }

  const depositCols = [
    { key: 'id', label: 'Ref' },
    { key: 'guest', label: 'Guest' },
    { key: 'room', label: 'Room' },
    { key: 'type', label: 'Type' },
    { key: 'amount', label: 'Amount', render: (r) => formatINRAmount(r.amount) },
    { key: 'received', label: 'Received', render: (r) => formatINRAmount(r.received) },
    { key: 'balance', label: 'Pending', render: (r) => formatINRAmount(r.balance) },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={depositVariant(r.status)}>{r.status}</Badge> },
  ]

  const requestCols = [
    { key: 'id', label: 'Ref' },
    { key: 'guest', label: 'Guest' },
    { key: 'room', label: 'Room' },
    { key: 'requestType', label: 'Request' },
    { key: 'department', label: 'Routed To' },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={requestVariant(r.status)}>{r.status}</Badge> },
    { key: 'created', label: 'Created' },
  ]

  return (
    <PageShell
      title="Front Office"
      description="Guest folio, room board, history, deposits & service requests — synced with HK, Finance & CRM"
    >
      <section className="panel">
        <SectionHeader title="Module Features" />
        <FeatureGrid features={features} />
      </section>

      <section className="panel">
        <SectionHeader
          title="Room Status Board"
          subtitle="Real-time overview — Vacant, Occupied, Dirty, Reserved, Under Maintenance, Ready"
        />
        <RoomStatusBoard
          rooms={store.rooms}
          reservations={store.reservations}
          maintenanceTickets={store.maintenanceTickets}
          onRoomClick={setSelectedRoom}
        />
        {selectedRoom && (
          <p className="room-selected-info">
            <strong>{selectedRoom.displayName}</strong> — {selectedRoom.boardStatus}
            <button type="button" className="btn-link" onClick={() => setSelectedRoom(null)}>Clear</button>
          </p>
        )}
      </section>

      <div className="two-col">
        <section className="panel">
          <SectionHeader
            title="Guest Folio"
            subtitle="Room, restaurant, laundry, spa charges & payments"
            action={(
              <button type="button" className="btn btn-primary btn-sm" onClick={() => { setFolioPreselect(null); setFolioOpen(true) }}>
                Open Folio
              </button>
            )}
          />
          <DataTable
            columns={[
              { key: 'guest', label: 'Guest' },
              { key: 'room', label: 'Room' },
              { key: 'status', label: 'Status', render: (r) => <Badge variant="info">{r.status}</Badge> },
            ]}
            rows={store.guestFolios}
          />
        </section>

        <section className="panel">
          <SectionHeader
            title="Deposit Management"
            action={(
              <button type="button" className="btn btn-primary btn-sm" onClick={() => { depositCrud.closeModal(); setDepositOpen(true) }}>
                + Record Deposit
              </button>
            )}
          />
          <CrudTable
            columns={depositCols}
            rows={store.guestDeposits}
            onEdit={(item) => { depositCrud.openEdit(item); setDepositOpen(true) }}
          />
        </section>
      </div>

      <section className="panel">
        <SectionHeader title="Guest History & Preferences" subtitle="Previous stays, loyalty, preferences & special requests" />
        <GuestHistoryPanel crmCustomers={store.crmCustomers} reservations={store.reservations} />
      </section>

      <section className="panel">
        <SectionHeader
          title="Guest Requests / Service Requests"
          subtitle="Auto-routed to Housekeeping, Laundry, Maintenance, F&B & Front Office"
          action={(
            <button type="button" className="btn btn-primary btn-sm" onClick={() => { requestCrud.closeModal(); setRequestOpen(true) }}>
              + New Request
            </button>
          )}
        />
        <CrudTable
          columns={requestCols}
          rows={store.guestRequests}
          onEdit={(item) => { requestCrud.openEdit(item); setRequestOpen(true) }}
        />
      </section>

      <section className="panel">
        <SectionHeader
          title="Active Reservations"
          action={<button type="button" className="btn btn-primary" onClick={openCreate}>+ New Reservation</button>}
        />
        <CrudTable
          columns={[
            ...resColumns,
            {
              key: 'folio',
              label: 'Folio',
              render: (row) => (
                row.status === 'Checked In' ? (
                  <button type="button" className="btn-link" onClick={() => openFolioForGuest(row.id)}>View Folio</button>
                ) : '—'
              ),
            },
          ]}
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

      <GuestFolioModal
        open={folioOpen}
        folios={store.guestFolios}
        reservations={store.reservations}
        preselectedId={folioPreselect}
        onClose={() => { setFolioOpen(false); setFolioPreselect(null) }}
        onAddCharge={store.addFolioCharge}
        onAddPayment={store.addFolioPayment}
      />

      <DepositModal
        open={depositOpen}
        reservations={store.reservations}
        editItem={depositCrud.item}
        onClose={() => { setDepositOpen(false); depositCrud.closeModal() }}
        onSubmit={(data) => store.saveDeposit(data, depositCrud.item?.id)}
      />

      <GuestRequestModal
        open={requestOpen}
        reservations={store.reservations}
        editItem={requestCrud.item}
        onClose={() => { setRequestOpen(false); requestCrud.closeModal() }}
        onSubmit={(data) => store.saveGuestRequest(data, requestCrud.item?.id)}
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

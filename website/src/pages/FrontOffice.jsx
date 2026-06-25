import { useState } from 'react'
import { reservations as initialReservations, bookingSourcePerformance } from '../data/mockData'
import { PageShell, SectionHeader, FeatureGrid, DataTable, Badge } from '../components/UI'
import NewReservationModal, { nextReservationId } from '../components/NewReservationModal'
import GuestActionModal from '../components/GuestActionModal'

const features = [
  'Reservation', 'Room booking', 'Walk-in guests', 'OTA bookings',
  'Corporate bookings', 'Check-in', 'Registration cards', 'Guest profile',
  'Check-out', 'Guest billing', 'Room charges',
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

export default function FrontOffice() {
  const [reservationList, setReservationList] = useState(initialReservations)
  const [reservationModalOpen, setReservationModalOpen] = useState(false)
  const [walkInMode, setWalkInMode] = useState(false)
  const [guestAction, setGuestAction] = useState(null)

  const handleAddReservation = (data) => {
    setReservationList((prev) => [{ id: nextReservationId(prev), ...data }, ...prev])
    setReservationModalOpen(false)
    setWalkInMode(false)
  }

  const updateStatus = (id, status) => {
    setReservationList((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const openQuickAction = (label) => {
    const action = QUICK_ACTIONS[label]
    if (action === 'walk-in') {
      setWalkInMode(true)
      setReservationModalOpen(true)
    } else {
      setGuestAction(action)
    }
  }

  return (
    <PageShell
      title="Front Office (PMS)"
      description="Property Management — reservations, check-in/out, guest profiles & billing"
    >
      <section className="panel">
        <SectionHeader title="Module Features" />
        <FeatureGrid features={features} />
      </section>

      <section className="panel">
        <SectionHeader
          title="Active Reservations"
          subtitle="Walk-in, phone, email, corporate, OTA & travel agent bookings"
          action={(
            <button type="button" className="btn btn-primary" onClick={() => { setWalkInMode(false); setReservationModalOpen(true) }}>
              + New Reservation
            </button>
          )}
        />
        <DataTable
          columns={[
            { key: 'id', label: 'Ref' },
            { key: 'guest', label: 'Guest' },
            { key: 'source', label: 'Source' },
            { key: 'room', label: 'Room' },
            { key: 'checkIn', label: 'Check-in' },
            { key: 'checkOut', label: 'Check-out' },
            {
              key: 'status',
              label: 'Status',
              render: (row) => <Badge variant={statusVariant(row.status)}>{row.status}</Badge>,
            },
          ]}
          rows={reservationList}
        />
      </section>

      <div className="two-col">
        <section className="panel">
          <SectionHeader title="Quick Actions" />
          <div className="action-grid">
            {Object.keys(QUICK_ACTIONS).map((label) => (
              <button key={label} type="button" className="action-btn" onClick={() => openQuickAction(label)}>
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          <SectionHeader title="Booking Source Report" subtitle="Performance by channel" />
          <DataTable
            columns={[
              { key: 'source', label: 'Source' },
              { key: 'bookings', label: 'Bookings' },
              { key: 'revenue', label: 'Revenue' },
            ]}
            rows={bookingSourcePerformance}
            keyField="source"
          />
        </section>
      </div>

      <section className="panel panel-highlight">
        <SectionHeader title="Future: Passport Scanner" subtitle="Auto-extract guest details & fill registration form" />
        <p className="info-text">Passport scan integration planned — scan passport, auto-fill registration card fields.</p>
      </section>

      <NewReservationModal
        open={reservationModalOpen}
        onClose={() => { setReservationModalOpen(false); setWalkInMode(false) }}
        onSubmit={handleAddReservation}
        defaultSource={walkInMode ? 'Walk-in' : 'OTA'}
      />

      <GuestActionModal
        open={!!guestAction}
        type={guestAction}
        onClose={() => setGuestAction(null)}
        reservations={reservationList}
        onCheckIn={(id) => updateStatus(id, 'Checked In')}
        onCheckOut={(id) => updateStatus(id, 'Checked Out')}
        onSaveRegistration={() => {}}
      />
    </PageShell>
  )
}

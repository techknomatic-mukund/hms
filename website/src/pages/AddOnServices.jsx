import { useState } from 'react'
import { addonServices as initialBookings } from '../data/mockData'
import { PageShell, SectionHeader, FeatureGrid, DataTable, Badge } from '../components/UI'
import NewAddonBookingModal from '../components/NewAddonBookingModal'

const serviceCategories = ['Spa', 'Swimming Pool', 'Gym', 'Rental services', 'Health club services']

const statusBadge = (s) => {
  if (s === 'Completed') return 'success'
  if (s === 'Active') return 'info'
  return 'warning'
}

export default function AddOnServices() {
  const [bookingList, setBookingList] = useState(initialBookings)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <PageShell
      title="Add-on Services"
      description="Spa, pool, gym, rentals & health club — billed to guest folio"
    >
      <section className="panel">
        <SectionHeader title="Service Categories" />
        <FeatureGrid features={serviceCategories} />
      </section>

      <section className="panel">
        <SectionHeader
          title="Today's Bookings"
          action={<button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>+ New Booking</button>}
        />
        <DataTable
          columns={[
            { key: 'service', label: 'Service' },
            { key: 'guest', label: 'Guest' },
            { key: 'room', label: 'Room' },
            { key: 'time', label: 'Time' },
            { key: 'amount', label: 'Amount' },
            {
              key: 'status',
              label: 'Status',
              render: (row) => <Badge variant={statusBadge(row.status)}>{row.status}</Badge>,
            },
          ]}
          rows={bookingList}
        />
      </section>

      <section className="panel panel-highlight">
        <SectionHeader title="Guest Folio Integration" />
        <p className="info-text">
          All add-on charges post automatically to the guest folio during their stay —
          Restaurant, Laundry, Spa, Health Club, and Rentals appear on the final bill at check-out.
        </p>
      </section>

      <NewAddonBookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(booking) => {
          setBookingList((prev) => [booking, ...prev])
          setModalOpen(false)
        }}
      />
    </PageShell>
  )
}

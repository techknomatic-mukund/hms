import { useAuth } from '../../context/AuthContext'
import { useStore } from '../../context/StoreContext'
import { PageShell, SectionHeader, DataTable, Badge } from '../../components/UI'

export default function CustomerBookings() {
  const { user } = useAuth()
  const store = useStore()
  const myBookings = store.customerBookings.filter((b) => b.guest === user.name)
  const myReservations = store.reservations.filter((r) => r.guest === user.name)

  return (
    <PageShell title="My Bookings" description="Room bookings & booking history">
      <section className="panel">
        <SectionHeader title="Portal Bookings" />
        <DataTable columns={[
          { key: 'id', label: 'Ref' }, { key: 'room', label: 'Room' },
          { key: 'checkIn', label: 'Check-in' }, { key: 'checkOut', label: 'Check-out' },
          { key: 'status', label: 'Status', render: (r) => <Badge variant="info">{r.status}</Badge> },
        ]} rows={myBookings} />
      </section>
      <section className="panel">
        <SectionHeader title="ERP Reservations (synced)" />
        <DataTable columns={[
          { key: 'id', label: 'Ref' }, { key: 'source', label: 'Source' }, { key: 'room', label: 'Room' },
          { key: 'checkIn', label: 'Check-in' }, { key: 'status', label: 'Status', render: (r) => <Badge variant="success">{r.status}</Badge> },
        ]} rows={myReservations} />
      </section>
    </PageShell>
  )
}

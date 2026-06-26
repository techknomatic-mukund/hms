import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import { Badge } from '../components/UI'
import { formatDisplayDate } from '../utils/helpers'

const features = ['Room Search', 'Availability', 'New Booking', 'Modify', 'Cancel', 'Group Booking', 'Corporate', 'Waitlist', 'Advance Payment']

const statusBadge = (s) => {
  if (s === 'Checked In') return 'success'
  if (s === 'Confirmed') return 'info'
  if (s === 'Checked Out') return 'muted'
  return 'default'
}

export default function Reservations() {
  const store = useStore()

  return (
    <CrudModule
      title="Reservation Management"
      description="Manage hotel bookings — integrated with Customer Portal, Front Office, Finance & CRM"
      features={features}
      sectionTitle="All Reservations"
      createLabel="+ New Booking"
      data={store.reservations}
      moduleName="Reservation"
      columns={[
        { key: 'id', label: 'Ref' },
        { key: 'guest', label: 'Guest' },
        { key: 'source', label: 'Source' },
        { key: 'room', label: 'Room' },
        { key: 'checkIn', label: 'Check-in' },
        { key: 'checkOut', label: 'Check-out' },
        { key: 'status', label: 'Status', render: (row) => <Badge variant={statusBadge(row.status)}>{row.status}</Badge> },
      ]}
      formFields={[
        { name: 'guest', label: 'Guest Name', required: true, full: true },
        { name: 'source', label: 'Source', type: 'select', options: ['Walk-in', 'OTA', 'Corporate', 'Phone', 'Email', 'Travel Agent', 'Customer Portal'], default: 'Walk-in' },
        { name: 'room', label: 'Room', type: 'select', options: ['Standard 201', 'Standard 204', 'Deluxe 302', 'Deluxe 305', 'Suite 501', 'Suite 502'], default: 'Standard 201' },
        { name: 'checkIn', label: 'Check-in', type: 'date', required: true },
        { name: 'checkOut', label: 'Check-out', type: 'date', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['Confirmed', 'Checked In', 'Checked Out', 'Cancelled'], default: 'Confirmed' },
      ]}
      onCreate={(form) => store.createReservation({
        ...form,
        checkIn: formatDisplayDate(form.checkIn),
        checkOut: formatDisplayDate(form.checkOut),
        status: form.status || 'Confirmed',
      })}
      onUpdate={(id, form) => store.updateReservation(id, {
        ...form,
        checkIn: form.checkIn.includes('-') ? formatDisplayDate(form.checkIn) : form.checkIn,
        checkOut: form.checkOut.includes('-') ? formatDisplayDate(form.checkOut) : form.checkOut,
      })}
      onDelete={(id) => store.deleteReservation(id)}
    />
  )
}

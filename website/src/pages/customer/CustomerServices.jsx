import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useStore } from '../../context/StoreContext'
import { PageShell, SectionHeader, DataTable } from '../../components/UI'
import { formatINR } from '../../utils/helpers'

const SERVICES = [
  { id: 'spa', name: 'Spa - Aromatherapy', price: 3500 },
  { id: 'gym', name: 'Gym - Personal Trainer', price: 1200 },
  { id: 'pool', name: 'Pool - Cabana', price: 2000 },
  { id: 'laundry', name: 'Laundry - Express', price: 850 },
  { id: 'pickup', name: 'Airport Pickup', price: 1500 },
]

export default function CustomerServices() {
  const { user } = useAuth()
  const store = useStore()
  const [booked, setBooked] = useState(null)

  const book = (svc) => {
    store.customerBookService({
      service: svc.name,
      guest: user.name,
      room: '-',
      time: '10:00 AM',
      amount: formatINR(svc.price),
    })
    store.create('addonBookings', 'ADD-', 'Add-ons', {
      service: svc.name, guest: user.name, room: '-', time: '10:00 AM', amount: formatINR(svc.price), status: 'Booked',
    })
    setBooked(svc.name)
  }

  return (
    <PageShell title="Book Services" description="Restaurant, spa, gym, pool, laundry, airport pickup & more">
      <section className="panel">
        <SectionHeader title="Available Services" />
        <div className="service-grid">
          {SERVICES.map((svc) => (
            <div key={svc.id} className="service-card">
              <strong>{svc.name}</strong>
              <span>{formatINR(svc.price)}</span>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => book(svc)}>Book</button>
            </div>
          ))}
        </div>
        {booked && <p className="save-toast">{booked} booked — synced to ERP Add-ons module</p>}
      </section>
      <section className="panel">
        <SectionHeader title="My Service Bookings" />
        <DataTable columns={[{ key: 'service', label: 'Service' }, { key: 'amount', label: 'Amount' }, { key: 'status', label: 'Status' }]} rows={store.customerServiceBookings.filter((b) => b.guest === user.name)} keyField="id" />
      </section>
    </PageShell>
  )
}

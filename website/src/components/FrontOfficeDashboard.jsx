import { StatCard } from './UI'

function Section({ title, children }) {
  return (
    <section className="fo-dashboard-section panel">
      <h2 className="fo-section-title">{title}</h2>
      {children}
    </section>
  )
}

function KpiRow({ items }) {
  return (
    <div className="stats-grid fo-kpi-grid">
      {items.map((item) => (
        <StatCard key={item.label} label={item.label} value={item.value} change={item.change} trend={item.trend || 'neutral'} />
      ))}
    </div>
  )
}

export default function FrontOfficeDashboard({ metrics }) {
  const { roomAvailability, occupancyByType, arrivals, reservations, payments, inHouse, alerts } = metrics

  return (
    <div className="fo-dashboard">
      <Section title="Room Availability">
        <KpiRow items={[
          { label: 'Total', value: String(roomAvailability.total) },
          { label: 'Occupied', value: String(roomAvailability.occupied), trend: 'up' },
          { label: 'Available', value: String(roomAvailability.available), trend: 'up' },
          { label: 'Reserved', value: String(roomAvailability.reserved) },
          { label: 'Maintenance', value: String(roomAvailability.maintenance), trend: 'down' },
        ]} />
        <h3 className="fo-subsection-title">Occupancy by Room Type</h3>
        <div className="fo-type-grid">
          {occupancyByType.map(({ type, occupied, total, rate }) => (
            <div key={type} className="fo-type-card">
              <span className="fo-type-name">{type}</span>
              <strong>{total ? `${occupied}/${total}` : '—'}</strong>
              <span className="fo-type-rate">{total ? `${rate}% occupied` : 'No rooms'}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Arrivals & Departures">
        <KpiRow items={[
          { label: "Today's Check-ins", value: String(arrivals.todayCheckIns) },
          { label: "Today's Check-outs", value: String(arrivals.todayCheckOuts) },
          { label: 'Walk-ins', value: String(arrivals.walkIns) },
        ]} />
      </Section>

      <Section title="Reservations">
        <KpiRow items={[
          { label: 'Confirmed', value: String(reservations.confirmed), trend: 'up' },
          { label: 'Tentative', value: String(reservations.tentative) },
          { label: 'Cancelled', value: String(reservations.cancelled), trend: 'down' },
          { label: 'No Show', value: String(reservations.noShow), trend: 'down' },
        ]} />
      </Section>

      <Section title="Payment Status">
        <KpiRow items={[
          { label: 'Collection Today', value: payments.collectionToday, trend: 'up' },
          { label: 'Outstanding Amount', value: payments.outstanding, trend: 'down' },
          { label: 'Pending Payments', value: String(payments.pendingPayments), trend: 'down' },
        ]} />
      </Section>

      <Section title="In-House Guests">
        <KpiRow items={[
          { label: 'VIP Guests', value: String(inHouse.vipGuests) },
          { label: 'Corporate Guests', value: String(inHouse.corporateGuests) },
          { label: 'Long Stay Guests', value: String(inHouse.longStayGuests) },
        ]} />
      </Section>

      <Section title="Alerts & Actions">
        <KpiRow items={[
          { label: 'Pending Check-ins', value: String(alerts.pendingCheckIns), trend: alerts.pendingCheckIns ? 'down' : 'neutral' },
          { label: 'Pending Payments', value: String(alerts.pendingPayments), trend: alerts.pendingPayments ? 'down' : 'neutral' },
          { label: 'VIP Arrivals', value: String(alerts.vipArrivals) },
          { label: 'Maintenance Rooms', value: String(alerts.maintenanceRooms), trend: 'down' },
        ]} />
      </Section>
    </div>
  )
}

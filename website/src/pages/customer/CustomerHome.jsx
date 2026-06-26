import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { PageShell, SectionHeader, FeatureGrid } from '../../components/UI'

export default function CustomerHome() {
  const { user } = useAuth()

  return (
    <PageShell title={`Welcome, ${user?.name}`} description="Book rooms, services & manage your stay">
      <section className="panel">
        <SectionHeader title="Customer Portal" subtitle="Register → Login → Book → Pay → Feedback" />
        <FeatureGrid features={[
          'Book rooms', 'Restaurant', 'Spa & Gym', 'Pool', 'Laundry', 'Airport pickup',
          'Car rental', 'Banquet & events', 'Loyalty program', 'Online payments',
        ]} />
      </section>
      <div className="customer-actions">
        <Link to="/customer/book-room" className="customer-card"><strong>🛏️ Book a Room</strong><span>Search availability & reserve</span></Link>
        <Link to="/customer/services" className="customer-card"><strong>✨ Book Services</strong><span>Spa, gym, pool, laundry</span></Link>
        <Link to="/customer/bookings" className="customer-card"><strong>📋 My Bookings</strong><span>History & confirmations</span></Link>
        <Link to="/customer/payments" className="customer-card"><strong>💳 Payments</strong><span>Pay online & download invoices</span></Link>
      </div>
    </PageShell>
  )
}

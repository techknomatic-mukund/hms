import { useState } from 'react'
import { fnbEvents as initialEvents } from '../data/mockData'
import { PageShell, SectionHeader, FeatureGrid, DataTable, Badge } from '../components/UI'
import NewEventModal from '../components/NewEventModal'
import AddFoodCostingModal from '../components/AddFoodCostingModal'
import { formatINR, nextId } from '../utils/helpers'

const features = [
  'Restaurant operations', 'Event bookings', 'Banquets',
  'Food costing', 'Order management',
]

const initialCosting = [
  { name: 'Butter Chicken', cost: 180, sell: 420, margin: '57%' },
  { name: 'Continental Breakfast', cost: 220, sell: 680, margin: '68%' },
]

const eventBadge = (s) => {
  if (s === 'Confirmed') return 'success'
  if (s === 'In Progress') return 'info'
  return 'warning'
}

export default function FnB() {
  const [eventList, setEventList] = useState(initialEvents)
  const [costingList, setCostingList] = useState(initialCosting)
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [costingModalOpen, setCostingModalOpen] = useState(false)

  return (
    <PageShell
      title="Food & Beverage (F&B)"
      description="Restaurant operations, events, banquets & food costing"
    >
      <section className="panel">
        <SectionHeader title="Module Features" />
        <FeatureGrid features={features} />
      </section>

      <section className="panel">
        <SectionHeader
          title="Events & Banquets"
          action={<button type="button" className="btn btn-primary" onClick={() => setEventModalOpen(true)}>+ New Event Booking</button>}
        />
        <DataTable
          columns={[
            { key: 'id', label: 'Ref' },
            { key: 'name', label: 'Event' },
            { key: 'type', label: 'Type' },
            { key: 'date', label: 'Date' },
            { key: 'guests', label: 'Guests' },
            {
              key: 'status',
              label: 'Status',
              render: (row) => <Badge variant={eventBadge(row.status)}>{row.status}</Badge>,
            },
          ]}
          rows={eventList}
        />
      </section>

      <div className="two-col">
        <section className="panel">
          <SectionHeader
            title="Food Costing"
            action={<button type="button" className="btn btn-secondary btn-sm" onClick={() => setCostingModalOpen(true)}>+ Add Item</button>}
          />
          {costingList.map((item) => (
            <div key={item.name} className="costing-row">
              <span>{item.name}</span>
              <span>Cost: {formatINR(item.cost)}</span>
              <span>Sell: {formatINR(item.sell)}</span>
              <span className="margin">Margin: {item.margin}</span>
            </div>
          ))}
        </section>

        <section className="panel">
          <SectionHeader title="Order Management" />
          <p className="info-text">Integrated with POS for restaurant orders and banquet event catering workflows.</p>
        </section>
      </div>

      <NewEventModal
        open={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        onSubmit={(evt) => {
          setEventList((prev) => [{ id: nextId('EVT-', prev), ...evt }, ...prev])
          setEventModalOpen(false)
        }}
      />
      <AddFoodCostingModal
        open={costingModalOpen}
        onClose={() => setCostingModalOpen(false)}
        onSubmit={(item) => {
          setCostingList((prev) => [item, ...prev])
          setCostingModalOpen(false)
        }}
      />
    </PageShell>
  )
}

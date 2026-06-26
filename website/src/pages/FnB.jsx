import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, FeatureGrid, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import NewEventModal from '../components/NewEventModal'
import AddFoodCostingModal from '../components/AddFoodCostingModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { formatINR } from '../utils/helpers'

const features = [
  'Event Inquiry Management', 'Quotation Management', 'Booking & Confirmation',
  'Venue Allocation', 'Resource & Staff Allocation', 'Catering & Menu Management',
  'Billing & Payment Management', 'Event Execution Tracking', 'Customer Feedback Management',
  'Reports & Analytics',
]

export default function FnB() {
  const store = useStore()
  const crud = useCrudModal()
  const [eventModal, setEventModal] = useState({ open: false, item: null })
  const [costModal, setCostModal] = useState({ open: false, item: null })
  const [costingList, setCostingList] = useState([
    { id: 'FC-1', name: 'Butter Chicken', cost: 180, sell: 420, margin: '57%' },
    { id: 'FC-2', name: 'Continental Breakfast', cost: 220, sell: 680, margin: '68%' },
  ])

  const eventCols = [
    { key: 'id', label: 'Ref' },
    { key: 'name', label: 'Event' },
    { key: 'type', label: 'Type' },
    { key: 'date', label: 'Date' },
    { key: 'guests', label: 'Guests' },
    { key: 'venue', label: 'Venue', render: (r) => r.venue || '—' },
    { key: 'status', label: 'Status', render: (r) => <Badge variant="success">{r.status}</Badge> },
  ]

  const eventViewFields = [
    ...eventCols,
    { key: 'inquirySource', label: 'Inquiry Source' },
    { key: 'quotedAmount', label: 'Quoted Amount', render: (r) => (r.quotedAmount ? `₹${r.quotedAmount}` : '—') },
    { key: 'menuPackage', label: 'Menu Package' },
    { key: 'paymentStatus', label: 'Payment' },
    { key: 'executionStatus', label: 'Execution' },
    { key: 'feedbackScore', label: 'Feedback Score' },
  ]

  return (
    <PageShell title="Events & Banquet" description="Hall booking, catering, decoration & event billing">
      <section className="panel"><SectionHeader title="Module Features" /><FeatureGrid features={features} /></section>
      <section className="panel">
        <SectionHeader title="Events & Banquets" action={<button type="button" className="btn btn-primary" onClick={() => setEventModal({ open: true, item: null })}>+ New Event</button>} />
        <CrudTable columns={eventCols} rows={store.fnbEvents} onView={crud.openView} onEdit={(item) => setEventModal({ open: true, item })} onDelete={crud.openDelete} />
      </section>
      <section className="panel">
        <SectionHeader title="Food Costing" action={<button type="button" className="btn btn-secondary btn-sm" onClick={() => setCostModal({ open: true, item: null })}>+ Add Item</button>} />
        {costingList.map((item) => (
          <div key={item.id} className="costing-row">
            <span>{item.name}</span><span>Cost: {formatINR(item.cost)}</span><span>Sell: {formatINR(item.sell)}</span>
            <span className="margin">Margin: {item.margin}</span>
            <div className="crud-actions">
              <button type="button" className="btn-icon" onClick={() => setCostModal({ open: true, item })}>✏️</button>
              <button type="button" className="btn-icon btn-icon-danger" onClick={() => setCostingList((p) => p.filter((x) => x.id !== item.id))}>🗑</button>
            </div>
          </div>
        ))}
      </section>
      <NewEventModal open={eventModal.open} editItem={eventModal.item} onClose={() => setEventModal({ open: false, item: null })} onSubmit={(evt) => {
        if (eventModal.item) store.update('fnbEvents', 'F&B', eventModal.item.id, evt)
        else store.create('fnbEvents', 'EVT-', 'F&B', evt)
        setEventModal({ open: false, item: null })
      }} />
      <AddFoodCostingModal open={costModal.open} editItem={costModal.item} onClose={() => setCostModal({ open: false, item: null })} onSubmit={(item) => {
        if (costModal.item) setCostingList((p) => p.map((x) => x.id === costModal.item.id ? { ...item, id: x.id } : x))
        else setCostingList((p) => [{ ...item, id: `FC-${p.length + 1}` }, ...p])
        setCostModal({ open: false, item: null })
      }} />
      <ViewDetailModal open={crud.isView} onClose={crud.closeModal} title="Event" data={crud.item} fields={eventViewFields} />
      <DeleteConfirmModal open={!!crud.deleteTarget} onClose={crud.closeDelete} onConfirm={() => store.remove('fnbEvents', 'F&B', crud.deleteTarget.id)} itemName={crud.deleteTarget?.name} />
    </PageShell>
  )
}

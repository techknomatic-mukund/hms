import { useState, useMemo } from 'react'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import NewEventModal from '../components/NewEventModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { formatINR } from '../utils/helpers'

const balanceBadge = (status) => {
  if (status === 'Paid') return 'success'
  if (status === 'Partial') return 'warning'
  if (status === 'Pending') return 'warning'
  return 'default'
}

export default function FnB() {
  const store = useStore()
  const crud = useCrudModal()
  const staffOptions = useMemo(
    () => store.employees.filter((e) => e.dept === 'F&B').map((e) => e.name),
    [store.employees],
  )
  const [eventModal, setEventModal] = useState({ open: false, item: null })

  const eventCols = [
    { key: 'id', label: 'Ref' },
    { key: 'name', label: 'Event' },
    { key: 'type', label: 'Type' },
    { key: 'date', label: 'Date' },
    { key: 'guests', label: 'Guests' },
    { key: 'venue', label: 'Venue', render: (r) => r.venue || '—' },
    {
      key: 'balance',
      label: 'Balance',
      render: (r) => formatINR(r.balance ?? 0),
    },
    {
      key: 'balanceStatus',
      label: 'Balance Status',
      render: (r) => <Badge variant={balanceBadge(r.balanceStatus)}>{r.balanceStatus || '—'}</Badge>,
    },
    { key: 'status', label: 'Status', render: (r) => <Badge variant="success">{r.status}</Badge> },
  ]

  const eventViewFields = [
    ...eventCols,
    { key: 'inquirySource', label: 'Inquiry Source' },
    { key: 'quotedAmount', label: 'Quoted Amount', render: (r) => (r.quotedAmount ? formatINR(r.quotedAmount) : '—') },
    { key: 'quotationStatus', label: 'Quotation Status' },
    { key: 'contactPerson', label: 'Contact Person' },
    { key: 'staffAssigned', label: 'Staff Assigned' },
  ]

  return (
    <PageShell title="Events & Banquet" description="Hall booking, catering, decoration & event billing">
      <section className="panel">
        <SectionHeader title="Events & Banquets" action={<button type="button" className="btn btn-primary" onClick={() => setEventModal({ open: true, item: null })}>+ New Event</button>} />
        <CrudTable columns={eventCols} rows={store.fnbEvents} onView={crud.openView} onEdit={(item) => setEventModal({ open: true, item })} onDelete={crud.openDelete} />
      </section>
      <NewEventModal
        open={eventModal.open}
        editItem={eventModal.item}
        staff={staffOptions}
        onClose={() => setEventModal({ open: false, item: null })}
        onSubmit={(evt) => {
        if (eventModal.item) store.update('fnbEvents', 'F&B', eventModal.item.id, evt)
        else store.create('fnbEvents', 'EVT-', 'F&B', evt)
        setEventModal({ open: false, item: null })
      }}
      />
      <ViewDetailModal open={crud.isView} onClose={crud.closeModal} title="Event" data={crud.item} fields={eventViewFields} />
      <DeleteConfirmModal open={!!crud.deleteTarget} onClose={crud.closeDelete} onConfirm={() => store.remove('fnbEvents', 'F&B', crud.deleteTarget.id)} itemName={crud.deleteTarget?.name} />
    </PageShell>
  )
}

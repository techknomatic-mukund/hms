import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import NewAddonBookingModal from '../components/NewAddonBookingModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'

export default function AddOnServices() {
  const store = useStore()
  const crud = useCrudModal()
  const [modal, setModal] = useState({ open: false, item: null })

  const cols = [
    { key: 'service', label: 'Service' },
    { key: 'guest', label: 'Guest' },
    { key: 'room', label: 'Room' },
    { key: 'membership', label: 'Membership', render: (r) => r.membership || '—' },
    { key: 'time', label: 'Time' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status', render: (r) => <Badge variant="info">{r.status}</Badge> },
  ]

  return (
    <PageShell title="Membership & Add-on Services" description="Spa, gym, pool, airport pickup — billed to guest folio">
      <section className="panel">
        <SectionHeader title="Bookings" action={<button type="button" className="btn btn-primary" onClick={() => setModal({ open: true, item: null })}>+ New Booking</button>} />
        <CrudTable columns={cols} rows={store.addonBookings} keyField="id" onView={crud.openView} onEdit={(item) => setModal({ open: true, item })} onDelete={crud.openDelete} />
      </section>
      <NewAddonBookingModal
        open={modal.open}
        editItem={modal.item}
        reservations={store.reservations}
        onClose={() => setModal({ open: false, item: null })}
        onSubmit={(b) => {
          if (modal.item) store.update('addonBookings', 'Add-ons', modal.item.id, b)
          else store.create('addonBookings', 'ADD-', 'Add-ons', b)
          setModal({ open: false, item: null })
        }}
      />
      <ViewDetailModal open={crud.isView} onClose={crud.closeModal} title="Booking" data={crud.item} fields={cols} />
      <DeleteConfirmModal open={!!crud.deleteTarget} onClose={crud.closeDelete} onConfirm={() => store.remove('addonBookings', 'Add-ons', crud.deleteTarget.id)} itemName={crud.deleteTarget?.service} />
    </PageShell>
  )
}

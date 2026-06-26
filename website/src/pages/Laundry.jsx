import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, FeatureGrid, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import LaundryTrackingBoard from '../components/LaundryTrackingBoard'
import LaundryOrderModal from '../components/LaundryOrderModal'
import LaundryTagModal from '../components/LaundryTagModal'
import QualityInspectionModal from '../components/QualityInspectionModal'
import LaundryServiceHistoryPanel from '../components/LaundryServiceHistoryPanel'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { stageVariant } from '../utils/laundryHelpers'

const features = [
  'Laundry Tracking', 'Item Inventory & Tagging', 'Express Laundry Service',
  'Quality Inspection', 'Laundry Service History', 'Billing to Folio',
]

export default function Laundry() {
  const store = useStore()
  const orderCrud = useCrudModal()
  const tagCrud = useCrudModal()
  const [orderOpen, setOrderOpen] = useState(false)
  const [tagOpen, setTagOpen] = useState(false)
  const [qcOrder, setQcOrder] = useState(null)
  const [viewOrder, setViewOrder] = useState(null)

  const orderCols = [
    { key: 'id', label: 'Ref' },
    { key: 'guest', label: 'Guest' },
    { key: 'room', label: 'Room' },
    { key: 'items', label: 'Items' },
    { key: 'service', label: 'Service' },
    {
      key: 'express',
      label: 'Express',
      render: (r) => (r.express ? <Badge variant="warning">Express</Badge> : '—'),
    },
    { key: 'amount', label: 'Amount' },
    {
      key: 'stage',
      label: 'Stage',
      render: (r) => <Badge variant={stageVariant(r.stage)}>{r.stage}</Badge>,
    },
    { key: 'expectedDelivery', label: 'ETA' },
  ]

  const tagCols = [
    { key: 'tag', label: 'Tag / Barcode' },
    { key: 'orderId', label: 'Order' },
    { key: 'item', label: 'Item' },
    { key: 'guest', label: 'Guest' },
    { key: 'room', label: 'Room' },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <Badge variant={stageVariant(r.status)}>{r.status}</Badge>,
    },
  ]

  const viewFields = [
    ...orderCols,
    { key: 'pickupDate', label: 'Pickup Date' },
    { key: 'deliveredDate', label: 'Delivered', render: (r) => r.deliveredDate || '—' },
    {
      key: 'history',
      label: 'Timeline',
      render: (r) => (r.history || []).map((h) => `${h.time}: ${h.action}`).join(' · '),
    },
  ]

  return (
    <PageShell
      title="Laundry"
      description="Order tracking, item tagging, express service, QC & guest history — billed to folio"
    >
      <section className="panel">
        <SectionHeader title="Module Features" />
        <FeatureGrid features={features} />
      </section>

      <section className="panel">
        <SectionHeader
          title="Laundry Tracking"
          subtitle="Real-time pipeline — Pickup → Washing → Drying → Ironing → Quality Check → Delivery"
          action={(
            <button type="button" className="btn btn-primary btn-sm" onClick={() => { orderCrud.closeModal(); setOrderOpen(true) }}>
              + New Order
            </button>
          )}
        />
        <LaundryTrackingBoard
          orders={store.laundryOrders}
          onAdvance={store.advanceLaundryStage}
          onSelect={setViewOrder}
        />
      </section>

      <section className="panel">
        <SectionHeader title="All Orders" />
        <CrudTable
          columns={orderCols}
          rows={store.laundryOrders}
          onView={setViewOrder}
          onEdit={(item) => { orderCrud.openEdit(item); setOrderOpen(true) }}
          onDelete={(item) => orderCrud.openDelete(item)}
        />
      </section>

      <div className="two-col">
        <section className="panel">
          <SectionHeader
            title="Item Inventory & Tagging"
            subtitle="Barcode tags to prevent loss and mix-ups"
            action={(
              <button type="button" className="btn btn-primary btn-sm" onClick={() => { tagCrud.closeModal(); setTagOpen(true) }}>
                + Tag Item
              </button>
            )}
          />
          <CrudTable
            columns={tagCols}
            rows={store.laundryItemTags}
            onEdit={(item) => { tagCrud.openEdit(item); setTagOpen(true) }}
            onDelete={(item) => tagCrud.openDelete(item)}
          />
        </section>

        <section className="panel">
          <SectionHeader
            title="Quality Inspection"
            subtitle="Final check before delivery"
          />
          <div className="qc-order-list">
            {store.laundryOrders.filter((o) => o.stage === 'Quality Check').map((o) => (
              <div key={o.id} className="qc-order-card">
                <div>
                  <strong>{o.id}</strong> — {o.guest} · {o.items}
                </div>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => setQcOrder(o)}>
                  Inspect
                </button>
              </div>
            ))}
            {!store.laundryOrders.some((o) => o.stage === 'Quality Check') && (
              <p className="info-text">No orders awaiting quality inspection.</p>
            )}
          </div>
        </section>
      </div>

      <section className="panel">
        <SectionHeader title="Laundry Service History" subtitle="Past orders, billing & delivery records per guest" />
        <LaundryServiceHistoryPanel
          orders={store.laundryOrders}
          history={store.laundryServiceHistory}
          customers={store.crmCustomers}
        />
      </section>

      <LaundryOrderModal
        open={orderOpen}
        reservations={store.reservations}
        editItem={orderCrud.item}
        onClose={() => { setOrderOpen(false); orderCrud.closeModal() }}
        onSubmit={(data) => {
          if (orderCrud.item) store.update('laundryOrders', 'Laundry', orderCrud.item.id, data)
          else store.create('laundryOrders', 'LD-', 'Laundry', data)
        }}
      />

      <LaundryTagModal
        open={tagOpen}
        orders={store.laundryOrders}
        editItem={tagCrud.item}
        onClose={() => { setTagOpen(false); tagCrud.closeModal() }}
        onSubmit={(data) => {
          const tag = data.tag || `TAG-${1000 + store.laundryItemTags.length + 1}`
          const payload = { ...data, tag, id: tagCrud.item?.id || tag }
          if (tagCrud.item) store.update('laundryItemTags', 'Laundry', tagCrud.item.id, payload)
          else store.create('laundryItemTags', 'TAG-', 'Laundry', payload)
        }}
      />

      <QualityInspectionModal
        open={!!qcOrder}
        order={qcOrder}
        onClose={() => setQcOrder(null)}
        onSubmit={store.saveLaundryQualityCheck}
      />

      <ViewDetailModal
        open={!!viewOrder}
        onClose={() => setViewOrder(null)}
        title="Laundry Order Details"
        data={viewOrder}
        fields={viewFields}
      />

      <DeleteConfirmModal
        open={!!orderCrud.deleteTarget}
        onClose={orderCrud.closeDelete}
        onConfirm={() => store.remove('laundryOrders', 'Laundry', orderCrud.deleteTarget.id)}
        itemName={orderCrud.deleteTarget?.id}
      />
      <DeleteConfirmModal
        open={!!tagCrud.deleteTarget}
        onClose={tagCrud.closeDelete}
        onConfirm={() => store.remove('laundryItemTags', 'Laundry', tagCrud.deleteTarget.id)}
        itemName={tagCrud.deleteTarget?.tag}
      />
    </PageShell>
  )
}

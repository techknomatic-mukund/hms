import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, FeatureGrid, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import AddMenuItemModal from '../components/AddMenuItemModal'
import NewPosOrderModal from '../components/NewPosOrderModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { formatINR, nextId } from '../utils/helpers'

const features = ['Table Reservation', 'Food Orders', 'Billing', 'Discounts', 'Split Billing', 'Bill-to-room']

const orderBadge = (s) => {
  if (s === 'Paid') return 'success'
  if (s === 'Preparing') return 'warning'
  return 'info'
}

export default function POS() {
  const store = useStore()
  const menuCrud = useCrudModal()
  const orderCrud = useCrudModal()
  const [menuModal, setMenuModal] = useState({ open: false, item: null })
  const [orderModal, setOrderModal] = useState({ open: false, item: null })
  const [taxMode, setTaxMode] = useState('inclusive')
  const [autoTax, setAutoTax] = useState(true)
  const [taxSaved, setTaxSaved] = useState(false)

  const menuCols = [
    { key: 'name', label: 'Item' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
    { key: 'tax', label: 'Tax' },
  ]

  const orderCols = [
    { key: 'id', label: 'Order' },
    { key: 'table', label: 'Table/Room' },
    { key: 'items', label: 'Items' },
    { key: 'amount', label: 'Amount' },
    { key: 'payment', label: 'Payment' },
    { key: 'status', label: 'Status', render: (row) => <Badge variant={orderBadge(row.status)}>{row.status}</Badge> },
  ]

  return (
    <PageShell title="Restaurant & POS" description="Restaurant billing — syncs orders to Kitchen module">
      <section className="panel"><SectionHeader title="Module Features" /><FeatureGrid features={features} /></section>

      <div className="pos-layout">
        <section className="panel pos-menu">
          <SectionHeader title="Menu" action={<button type="button" className="btn btn-secondary" onClick={() => setMenuModal({ open: true, item: null })}>+ Add Item</button>} />
          <CrudTable columns={menuCols} rows={store.menuItems} keyField="id" onView={menuCrud.openView} onEdit={(item) => setMenuModal({ open: true, item })} onDelete={menuCrud.openDelete} />
        </section>
        <section className="panel pos-orders">
          <SectionHeader title="Live Orders" action={<button type="button" className="btn btn-primary btn-sm" onClick={() => setOrderModal({ open: true, item: null })}>+ New Order</button>} />
          <CrudTable columns={orderCols} rows={store.posOrders} onView={orderCrud.openView} onEdit={(item) => setOrderModal({ open: true, item })} onDelete={orderCrud.openDelete} />
        </section>
      </div>

      <section className="panel">
        <SectionHeader title="Tax Configuration" action={<button type="button" className="btn btn-primary btn-sm" onClick={() => { setTaxSaved(true); setTimeout(() => setTaxSaved(false), 2500) }}>Save Config</button>} />
        <div className="tax-config">
          <label className="tax-option"><input type="radio" name="tax" checked={taxMode === 'inclusive'} onChange={() => setTaxMode('inclusive')} /> GST — Tax inclusive</label>
          <label className="tax-option"><input type="radio" name="tax" checked={taxMode === 'exclusive'} onChange={() => setTaxMode('exclusive')} /> GST — Tax exclusive</label>
          <label className="tax-option"><input type="checkbox" checked={autoTax} onChange={(e) => setAutoTax(e.target.checked)} /> Automatic tax calculation</label>
        </div>
        {taxSaved && <p className="save-toast">Tax configuration saved</p>}
      </section>

      <AddMenuItemModal
        open={menuModal.open}
        editItem={menuModal.item}
        onClose={() => setMenuModal({ open: false, item: null })}
        onSubmit={(item) => {
          if (menuModal.item) store.update('menuItems', 'POS', menuModal.item.id, item)
          else store.create('menuItems', 'MENU-', 'POS', item)
          setMenuModal({ open: false, item: null })
        }}
      />
      <NewPosOrderModal
        open={orderModal.open}
        editItem={orderModal.item}
        onClose={() => setOrderModal({ open: false, item: null })}
        onSubmit={(order) => {
          if (orderModal.item) {
            store.update('posOrders', 'POS', orderModal.item.id, order)
          } else {
            const id = nextId('POS-', store.posOrders)
            store.create('posOrders', 'POS-', 'POS', { ...order, id }, order.items)
            store.create('kitchenOrders', 'KIT-', 'Kitchen', { orderRef: id, dish: order.items, qty: 1, station: 'Main Kitchen', status: 'Queued' }, `From ${id}`)
          }
          setOrderModal({ open: false, item: null })
        }}
      />

      <ViewDetailModal open={menuCrud.isView} onClose={menuCrud.closeModal} title="Menu Item" data={menuCrud.item} fields={menuCols} />
      <DeleteConfirmModal open={!!menuCrud.deleteTarget} onClose={menuCrud.closeDelete} onConfirm={() => store.remove('menuItems', 'POS', menuCrud.deleteTarget.id)} itemName={menuCrud.deleteTarget?.name} />
      <ViewDetailModal open={orderCrud.isView} onClose={orderCrud.closeModal} title="Order" data={orderCrud.item} fields={orderCols} />
      <DeleteConfirmModal open={!!orderCrud.deleteTarget} onClose={orderCrud.closeDelete} onConfirm={() => store.remove('posOrders', 'POS', orderCrud.deleteTarget.id)} itemName={orderCrud.deleteTarget?.id} />
    </PageShell>
  )
}

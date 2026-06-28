import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import AddMenuItemModal from '../components/AddMenuItemModal'
import NewPosOrderModal from '../components/NewPosOrderModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { nextId, formatOMR } from '../utils/helpers'

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

  const menuCols = [
    { key: 'name', label: 'Item' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
    { key: 'tax', label: 'Tax' },
  ]

  const orderCols = [
    { key: 'id', label: 'Order' },
    { key: 'table', label: 'Table/Room' },
    { key: 'waiter', label: 'Waiter' },
    { key: 'items', label: 'Items' },
    { key: 'amount', label: 'Amount' },
    { key: 'payment', label: 'Payment' },
    { key: 'status', label: 'Status', render: (row) => <Badge variant={orderBadge(row.status)}>{row.status}</Badge> },
  ]

  const orderViewFields = [
    ...orderCols,
    { key: 'subtotal', label: 'Subtotal', render: (r) => (r.subtotal != null ? formatOMR(r.subtotal) : '—') },
    { key: 'taxAmount', label: 'Tax', render: (r) => (r.taxAmount != null ? formatOMR(r.taxAmount) : '—') },
  ]

  return (
    <PageShell title="Restaurant & POS" description="Restaurant billing — syncs orders to Kitchen module">
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
        menuItems={store.menuItems}
        onClose={() => setOrderModal({ open: false, item: null })}
        onSubmit={(order) => {
          if (orderModal.item) {
            store.update('posOrders', 'POS', orderModal.item.id, order)
          } else {
            const id = nextId('POS-', store.posOrders)
            store.create('posOrders', 'POS-', 'POS', { ...order, id }, order.items)
            if (order.sendToKitchen !== false) {
              store.create('kitchenOrders', 'KIT-', 'Kitchen', {
                orderRef: id,
                dish: order.items,
                qty: 1,
                station: 'Main Kitchen',
                status: 'Queued',
                chefName: '',
                queuePriority: 'Normal',
              }, `From ${id}`)
            }
          }
          setOrderModal({ open: false, item: null })
        }}
      />

      <ViewDetailModal open={menuCrud.isView} onClose={menuCrud.closeModal} title="Menu Item" data={menuCrud.item} fields={menuCols} />
      <DeleteConfirmModal open={!!menuCrud.deleteTarget} onClose={menuCrud.closeDelete} onConfirm={() => store.remove('menuItems', 'POS', menuCrud.deleteTarget.id)} itemName={menuCrud.deleteTarget?.name} />
      <ViewDetailModal open={orderCrud.isView} onClose={orderCrud.closeModal} title="Order" data={orderCrud.item} fields={orderViewFields} />
      <DeleteConfirmModal open={!!orderCrud.deleteTarget} onClose={orderCrud.closeDelete} onConfirm={() => store.remove('posOrders', 'POS', orderCrud.deleteTarget.id)} itemName={orderCrud.deleteTarget?.id} />
    </PageShell>
  )
}

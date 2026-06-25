import { useState } from 'react'
import { posOrders as initialOrders, menuItems as initialMenu } from '../data/mockData'
import { PageShell, SectionHeader, FeatureGrid, DataTable, Badge } from '../components/UI'
import AddMenuItemModal from '../components/AddMenuItemModal'
import NewPosOrderModal from '../components/NewPosOrderModal'
import { nextId } from '../utils/helpers'

const features = [
  'Restaurant billing', 'Food orders', 'Item creation', 'Menu management',
  'Tax calculations', 'Bill-to-room', 'Direct payments', 'POS reports',
]

const orderBadge = (status) => {
  if (status === 'Paid') return 'success'
  if (status === 'Preparing') return 'warning'
  return 'info'
}

export default function POS() {
  const [menuList, setMenuList] = useState(initialMenu)
  const [orderList, setOrderList] = useState(initialOrders)
  const [menuModalOpen, setMenuModalOpen] = useState(false)
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [taxMode, setTaxMode] = useState('inclusive')
  const [autoTax, setAutoTax] = useState(true)
  const [taxSaved, setTaxSaved] = useState(false)

  const saveTaxConfig = () => {
    setTaxSaved(true)
    setTimeout(() => setTaxSaved(false), 2500)
  }

  return (
    <PageShell
      title="Point of Sale (POS)"
      description="Restaurant billing, menu management, tax calculation & outlet reports"
    >
      <section className="panel">
        <SectionHeader title="Module Features" />
        <FeatureGrid features={features} />
      </section>

      <div className="pos-layout">
        <section className="panel pos-menu">
          <SectionHeader
            title="Menu"
            action={<button type="button" className="btn btn-secondary" onClick={() => setMenuModalOpen(true)}>+ Add Item</button>}
          />
          <DataTable
            columns={[
              { key: 'name', label: 'Item' },
              { key: 'category', label: 'Category' },
              { key: 'price', label: 'Price' },
              { key: 'tax', label: 'Tax' },
            ]}
            rows={menuList}
            keyField="name"
          />
        </section>

        <section className="panel pos-orders">
          <SectionHeader
            title="Live Orders"
            subtitle="Bill-to-room & direct payments"
            action={<button type="button" className="btn btn-primary btn-sm" onClick={() => setOrderModalOpen(true)}>+ New Order</button>}
          />
          <DataTable
            columns={[
              { key: 'id', label: 'Order' },
              { key: 'table', label: 'Table/Room' },
              { key: 'items', label: 'Items' },
              { key: 'amount', label: 'Amount' },
              { key: 'payment', label: 'Payment' },
              {
                key: 'status',
                label: 'Status',
                render: (row) => <Badge variant={orderBadge(row.status)}>{row.status}</Badge>,
              },
            ]}
            rows={orderList}
          />
        </section>
      </div>

      <section className="panel">
        <SectionHeader
          title="Tax Configuration"
          action={<button type="button" className="btn btn-primary btn-sm" onClick={saveTaxConfig}>Save Config</button>}
        />
        <div className="tax-config">
          <label className="tax-option">
            <input type="radio" name="tax" checked={taxMode === 'inclusive'} onChange={() => setTaxMode('inclusive')} />
            GST — Tax inclusive pricing
          </label>
          <label className="tax-option">
            <input type="radio" name="tax" checked={taxMode === 'exclusive'} onChange={() => setTaxMode('exclusive')} />
            GST — Tax exclusive pricing
          </label>
          <label className="tax-option">
            <input type="checkbox" checked={autoTax} onChange={(e) => setAutoTax(e.target.checked)} />
            Automatic tax calculation
          </label>
        </div>
        {taxSaved && <p className="save-toast">Tax configuration saved ({taxMode === 'inclusive' ? 'inclusive' : 'exclusive'}, auto: {autoTax ? 'on' : 'off'})</p>}
      </section>

      <AddMenuItemModal
        open={menuModalOpen}
        onClose={() => setMenuModalOpen(false)}
        onSubmit={(item) => { setMenuList((prev) => [item, ...prev]); setMenuModalOpen(false) }}
      />
      <NewPosOrderModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        onSubmit={(order) => {
          setOrderList((prev) => [{ id: nextId('POS-', prev), ...order }, ...prev])
          setOrderModalOpen(false)
        }}
      />
    </PageShell>
  )
}

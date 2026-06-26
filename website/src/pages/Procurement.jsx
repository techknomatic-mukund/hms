import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import { Badge } from '../components/UI'
import { formatINR } from '../utils/helpers'

const features = ['Vendor Management', 'Purchase Request', 'Purchase Order', 'Goods Receipt', 'Quotation Comparison', 'Approval Workflow']

export default function Procurement() {
  const store = useStore()
  const key = 'purchaseOrders'

  return (
    <CrudModule
      title="Procurement"
      description="Vendor & purchase management with approval workflows"
      features={features}
      createLabel="+ New Purchase Order"
      data={store.purchaseOrders}
      moduleName="Purchase Order"
      columns={[
        { key: 'id', label: 'PO Ref' },
        { key: 'vendor', label: 'Vendor' },
        { key: 'items', label: 'Items' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status.includes('Pending') ? 'warning' : 'success'}>{r.status}</Badge> },
      ]}
      formFields={[
        { name: 'vendor', label: 'Vendor', required: true, full: true },
        { name: 'items', label: 'Items', required: true, full: true },
        { name: 'amount', label: 'Amount (₹)', type: 'number', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['Pending Approval', 'Approved', 'Received', 'Rejected'], default: 'Pending Approval' },
      ]}
      onCreate={(f) => store.create(key, 'PO-', 'Procurement', { ...f, amount: formatINR(f.amount) })}
      onUpdate={(id, f) => store.update(key, 'Procurement', id, { ...f, amount: String(f.amount).includes('₹') ? f.amount : formatINR(f.amount) })}
      onDelete={(id) => store.remove(key, 'Procurement', id)}
    />
  )
}

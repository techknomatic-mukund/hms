import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import ProcurementOrderModal from '../components/ProcurementOrderModal'
import { Badge } from '../components/UI'
import { formatINR } from '../utils/helpers'

const features = [
  'Purchase Request Management', 'Approval Workflow', 'Vendor Management',
  'Quotation Comparison', 'Purchase Order Creation', 'Purchase Order Approval',
  'Goods Receipt Note (GRN) Management', 'Quality Inspection & Verification',
  'Invoice Verification', 'Payment Processing', 'Procurement History',
  'Master Data Management', 'Procurement Analytics & Reports',
  'Inventory Integration', 'Low Stock Replenishment',
]

const viewFields = [
  { key: 'id', label: 'PO Ref' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'items', label: 'Items' },
  { key: 'amount', label: 'Amount' },
  { key: 'requestRef', label: 'Request Ref' },
  { key: 'approvalStatus', label: 'Approval' },
  { key: 'grnNumber', label: 'GRN' },
  { key: 'inspectionStatus', label: 'Inspection' },
  { key: 'paymentStatus', label: 'Payment' },
  { key: 'department', label: 'Department' },
  { key: 'reportTag', label: 'Report Tag' },
  { key: 'status', label: 'Status' },
]

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
        { key: 'department', label: 'Dept', render: (r) => r.department || '—' },
        { key: 'approvalStatus', label: 'Approval', render: (r) => r.approvalStatus || '—' },
        { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status.includes('Pending') ? 'warning' : 'success'}>{r.status}</Badge> },
      ]}
      viewFields={viewFields}
      onCreate={(f) => store.create(key, 'PO-', 'Procurement', { ...f, amount: formatINR(f.amount) })}
      onUpdate={(id, f) => store.update(key, 'Procurement', id, { ...f, amount: String(f.amount).includes('₹') ? f.amount : formatINR(f.amount) })}
      onDelete={(id) => store.remove(key, 'Procurement', id)}
      customModal={(props) => <ProcurementOrderModal {...props} />}
    />
  )
}

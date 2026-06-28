import { useMemo } from 'react'
import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import LaundryOrderModal from '../components/LaundryOrderModal'
import { Badge } from '../components/UI'
import { formatOMR, isFormattedAmount } from '../utils/helpers'

const viewFields = [
  { key: 'id', label: 'Ref' },
  { key: 'guest', label: 'Guest' },
  { key: 'room', label: 'Room' },
  { key: 'collectedBy', label: 'Collected By' },
  { key: 'employeeId', label: 'Employee ID' },
  { key: 'items', label: 'Items' },
  { key: 'service', label: 'Service' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
]

export default function Laundry() {
  const store = useStore()
  const key = 'laundryOrders'

  const laundryStaff = useMemo(
    () => store.employees.filter((e) => e.dept === 'Laundry'),
    [store.employees],
  )

  return (
    <CrudModule
      title="Laundry"
      description="Guest laundry services — billed to room folio"
      createLabel="+ New Order"
      data={store.laundryOrders}
      moduleName="Laundry Order"
      columns={[
        { key: 'id', label: 'Ref' },
        { key: 'guest', label: 'Guest' },
        { key: 'room', label: 'Room' },
        { key: 'collectedBy', label: 'Collected By', render: (r) => r.collectedBy || '—' },
        { key: 'items', label: 'Items' },
        {
          key: 'service',
          label: 'Service',
          render: (r) => (
            <Badge variant={r.expressService || r.serviceType === 'express' ? 'warning' : 'info'}>
              {r.service || (r.expressService ? 'Express Laundry' : 'Normal Laundry')}
            </Badge>
          ),
        },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status', render: (r) => <Badge variant="info">{r.status}</Badge> },
      ]}
      viewFields={viewFields}
      onCreate={(f) => store.create(key, 'LD-', 'Laundry', { ...f, amount: formatOMR(f.amount) })}
      onUpdate={(id, f) => store.update(key, 'Laundry', id, { ...f, amount: isFormattedAmount(f.amount) ? f.amount : formatOMR(f.amount) })}
      onDelete={(id) => store.remove(key, 'Laundry', id)}
      customModal={(props) => (
        <LaundryOrderModal
          {...props}
          reservations={store.reservations}
          staff={laundryStaff}
        />
      )}
    />
  )
}

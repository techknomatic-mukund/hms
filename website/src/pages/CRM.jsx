import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import { Badge } from '../components/UI'

const features = ['Customer Profiles', 'Loyalty Program', 'Feedback', 'Marketing Campaigns', 'Customer Segmentation']

export default function CRM() {
  const store = useStore()
  const key = 'crmCustomers'

  return (
    <CrudModule
      title="CRM"
      description="Customer relationship management — auto-updated on check-in/out"
      features={features}
      createLabel="+ Add Customer"
      data={store.crmCustomers}
      moduleName="Customer"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'loyalty', label: 'Loyalty', render: (r) => <Badge variant="info">{r.loyalty}</Badge> },
        { key: 'visits', label: 'Visits' },
        { key: 'lastStay', label: 'Last Stay' },
      ]}
      formFields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'email', label: 'Email', required: true },
        { name: 'loyalty', label: 'Loyalty Tier', type: 'select', options: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },
        { name: 'visits', label: 'Visits', type: 'number', default: 0 },
        { name: 'lastStay', label: 'Last Stay', default: '-' },
      ]}
      onCreate={(f) => store.create(key, 'CRM-', 'CRM', { ...f, visits: Number(f.visits) || 0 })}
      onUpdate={(id, f) => store.update(key, 'CRM', id, { ...f, visits: Number(f.visits) })}
      onDelete={(id) => store.remove(key, 'CRM', id)}
    />
  )
}

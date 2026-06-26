import { useStore } from '../context/StoreContext'
import CrudModule from '../components/CrudModule'
import CustomerModal from '../components/CustomerModal'
import { Badge } from '../components/UI'

const features = [
  'Customer Profiles', 'Loyalty Program', 'Customer Interaction History',
  'Offers & Coupon Management', 'Referral Program', 'Customer Support Tickets',
  'Birthday & Anniversary Campaigns',
]

const viewFields = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'loyalty', label: 'Loyalty', render: (r) => <Badge variant="info">{r.loyalty}</Badge> },
  { key: 'visits', label: 'Visits' },
  { key: 'lastStay', label: 'Last Stay' },
  { key: 'interactionHistory', label: 'Interaction History', render: (r) => r.interactionHistory || '—' },
  { key: 'offerType', label: 'Active Offer', render: (r) => r.offerType || 'None' },
  { key: 'couponCode', label: 'Coupon Code', render: (r) => r.couponCode || '—' },
  { key: 'referralCode', label: 'Referral Code', render: (r) => r.referralCode || '—' },
  { key: 'supportSubject', label: 'Support Ticket', render: (r) => r.supportSubject || '—' },
  { key: 'campaignType', label: 'Campaigns', render: (r) => (r.campaignOptIn ? r.campaignType : 'Opted out') },
]

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
        {
          key: 'offerType',
          label: 'Offer',
          render: (r) => (r.offerType && r.offerType !== 'None' ? r.offerType : '—'),
        },
      ]}
      viewFields={viewFields}
      onCreate={(f) => store.create(key, 'CRM-', 'CRM', f)}
      onUpdate={(id, f) => store.update(key, 'CRM', id, f)}
      onDelete={(id) => store.remove(key, 'CRM', id)}
      customModal={(props) => <CustomerModal {...props} />}
    />
  )
}

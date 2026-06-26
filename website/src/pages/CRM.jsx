import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, FeatureGrid, Badge } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import GenericCrudModal from '../components/GenericCrudModal'
import CustomerInteractionTimeline from '../components/CustomerInteractionTimeline'
import OfferCouponModal from '../components/OfferCouponModal'
import ReferralModal from '../components/ReferralModal'
import SupportTicketModal from '../components/SupportTicketModal'
import CampaignPanel from '../components/CampaignPanel'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'
import { loyaltyVariant, ticketVariant } from '../utils/crmHelpers'

const features = [
  'Customer Interaction History', 'Offers & Coupon Management', 'Referral Program',
  'Customer Support Tickets', 'Birthday & Anniversary Campaigns', 'Loyalty Program',
]

const customerFormFields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'email', label: 'Email', required: true },
  { name: 'loyalty', label: 'Loyalty Tier', type: 'select', options: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },
  { name: 'birthday', label: 'Birthday', placeholder: 'e.g. 28 Jun' },
  { name: 'anniversary', label: 'Anniversary', placeholder: 'e.g. 14 Feb' },
  { name: 'visits', label: 'Visits', type: 'number', default: 0 },
  { name: 'lastStay', label: 'Last Stay', default: '-' },
]

export default function CRM() {
  const store = useStore()
  const customerCrud = useCrudModal()
  const offerCrud = useCrudModal()
  const referralCrud = useCrudModal()
  const ticketCrud = useCrudModal()
  const [offerOpen, setOfferOpen] = useState(false)
  const [referralOpen, setReferralOpen] = useState(false)
  const [ticketOpen, setTicketOpen] = useState(false)

  const customerCols = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'loyalty', label: 'Loyalty', render: (r) => <Badge variant={loyaltyVariant(r.loyalty)}>{r.loyalty}</Badge> },
    { key: 'birthday', label: 'Birthday', render: (r) => r.birthday || '—' },
    { key: 'visits', label: 'Visits' },
    { key: 'lastStay', label: 'Last Stay' },
  ]

  const offerCols = [
    { key: 'code', label: 'Code' },
    { key: 'title', label: 'Offer' },
    { key: 'discount', label: 'Discount' },
    { key: 'type', label: 'Type' },
    { key: 'validFrom', label: 'Valid From' },
    { key: 'validTo', label: 'Valid To' },
    { key: 'uses', label: 'Uses' },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'Active' ? 'success' : 'muted'}>{r.status}</Badge> },
  ]

  const referralCols = [
    { key: 'referrer', label: 'Referrer' },
    { key: 'referredGuest', label: 'Referred Guest' },
    { key: 'referredEmail', label: 'Email' },
    { key: 'reward', label: 'Reward' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'Rewarded' ? 'success' : 'info'}>{r.status}</Badge> },
  ]

  const ticketCols = [
    { key: 'id', label: 'Ref' },
    { key: 'guest', label: 'Guest' },
    { key: 'subject', label: 'Subject' },
    { key: 'department', label: 'Department' },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={ticketVariant(r.status)}>{r.status}</Badge> },
    { key: 'created', label: 'Created' },
  ]

  return (
    <PageShell
      title="CRM"
      description="Interaction history, offers, referrals, support tickets & engagement campaigns"
    >
      <section className="panel">
        <SectionHeader title="Module Features" />
        <FeatureGrid features={features} />
      </section>

      <section className="panel">
        <SectionHeader
          title="Customer Interaction History"
          subtitle="Bookings, emails, calls, complaints, feedback & service requests"
        />
        <CustomerInteractionTimeline
          customers={store.crmCustomers}
          customerInteractions={store.customerInteractions}
          reservations={store.reservations}
          feedback={store.feedback}
          guestRequests={store.guestRequests}
          crmSupportTickets={store.crmSupportTickets}
        />
      </section>

      <div className="two-col">
        <section className="panel">
          <SectionHeader
            title="Offers & Coupon Management"
            action={(
              <button type="button" className="btn btn-primary btn-sm" onClick={() => { offerCrud.closeModal(); setOfferOpen(true) }}>
                + Create Offer
              </button>
            )}
          />
          <CrudTable
            columns={offerCols}
            rows={store.crmOffers}
            onEdit={(item) => { offerCrud.openEdit(item); setOfferOpen(true) }}
            onDelete={(item) => offerCrud.openDelete(item)}
          />
        </section>

        <section className="panel">
          <SectionHeader
            title="Referral Program"
            action={(
              <button type="button" className="btn btn-primary btn-sm" onClick={() => { referralCrud.closeModal(); setReferralOpen(true) }}>
                + Record Referral
              </button>
            )}
          />
          <CrudTable
            columns={referralCols}
            rows={store.crmReferrals}
            onEdit={(item) => { referralCrud.openEdit(item); setReferralOpen(true) }}
            onDelete={(item) => referralCrud.openDelete(item)}
          />
        </section>
      </div>

      <section className="panel">
        <SectionHeader
          title="Customer Support Tickets"
          subtitle="Complaints & requests — assign to departments and track resolution"
          action={(
            <button type="button" className="btn btn-primary btn-sm" onClick={() => { ticketCrud.closeModal(); setTicketOpen(true) }}>
              + New Ticket
            </button>
          )}
        />
        <CrudTable
          columns={ticketCols}
          rows={store.crmSupportTickets}
          onEdit={(item) => { ticketCrud.openEdit(item); setTicketOpen(true) }}
          onDelete={(item) => ticketCrud.openDelete(item)}
        />
      </section>

      <section className="panel">
        <SectionHeader
          title="Birthday & Anniversary Campaigns"
          subtitle="Personalized greetings, offers & promotional packages"
        />
        <CampaignPanel
          campaigns={store.crmCampaigns}
          customers={store.crmCustomers}
          onSend={store.sendCampaign}
        />
      </section>

      <section className="panel">
        <SectionHeader
          title="Customer Profiles"
          action={<button type="button" className="btn btn-primary" onClick={customerCrud.openCreate}>+ Add Customer</button>}
        />
        <CrudTable
          columns={customerCols}
          rows={store.crmCustomers}
          onView={customerCrud.openView}
          onEdit={customerCrud.openEdit}
          onDelete={customerCrud.openDelete}
        />
      </section>

      <GenericCrudModal
        open={customerCrud.isCreate || customerCrud.isEdit}
        onClose={customerCrud.closeModal}
        onSubmit={(form, isEdit) => {
          const payload = { ...form, visits: Number(form.visits) || 0 }
          if (isEdit) store.update('crmCustomers', 'CRM', customerCrud.item.id, payload)
          else store.create('crmCustomers', 'CRM-', 'CRM', payload)
          customerCrud.closeModal()
        }}
        title="Customer"
        fields={customerFormFields}
        editItem={customerCrud.isEdit ? customerCrud.item : null}
      />

      <OfferCouponModal
        open={offerOpen}
        editItem={offerCrud.item}
        onClose={() => { setOfferOpen(false); offerCrud.closeModal() }}
        onSubmit={(data) => {
          if (offerCrud.item) store.update('crmOffers', 'CRM', offerCrud.item.id, data)
          else store.create('crmOffers', 'OFF-', 'CRM Offer', data)
        }}
      />

      <ReferralModal
        open={referralOpen}
        customers={store.crmCustomers}
        editItem={referralCrud.item}
        onClose={() => { setReferralOpen(false); referralCrud.closeModal() }}
        onSubmit={(data) => {
          if (referralCrud.item) store.update('crmReferrals', 'CRM', referralCrud.item.id, data)
          else store.create('crmReferrals', 'REF-', 'CRM Referral', data)
        }}
      />

      <SupportTicketModal
        open={ticketOpen}
        customers={store.crmCustomers}
        editItem={ticketCrud.item}
        onClose={() => { setTicketOpen(false); ticketCrud.closeModal() }}
        onSubmit={(data) => {
          if (ticketCrud.item) store.update('crmSupportTickets', 'CRM', ticketCrud.item.id, data)
          else store.create('crmSupportTickets', 'TKT-', 'CRM Ticket', data)
        }}
      />

      <ViewDetailModal
        open={customerCrud.isView}
        onClose={customerCrud.closeModal}
        title="Customer Details"
        data={customerCrud.item}
        fields={customerCols}
      />

      <DeleteConfirmModal
        open={!!customerCrud.deleteTarget}
        onClose={customerCrud.closeDelete}
        onConfirm={() => store.remove('crmCustomers', 'CRM', customerCrud.deleteTarget.id)}
        itemName={customerCrud.deleteTarget?.name}
      />
      <DeleteConfirmModal
        open={!!offerCrud.deleteTarget}
        onClose={offerCrud.closeDelete}
        onConfirm={() => store.remove('crmOffers', 'CRM', offerCrud.deleteTarget.id)}
        itemName={offerCrud.deleteTarget?.code}
      />
      <DeleteConfirmModal
        open={!!referralCrud.deleteTarget}
        onClose={referralCrud.closeDelete}
        onConfirm={() => store.remove('crmReferrals', 'CRM', referralCrud.deleteTarget.id)}
        itemName={referralCrud.deleteTarget?.referrer}
      />
      <DeleteConfirmModal
        open={!!ticketCrud.deleteTarget}
        onClose={ticketCrud.closeDelete}
        onConfirm={() => store.remove('crmSupportTickets', 'CRM', ticketCrud.deleteTarget.id)}
        itemName={ticketCrud.deleteTarget?.subject}
      />
    </PageShell>
  )
}

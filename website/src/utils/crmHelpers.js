const TYPE_ICONS = {
  Booking: '📅',
  Email: '✉️',
  Call: '📞',
  Feedback: '⭐',
  Complaint: '⚠️',
  'Service Request': '🛎️',
  Campaign: '🎁',
  Referral: '🔗',
  Payment: '💳',
}

export function interactionIcon(type) {
  return TYPE_ICONS[type] || '•'
}

export function buildCustomerTimeline(customerName, {
  customerInteractions,
  reservations,
  feedback,
  guestRequests,
  crmSupportTickets,
}) {
  const items = []

  for (const i of customerInteractions) {
    if (i.customer === customerName) {
      items.push({ ...i, source: 'CRM' })
    }
  }

  for (const r of reservations) {
    if (r.guest === customerName) {
      items.push({
        id: `res-${r.id}`,
        customer: customerName,
        type: 'Booking',
        detail: `${r.id} — ${r.room} (${r.checkIn} – ${r.checkOut}) · ${r.status}`,
        date: r.history?.[0]?.time || r.checkIn,
        channel: r.source,
        source: 'Reservations',
      })
    }
  }

  for (const f of feedback) {
    if (f.guest === customerName) {
      items.push({
        id: `fb-${f.id}`,
        customer: customerName,
        type: 'Feedback',
        detail: `${f.rating}★ — ${f.comment}`,
        date: f.date,
        channel: f.channel,
        source: 'Feedback',
      })
    }
  }

  for (const g of guestRequests) {
    if (g.guest === customerName) {
      items.push({
        id: `gr-${g.id}`,
        customer: customerName,
        type: 'Service Request',
        detail: `${g.requestType} — ${g.status} (${g.department})`,
        date: g.created,
        channel: 'Front Office',
        source: 'Guest Requests',
      })
    }
  }

  for (const t of crmSupportTickets) {
    if (t.guest === customerName) {
      items.push({
        id: `tkt-${t.id}`,
        customer: customerName,
        type: t.status === 'Resolved' ? 'Complaint' : 'Service Request',
        detail: `${t.id}: ${t.subject} — ${t.status}`,
        date: t.created,
        channel: t.department,
        source: 'Support',
      })
    }
  }

  return items.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export const OFFER_TYPES = ['Discount Coupon', 'Seasonal Package', 'Service Offer', 'Corporate Deal', 'Loyalty Reward']

export const TICKET_DEPARTMENTS = ['Front Office', 'Housekeeping', 'Maintenance', 'Finance', 'F&B', 'Spa / Add-ons']

export const CAMPAIGN_CHANNELS = ['Email', 'SMS', 'WhatsApp', 'In-app']

export const REFERRAL_REWARDS = [
  '500 Loyalty Points', '10% Discount Coupon', 'Complimentary Breakfast',
  'Spa Voucher', 'Room Upgrade Voucher',
]

export function loyaltyVariant(tier) {
  if (tier === 'Platinum') return 'info'
  if (tier === 'Gold') return 'warning'
  if (tier === 'Silver') return 'default'
  return 'muted'
}

export function ticketVariant(status) {
  if (status === 'Resolved') return 'success'
  if (status === 'In Progress') return 'info'
  if (status === 'Open') return 'warning'
  return 'muted'
}

export function campaignVariant(status) {
  if (status === 'Sent') return 'success'
  if (status === 'Scheduled') return 'info'
  if (status === 'Pending') return 'warning'
  return 'muted'
}

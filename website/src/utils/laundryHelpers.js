export const LAUNDRY_STAGES = ['Pickup', 'Washing', 'Drying', 'Ironing', 'Quality Check', 'Delivery']

export const LAUNDRY_SERVICES = ['Wash & Iron', 'Dry Clean', 'Iron Only', 'Express Wash & Iron', 'Express Dry Clean']

export const EXPRESS_SURCHARGE = 200

export const QC_CHECKLIST = [
  'Garments clean & stain-free',
  'No damage or tears',
  'Correct items returned',
  'Ironing quality acceptable',
  'Tags match order',
]

export function stageIndex(stage) {
  const i = LAUNDRY_STAGES.indexOf(stage)
  return i >= 0 ? i : 0
}

export function stageVariant(stage) {
  if (stage === 'Delivery') return 'success'
  if (stage === 'Quality Check') return 'warning'
  if (['Washing', 'Drying', 'Ironing'].includes(stage)) return 'info'
  return 'default'
}

export function calcExpressAmount(base, express) {
  const n = typeof base === 'number' ? base : parseFloat(String(base).replace(/[^\d.]/g, ''))
  if (Number.isNaN(n)) return express ? EXPRESS_SURCHARGE : 0
  return express ? n + EXPRESS_SURCHARGE : n
}

export function guestLaundryHistory(orders, history, guestName) {
  const fromOrders = orders
    .filter((o) => o.guest === guestName && o.stage === 'Delivery')
    .map((o) => ({
      id: o.id,
      orderId: o.id,
      guest: o.guest,
      service: o.service,
      items: o.items,
      amount: o.amount,
      delivered: o.deliveredDate || o.expectedDelivery || '—',
      status: 'Delivered',
      express: o.express,
    }))
  const fromHistory = history.filter((h) => h.guest === guestName)
  const ids = new Set(fromHistory.map((h) => h.orderId))
  return [...fromHistory, ...fromOrders.filter((o) => !ids.has(o.orderId))]
}

export function nextStage(current) {
  const i = stageIndex(current)
  return i < LAUNDRY_STAGES.length - 1 ? LAUNDRY_STAGES[i + 1] : current
}

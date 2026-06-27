import {
  filterByDateRange, formatINR, getRecordDateISO, isWithinDateRange, parseAmountINR,
} from './helpers'

function parsePosDate(order) {
  return getRecordDateISO(order, ['dateIso', 'date'])
}

export function computeDashboardKpis(store, start, end) {
  const { reservations, rooms, transactions, posOrders, addonBookings } = store

  const checkIns = reservations.filter(
    (r) => r.checkInIso && isWithinDateRange(r.checkInIso, start, end),
  ).length

  const checkOuts = reservations.filter(
    (r) => r.checkOutIso && isWithinDateRange(r.checkOutIso, start, end),
  ).length

  const activeGuests = reservations.filter((r) => {
    if (r.status !== 'Checked In') return false
    const inDate = r.checkInIso
    const outDate = r.checkOutIso
    if (!inDate || !outDate) return false
    return inDate <= end && outDate >= start
  }).length

  const occupied = rooms.filter((r) => r.status === 'Occupied').length
  const occupancyRate = rooms.length ? `${Math.round((occupied / rooms.length) * 100)}%` : '0%'

  const txnInRange = filterByDateRange(transactions, start, end, (t) => getRecordDateISO(t))
  const txnRevenue = txnInRange
    .filter((t) => t.type === 'Revenue')
    .reduce((sum, t) => sum + parseAmountINR(t.amount), 0)

  const posInRange = filterByDateRange(posOrders, start, end, parsePosDate)
  const posRevenue = posInRange.reduce((sum, o) => sum + parseAmountINR(o.amount), 0)

  const addonInRange = filterByDateRange(addonBookings, start, end, (b) => getRecordDateISO(b, ['dateIso', 'date']))
  const addonRevenue = addonInRange.reduce((sum, b) => sum + parseAmountINR(b.amount), 0)

  const totalRevenue = txnRevenue + posRevenue + addonRevenue

  return [
    { label: 'Occupancy Rate', value: occupancyRate, change: `${occupied}/${rooms.length} rooms`, trend: 'up' },
    { label: 'Check-ins', value: String(checkIns), change: start === end ? 'Selected day' : 'In range', trend: 'neutral' },
    { label: 'Check-outs', value: String(checkOuts), change: start === end ? 'Selected day' : 'In range', trend: 'neutral' },
    { label: 'Revenue', value: formatINR(totalRevenue), change: 'Filtered total', trend: totalRevenue > 0 ? 'up' : 'neutral' },
    { label: 'POS Sales', value: formatINR(posRevenue), change: `${posInRange.length} orders`, trend: posRevenue > 0 ? 'up' : 'neutral' },
    { label: 'Active Guests', value: String(activeGuests), change: 'In-house', trend: 'neutral' },
    { label: 'Rooms Occupied', value: String(occupied), change: `${rooms.length} total`, trend: 'neutral' },
    { label: 'Active Reservations', value: String(reservations.filter((r) => r.status !== 'Cancelled').length), trend: 'neutral' },
  ]
}

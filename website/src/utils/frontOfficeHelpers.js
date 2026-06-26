export const ROOM_STATUS_ORDER = [
  'Vacant', 'Occupied', 'Dirty', 'Reserved', 'Under Maintenance', 'Ready',
]

export const ROOM_STATUS_VARIANT = {
  Vacant: 'success',
  Occupied: 'info',
  Dirty: 'warning',
  Reserved: 'default',
  'Under Maintenance': 'warning',
  Ready: 'success',
}

export const REQUEST_TYPES = {
  'Extra Bed': 'Housekeeping',
  'Housekeeping': 'Housekeeping',
  'Laundry': 'Laundry',
  'Airport Pickup': 'Front Office',
  'Wake-up Call': 'Front Office',
  'Maintenance': 'Maintenance',
  'Room Service': 'F&B',
  'Spa Appointment': 'Spa / Add-ons',
}

export const DEPOSIT_TYPES = ['Advance Payment', 'Security Deposit', 'Refund', 'Partial Payment']

export function roomDisplayName(room) {
  return `${room.type} ${room.number}`
}

export function deriveRoomBoardState(room, reservations, maintenanceTickets) {
  const name = roomDisplayName(room)
  const underMaint = maintenanceTickets.some((t) => {
    const open = !['Closed', 'Resolved'].includes(t.status)
    return open && (t.asset.includes(`Room ${room.number}`) || t.asset.includes(name))
  })
  if (underMaint) return 'Under Maintenance'
  if (room.status === 'Occupied') return 'Occupied'
  if (room.status === 'Dirty') return 'Dirty'
  if (room.status === 'Ready') return 'Ready'
  const reserved = reservations.some((r) =>
    ['Confirmed', 'Waitlist'].includes(r.status)
    && (r.room === name || r.rooms?.includes(name)),
  )
  if (reserved) return 'Reserved'
  return 'Vacant'
}

export function folioTotals(folio) {
  const charges = folio?.charges || []
  const payments = folio?.payments || []
  const subtotal = charges.reduce((s, c) => s + c.amount, 0)
  const tax = charges.reduce((s, c) => s + (c.tax || 0), 0)
  const total = subtotal + tax
  const paid = payments.reduce((s, p) => s + p.amount, 0)
  return { subtotal, tax, total, paid, balance: total - paid }
}

export function formatINRAmount(amount) {
  const n = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^\d.]/g, ''))
  if (Number.isNaN(n)) return '₹0'
  return `₹${n.toLocaleString('en-IN')}`
}

export function guestReservations(reservations, guestName) {
  return reservations.filter((r) => r.guest === guestName)
}

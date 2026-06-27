import { normalizeReservation } from './reservationHelpers'
import { formatINR, getRecordDateISO, parseAmountINR, todayISO } from './helpers'

const ROOM_TYPES = ['Standard', 'Deluxe', 'Executive', 'Suite']

function nightsBetween(checkInIso, checkOutIso) {
  if (!checkInIso || !checkOutIso) return 0
  const start = new Date(`${checkInIso}T00:00:00`)
  const end = new Date(`${checkOutIso}T00:00:00`)
  return Math.max(Math.round((end - start) / (1000 * 60 * 60 * 24)), 0)
}

function isVip(res) {
  if (res.guestType === 'VIP') return true
  const text = `${res.notes || ''} ${res.guest || ''}`.toLowerCase()
  return text.includes('vip')
}

function maintenanceRoomSet(maintenanceTickets) {
  const rooms = new Set()
  maintenanceTickets.forEach((t) => {
    if (!t.room || t.room === 'Common Area') return
    if (['Open', 'In Progress'].includes(t.status)) rooms.add(t.room)
  })
  return rooms
}

function reservedRoomSet(reservations) {
  const rooms = new Set()
  reservations.forEach((res) => {
    if (res.status !== 'Confirmed') return
    normalizeReservation(res).rooms.forEach((room) => rooms.add(room))
  })
  return rooms
}

export function computeFrontOfficeDashboard(store) {
  const today = todayISO()
  const reservations = store.reservations.map(normalizeReservation)
  const { rooms, maintenanceTickets, transactions } = store

  const maintenanceRooms = maintenanceRoomSet(maintenanceTickets)
  const occupied = rooms.filter((r) => r.status === 'Occupied').length
  const reservedRooms = reservedRoomSet(reservations)
  const reserved = [...reservedRooms].filter((room) => {
    const rm = rooms.find((r) => `${r.type} ${r.number}` === room || room.includes(r.number))
    return !rm || rm.status !== 'Occupied'
  }).length
  const maintenance = maintenanceRooms.size
  const total = rooms.length
  const available = Math.max(total - occupied - reserved - maintenance, 0)

  const occupancyByType = ROOM_TYPES.map((type) => {
    const typeRooms = rooms.filter((r) => r.type === type)
    const typeOccupied = typeRooms.filter((r) => r.status === 'Occupied').length
    const typeTotal = typeRooms.length
    const rate = typeTotal ? Math.round((typeOccupied / typeTotal) * 100) : 0
    return { type, occupied: typeOccupied, total: typeTotal, rate }
  })

  const todayCheckIns = reservations.filter((r) => r.checkInIso === today && r.status !== 'Cancelled').length
  const todayCheckOuts = reservations.filter((r) => r.checkOutIso === today && r.status === 'Checked In').length
  const walkIns = reservations.filter((r) => r.source === 'Walk-in' && r.checkInIso === today).length

  const confirmed = reservations.filter((r) => r.status === 'Confirmed').length
  const tentative = reservations.filter((r) => r.status === 'Tentative').length
  const cancelled = reservations.filter((r) => r.status === 'Cancelled').length
  const noShow = reservations.filter((r) => r.status === 'No Show').length

  let collectionToday = 0
  let outstanding = 0
  let pendingPayments = 0

  reservations.forEach((res) => {
    const folio = parseAmountINR(res.folioBalance ?? res.totalAmount ?? 0)
    const deposit = parseAmountINR(res.deposit?.amount ?? 0)
    const collected = res.deposit?.status === 'Collected' ? deposit : 0
    if (res.deposit?.collectedOn === today || (res.checkInIso === today && collected > 0)) {
      collectionToday += collected
    }
    if (res.paymentStatus === 'Pending' || res.deposit?.status === 'Pending') {
      pendingPayments += 1
      outstanding += Math.max(folio - (res.deposit?.status === 'Collected' ? deposit : 0), folio || deposit || 0)
    } else if (folio > deposit) {
      outstanding += folio - deposit
    }
  })

  filterByTxnToday(transactions, today).forEach((t) => {
    if (t.type === 'Revenue' && t.sourceModule === 'Front Office' && t.paymentStatus === 'Completed') {
      collectionToday += parseAmountINR(t.amount)
    }
  })

  const inHouse = reservations.filter((r) => r.status === 'Checked In')
  const vipGuests = inHouse.filter(isVip).length
  const corporateGuests = inHouse.filter((r) => r.source === 'Corporate').length
  const longStayGuests = inHouse.filter((r) => nightsBetween(r.checkInIso, r.checkOutIso) >= 7).length

  const pendingCheckIns = reservations.filter((r) => r.status === 'Confirmed' && r.checkInIso === today).length
  const vipArrivals = reservations.filter((r) => isVip(r) && r.checkInIso === today && r.status === 'Confirmed').length

  return {
    roomAvailability: { total, occupied, available, reserved, maintenance },
    occupancyByType,
    arrivals: { todayCheckIns, todayCheckOuts, walkIns },
    reservations: { confirmed, tentative, cancelled, noShow },
    payments: {
      collectionToday: formatINR(collectionToday),
      outstanding: formatINR(outstanding),
      pendingPayments,
    },
    inHouse: { vipGuests, corporateGuests, longStayGuests },
    alerts: {
      pendingCheckIns,
      pendingPayments,
      vipArrivals,
      maintenanceRooms: maintenance,
    },
  }
}

function filterByTxnToday(transactions, today) {
  return transactions.filter((t) => getRecordDateISO(t) === today)
}

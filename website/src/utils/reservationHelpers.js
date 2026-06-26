export const ROOM_OPTIONS = [
  'Standard 201', 'Standard 204', 'Deluxe 302', 'Deluxe 305', 'Suite 501', 'Suite 502',
]

export const BOOKING_SOURCES = [
  'Walk-in', 'OTA', 'Corporate', 'Phone', 'Email', 'Travel Agent', 'Customer Portal',
]

export function historyEntry(action, detail) {
  return {
    time: new Date().toLocaleString('en-GB', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    }),
    action,
    detail,
  }
}

export function parseDisplayDateToIso(display) {
  if (!display) return ''
  if (display.includes('-') && display.length >= 10) return display.slice(0, 10)
  const year = new Date().getFullYear()
  const d = new Date(`${display} ${year}`)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export function normalizeReservation(r) {
  const room = r.room || r.rooms?.[0] || ''
  return {
    ...r,
    room,
    rooms: r.rooms?.length ? r.rooms : room ? [room] : [],
    notes: r.notes || '',
    history: r.history || [],
    checkInIso: r.checkInIso || parseDisplayDateToIso(r.checkIn),
    checkOutIso: r.checkOutIso || parseDisplayDateToIso(r.checkOut),
    isMultiRoom: (r.rooms?.length || 1) > 1,
  }
}

export function reservationSpansDate(res, isoDate) {
  const norm = normalizeReservation(res)
  if (!norm.checkInIso || !norm.checkOutIso) return false
  if (norm.checkOutIso < norm.checkInIso) return false
  if (norm.checkInIso === norm.checkOutIso) return isoDate === norm.checkInIso
  return isoDate >= norm.checkInIso && isoDate < norm.checkOutIso
}

/** True when two stays share at least one occupied day (checkout day is free for multi-day stays). */
export function dateRangesOverlap(checkInA, checkOutA, checkInB, checkOutB) {
  if (!checkInA || !checkOutA || !checkInB || !checkOutB) return false
  if (checkOutA < checkInA || checkOutB < checkInB) return false
  if (checkInA === checkOutA) {
    if (checkInB === checkOutB) return checkInA === checkInB
    return checkInA >= checkInB && checkInA < checkOutB
  }
  if (checkInB === checkOutB) return checkInB >= checkInA && checkInB < checkOutA
  return checkInA < checkOutB && checkOutA > checkInB
}

const ACTIVE_STATUSES = new Set(['Confirmed', 'Checked In', 'Waitlist'])

/** room name → list of conflicting bookings for the given date range */
export function getRoomBookingConflicts(reservations, checkInIso, checkOutIso, excludeId = null) {
  const conflicts = {}
  if (!checkInIso || !checkOutIso || checkOutIso < checkInIso) return conflicts

  for (const res of reservations) {
    if (excludeId && res.id === excludeId) continue
    if (!ACTIVE_STATUSES.has(res.status)) continue
    const norm = normalizeReservation(res)
    if (!dateRangesOverlap(checkInIso, checkOutIso, norm.checkInIso, norm.checkOutIso)) continue

    for (const room of norm.rooms) {
      if (!conflicts[room]) conflicts[room] = []
      conflicts[room].push({
        id: res.id,
        guest: res.guest,
        checkIn: res.checkIn,
        checkOut: res.checkOut,
      })
    }
  }
  return conflicts
}

export function roomConflictLabel(conflict) {
  return `This room is booked on that day (${conflict.checkIn} – ${conflict.checkOut}, ${conflict.guest})`
}

export function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function startOfWeek(iso) {
  const d = new Date(`${iso}T00:00:00`)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}

export function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function formatIsoDisplay(iso) {
  if (!iso) return ''
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

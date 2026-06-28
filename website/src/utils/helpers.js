export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function monthStartISO(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}-01`
}

export function currentMonthRange() {
  return { start: monthStartISO(), end: todayISO() }
}

export function getRangeLabel(start, end) {
  const { start: monthStart, end: today } = currentMonthRange()
  if (start === monthStart && end === today) return 'This month'
  if (start === end) return 'Today'
  return 'Selected range'
}

export function parseAmount(value) {
  return parseFloat(String(value).replace(/[^\d.]/g, '')) || 0
}

/** @deprecated use parseAmount */
export const parseAmountINR = parseAmount

export function isFormattedAmount(value) {
  return /OMR|₹/i.test(String(value))
}

export function formatOMR(amount) {
  const num = typeof amount === 'number' ? amount : parseAmount(amount)
  if (Number.isNaN(num)) return 'OMR 0.00'
  return `OMR ${num.toLocaleString('en-OM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** @deprecated use formatOMR */
export const formatINR = formatOMR

export function parseDisplayDateToISO(dateStr, fallbackYear = new Date().getFullYear()) {
  if (!dateStr) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
  const isoCandidate = dateStr.includes('T') ? dateStr.slice(0, 10) : null
  if (isoCandidate && /^\d{4}-\d{2}-\d{2}$/.test(isoCandidate)) return isoCandidate
  const parsed = new Date(`${dateStr} ${fallbackYear}`)
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10)
  return null
}

export function getRecordDateISO(record, fields = ['dateIso', 'date']) {
  for (const field of fields) {
    if (!record?.[field]) continue
    const iso = parseDisplayDateToISO(record[field])
    if (iso) return iso
  }
  return null
}

export function isWithinDateRange(iso, start, end) {
  if (!iso || !start || !end) return false
  return iso >= start && iso <= end
}

export function filterByDateRange(items, start, end, getIso = (item) => getRecordDateISO(item)) {
  if (!start || !end) return items
  return items.filter((item) => {
    const iso = getIso(item)
    return iso && isWithinDateRange(iso, start, end)
  })
}

export function formatDisplayDate(dateStr) {
  if (!dateStr) return ''
  const iso = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function todayDisplay() {
  return formatDisplayDate(new Date().toISOString().slice(0, 10))
}

export function nextId(prefix, items, idField = 'id') {
  const nums = items.map((item) => {
    const raw = String(item[idField] ?? '')
    const num = parseInt(raw.replace(/\D/g, ''), 10)
    return Number.isNaN(num) ? 0 : num
  })
  const max = nums.length ? Math.max(...nums) : 0
  return `${prefix}${max + 1}`
}

export function calcMargin(cost, sell) {
  const c = parseFloat(cost)
  const s = parseFloat(sell)
  if (!s || Number.isNaN(c) || Number.isNaN(s)) return '0%'
  return `${Math.round(((s - c) / s) * 100)}%`
}

export function formatTime12(time24) {
  if (!time24) return ''
  const [h, m] = time24.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${h12}:${m} ${ampm}`
}

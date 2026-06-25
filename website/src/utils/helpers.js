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

export function formatINR(amount) {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^\d.]/g, ''))
  if (Number.isNaN(num)) return '₹0'
  return `₹${num.toLocaleString('en-IN')}`
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

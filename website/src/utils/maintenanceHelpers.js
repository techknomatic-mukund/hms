export const MAINTENANCE_CATEGORIES = ['HVAC', 'Elevator', 'Generator', 'Plumbing', 'Electrical', 'Fire Safety', 'Room Equipment']

export const SCHEDULE_FREQUENCIES = ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Semi-annual', 'Annual']

export const WO_TYPES = ['Corrective', 'Preventive', 'Emergency', 'Inspection']

export function ticketVariant(status) {
  if (status === 'Resolved' || status === 'Closed') return 'success'
  if (status === 'In Progress') return 'info'
  if (status === 'Open') return 'warning'
  return 'muted'
}

export function priorityVariant(priority) {
  if (priority === 'High' || priority === 'Urgent') return 'warning'
  if (priority === 'Medium') return 'info'
  return 'default'
}

export function stockVariant(status) {
  if (status === 'Low Stock') return 'warning'
  if (status === 'Out of Stock') return 'warning'
  return 'success'
}

export function scheduleVariant(status) {
  if (status === 'Due Soon' || status === 'Overdue') return 'warning'
  if (status === 'Completed') return 'success'
  return 'info'
}

export function autoAssignTechnician(technicians) {
  const available = technicians.filter((t) => t.status === 'Active')
  if (!available.length) return 'Maintenance Team'
  return [...available].sort((a, b) => a.workload - b.workload)[0].name
}

export function assetHistoryForAsset(history, assetName) {
  return history.filter((h) => h.asset === assetName || h.asset.includes(assetName))
}

export function maintenanceCostMetrics(tickets, history, spareParts) {
  const parseAmt = (s) => parseFloat(String(s).replace(/[^\d.]/g, '')) || 0
  const woLabor = tickets.reduce((sum, t) => sum + (t.laborCost || 0), 0)
  const woParts = tickets.reduce((sum, t) => sum + (t.partsCost || 0), 0)
  const histCost = history.reduce((sum, h) => sum + parseAmt(h.cost), 0)
  const lowStock = spareParts.filter((p) => p.status === 'Low Stock' || p.status === 'Out of Stock').length
  const openOrders = tickets.filter((t) => !['Resolved', 'Closed'].includes(t.status)).length
  const total = woLabor + woParts + histCost
  return {
    totalCost: total,
    laborCost: woLabor,
    partsCost: woParts + histCost * 0.3,
    openOrders,
    lowStockParts: lowStock,
    completedThisMonth: history.length + tickets.filter((t) => t.status === 'Resolved').length,
  }
}

export function formatMaintINR(n) {
  return `₹${n.toLocaleString('en-IN')}`
}

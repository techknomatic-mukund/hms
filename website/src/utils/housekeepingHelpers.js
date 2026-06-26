export const TASK_TYPES = ['Daily', 'Checkout', 'Turndown', 'Setup', 'Deep Clean', 'Inspection']

export const SHIFTS = ['Morning (7 AM – 3 PM)', 'Evening (3 PM – 11 PM)', 'Night (11 PM – 7 AM)']

export const AMENITY_ITEMS = [
  'Towels', 'Shampoo', 'Soap', 'Dental kit', 'Water bottles',
  'Bathrobes', 'Slippers', 'Minibar snacks', 'Extra pillows', 'Coffee/tea sachets',
]

export const DEEP_CLEAN_FREQUENCIES = ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly']

export function taskStatusVariant(status) {
  if (status === 'Completed') return 'success'
  if (status === 'In Progress') return 'info'
  if (status === 'Scheduled') return 'default'
  if (status === 'Pending') return 'warning'
  return 'muted'
}

export function hkPerformanceMetrics(tasks, rooms) {
  const completed = tasks.filter((t) => t.status === 'Completed').length
  const pending = tasks.filter((t) => ['Pending', 'Scheduled'].includes(t.status)).length
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length
  const dirtyRooms = rooms.filter((r) => r.status === 'Dirty').length
  const withTime = tasks.filter((t) => t.estimatedMins)
  const avgTime = withTime.length
    ? Math.round(withTime.reduce((s, t) => s + t.estimatedMins, 0) / withTime.length)
    : 0
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0
  return { completed, pending, inProgress, dirtyRooms, avgTime, completionRate, totalTasks: tasks.length }
}

export function autoAssignStaff(staff) {
  const available = staff.filter((s) => s.status === 'Active')
  if (!available.length) return 'Unassigned'
  return [...available].sort((a, b) => a.workload - b.workload)[0].name
}

export function checklistForRoomType(roomType, checklists) {
  return checklists.find((c) => c.roomType === roomType) || checklists[0]
}

export function roomTypeFromLabel(roomLabel) {
  if (!roomLabel) return 'Standard'
  if (roomLabel.startsWith('Suite')) return 'Suite'
  if (roomLabel.startsWith('Deluxe')) return 'Deluxe'
  return 'Standard'
}

export function deepCleanVariant(status) {
  if (status === 'Due Soon') return 'warning'
  if (status === 'Overdue') return 'warning'
  if (status === 'Completed') return 'success'
  return 'info'
}

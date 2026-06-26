export const ROLES = {
  customer: { label: 'Customer', portal: 'customer' },
  receptionist: { label: 'Receptionist', portal: 'erp' },
  housekeeping: { label: 'Housekeeping Staff', portal: 'erp' },
  restaurant: { label: 'Restaurant Staff', portal: 'erp' },
  finance: { label: 'Finance Executive', portal: 'erp' },
  hr: { label: 'HR Executive', portal: 'erp' },
  manager: { label: 'General Manager', portal: 'erp' },
  admin: { label: 'System Administrator', portal: 'erp' },
}

export const DEMO_USERS = [
  { email: 'customer@demo.com', password: 'demo', role: 'customer', name: 'Demo Customer' },
  { email: 'reception@demo.com', password: 'demo', role: 'receptionist', name: 'Anita Verma' },
  { email: 'admin@demo.com', password: 'demo', role: 'admin', name: 'System Admin' },
  { email: 'manager@demo.com', password: 'demo', role: 'manager', name: 'General Manager' },
]

export const PERMISSIONS = ['View', 'Create', 'Update', 'Delete', 'Approve', 'Export']

export function roleCan(role, action) {
  if (role === 'admin' || role === 'manager') return true
  if (role === 'customer') return ['View', 'Create'].includes(action)
  if (role === 'receptionist') return ['View', 'Create', 'Update', 'Export'].includes(action)
  if (role === 'housekeeping') return ['View', 'Create', 'Update'].includes(action)
  if (role === 'restaurant') return ['View', 'Create', 'Update', 'Delete'].includes(action)
  if (role === 'finance') return ['View', 'Create', 'Update', 'Approve', 'Export'].includes(action)
  if (role === 'hr') return ['View', 'Create', 'Update', 'Approve', 'Export'].includes(action)
  return ['View'].includes(action)
}

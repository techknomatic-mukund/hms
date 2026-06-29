/** All ERP module ids used for RBAC */
export const ALL_ERP_MODULES = [
  'dashboard', 'integration', 'reservations', 'front-office', 'housekeeping', 'laundry',
  'maintenance', 'addons', 'pos', 'kitchen', 'fnb', 'inventory', 'procurement',
  'finance', 'hrms', 'crm', 'feedback', 'reports', 'admin',
]

const ROUTE_SEGMENT_MODULE = {
  integration: 'integration',
  reservations: 'reservations',
  'front-office': 'front-office',
  housekeeping: 'housekeeping',
  laundry: 'laundry',
  maintenance: 'maintenance',
  addons: 'addons',
  pos: 'pos',
  kitchen: 'kitchen',
  fnb: 'fnb',
  inventory: 'inventory',
  procurement: 'procurement',
  finance: 'finance',
  hrms: 'hrms',
  crm: 'crm',
  feedback: 'feedback',
  reports: 'reports',
  admin: 'admin',
}

/** Role → allowed module ids. Admin gets all via '*'. */
const ROLE_MODULES = {
  admin: '*',
  manager: ['dashboard', 'finance', 'hrms', 'reports', 'inventory', 'procurement'],
  maintenance: ['dashboard', 'maintenance', 'inventory'],
  operations: ['dashboard', 'reservations', 'housekeeping', 'laundry', 'maintenance', 'addons', 'pos', 'fnb'],
  backoffice: ['dashboard', 'finance', 'hrms', 'inventory', 'procurement', 'reports'],
  customer: [],
}

export const ROLES = {
  customer: { label: 'Customer', portal: 'customer', tier: 'External' },
  admin: { label: 'Director / Admin', portal: 'erp', tier: 'Executive' },
  manager: { label: 'General Manager', portal: 'erp', tier: 'Executive' },
  maintenance: { label: 'Maintenance', portal: 'erp', tier: 'Operations' },
  operations: { label: 'Operations', portal: 'erp', tier: 'Operations' },
  backoffice: { label: 'Back Office', portal: 'erp', tier: 'Support' },
}

export const DEMO_USERS = [
  { email: 'customer@demo.com', password: 'demo', role: 'customer', name: 'Demo Customer' },
  { email: 'admin@demo.com', password: 'demo', role: 'admin', name: 'Director Admin' },
  { email: 'manager@demo.com', password: 'demo', role: 'manager', name: 'General Manager' },
  { email: 'maintenance@demo.com', password: 'demo', role: 'maintenance', name: 'Karan Singh' },
  { email: 'operations@demo.com', password: 'demo', role: 'operations', name: 'Sneha Patel' },
  { email: 'backoffice@demo.com', password: 'demo', role: 'backoffice', name: 'Finance Executive' },
]

export const PERMISSIONS = ['View', 'Create', 'Update', 'Delete', 'Approve', 'Export']

export function roleHasModule(role, moduleId) {
  if (!role || !moduleId) return false
  const allowed = ROLE_MODULES[role]
  if (!allowed) return false
  if (allowed === '*') return true
  return allowed.includes(moduleId)
}

export function getModulesForRole(role) {
  const allowed = ROLE_MODULES[role]
  if (allowed === '*') return ALL_ERP_MODULES
  return allowed || []
}

export function getModuleForPath(pathname) {
  if (pathname === '/erp' || pathname === '/erp/') return 'dashboard'
  const segment = pathname.replace(/^\/erp\/?/, '').split('/')[0]
  return ROUTE_SEGMENT_MODULE[segment] || null
}

export function getDefaultErpPath(role) {
  const map = {
    admin: '/erp',
    manager: '/erp/finance',
    maintenance: '/erp/maintenance',
    operations: '/erp/reservations',
    backoffice: '/erp/finance',
  }
  const path = map[role]
  if (path && roleHasModule(role, getModuleForPath(path))) return path
  const first = getModulesForRole(role).find((m) => m !== 'dashboard')
  if (first) {
    const mod = ALL_ERP_MODULES.includes(first)
    const paths = Object.entries(ROUTE_SEGMENT_MODULE).find(([, id]) => id === first)
    if (paths) return `/erp/${paths[0]}`
  }
  return '/erp'
}

export function roleCan(role, action) {
  if (role === 'admin') return true
  if (role === 'manager') return ['View', 'Approve', 'Export'].includes(action)
  if (role === 'maintenance') return ['View', 'Create', 'Update', 'Approve'].includes(action)
  if (role === 'operations') return ['View', 'Create', 'Update', 'Export'].includes(action)
  if (role === 'backoffice') return ['View', 'Create', 'Update', 'Export'].includes(action)
  if (role === 'customer') return ['View', 'Create'].includes(action)
  return action === 'View'
}

/** GM (General Manager) is the sole approver for inventory, finance, HRMS leave & procurement. */
export function canGmApprove(role) {
  return role === 'manager'
}

/** Maintenance team approves or rejects requests raised by Operations. */
export function canMaintenanceApprove(role) {
  return role === 'maintenance' || role === 'admin'
}

export function isOperationsRequester(role) {
  return role === 'operations'
}

export function canAddNotification(role) {
  return role === 'operations'
}

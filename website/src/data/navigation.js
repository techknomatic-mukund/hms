import { roleHasModule } from './roles'

export const erpModuleGroups = [
  {
    label: 'Overview',
    modules: [
      { id: 'dashboard', path: '/erp', label: 'Dashboard', icon: '📊', end: true },
    ],
  },
  {
    label: 'Guest Operations',
    modules: [
      { id: 'reservations', path: '/erp/reservations', label: 'Front Office', icon: '📅' },
    ],
  },
  {
    label: 'Rooms & Services',
    modules: [
      { id: 'housekeeping', path: '/erp/housekeeping', label: 'Housekeeping', icon: '🧹' },
      { id: 'laundry', path: '/erp/laundry', label: 'Laundry', icon: '👔' },
      { id: 'maintenance', path: '/erp/maintenance', label: 'Maintenance', icon: '🔧' },
      { id: 'maintenance-inventory', path: '/erp/maintenance-inventory', label: 'Maintenance Inventory', icon: '🧰' },
      { id: 'addons', path: '/erp/addons', label: 'Membership & Add-ons', icon: '💆' },
    ],
  },
  {
    label: 'F&B',
    modules: [
      { id: 'pos', path: '/erp/pos', label: 'Restaurant & POS', icon: '🍽️' },
      { id: 'fnb', path: '/erp/fnb', label: 'Events & Banquet', icon: '🥂' },
    ],
  },
  {
    label: 'Supply Chain',
    modules: [
      { id: 'inventory', path: '/erp/inventory', label: 'Inventory', icon: '📦' },
      { id: 'procurement', path: '/erp/procurement', label: 'Procurement', icon: '🛒' },
    ],
  },
  {
    label: 'Back Office',
    modules: [
      { id: 'finance', path: '/erp/finance', label: 'Finance', icon: '💰' },
      { id: 'hrms', path: '/erp/hrms', label: 'HRMS', icon: '👥' },
      // { id: 'reports', path: '/erp/reports', label: 'Reports', icon: '📈' },
      // { id: 'admin', path: '/erp/admin', label: 'Administration', icon: '⚙️' },
    ],
  },
]

export const customerModules = [
  { id: 'home', path: '/customer', label: 'Home', icon: '🏠', end: true },
  { id: 'book-room', path: '/customer/book-room', label: 'Book Room', icon: '🛏️' },
  { id: 'services', path: '/customer/services', label: 'Services', icon: '✨' },
  { id: 'bookings', path: '/customer/bookings', label: 'My Bookings', icon: '📋' },
  { id: 'payments', path: '/customer/payments', label: 'Payments', icon: '💳' },
  { id: 'feedback', path: '/customer/feedback', label: 'Feedback', icon: '⭐' },
]

export const flatErpModules = erpModuleGroups.flatMap((g) => g.modules)

export function getNavGroupsForRole(role) {
  return erpModuleGroups
    .map((group) => ({
      ...group,
      modules: group.modules.filter((mod) => roleHasModule(role, mod.id)),
    }))
    .filter((group) => group.modules.length > 0)
}

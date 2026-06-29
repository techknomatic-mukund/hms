import Dashboard from './pages/Dashboard'
import IntegrationFlow from './pages/IntegrationFlow'
import Reservations from './pages/Reservations'
import FrontOffice from './pages/FrontOffice'
import Housekeeping from './pages/Housekeeping'
import Laundry from './pages/Laundry'
import Maintenance from './pages/Maintenance'
import MaintenanceInventory from './pages/MaintenanceInventory'
import POS from './pages/POS'
import Kitchen from './pages/Kitchen'
import FnB from './pages/FnB'
import Inventory from './pages/Inventory'
import Procurement from './pages/Procurement'
import Finance from './pages/Finance'
import HRMS from './pages/HRMS'
import CRM from './pages/CRM'
import AddOnServices from './pages/AddOnServices'
import Feedback from './pages/Feedback'
import Reports from './pages/Reports'
import Admin from './pages/Admin'
import CustomerHome from './pages/customer/CustomerHome'
import CustomerBookRoom from './pages/customer/CustomerBookRoom'
import CustomerServices from './pages/customer/CustomerServices'
import CustomerBookings from './pages/customer/CustomerBookings'
import CustomerPayments from './pages/customer/CustomerPayments'
import CustomerFeedback from './pages/customer/CustomerFeedback'

export const erpRoutes = [
  { path: '', Component: Dashboard },
  { path: 'integration', Component: IntegrationFlow },
  { path: 'reservations', Component: Reservations },
  { path: 'front-office', Component: FrontOffice },
  { path: 'housekeeping', Component: Housekeeping },
  { path: 'laundry', Component: Laundry },
  { path: 'maintenance', Component: Maintenance },
  { path: 'maintenance-inventory', Component: MaintenanceInventory },
  { path: 'pos', Component: POS },
  { path: 'kitchen', Component: Kitchen },
  { path: 'fnb', Component: FnB },
  { path: 'inventory', Component: Inventory },
  { path: 'procurement', Component: Procurement },
  { path: 'finance', Component: Finance },
  { path: 'hrms', Component: HRMS },
  { path: 'crm', Component: CRM },
  { path: 'addons', Component: AddOnServices },
  { path: 'feedback', Component: Feedback },
  { path: 'reports', Component: Reports },
  { path: 'admin', Component: Admin },
]

export const customerRoutes = [
  { path: '', Component: CustomerHome },
  { path: 'book-room', Component: CustomerBookRoom },
  { path: 'services', Component: CustomerServices },
  { path: 'bookings', Component: CustomerBookings },
  { path: 'payments', Component: CustomerPayments },
  { path: 'feedback', Component: CustomerFeedback },
]

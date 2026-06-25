import Dashboard from './pages/Dashboard'
import FrontOffice from './pages/FrontOffice'
import POS from './pages/POS'
import Finance from './pages/Finance'
import HRMS from './pages/HRMS'
import FnB from './pages/FnB'
import AddOnServices from './pages/AddOnServices'
import Feedback from './pages/Feedback'
import Reports from './pages/Reports'

export const routes = [
  { path: '/', Component: Dashboard },
  { path: '/front-office', Component: FrontOffice },
  { path: '/pos', Component: POS },
  { path: '/finance', Component: Finance },
  { path: '/hrms', Component: HRMS },
  { path: '/fnb', Component: FnB },
  { path: '/addons', Component: AddOnServices },
  { path: '/feedback', Component: Feedback },
  { path: '/reports', Component: Reports },
]

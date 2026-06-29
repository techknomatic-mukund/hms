import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDefaultErpPath, getModuleForPath, roleHasModule } from '../data/roles'

export default function ErpRouteGuard({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  const moduleId = getModuleForPath(location.pathname)

  if (moduleId && !roleHasModule(user?.role, moduleId)) {
    return <Navigate to={getDefaultErpPath(user?.role)} replace />
  }

  return children
}

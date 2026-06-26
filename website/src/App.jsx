import { Navigate, Route, Routes } from 'react-router-dom'
import ErpLayout from './layouts/ErpLayout'
import CustomerLayout from './layouts/CustomerLayout'
import Login from './pages/Login'
import { erpRoutes, customerRoutes } from './routes'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/erp" element={<ErpLayout />}>
        {erpRoutes.map(({ path, Component }) => (
          <Route key={path || 'index'} index={path === ''} path={path || undefined} element={<Component />} />
        ))}
      </Route>

      <Route path="/customer" element={<CustomerLayout />}>
        {customerRoutes.map(({ path, Component }) => (
          <Route key={path || 'index'} index={path === ''} path={path || undefined} element={<Component />} />
        ))}
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

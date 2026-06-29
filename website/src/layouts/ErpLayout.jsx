import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getNavGroupsForRole } from '../data/navigation'
import { getDefaultErpPath, getModuleForPath, roleHasModule, ROLES } from '../data/roles'
import ErpRouteGuard from '../components/ErpRouteGuard'

export default function ErpLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (ROLES[user.role]?.portal !== 'erp') {
    return <Navigate to="/customer" replace />
  }

  const navGroups = getNavGroupsForRole(user.role)
  const moduleId = getModuleForPath(location.pathname)
  if (moduleId && !roleHasModule(user.role, moduleId)) {
    return <Navigate to={getDefaultErpPath(user.role)} replace />
  }

  const currentLabel = navGroups
    .flatMap((g) => g.modules)
    .find((m) => location.pathname === m.path || (m.end && location.pathname === m.path))?.label
    ?? 'Hotel ERP'

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <NavLink to={getDefaultErpPath(user.role)} className="sidebar-brand" onClick={() => setSidebarOpen(false)}>
          <span className="brand-icon">🏨</span>
          <div>
            <strong>Hotel ERP</strong>
            <small>Employee Portal</small>
          </div>
        </NavLink>

        <nav className="sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.label} className="nav-group">
              <span className="nav-group-label">{group.label}</span>
              {group.modules.map((mod) => (
                <NavLink
                  key={mod.id}
                  to={mod.path}
                  end={mod.end}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="nav-icon">{mod.icon}</span>
                  <span className="nav-label">{mod.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>{user.name}</p>
          <small>{ROLES[user.role]?.label}</small>
        </div>
      </aside>

      {sidebarOpen && (
        <button type="button" className="sidebar-overlay" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="main">
        <header className="topbar">
          <button type="button" className="menu-toggle" aria-label="Toggle menu" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <span className="topbar-title">{currentLabel}</span>
          <div className="topbar-actions">
            <span className="sync-status">● Central DB — Synced</span>
            {user.role === 'admin' && (
              <NavLink to="/customer" className="btn btn-secondary btn-sm">Customer Portal</NavLink>
            )}
            <button type="button" className="btn btn-secondary btn-sm" onClick={logout}>Logout</button>
          </div>
        </header>
        <main className="content">
          <ErpRouteGuard>
            <Outlet />
          </ErpRouteGuard>
        </main>
      </div>
    </div>
  )
}

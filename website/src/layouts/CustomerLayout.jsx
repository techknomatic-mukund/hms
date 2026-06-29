import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { customerModules } from '../data/navigation'
import NotificationPanel from '../components/NotificationPanel'

export default function CustomerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const currentLabel = customerModules.find((m) =>
    location.pathname === m.path || (m.end && location.pathname === m.path))?.label ?? 'Customer Portal'

  return (
    <div className="app customer-app">
      <aside className={`sidebar sidebar-customer ${sidebarOpen ? 'open' : ''}`}>
        <NavLink to="/customer" className="sidebar-brand" onClick={() => setSidebarOpen(false)}>
          <span className="brand-icon">🌐</span>
          <div>
            <strong>Guest Portal</strong>
            <small>Book & Manage Stay</small>
          </div>
        </NavLink>

        <nav className="sidebar-nav">
          {customerModules.map((mod) => (
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
        </nav>

        <div className="sidebar-footer">
          <p>{user.name}</p>
          <small>Customer</small>
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
            <NotificationPanel />
            <NavLink to="/erp" className="btn btn-secondary btn-sm">ERP Portal</NavLink>
            <button type="button" className="btn btn-secondary btn-sm" onClick={logout}>Logout</button>
          </div>
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  )
}

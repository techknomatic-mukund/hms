import { useState } from 'react'
import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom'
import { modules } from './data/mockData'
import { routes } from './routes'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const currentModule = modules.find((m) => m.path === location.pathname)

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <NavLink to="/" className="sidebar-brand" onClick={() => setSidebarOpen(false)}>
          <span className="brand-icon">🏨</span>
          <div>
            <strong>Hotel ERP</strong>
            <small>Integrated PMS Platform</small>
          </div>
        </NavLink>

        <nav className="sidebar-nav">
          {modules.map((mod) => (
            <NavLink
              key={mod.id}
              to={mod.path}
              end={mod.path === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{mod.icon}</span>
              <span className="nav-label">{mod.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>TechKnomatic Demo</p>
          <small>Phase 1 — ERP Showcase</small>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="main">
        <header className="topbar">
          <button
            type="button"
            className="menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <span className="topbar-title">
            {currentModule?.label ?? 'Hotel ERP'}
          </span>
          <div className="topbar-actions">
            <span className="sync-status">● Online — Synced</span>
            <button type="button" className="btn btn-secondary btn-sm">Admin</button>
          </div>
        </header>

        <main className="content">
          <Routes>
            {routes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App

import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DEMO_USERS, ROLES } from '../data/roles'

const QUICK_LOGINS = [
  { email: 'admin@demo.com', label: 'Admin' },
  { email: 'manager@demo.com', label: 'GM / VP' },
  { email: 'operations@demo.com', label: 'Operations' },
  { email: 'maintenance@demo.com', label: 'Maintenance' },
  { email: 'backoffice@demo.com', label: 'Back Office' },
  { email: 'customer@demo.com', label: 'Customer' },
]

function portalHome(role) {
  return ROLES[role]?.portal === 'customer' ? '/customer' : '/erp'
}

export default function Login() {
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  if (user) {
    return <Navigate to={portalHome(user.role)} replace />
  }

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const handleLogin = (e) => {
    e.preventDefault()
    const res = login(form.email, form.password)
    if (!res.ok) { setError(res.error); return }
    navigate(portalHome(res.user.role))
  }

  const handleRegister = (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    register(form.name.trim(), form.email, form.password)
    navigate('/customer')
  }

  const quickLogin = (email) => {
    const u = DEMO_USERS.find((d) => d.email === email)
    if (u) {
      const res = login(u.email, u.password)
      if (res.ok) navigate(portalHome(res.user.role))
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="brand-icon">🏨</span>
          <h1>Integrated Hotel ERP</h1>
          <p>One platform — Customer Portal & Employee ERP</p>
        </div>

        <div className="login-tabs">
          <button type="button" className={tab === 'login' ? 'active' : ''} onClick={() => { setTab('login'); setError('') }}>Login</button>
          <button type="button" className={tab === 'register' ? 'active' : ''} onClick={() => { setTab('register'); setError('') }}>Register</button>
        </div>

        {error && <p className="form-error login-error">{error}</p>}

        {tab === 'login' ? (
          <form className="entity-form" onSubmit={handleLogin}>
            <label className="form-field form-field-full">
              <span>Email</span>
              <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="admin@demo.com" />
            </label>
            <label className="form-field form-field-full">
              <span>Password</span>
              <input type="password" required value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="demo" />
            </label>
            <button type="submit" className="btn btn-primary btn-full">Login</button>
          </form>
        ) : (
          <form className="entity-form" onSubmit={handleRegister}>
            <label className="form-field form-field-full">
              <span>Full Name</span>
              <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} />
            </label>
            <label className="form-field form-field-full">
              <span>Email</span>
              <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
            </label>
            <label className="form-field form-field-full">
              <span>Password</span>
              <input type="password" required value={form.password} onChange={(e) => update('password', e.target.value)} />
            </label>
            <button type="submit" className="btn btn-primary btn-full">Create Account</button>
          </form>
        )}

        <div className="demo-logins">
          <p>Demo accounts (password: <code>demo</code>)</p>
          <div className="demo-login-btns">
            {QUICK_LOGINS.map(({ email, label }) => (
              <button key={email} type="button" className="btn btn-secondary btn-sm" onClick={() => quickLogin(email)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <p className="login-footer">
          <Link to="/login">Role-based access — each account sees different modules</Link>
        </p>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DEMO_USERS, ROLES } from '../data/roles'

export default function Login() {
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [tab, setTab] = useState('login')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  if (user) {
    const dest = ROLES[user.role]?.portal === 'customer' ? '/customer' : '/erp'
    return <Navigate to={location.state?.from || dest} replace />
  }

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const handleLogin = (e) => {
    e.preventDefault()
    const res = login(form.email, form.password)
    if (!res.ok) { setError(res.error); return }
    const dest = ROLES[res.user.role]?.portal === 'customer' ? '/customer' : '/erp'
    navigate(location.state?.from || dest)
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
      login(u.email, u.password)
      navigate(ROLES[u.role].portal === 'customer' ? '/customer' : '/erp')
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
              <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="reception@demo.com" />
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
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => quickLogin('customer@demo.com')}>Customer</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => quickLogin('reception@demo.com')}>Receptionist</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => quickLogin('admin@demo.com')}>Admin</button>
          </div>
        </div>

        <p className="login-footer">
          <Link to="/erp">Browse ERP demo</Link> (requires staff login)
        </p>
      </div>
    </div>
  )
}

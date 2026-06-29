import { createContext, useContext, useMemo, useState } from 'react'
import { DEMO_USERS, getDefaultErpPath, getModulesForRole, roleCan, roleHasModule } from '../data/roles'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hms_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const login = (email, password) => {
    const found = DEMO_USERS.find((u) => u.email === email && u.password === password)
    if (!found) return { ok: false, error: 'Invalid email or password' }
    const session = { email: found.email, name: found.name, role: found.role }
    setUser(session)
    localStorage.setItem('hms_user', JSON.stringify(session))
    return { ok: true, user: session }
  }

  const register = (name, email, password) => {
    const session = { email, name, role: 'customer' }
    setUser(session)
    localStorage.setItem('hms_user', JSON.stringify(session))
    return { ok: true, user: session }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('hms_user')
  }

  const value = useMemo(() => ({
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    hasModule: (moduleId) => roleHasModule(user?.role, moduleId),
    can: (action) => roleCan(user?.role, action),
    modules: getModulesForRole(user?.role),
    defaultErpPath: getDefaultErpPath(user?.role),
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

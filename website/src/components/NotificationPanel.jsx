import { useEffect, useRef, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { Badge } from './UI'
import AddNotificationModal from './AddNotificationModal'
import { formatDisplayDate, todayISO } from '../utils/helpers'

function priorityVariant(priority) {
  if (priority === 'Urgent') return 'danger'
  if (priority === 'High') return 'warning'
  return 'info'
}

export default function NotificationPanel() {
  const store = useStore()
  const { user, canAddNotification } = useAuth()
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const panelRef = useRef(null)

  const notifications = store.notifications

  useEffect(() => {
    if (!open) return undefined
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const handleAdd = (payload) => {
    const now = new Date()
    store.create('notifications', 'NOTIF-', 'Notifications', {
      ...payload,
      createdBy: user?.name || 'Operations',
      createdByRole: 'Operations',
      createdAt: todayISO(),
      createdTime: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    }, payload.title)
  }

  return (
    <div className="notification-panel-wrap" ref={panelRef}>
      <button
        type="button"
        className="notification-trigger"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="notification-bell" aria-hidden>🔔</span>
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <div>
              <strong>Notifications</strong>
              <span className="notification-dropdown-sub">{notifications.length} active</span>
            </div>
            {canAddNotification && (
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}>
                + Add
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="notification-empty">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <article key={n.id} className={`notification-item notification-item--${n.priority?.toLowerCase() || 'normal'}`}>
                  <div className="notification-item-header">
                    <strong>{n.title}</strong>
                    <Badge variant={priorityVariant(n.priority)}>{n.priority || 'Normal'}</Badge>
                  </div>
                  <p className="notification-item-message">{n.message}</p>
                  <div className="notification-item-meta">
                    <span>{n.createdBy}</span>
                    <span>{formatDisplayDate(n.createdAt)}{n.createdTime ? ` · ${n.createdTime}` : ''}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      )}

      <AddNotificationModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />
    </div>
  )
}

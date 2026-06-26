import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import {
  addDays, normalizeReservation, reservationSpansDate, startOfWeek, daysInMonth, formatIsoDisplay,
} from '../utils/reservationHelpers'

const VIEWS = ['Daily', 'Weekly', 'Monthly']

export default function ReservationCalendar({ onSelectReservation }) {
  const { reservations } = useStore()
  const [view, setView] = useState('Weekly')
  const [anchor, setAnchor] = useState('2026-06-25')

  const normalized = useMemo(() => reservations.map(normalizeReservation), [reservations])

  const navigate = (dir) => {
    if (view === 'Daily') setAnchor(addDays(anchor, dir))
    else if (view === 'Weekly') setAnchor(addDays(anchor, dir * 7))
    else {
      const d = new Date(`${anchor}T00:00:00`)
      d.setMonth(d.getMonth() + dir)
      setAnchor(d.toISOString().slice(0, 10))
    }
  }

  const dailyReservations = normalized.filter((r) => reservationSpansDate(r, anchor))

  const weekStart = startOfWeek(anchor)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const monthDate = new Date(`${anchor}T00:00:00`)
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const totalDays = daysInMonth(year, month)
  const firstDay = new Date(year, month, 1).getDay()
  const offset = firstDay === 0 ? 6 : firstDay - 1

  return (
    <div className="res-calendar">
      <div className="res-calendar-toolbar">
        <div className="calendar-view-tabs">
          {VIEWS.map((v) => (
            <button key={v} type="button" className={view === v ? 'active' : ''} onClick={() => setView(v)}>{v}</button>
          ))}
        </div>
        <div className="calendar-nav">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>←</button>
          <span className="calendar-title">
            {view === 'Daily' && formatIsoDisplay(anchor)}
            {view === 'Weekly' && `${formatIsoDisplay(weekStart)} — ${formatIsoDisplay(addDays(weekStart, 6))}`}
            {view === 'Monthly' && monthDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </span>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate(1)}>→</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAnchor('2026-06-25')}>Today</button>
        </div>
      </div>

      {view === 'Daily' && (
        <div className="calendar-daily">
          {dailyReservations.length === 0 && <p className="info-text">No reservations for this date.</p>}
          {dailyReservations.map((r) => (
            <button key={r.id} type="button" className="calendar-event" onClick={() => onSelectReservation?.(r)}>
              <strong>{r.guest}</strong>
              <span>{r.rooms.join(', ')} · {r.checkIn} – {r.checkOut}</span>
              <span className="calendar-event-status">{r.status}</span>
            </button>
          ))}
        </div>
      )}

      {view === 'Weekly' && (
        <div className="calendar-weekly">
          {weekDays.map((day) => {
            const dayRes = normalized.filter((r) => reservationSpansDate(r, day))
            return (
              <div key={day} className={`calendar-week-col${day === anchor ? ' today' : ''}`}>
                <div className="calendar-week-head">
                  <span>{new Date(`${day}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                  <strong>{formatIsoDisplay(day)}</strong>
                </div>
                {dayRes.map((r) => (
                  <button key={r.id} type="button" className="calendar-chip" onClick={() => onSelectReservation?.(r)}>
                    {r.guest.split(' ')[0]} · {r.room.split(' ').pop()}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      )}

      {view === 'Monthly' && (
        <div className="calendar-monthly">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} className="calendar-month-head">{d}</div>
          ))}
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-month-cell empty" />
          ))}
          {Array.from({ length: totalDays }, (_, i) => {
            const day = i + 1
            const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const count = normalized.filter((r) => reservationSpansDate(r, iso)).length
            return (
              <button
                key={iso}
                type="button"
                className={`calendar-month-cell${count ? ' has-events' : ''}${iso === anchor ? ' selected' : ''}`}
                onClick={() => { setAnchor(iso); setView('Daily') }}
              >
                <span className="day-num">{day}</span>
                {count > 0 && <span className="day-count">{count} booking{count > 1 ? 's' : ''}</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

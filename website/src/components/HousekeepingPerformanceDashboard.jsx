import { StatCard } from './UI'
import { hkPerformanceMetrics } from '../utils/housekeepingHelpers'

export default function HousekeepingPerformanceDashboard({ tasks, rooms, staff }) {
  const metrics = hkPerformanceMetrics(tasks, rooms)
  const activeStaff = staff.filter((s) => s.status === 'Active').length

  return (
    <div className="hk-performance">
      <div className="stats-grid">
        <StatCard label="Tasks Completed" value={String(metrics.completed)} change={`of ${metrics.totalTasks} total`} />
        <StatCard label="Pending / Scheduled" value={String(metrics.pending)} trend={metrics.pending > 2 ? 'down' : 'neutral'} />
        <StatCard label="In Progress" value={String(metrics.inProgress)} trend="neutral" />
        <StatCard label="Dirty Rooms" value={String(metrics.dirtyRooms)} change="awaiting cleaning" trend={metrics.dirtyRooms > 0 ? 'down' : 'up'} />
        <StatCard label="Avg. Cleaning Time" value={`${metrics.avgTime} min`} change="per task" />
        <StatCard label="Completion Rate" value={`${metrics.completionRate}%`} trend={metrics.completionRate >= 50 ? 'up' : 'neutral'} />
      </div>

      <div className="hk-staff-workload">
        <h4>Staff Workload</h4>
        <div className="workload-bars">
          {staff.map((s) => (
            <div key={s.id} className="workload-row">
              <span className="workload-name">{s.name}</span>
              <div className="workload-bar-track">
                <div
                  className={`workload-bar-fill${s.status !== 'Active' ? ' inactive' : ''}`}
                  style={{ width: `${Math.min(s.workload * 20, 100)}%` }}
                />
              </div>
              <span className="workload-count">{s.workload} tasks</span>
              <span className={`workload-status${s.status !== 'Active' ? ' leave' : ''}`}>{s.status}</span>
            </div>
          ))}
        </div>
        <p className="info-text">{activeStaff} staff on active shift today</p>
      </div>
    </div>
  )
}

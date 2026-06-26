import { useState } from 'react'
import { Badge } from './UI'
import { checklistForRoomType, roomTypeFromLabel } from '../utils/housekeepingHelpers'

export default function CleaningChecklistPanel({ checklists, tasks, onUpdateProgress }) {
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id || '')
  const [checkedItems, setCheckedItems] = useState({})

  const task = tasks.find((t) => t.id === selectedTaskId)
  const roomType = task ? roomTypeFromLabel(task.room) : 'Standard'
  const checklist = checklistForRoomType(roomType, checklists)
  const taskChecks = checkedItems[selectedTaskId] || []

  const toggleItem = (index) => {
    const next = taskChecks.includes(index)
      ? taskChecks.filter((i) => i !== index)
      : [...taskChecks, index]
    setCheckedItems((p) => ({ ...p, [selectedTaskId]: next }))
    const progress = Math.round((next.length / checklist.items.length) * 100)
    if (task) onUpdateProgress(task.id, progress)
  }

  return (
    <div className="hk-checklist-panel">
      <label className="form-field">
        <span>Active Task</span>
        <select value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)}>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>{t.room} — {t.task}</option>
          ))}
        </select>
      </label>

      {task && checklist && (
        <>
          <div className="checklist-meta">
            <Badge variant="info">{roomType} Room Checklist</Badge>
            <span>{taskChecks.length} / {checklist.items.length} completed</span>
            {task.checklistProgress > 0 && (
              <div className="checklist-progress-bar">
                <div className="checklist-progress-fill" style={{ width: `${task.checklistProgress}%` }} />
              </div>
            )}
          </div>
          <ul className="cleaning-checklist">
            {checklist.items.map((item, i) => (
              <li key={item}>
                <label className={`checklist-item${taskChecks.includes(i) ? ' done' : ''}`}>
                  <input
                    type="checkbox"
                    checked={taskChecks.includes(i)}
                    onChange={() => toggleItem(i)}
                  />
                  {item}
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

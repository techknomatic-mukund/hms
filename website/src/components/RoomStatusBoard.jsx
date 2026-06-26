import { Badge } from './UI'
import {
  deriveRoomBoardState, roomDisplayName, ROOM_STATUS_ORDER, ROOM_STATUS_VARIANT,
} from '../utils/frontOfficeHelpers'

export default function RoomStatusBoard({ rooms, reservations, maintenanceTickets, onRoomClick }) {
  const enriched = rooms.map((room) => ({
    ...room,
    displayName: roomDisplayName(room),
    boardStatus: deriveRoomBoardState(room, reservations, maintenanceTickets),
  }))

  const counts = ROOM_STATUS_ORDER.reduce((acc, status) => {
    acc[status] = enriched.filter((r) => r.boardStatus === status).length
    return acc
  }, {})

  return (
    <div className="room-status-board">
      <div className="room-status-legend">
        {ROOM_STATUS_ORDER.map((status) => (
          <span key={status} className="legend-item">
            <span className={`room-status-dot status-${status.replace(/\s/g, '-')}`} />
            {status} ({counts[status] || 0})
          </span>
        ))}
      </div>
      <div className="room-status-grid">
        {enriched.map((room) => (
          <button
            key={room.id}
            type="button"
            className={`room-status-tile status-${room.boardStatus.replace(/\s/g, '-')}`}
            onClick={() => onRoomClick?.(room)}
            title={`${room.displayName} — ${room.boardStatus}`}
          >
            <span className="room-tile-num">{room.number}</span>
            <span className="room-tile-type">{room.type}</span>
            <Badge variant={ROOM_STATUS_VARIANT[room.boardStatus] || 'default'}>{room.boardStatus}</Badge>
          </button>
        ))}
      </div>
    </div>
  )
}

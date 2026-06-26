import { Badge } from './UI'
import { LAUNDRY_STAGES, stageIndex, stageVariant } from '../utils/laundryHelpers'

export default function LaundryTrackingBoard({ orders, onAdvance, onSelect }) {
  const active = orders.filter((o) => o.stage !== 'Delivery')

  return (
    <div className="laundry-tracking">
      {active.map((order) => {
        const current = stageIndex(order.stage)
        return (
          <div key={order.id} className={`laundry-track-card${order.express ? ' express' : ''}`}>
            <div className="laundry-track-head">
              <div>
                <strong>{order.id}</strong> — {order.guest} (Room {order.room})
                {order.express && <Badge variant="warning">Express</Badge>}
              </div>
              <Badge variant={stageVariant(order.stage)}>{order.stage}</Badge>
            </div>
            <p className="laundry-track-items">{order.items} · {order.service} · {order.amount}</p>
            <div className="laundry-pipeline">
              {LAUNDRY_STAGES.map((stage, i) => (
                <div
                  key={stage}
                  className={`pipeline-step${i < current ? ' done' : ''}${i === current ? ' active' : ''}${i > current ? ' pending' : ''}`}
                >
                  <span className="pipeline-dot" />
                  <span className="pipeline-label">{stage}</span>
                </div>
              ))}
            </div>
            <div className="laundry-track-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => onSelect(order)}>Details</button>
              {order.stage !== 'Delivery' && (
                <button type="button" className="btn btn-primary btn-sm" onClick={() => onAdvance(order.id)}>
                  Advance Stage
                </button>
              )}
            </div>
          </div>
        )
      })}
      {!active.length && <p className="info-text">All orders delivered — no active tracking.</p>}
    </div>
  )
}

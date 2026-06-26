import { useMemo, useState } from 'react'
import { Badge } from './UI'
import { assetHistoryForAsset } from '../utils/maintenanceHelpers'

export default function AssetMaintenanceHistoryPanel({ history, tickets }) {
  const assets = useMemo(() => {
    const set = new Set([
      ...history.map((h) => h.asset),
      ...tickets.map((t) => t.asset),
    ])
    return [...set].sort()
  }, [history, tickets])

  const [asset, setAsset] = useState(assets[0] || '')

  const records = useMemo(() => {
    const hist = assetHistoryForAsset(history, asset)
    const fromTickets = tickets
      .filter((t) => t.asset === asset)
      .map((t) => ({
        id: t.id,
        asset: t.asset,
        date: t.scheduledDate || '—',
        type: t.type || 'Work Order',
        workOrder: t.id,
        technician: t.technician,
        cost: `₹${((t.laborCost || 0) + (t.partsCost || 0)).toLocaleString('en-IN')}`,
        partsUsed: t.sparePartsUsed || '—',
        notes: t.complaint,
        status: t.status,
      }))
    return [...hist, ...fromTickets.filter((t) => !hist.some((h) => h.workOrder === t.workOrder))]
  }, [asset, history, tickets])

  return (
    <div className="asset-history-panel">
      <label className="form-field guest-history-picker">
        <span>Select Asset</span>
        <select value={asset} onChange={(e) => setAsset(e.target.value)}>
          {assets.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </label>

      <ul className="asset-history-timeline">
        {records.map((r) => (
          <li key={r.id} className="asset-history-item">
            <div className="asset-history-head">
              <strong>{r.date}</strong>
              <Badge variant="info">{r.type}</Badge>
              {r.status && <Badge variant="muted">{r.status}</Badge>}
            </div>
            <p>{r.workOrder} — {r.technician} · {r.cost}</p>
            {r.partsUsed && r.partsUsed !== '—' && <p className="asset-parts">Parts: {r.partsUsed}</p>}
            <p className="asset-notes">{r.notes}</p>
          </li>
        ))}
        {!records.length && <li className="info-text">No maintenance history for this asset.</li>}
      </ul>
    </div>
  )
}

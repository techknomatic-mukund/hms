import { Badge } from './UI'
import { formatDisplayDate } from '../utils/helpers'

function ApprovalMeta({ label, value }) {
  if (!value) return null
  return (
    <div className="approval-card-meta-item">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function ApprovalCard({ req, onApprove, onReject }) {
  const isIssue = req.requestType === 'Issue'
  const remarks = isIssue ? req.purposeRemarks : req.remarks

  return (
    <article className={`approval-card approval-card--${isIssue ? 'issue' : 'return'}`}>
      <div className="approval-card-header">
        <div className="approval-card-heading">
          <h3 className="approval-card-title">{req.itemName}</h3>
          <span className="approval-card-id">{req.id}</span>
        </div>
        <div className="approval-card-badges">
          <Badge variant={isIssue ? 'info' : 'warning'}>{req.requestType}</Badge>
          <Badge variant="warning">Pending</Badge>
        </div>
      </div>

      <dl className="approval-card-meta">
        {isIssue ? (
          <>
            <ApprovalMeta label="Quantity" value={`${req.quantityIssued} units`} />
            <ApprovalMeta label="Issued to" value={req.issuedTo} />
            <ApprovalMeta label="Requested by" value={req.requestedBy} />
            <ApprovalMeta label="Issue date" value={formatDisplayDate(req.issueDate)} />
          </>
        ) : (
          <>
            <ApprovalMeta label="Return qty" value={`${req.returnQuantity} ${req.unit}`} />
            <ApprovalMeta label="Returned by" value={req.returnedBy} />
            <ApprovalMeta label="Return date" value={formatDisplayDate(req.returnDate)} />
            <ApprovalMeta label="Current stock" value={`${req.previousStock} ${req.unit}`} />
          </>
        )}
      </dl>

      {remarks && (
        <blockquote className="approval-card-remarks">{remarks}</blockquote>
      )}

      <div className="approval-card-actions">
        <button type="button" className="btn btn-success btn-sm" onClick={() => onApprove(req)}>
          Approve
        </button>
        <button type="button" className="btn btn-danger-outline btn-sm" onClick={() => onReject(req)}>
          Reject
        </button>
      </div>
    </article>
  )
}

export default function InventoryApprovalQueue({ requests, onApprove, onReject }) {
  const issueCount = requests.filter((r) => r.requestType === 'Issue').length
  const returnCount = requests.filter((r) => r.requestType === 'Return').length

  if (requests.length === 0) {
    return (
      <div className="approval-queue-empty">
        <span className="approval-queue-empty-icon" aria-hidden>✓</span>
        <p>All caught up — no pending requests.</p>
      </div>
    )
  }

  return (
    <>
      <div className="approval-queue-summary">
        <div className="approval-queue-total">
          <span className="approval-queue-count">{requests.length}</span>
          <span className="approval-queue-label">pending request{requests.length === 1 ? '' : 's'}</span>
        </div>
        <div className="approval-queue-pills">
          {issueCount > 0 && (
            <span className="approval-queue-pill approval-queue-pill--issue">
              {issueCount} issue{issueCount === 1 ? '' : 's'}
            </span>
          )}
          {returnCount > 0 && (
            <span className="approval-queue-pill approval-queue-pill--return">
              {returnCount} return{returnCount === 1 ? '' : 's'}
            </span>
          )}
        </div>
      </div>

      <div className="approval-queue">
        {requests.map((req) => (
          <ApprovalCard key={req.id} req={req} onApprove={onApprove} onReject={onReject} />
        ))}
      </div>
    </>
  )
}

import { useMemo, useState } from 'react'
import { feedbackEntries as initialFeedback } from '../data/mockData'
import { PageShell, SectionHeader, FeatureGrid, DataTable } from '../components/UI'
import CollectFeedbackModal from '../components/CollectFeedbackModal'
import { nextId } from '../utils/helpers'

const features = [
  'QR code-based feedback', 'Voice of Customer system', 'Property-wide feedback',
]

function StarRating({ rating }) {
  return (
    <span className="star-rating" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

export default function Feedback() {
  const [feedbackList, setFeedbackList] = useState(initialFeedback)
  const [modalOpen, setModalOpen] = useState(false)

  const avgRating = useMemo(() => {
    if (!feedbackList.length) return '0.0'
    return (feedbackList.reduce((s, f) => s + f.rating, 0) / feedbackList.length).toFixed(1)
  }, [feedbackList])

  return (
    <PageShell
      title="Customer Feedback Management"
      description="QR-based feedback collection & Voice of Customer across the property"
    >
      <section className="panel">
        <SectionHeader title="Module Features" />
        <FeatureGrid features={features} />
      </section>

      <div className="feedback-hero">
        <div className="qr-demo">
          <div className="qr-placeholder">
            <span>QR</span>
            <small>Scan to feedback</small>
          </div>
          <p>Place QR codes in rooms, restaurant & common areas for instant guest feedback.</p>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>Simulate QR Scan</button>
        </div>
        <div className="feedback-stats">
          <div className="feedback-stat">
            <span className="feedback-stat-value">{avgRating}</span>
            <span className="feedback-stat-label">Avg Rating</span>
          </div>
          <div className="feedback-stat">
            <span className="feedback-stat-value">{feedbackList.length}</span>
            <span className="feedback-stat-label">Responses (7 days)</span>
          </div>
          <div className="feedback-stat">
            <span className="feedback-stat-value">92%</span>
            <span className="feedback-stat-label">Response Rate</span>
          </div>
        </div>
      </div>

      <section className="panel">
        <SectionHeader
          title="Recent Feedback"
          action={<button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>+ Collect Feedback</button>}
        />
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'guest', label: 'Guest' },
            {
              key: 'rating',
              label: 'Rating',
              render: (row) => <StarRating rating={row.rating} />,
            },
            { key: 'channel', label: 'Channel' },
            { key: 'comment', label: 'Comment' },
            { key: 'date', label: 'Date' },
          ]}
          rows={feedbackList}
        />
      </section>

      <CollectFeedbackModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(entry) => {
          setFeedbackList((prev) => [{ id: nextId('FB-', prev), ...entry }, ...prev])
          setModalOpen(false)
        }}
      />
    </PageShell>
  )
}

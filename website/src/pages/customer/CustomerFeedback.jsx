import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useStore } from '../../context/StoreContext'
import { PageShell, SectionHeader } from '../../components/UI'
import CollectFeedbackModal from '../../components/CollectFeedbackModal'

export default function CustomerFeedback() {
  const { user } = useAuth()
  const store = useStore()
  const [open, setOpen] = useState(false)
  const myFeedback = store.feedback.filter((f) => f.guest === user.name)

  return (
    <PageShell title="Give Feedback" description="Share your experience — synced to CRM">
      <section className="panel">
        <SectionHeader title="Voice of Customer" action={<button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>Submit Feedback</button>} />
        {myFeedback.length === 0 && <p className="info-text">No feedback submitted yet.</p>}
        <ul className="info-list">{myFeedback.map((f) => <li key={f.id}>{f.rating}★ — {f.comment}</li>)}</ul>
      </section>
      <CollectFeedbackModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(entry) => { store.create('feedback', 'FB-', 'Feedback', { ...entry, guest: user.name, channel: 'Customer Portal' }); setOpen(false) }}
      />
    </PageShell>
  )
}

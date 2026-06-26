import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { PageShell, SectionHeader, FeatureGrid } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import CollectFeedbackModal from '../components/CollectFeedbackModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'

function StarRating({ rating }) {
  return <span className="star-rating">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
}

export default function Feedback() {
  const store = useStore()
  const crud = useCrudModal()
  const [modalOpen, setModalOpen] = useState(false)

  const avgRating = useMemo(() => {
    if (!store.feedback.length) return '0.0'
    return (store.feedback.reduce((s, f) => s + f.rating, 0) / store.feedback.length).toFixed(1)
  }, [store.feedback])

  const cols = [
    { key: 'id', label: 'ID' }, { key: 'guest', label: 'Guest' },
    { key: 'rating', label: 'Rating', render: (r) => <StarRating rating={r.rating} /> },
    { key: 'channel', label: 'Channel' }, { key: 'comment', label: 'Comment' }, { key: 'date', label: 'Date' },
  ]

  return (
    <PageShell title="Customer Feedback" description="QR & Voice of Customer — property-wide feedback">
      <section className="panel"><SectionHeader title="Features" /><FeatureGrid features={['QR feedback', 'Voice of Customer', 'CRM integration', 'Loyalty impact']} /></section>
      <div className="feedback-stats" style={{ marginBottom: 20 }}>
        <div className="feedback-stat"><span className="feedback-stat-value">{avgRating}</span><span className="feedback-stat-label">Avg Rating</span></div>
        <div className="feedback-stat"><span className="feedback-stat-value">{store.feedback.length}</span><span className="feedback-stat-label">Responses</span></div>
      </div>
      <section className="panel">
        <SectionHeader title="Feedback" action={<button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>+ Collect Feedback</button>} />
        <CrudTable columns={cols} rows={store.feedback} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
      </section>
      <CollectFeedbackModal
        open={modalOpen || crud.isEdit}
        editItem={crud.isEdit ? crud.item : null}
        onClose={() => { setModalOpen(false); crud.closeModal() }}
        onSubmit={(entry) => {
          if (crud.isEdit && crud.item) store.update('feedback', 'Feedback', crud.item.id, entry)
          else store.create('feedback', 'FB-', 'Feedback', entry)
          setModalOpen(false); crud.closeModal()
        }}
      />
      <ViewDetailModal open={crud.isView} onClose={crud.closeModal} title="Feedback" data={crud.item} fields={cols} />
      <DeleteConfirmModal open={!!crud.deleteTarget} onClose={crud.closeDelete} onConfirm={() => store.remove('feedback', 'Feedback', crud.deleteTarget.id)} itemName={crud.deleteTarget?.guest} />
    </PageShell>
  )
}

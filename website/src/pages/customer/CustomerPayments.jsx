import { PageShell, SectionHeader } from '../../components/UI'

const INVOICES = [
  { id: 'INV-1001', desc: 'Room — Deluxe 302', amount: '₹22,500', status: 'Paid', date: '24 Jun' },
  { id: 'INV-1002', desc: 'Spa Services', amount: '₹3,500', status: 'Pending', date: '25 Jun' },
]

export default function CustomerPayments() {
  return (
    <PageShell title="Payments & Invoices" description="Pay online and download invoices">
      <section className="panel">
        <SectionHeader title="Invoices" />
        {INVOICES.map((inv) => (
          <div key={inv.id} className="approval-item">
            <div><strong>{inv.id}</strong><span>{inv.desc} — {inv.amount}</span></div>
            <div className="approval-actions">
              {inv.status === 'Pending' && <button type="button" className="btn btn-primary btn-sm">Pay Now</button>}
              <button type="button" className="btn btn-secondary btn-sm">Download PDF</button>
            </div>
          </div>
        ))}
      </section>
    </PageShell>
  )
}

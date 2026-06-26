import { Badge } from './UI'
import { campaignVariant } from '../utils/crmHelpers'

export default function CampaignPanel({ campaigns, customers, onSend }) {
  const upcoming = [...campaigns].sort((a, b) => (a.eventDate > b.eventDate ? 1 : -1))

  return (
    <div className="crm-campaign-panel">
      <p className="info-text">
        Upcoming birthdays & anniversaries — send personalized greetings, offers, or promotional packages.
      </p>

      <div className="campaign-grid">
        {upcoming.map((c) => {
          const customer = customers.find((x) => x.id === c.customerId || x.name === c.guest)
          return (
            <div key={c.id} className="campaign-card">
              <div className="campaign-card-head">
                <span className={`campaign-type campaign-type-${c.type.toLowerCase()}`}>{c.type}</span>
                <Badge variant={campaignVariant(c.status)}>{c.status}</Badge>
              </div>
              <h4>{c.guest}</h4>
              <p className="campaign-date">Event: <strong>{c.eventDate}</strong></p>
              {customer && (
                <p className="campaign-meta">
                  {customer.birthday && c.type === 'Birthday' && `Birthday: ${customer.birthday}`}
                  {customer.anniversary && c.type === 'Anniversary' && `Anniversary: ${customer.anniversary}`}
                </p>
              )}
              <p className="campaign-offer">{c.offer}</p>
              <div className="campaign-footer">
                <span className="campaign-channel">via {c.channel}</span>
                {c.status !== 'Sent' && (
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => onSend(c.id)}>
                    Send Campaign
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function FormSection({ title, subtitle, children }) {
  return (
    <div className="form-section">
      <div className="form-section-head">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

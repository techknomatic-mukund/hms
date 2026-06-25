export function FormField({
  label, error, full, children, required,
}) {
  return (
    <label className={`form-field${full ? ' form-field-full' : ''}`}>
      <span>{label}{required ? ' *' : ''}</span>
      {children}
      {error && <em className="form-error">{error}</em>}
    </label>
  )
}

export function FormActions({ onCancel, submitLabel = 'Save' }) {
  return (
    <div className="modal-actions">
      <button type="button" className="btn btn-secondary" onClick={onCancel}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary">
        {submitLabel}
      </button>
    </div>
  )
}

export function FormSelect({ value, onChange, options }) {
  return (
    <select value={value} onChange={onChange}>
      {options.map((opt) => (
        <option key={opt.value ?? opt} value={opt.value ?? opt}>
          {opt.label ?? opt}
        </option>
      ))}
    </select>
  )
}

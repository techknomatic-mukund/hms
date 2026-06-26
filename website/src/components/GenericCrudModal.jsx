import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'

export default function GenericCrudModal({
  open, onClose, onSubmit, title, fields, editItem, createTitle, editTitle,
}) {
  const isEdit = !!editItem
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    const init = {}
    fields.forEach((f) => {
      init[f.name] = editItem?.[f.name] ?? f.default ?? ''
    })
    setForm(init)
    setErrors({})
  }, [open, editItem, fields])

  const update = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }))
    setErrors((p) => ({ ...p, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    fields.forEach((f) => {
      if (f.required && !String(form[f.name] ?? '').trim()) next[f.name] = `${f.label} is required`
    })
    if (Object.keys(next).length) { setErrors(next); return }
    onSubmit(form, isEdit)
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? (editTitle || `Edit ${title}`) : (createTitle || `New ${title}`)}>
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {fields.map((f) => (
            <FormField key={f.name} label={f.label} required={f.required} error={errors[f.name]} full={f.full}>
              {f.type === 'select' ? (
                <select value={form[f.name]} onChange={(e) => update(f.name, e.target.value)}>
                  {(f.options || []).map((o) => (
                    <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
                  ))}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea value={form[f.name]} rows={3} onChange={(e) => update(f.name, e.target.value)} />
              ) : (
                <input
                  type={f.type || 'text'}
                  value={form[f.name]}
                  min={f.min}
                  onChange={(e) => update(f.name, f.type === 'number' ? e.target.value : e.target.value)}
                />
              )}
            </FormField>
          ))}
        </div>
        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update' : 'Create'} />
      </form>
    </Modal>
  )
}

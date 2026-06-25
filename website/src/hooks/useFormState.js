import { useEffect, useState } from 'react'

export function useFormState(initial, open) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm(initial)
      setErrors({})
    }
  }, [open, initial])

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const setFieldErrors = (next) => {
    setErrors(next)
    return Object.keys(next).length === 0
  }

  return { form, errors, update, setFieldErrors, setForm }
}

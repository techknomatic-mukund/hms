import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import { useFormState } from '../hooks/useFormState'
import { calcMargin, formatINR } from '../utils/helpers'

const empty = { name: '', cost: '', sell: '' }

export default function AddFoodCostingModal({ open, onClose, onSubmit }) {
  const { form, errors, update, setFieldErrors } = useFormState(empty, open)

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'Item name is required'
    if (!form.cost || parseFloat(form.cost) <= 0) next.cost = 'Valid cost required'
    if (!form.sell || parseFloat(form.sell) <= 0) next.sell = 'Valid sell price required'
    if (!setFieldErrors(next)) return
    const cost = parseFloat(form.cost)
    const sell = parseFloat(form.sell)
    onSubmit({
      name: form.name.trim(),
      cost,
      sell,
      margin: calcMargin(cost, sell),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Food Costing Item">
      <form className="entity-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <FormField label="Dish Name" required error={errors.name} full>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </FormField>
          <FormField label="Cost (₹)" required error={errors.cost}>
            <input type="number" min="1" value={form.cost} onChange={(e) => update('cost', e.target.value)} />
          </FormField>
          <FormField label="Sell Price (₹)" required error={errors.sell}>
            <input type="number" min="1" value={form.sell} onChange={(e) => update('sell', e.target.value)} />
          </FormField>
        </div>
        {form.cost && form.sell && (
          <p className="info-text form-preview">
            Margin preview: {calcMargin(form.cost, form.sell)} ({formatINR(form.sell - form.cost)} profit)
          </p>
        )}
        <FormActions onCancel={onClose} submitLabel="Add Item" />
      </form>
    </Modal>
  )
}

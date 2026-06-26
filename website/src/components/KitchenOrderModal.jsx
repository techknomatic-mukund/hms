import { useEffect, useState } from 'react'
import { Modal } from './UI'
import { FormActions, FormField } from './FormFields'
import FormSection from './FormSection'

const STATIONS = ['Main Kitchen', 'Room Service', 'Pastry', 'Grill', 'Cold Kitchen']
const STATUSES = ['Queued', 'Cooking', 'Ready', 'Served']
const PREP_STAGES = ['Not Started', 'Prep', 'Cooking', 'Plating', 'Quality Check', 'Ready']
const QUEUE_PRIORITIES = ['Low', 'Normal', 'High', 'VIP']
const WASTE_REASONS = ['Overproduction', 'Spoilage', 'Plate Waste', 'Prep Error', 'Other']

const getEmpty = () => ({
  orderRef: '', dish: '', qty: 1, station: 'Main Kitchen', status: 'Queued',
  queuePosition: '', queuePriority: 'Normal',
  prepStage: 'Not Started', prepStartTime: '', estCompletion: '',
  chefName: '',
  recipe: '', ingredients: '',
  trackingStatus: 'Queued', statusHistory: '',
  ingredientsUsed: '', consumptionQty: '',
  wasteAmount: '', wasteReason: 'Other', wasteNote: '',
  performanceScore: '', reportNotes: '',
})

function itemToForm(editItem) {
  if (!editItem) return getEmpty()
  return { ...getEmpty(), ...editItem, qty: editItem.qty ?? 1 }
}

export default function KitchenOrderModal({ open, onClose, onSubmit, editItem = null, chefs = [] }) {
  const [form, setForm] = useState(getEmpty())
  const [errors, setErrors] = useState({})
  const isEdit = !!editItem

  useEffect(() => {
    if (!open) return
    setForm(itemToForm(editItem))
    setErrors({})
  }, [open, editItem])

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.orderRef.trim()) next.orderRef = 'POS order reference is required'
    if (!form.dish.trim()) next.dish = 'Dish name is required'
    if (!form.qty || Number(form.qty) < 1) next.qty = 'Valid quantity is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ ...form, orderRef: form.orderRef.trim(), dish: form.dish.trim(), qty: Number(form.qty) })
  }

  const chefList = chefs.length ? chefs : ['Chef Ravi', 'Chef Anita', 'Chef Karan', 'Head Chef']

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Kitchen Order' : 'New Kitchen Order'} wide>
      <form className="entity-form" onSubmit={handleSubmit}>
        <FormSection title="Kitchen Order Management" subtitle="Receive and manage orders from POS and room service">
          <div className="form-grid">
            <FormField label="POS Order Ref" required error={errors.orderRef}>
              <input type="text" value={form.orderRef} placeholder="POS-8821" onChange={(e) => update('orderRef', e.target.value)} />
            </FormField>
            <FormField label="Dish" required error={errors.dish} full>
              <input type="text" value={form.dish} onChange={(e) => update('dish', e.target.value)} />
            </FormField>
            <FormField label="Quantity" required error={errors.qty}>
              <input type="number" min="1" value={form.qty} onChange={(e) => update('qty', e.target.value)} />
            </FormField>
            <FormField label="Status">
              <select value={form.status} onChange={(e) => update('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Kitchen Queue Management" subtitle="Prioritize orders in the kitchen display queue">
          <div className="form-grid">
            <FormField label="Queue Position">
              <input type="number" min="1" value={form.queuePosition} placeholder="Auto-assigned" onChange={(e) => update('queuePosition', e.target.value)} />
            </FormField>
            <FormField label="Queue Priority">
              <select value={form.queuePriority} onChange={(e) => update('queuePriority', e.target.value)}>
                {QUEUE_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Food Preparation Tracking" subtitle="Track prep stages and estimated completion time">
          <div className="form-grid">
            <FormField label="Prep Stage">
              <select value={form.prepStage} onChange={(e) => update('prepStage', e.target.value)}>
                {PREP_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Prep Start Time">
              <input type="datetime-local" value={form.prepStartTime} onChange={(e) => update('prepStartTime', e.target.value)} />
            </FormField>
            <FormField label="Est. Completion">
              <input type="datetime-local" value={form.estCompletion} onChange={(e) => update('estCompletion', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Chef Assignment" subtitle="Assign responsible chef for each order">
          <FormField label="Assigned Chef" full>
            <select value={form.chefName} onChange={(e) => update('chefName', e.target.value)}>
              <option value="">— Select chef —</option>
              {chefList.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="Kitchen Station Management" subtitle="Route order to the correct preparation station">
          <FormField label="Station" full>
            <select value={form.station} onChange={(e) => update('station', e.target.value)}>
              {STATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="Recipe & Ingredient Management" subtitle="Link standard recipes and required ingredients">
          <div className="form-grid">
            <FormField label="Recipe">
              <input type="text" value={form.recipe} placeholder="Standard Butter Chicken recipe" onChange={(e) => update('recipe', e.target.value)} />
            </FormField>
            <FormField label="Ingredients" full>
              <textarea rows={2} value={form.ingredients} placeholder="Chicken 200g, Butter 50g, Cream 100ml..." onChange={(e) => update('ingredients', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Order Status Tracking" subtitle="Real-time kitchen order status updates">
          <FormField label="Tracking Status" full>
            <select value={form.trackingStatus} onChange={(e) => update('trackingStatus', e.target.value)}>
              {['Queued', 'Assigned', 'Cooking', 'Ready', 'Served', 'Delayed'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="Ingredient Consumption Tracking" subtitle="Deduct inventory based on recipes used">
          <div className="form-grid">
            <FormField label="Ingredients Used" full>
              <input type="text" value={form.ingredientsUsed} placeholder="Basmati Rice 0.5kg, Chicken 1kg" onChange={(e) => update('ingredientsUsed', e.target.value)} />
            </FormField>
            <FormField label="Consumption Qty / Unit">
              <input type="text" value={form.consumptionQty} placeholder="e.g. 2 portions" onChange={(e) => update('consumptionQty', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Food Waste Management" subtitle="Record and analyse kitchen food waste">
          <div className="form-grid">
            <FormField label="Waste Amount">
              <input type="text" value={form.wasteAmount} placeholder="e.g. 0.5 kg" onChange={(e) => update('wasteAmount', e.target.value)} />
            </FormField>
            <FormField label="Waste Reason">
              <select value={form.wasteReason} onChange={(e) => update('wasteReason', e.target.value)}>
                {WASTE_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </FormField>
            <FormField label="Waste Notes" full>
              <input type="text" value={form.wasteNote} onChange={(e) => update('wasteNote', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Kitchen Reports & Analytics" subtitle="Performance scores and operational notes">
          <div className="form-grid">
            <FormField label="Performance Score (1–10)">
              <input type="number" min="1" max="10" value={form.performanceScore} onChange={(e) => update('performanceScore', e.target.value)} />
            </FormField>
            <FormField label="Report Notes" full>
              <input type="text" value={form.reportNotes} placeholder="Turnaround time, station efficiency..." onChange={(e) => update('reportNotes', e.target.value)} />
            </FormField>
          </div>
        </FormSection>

        <FormActions onCancel={onClose} submitLabel={isEdit ? 'Update Order' : 'Create Order'} />
      </form>
    </Modal>
  )
}

import { VENDOR_NAMES } from '../data/vendors'

export default function VendorSelect({ value, onChange, placeholder = '— Select vendor —', id }) {
  return (
    <select id={id} value={value} onChange={onChange}>
      <option value="">{placeholder}</option>
      {VENDOR_NAMES.map((name) => (
        <option key={name} value={name}>{name}</option>
      ))}
      {value && !VENDOR_NAMES.includes(value) && (
        <option value={value}>{value}</option>
      )}
    </select>
  )
}

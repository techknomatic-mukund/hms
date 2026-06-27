export default function DateRangeFilter({ startDate, endDate, onStartChange, onEndChange }) {
  return (
    <div className="date-range-filter">
      <label className="date-range-field">
        <span>Start</span>
        <input
          type="date"
          value={startDate}
          max={endDate}
          onChange={(e) => onStartChange(e.target.value)}
        />
      </label>
      <label className="date-range-field">
        <span>End</span>
        <input
          type="date"
          value={endDate}
          min={startDate}
          onChange={(e) => onEndChange(e.target.value)}
        />
      </label>
    </div>
  )
}

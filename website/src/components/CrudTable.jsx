import { DataTable } from './UI'

export function CrudActions({ row, onView, onEdit, onDelete, canUpdate = true, canDelete = true }) {
  return (
    <div className="crud-actions">
      {onView && (
        <button type="button" className="btn-icon" title="View" onClick={() => onView(row)}>👁</button>
      )}
      {canUpdate && onEdit && (
        <button type="button" className="btn-icon" title="Edit" onClick={() => onEdit(row)}>✏️</button>
      )}
      {canDelete && onDelete && (
        <button type="button" className="btn-icon btn-icon-danger" title="Delete" onClick={() => onDelete(row)}>🗑</button>
      )}
    </div>
  )
}

export function CrudTable({
  columns, rows, keyField = 'id', onView, onEdit, onDelete, canUpdate, canDelete,
}) {
  const actionCol = (onView || onEdit || onDelete) ? [{
    key: '_actions',
    label: 'Actions',
    render: (row) => (
      <CrudActions
        row={row}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        canUpdate={canUpdate}
        canDelete={canDelete}
      />
    ),
  }] : []

  return (
    <DataTable
      columns={[...columns, ...actionCol]}
      rows={rows}
      keyField={keyField}
    />
  )
}

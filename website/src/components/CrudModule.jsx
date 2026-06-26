import { PageShell, SectionHeader } from '../components/UI'
import { CrudTable } from '../components/CrudTable'
import GenericCrudModal from '../components/GenericCrudModal'
import DeleteConfirmModal, { ViewDetailModal } from '../components/DeleteConfirmModal'
import { useCrudModal } from '../hooks/useCrudModal'

export default function CrudModule({
  title, description, features, sectionTitle, createLabel,
  data, columns, viewFields, formFields,
  storeKey, prefix, moduleName, onCreate, onUpdate, onDelete,
  keyField = 'id', extra, customModal,
}) {
  const crud = useCrudModal()

  const handleSubmit = (form, isEdit) => {
    if (isEdit) onUpdate(crud.item[keyField], form)
    else onCreate(form)
    crud.closeModal()
  }

  const handleDelete = () => {
    if (crud.deleteTarget) onDelete(crud.deleteTarget[keyField])
    crud.closeDelete()
  }

  return (
    <PageShell title={title} description={description}>
      {features && (
        <section className="panel">
          <SectionHeader title="Module Features" />
          <div className="feature-grid">
            {features.map((f) => <div key={f} className="feature-chip">{f}</div>)}
          </div>
        </section>
      )}

      <section className="panel">
        <SectionHeader
          title={sectionTitle || title}
          action={<button type="button" className="btn btn-primary" onClick={crud.openCreate}>{createLabel || '+ Create'}</button>}
        />
        <CrudTable
          columns={columns}
          rows={data}
          keyField={keyField}
          onView={crud.openView}
          onEdit={crud.openEdit}
          onDelete={crud.openDelete}
        />
      </section>

      {extra}

      {customModal ? customModal({
        open: crud.isCreate || crud.isEdit,
        onClose: crud.closeModal,
        onSubmit: (form) => handleSubmit(form, crud.isEdit),
        editItem: crud.isEdit ? crud.item : null,
      }) : (
        <GenericCrudModal
          open={crud.isCreate || crud.isEdit}
          onClose={crud.closeModal}
          onSubmit={handleSubmit}
          title={moduleName}
          fields={formFields}
          editItem={crud.isEdit ? crud.item : null}
        />
      )}

      <ViewDetailModal
        open={crud.isView}
        onClose={crud.closeModal}
        title={`${moduleName} Details`}
        data={crud.item}
        fields={viewFields || columns.map((c) => ({ key: c.key, label: c.label, render: c.render }))}
      />

      <DeleteConfirmModal
        open={!!crud.deleteTarget}
        onClose={crud.closeDelete}
        onConfirm={handleDelete}
        itemName={crud.deleteTarget?.name || crud.deleteTarget?.guest || crud.deleteTarget?.id || 'this record'}
      />
    </PageShell>
  )
}

import { useState } from 'react'

export function useCrudModal() {
  const [modal, setModal] = useState({ mode: null, item: null })
  const [deleteTarget, setDeleteTarget] = useState(null)

  return {
    mode: modal.mode,
    item: modal.item,
    deleteTarget,
    openCreate: () => setModal({ mode: 'create', item: null }),
    openEdit: (item) => setModal({ mode: 'edit', item }),
    openView: (item) => setModal({ mode: 'view', item }),
    closeModal: () => setModal({ mode: null, item: null }),
    openDelete: (item) => setDeleteTarget(item),
    closeDelete: () => setDeleteTarget(null),
    isOpen: modal.mode !== null,
    isCreate: modal.mode === 'create',
    isEdit: modal.mode === 'edit',
    isView: modal.mode === 'view',
  }
}

import type { ReusableRequestBody } from '../models/openapi'
import { useConfirm } from '../components/ConfirmContext'

interface Props {
  requestBodies: ReusableRequestBody[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: () => void
  onUpdate: (id: string, field: string, value: unknown) => void
  onRemove: (id: string) => void
}

export function ReusableRequestBodiesPage({
  requestBodies,
  selectedId,
  onSelect,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  const selected = requestBodies.find(b => b.id === selectedId)
  const { confirm } = useConfirm()

  const handleRemove = async (id: string, name: string) => {
    const confirmed = await confirm(`Delete request body "${name || 'untitled'}"?`)
    if (confirmed) {
      onRemove(id)
    }
  }

  return (
    <div className="flex h-full">
      <div
        className="w-72 flex-shrink-0 overflow-y-auto border-r"
        style={{ borderColor: 'var(--border-primary)' }}
      >
        <div className="p-4" style={{ borderBottom: '1px solid var(--border-primary)' }}>
          <button onClick={onAdd} className="btn-primary w-full justify-center">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Request Body
          </button>
        </div>
        <div className="p-2 space-y-0.5">
          {requestBodies.map(b => (
            <button
              key={b.id}
              onClick={() => onSelect(b.id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm transition-colors"
              style={{
                backgroundColor: selectedId === b.id ? 'var(--bg-active)' : 'transparent',
                color: selectedId === b.id ? 'var(--text-heading)' : 'var(--text-secondary)',
              }}
            >
              <svg className="w-4 h-4 flex-shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="truncate">{b.name || 'Unnamed'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!selected ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Select a request body to edit</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>Edit Request Body</h2>
              <button
                onClick={() => handleRemove(selected.id, selected.name)}
                className="btn-small"
                style={{ color: 'var(--method-delete)' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Name</label>
              <input
                className="input-field-sm"
                value={selected.name}
                onChange={e => onUpdate(selected.id, 'name', e.target.value)}
                placeholder="UserCreate"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
              <textarea
                className="input-field-sm resize-y"
                rows={2}
                value={selected.description}
                onChange={e => onUpdate(selected.id, 'description', e.target.value)}
                placeholder="Request body for creating a user"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.required}
                onChange={e => onUpdate(selected.id, 'required', e.target.checked)}
                className="w-3 h-3"
              />
              <span className="text-[11px]" style={{ color: 'var(--text-faint)' }}>Required</span>
            </label>
          </div>
        )}
      </div>
    </div>
  )
}

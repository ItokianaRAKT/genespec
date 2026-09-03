import type { ReusableResponse } from '../models/openapi'
import { useConfirm } from '../components/ConfirmContext'

interface Props {
  responses: ReusableResponse[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: () => void
  onUpdate: (id: string, field: string, value: string) => void
  onRemove: (id: string) => void
}

export function ReusableResponsesPage({
  responses,
  selectedId,
  onSelect,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  const selected = responses.find(r => r.id === selectedId)
  const { confirm } = useConfirm()

  const handleRemove = async (id: string, name: string) => {
    const confirmed = await confirm(`Delete response "${name || 'untitled'}"?`)
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
            Add Response
          </button>
        </div>
        <div className="p-2 space-y-0.5">
          {responses.map(r => (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm transition-colors"
              style={{
                backgroundColor: selectedId === r.id ? 'var(--bg-active)' : 'transparent',
                color: selectedId === r.id ? 'var(--text-heading)' : 'var(--text-secondary)',
              }}
            >
              <svg className="w-4 h-4 flex-shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">{r.name || 'Unnamed'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!selected ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Select a response to edit</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>Edit Response</h2>
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
                placeholder="NotFound"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
              <textarea
                className="input-field-sm resize-y"
                rows={2}
                value={selected.description}
                onChange={e => onUpdate(selected.id, 'description', e.target.value)}
                placeholder="Resource not found"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

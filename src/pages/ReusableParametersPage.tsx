import type { ReusableParameter } from '../models/openapi'
import { useConfirm } from '../components/ConfirmContext'

interface Props {
  parameters: ReusableParameter[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: () => void
  onUpdate: (id: string, field: string, value: unknown) => void
  onRemove: (id: string) => void
}

const paramLocations = ['query', 'path', 'header', 'cookie'] as const
const propTypes = ['string', 'integer', 'number', 'boolean', 'array', 'object']

export function ReusableParametersPage({
  parameters,
  selectedId,
  onSelect,
  onAdd,
  onUpdate,
  onRemove,
}: Props) {
  const selected = parameters.find(p => p.id === selectedId)
  const { confirm } = useConfirm()

  const handleRemove = async (id: string, name: string) => {
    const confirmed = await confirm(`Delete parameter "${name || 'untitled'}"?`)
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
            Add Parameter
          </button>
        </div>
        <div className="p-2 space-y-0.5">
          {parameters.map(p => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm transition-colors"
              style={{
                backgroundColor: selectedId === p.id ? 'var(--bg-active)' : 'transparent',
                color: selectedId === p.id ? 'var(--text-heading)' : 'var(--text-secondary)',
              }}
            >
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: 'var(--bg-badge)',
                  color: 'var(--text-muted)',
                }}
              >
                {p.in}
              </span>
              <span className="truncate">{p.name || 'Unnamed'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!selected ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Select a parameter to edit</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>Edit Parameter</h2>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Name</label>
                <input
                  className="input-field-sm"
                  value={selected.name}
                  onChange={e => onUpdate(selected.id, 'name', e.target.value)}
                  placeholder="limit"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Location</label>
                <select
                  className="input-field-sm"
                  value={selected.in}
                  onChange={e => onUpdate(selected.id, 'in', e.target.value)}
                >
                  {paramLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Type</label>
                <select
                  className="input-field-sm"
                  value={selected.type}
                  onChange={e => onUpdate(selected.id, 'type', e.target.value)}
                >
                  {propTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Format</label>
                <input
                  className="input-field-sm"
                  value={selected.format || ''}
                  onChange={e => onUpdate(selected.id, 'format', e.target.value)}
                  placeholder="int64"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Default Value</label>
                <input
                  className="input-field-sm"
                  value={selected.defaultValue || ''}
                  onChange={e => onUpdate(selected.id, 'defaultValue', e.target.value)}
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Enum (comma separated)</label>
                <input
                  className="input-field-sm"
                  value={selected.enum?.join(', ') || ''}
                  onChange={e => onUpdate(selected.id, 'enum', e.target.value ? e.target.value.split(',').map(s => s.trim()) : [])}
                  placeholder="10, 20, 50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
              <textarea
                className="input-field-sm resize-y"
                rows={2}
                value={selected.description}
                onChange={e => onUpdate(selected.id, 'description', e.target.value)}
                placeholder="Maximum number of items to return"
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

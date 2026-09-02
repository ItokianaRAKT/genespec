import type { Schema } from '../models/openapi'

interface Props {
  schemas: Schema[]
  selectedSchemaId: string | null
  onSelectSchema: (id: string) => void
  onAdd: () => void
  onUpdate: (id: string, field: string, value: string) => void
  onRemove: (id: string) => void
  onAddProperty: (schemaId: string) => void
  onUpdateProperty: (schemaId: string, propId: string, field: string, value: unknown) => void
  onRemoveProperty: (schemaId: string, propId: string) => void
}

const propTypes = ['string', 'integer', 'number', 'boolean', 'array', 'object']

export function SchemasPage({
  schemas,
  selectedSchemaId,
  onSelectSchema,
  onAdd,
  onUpdate,
  onRemove,
  onAddProperty,
  onUpdateProperty,
  onRemoveProperty,
}: Props) {
  const selected = schemas.find(s => s.id === selectedSchemaId)

  const handleRemoveSchema = (id: string, name: string) => {
    if (window.confirm(`Delete schema "${name || 'untitled'}"?`)) {
      onRemove(id)
    }
  }

  const handleRemoveProperty = (schemaId: string, propName: string) => {
    if (window.confirm(`Delete property "${propName || 'untitled'}"?`)) {
      onRemoveProperty(schemaId, propName)
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
            Add Schema
          </button>
        </div>
        <div className="p-2 space-y-0.5">
          {schemas.map(s => (
            <button
              key={s.id}
              onClick={() => onSelectSchema(s.id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm transition-colors"
              style={{
                backgroundColor: selectedSchemaId === s.id ? 'var(--bg-active)' : 'transparent',
                color: selectedSchemaId === s.id ? 'var(--text-heading)' : 'var(--text-secondary)',
              }}
            >
              <svg className="w-4 h-4 flex-shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="truncate">{s.name || 'Unnamed'}</span>
              <span className="ml-auto text-[10px]" style={{ color: 'var(--text-faintest)' }}>
                {s.properties.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!selected ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Select a schema to edit</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>Edit Schema</h2>
              <button
                onClick={() => handleRemoveSchema(selected.id, selected.name)}
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
                placeholder="User"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
              <textarea
                className="input-field-sm resize-y"
                rows={2}
                value={selected.description}
                onChange={e => onUpdate(selected.id, 'description', e.target.value)}
                placeholder="Schema description"
              />
            </div>

            <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: '1.5rem' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>Properties</h3>
                <button onClick={() => onAddProperty(selected.id)} className="btn-small">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>
              {selected.properties.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--text-faint)' }}>No properties</p>
              ) : (
                <div className="space-y-3">
                  {selected.properties.map(prop => (
                    <div
                      key={prop.id}
                      className="rounded-lg p-4 border"
                      style={{ backgroundColor: 'var(--bg-parameter)', borderColor: 'var(--border-card)' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Property</span>
                        <button onClick={() => handleRemoveProperty(selected.id, prop.id, prop.name)} style={{ color: 'var(--text-faint)' }}>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          className="input-field-sm"
                          value={prop.name}
                          onChange={e => onUpdateProperty(selected.id, prop.id, 'name', e.target.value)}
                          placeholder="name"
                        />
                        <select
                          className="input-field-sm"
                          value={prop.type}
                          onChange={e => onUpdateProperty(selected.id, prop.id, 'type', e.target.value)}
                        >
                          {propTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          className="input-field-sm"
                          value={prop.format || ''}
                          onChange={e => onUpdateProperty(selected.id, prop.id, 'format', e.target.value)}
                          placeholder="format"
                        />
                        <input
                          className="input-field-sm"
                          value={prop.defaultValue || ''}
                          onChange={e => onUpdateProperty(selected.id, prop.id, 'defaultValue', e.target.value)}
                          placeholder="default"
                        />
                      </div>
                      <input
                        className="input-field-sm mb-2"
                        value={prop.description}
                        onChange={e => onUpdateProperty(selected.id, prop.id, 'description', e.target.value)}
                        placeholder="description"
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={prop.required}
                          onChange={e => onUpdateProperty(selected.id, prop.id, 'required', e.target.checked)}
                          className="w-3 h-3"
                        />
                        <span className="text-[11px]" style={{ color: 'var(--text-faint)' }}>Required</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import type { Tag } from '../models/openapi'
import { useConfirm } from '../components/ConfirmContext'

interface Props {
  tags: Tag[]
  onAdd: () => void
  onUpdate: (id: string, field: string, value: string) => void
  onRemove: (id: string) => void
}

export function TagsPage({ tags, onAdd, onUpdate, onRemove }: Props) {
  const confirm = useConfirm()

  const handleRemove = async (id: string, name: string) => {
    const confirmed = await confirm(`Delete tag "${name || 'untitled'}"?`)
    if (confirmed) {
      onRemove(id)
    }
  }
  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>Tags</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Manage API tags</p>
        </div>
        <button onClick={onAdd} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Tag
        </button>
      </div>

      {tags.length === 0 ? (
        <div
          className="rounded-xl p-12 border-2 border-dashed text-center"
          style={{ borderColor: 'var(--border-dashed)', backgroundColor: 'var(--bg-empty)' }}
        >
          <svg className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-faintest)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No tags configured.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tags.map(tag => (
            <div
              key={tag.id}
              className="rounded-xl p-6 border"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>Tag</h3>
                <button
                  onClick={() => handleRemove(tag.id, tag.name)}
                  className="text-xs px-2 py-1 rounded transition-colors"
                  style={{ color: 'var(--text-faint)' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Name</label>
                  <input
                    className="input-field-sm"
                    value={tag.name}
                    onChange={e => onUpdate(tag.id, 'name', e.target.value)}
                    placeholder="users"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
                  <input
                    className="input-field-sm"
                    value={tag.description}
                    onChange={e => onUpdate(tag.id, 'description', e.target.value)}
                    placeholder="User management operations"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import type { Server } from '../models/openapi'

interface Props {
  servers: Server[]
  onAdd: () => void
  onUpdate: (id: string, field: string, value: string) => void
  onRemove: (id: string) => void
}

export function ServersPage({ servers, onAdd, onUpdate, onRemove }: Props) {
  const handleRemove = (id: string, url: string) => {
    if (window.confirm(`Delete server "${url || 'untitled'}"?`)) {
      onRemove(id)
    }
  }
  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>Servers</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Configure your API servers</p>
        </div>
        <button onClick={onAdd} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Server
        </button>
      </div>

      {servers.length === 0 ? (
        <div
          className="rounded-xl p-12 border-2 border-dashed text-center"
          style={{ borderColor: 'var(--border-dashed)', backgroundColor: 'var(--bg-empty)' }}
        >
          <svg className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-faintest)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01" />
          </svg>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No servers configured. Add one to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {servers.map(server => (
            <div
              key={server.id}
              className="rounded-xl p-6 border"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>Server</h3>
                <button
                  onClick={() => handleRemove(server.id, server.url)}
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
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>URL</label>
                  <input
                    className="input-field-sm"
                    value={server.url}
                    onChange={e => onUpdate(server.id, 'url', e.target.value)}
                    placeholder="https://api.example.com/v1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
                  <input
                    className="input-field-sm"
                    value={server.description}
                    onChange={e => onUpdate(server.id, 'description', e.target.value)}
                    placeholder="Production server"
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

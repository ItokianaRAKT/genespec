import type { SecurityScheme } from '../models/openapi'

interface Props {
  security: SecurityScheme[]
  onAdd: () => void
  onUpdate: (id: string, field: string, value: string) => void
  onRemove: (id: string) => void
}

export function SecurityPage({ security, onAdd, onUpdate, onRemove }: Props) {
  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>Security</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Configure security schemes</p>
        </div>
        <button onClick={onAdd} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Scheme
        </button>
      </div>

      {security.length === 0 ? (
        <div
          className="rounded-xl p-12 border-2 border-dashed text-center"
          style={{ borderColor: 'var(--border-dashed)', backgroundColor: 'var(--bg-empty)' }}
        >
          <svg className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-faintest)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No security schemes configured.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {security.map(sec => (
            <div
              key={sec.id}
              className="rounded-xl p-6 border"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>Security Scheme</h3>
                <button
                  onClick={() => onRemove(sec.id)}
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
                    value={sec.name}
                    onChange={e => onUpdate(sec.id, 'name', e.target.value)}
                    placeholder="bearerAuth"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Type</label>
                  <select
                    className="input-field-sm"
                    value={sec.type}
                    onChange={e => onUpdate(sec.id, 'type', e.target.value)}
                  >
                    <option value="http">HTTP</option>
                    <option value="apiKey">API Key</option>
                    <option value="oauth2">OAuth2</option>
                    <option value="openIdConnect">OpenID Connect</option>
                  </select>
                </div>
                {sec.type === 'http' && (
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Scheme</label>
                    <select
                      className="input-field-sm"
                      value={sec.scheme || 'bearer'}
                      onChange={e => onUpdate(sec.id, 'scheme', e.target.value)}
                    >
                      <option value="bearer">Bearer</option>
                      <option value="basic">Basic</option>
                      <option value="digest">Digest</option>
                    </select>
                  </div>
                )}
                {sec.type === 'http' && sec.scheme === 'bearer' && (
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Bearer Format</label>
                    <input
                      className="input-field-sm"
                      value={sec.bearerFormat || ''}
                      onChange={e => onUpdate(sec.id, 'bearerFormat', e.target.value)}
                      placeholder="JWT"
                    />
                  </div>
                )}
                {sec.type === 'apiKey' && (
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>In</label>
                    <select
                      className="input-field-sm"
                      value={sec.in || 'header'}
                      onChange={e => onUpdate(sec.id, 'in', e.target.value)}
                    >
                      <option value="header">Header</option>
                      <option value="query">Query</option>
                      <option value="cookie">Cookie</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

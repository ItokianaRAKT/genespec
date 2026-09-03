import type { Endpoint } from '../models/openapi'
import { useConfirm } from '../components/ConfirmContext'

interface Props {
  endpoints: Endpoint[]
  selectedEndpointId: string | null
  onSelectEndpoint: (id: string) => void
  onAdd: () => void
  onUpdate: (id: string, field: string, value: unknown) => void
  onRemove: (id: string) => void
  onAddParameter: (endpointId: string) => void
  onUpdateParameter: (endpointId: string, paramId: string, field: string, value: unknown) => void
  onRemoveParameter: (endpointId: string, paramId: string) => void
  onAddResponse: (endpointId: string) => void
  onUpdateResponse: (endpointId: string, index: number, field: string, value: string) => void
  onUpdateResponseContent: (endpointId: string, index: number, mediaType: string, ref: string) => void
  onRemoveResponse: (endpointId: string, index: number) => void
}

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']

const methodColors: Record<string, string> = {
  GET: 'var(--method-get)',
  POST: 'var(--method-post)',
  PUT: 'var(--method-put)',
  PATCH: 'var(--method-patch)',
  DELETE: 'var(--method-delete)',
}

const methodBg: Record<string, string> = {
  GET: 'var(--method-get-bg)',
  POST: 'var(--method-post-bg)',
  PUT: 'var(--method-put-bg)',
  PATCH: 'var(--method-patch-bg)',
  DELETE: 'var(--method-delete-bg)',
}

const paramIns = ['query', 'path', 'header', 'cookie']
const paramTypes = ['string', 'integer', 'number', 'boolean', 'array', 'object']

export function EndpointsPage({
  endpoints,
  selectedEndpointId,
  onSelectEndpoint,
  onAdd,
  onUpdate,
  onRemove,
  onAddParameter,
  onUpdateParameter,
  onRemoveParameter,
  onAddResponse,
  onUpdateResponse,
  onUpdateResponseContent,
  onRemoveResponse,
}: Props) {
  const selected = endpoints.find(e => e.id === selectedEndpointId)
  const { confirm } = useConfirm()

  const handleRemoveEndpoint = async (id: string, path: string, method: string) => {
    const confirmed = await confirm(`Delete endpoint ${method} ${path || '/'}?`)
    if (confirmed) {
      onRemove(id)
    }
  }

  const handleRemoveParameter = async (endpointId: string, paramId: string, paramName: string) => {
    const confirmed = await confirm(`Delete parameter "${paramName || 'untitled'}"?`)
    if (confirmed) {
      onRemoveParameter(endpointId, paramId)
    }
  }

  const handleRemoveResponse = async (endpointId: string, index: number, statusCode: string) => {
    const confirmed = await confirm(`Delete response ${statusCode}?`)
    if (confirmed) {
      onRemoveResponse(endpointId, index)
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
            Add Endpoint
          </button>
        </div>
        <div className="p-2 space-y-0.5">
          {endpoints.map(ep => (
            <button
              key={ep.id}
              onClick={() => onSelectEndpoint(ep.id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm transition-colors"
              style={{
                backgroundColor: selectedEndpointId === ep.id ? 'var(--bg-active)' : 'transparent',
                color: selectedEndpointId === ep.id ? 'var(--text-heading)' : 'var(--text-secondary)',
              }}
            >
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{
                  color: methodColors[ep.method] || 'var(--method-default)',
                  backgroundColor: methodBg[ep.method] || 'var(--method-default-bg)',
                }}
              >
                {ep.method}
              </span>
              <span className="truncate font-mono text-xs">{ep.path || '/'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!selected ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Select an endpoint to edit</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>Edit Endpoint</h2>
              <button
                onClick={() => handleRemoveEndpoint(selected.id, selected.path, selected.method)}
                className="btn-small"
                style={{ color: 'var(--method-delete)' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Method</label>
                <select
                  className="input-field-sm"
                  value={selected.method}
                  onChange={e => onUpdate(selected.id, 'method', e.target.value)}
                >
                  {methods.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Path</label>
                <input
                  className="input-field-sm font-mono"
                  value={selected.path}
                  onChange={e => onUpdate(selected.id, 'path', e.target.value)}
                  placeholder="/users/{id}"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Summary</label>
              <input
                className="input-field-sm"
                value={selected.summary}
                onChange={e => onUpdate(selected.id, 'summary', e.target.value)}
                placeholder="Get a user"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
              <textarea
                className="input-field-sm resize-y"
                rows={2}
                value={selected.description}
                onChange={e => onUpdate(selected.id, 'description', e.target.value)}
                placeholder="Detailed description..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Operation ID</label>
              <input
                className="input-field-sm"
                value={selected.operationId}
                onChange={e => onUpdate(selected.id, 'operationId', e.target.value)}
                placeholder="getUserById"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.deprecated}
                  onChange={e => onUpdate(selected.id, 'deprecated', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Deprecated</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Tags (comma-separated)</label>
              <input
                className="input-field-sm"
                value={selected.tags.join(', ')}
                onChange={e => onUpdate(selected.id, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                placeholder="users, auth"
              />
            </div>

            <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: '1.5rem' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>Parameters</h3>
                <button onClick={() => onAddParameter(selected.id)} className="btn-small">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>
              {selected.parameters.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--text-faint)' }}>No parameters</p>
              ) : (
                <div className="space-y-3">
                  {selected.parameters.map(param => (
                    <div
                      key={param.id}
                      className="rounded-lg p-4 border"
                      style={{ backgroundColor: 'var(--bg-parameter)', borderColor: 'var(--border-card)' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Parameter</span>
                        <button onClick={() => handleRemoveParameter(selected.id, param.id, param.name)} style={{ color: 'var(--text-faint)' }}>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          className="input-field-sm"
                          value={param.name}
                          onChange={e => onUpdateParameter(selected.id, param.id, 'name', e.target.value)}
                          placeholder="name"
                        />
                        <select
                          className="input-field-sm"
                          value={param.in}
                          onChange={e => onUpdateParameter(selected.id, param.id, 'in', e.target.value)}
                        >
                          {paramIns.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <select
                          className="input-field-sm"
                          value={param.type}
                          onChange={e => onUpdateParameter(selected.id, param.id, 'type', e.target.value)}
                        >
                          {paramTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input
                          className="input-field-sm"
                          value={param.format || ''}
                          onChange={e => onUpdateParameter(selected.id, param.id, 'format', e.target.value)}
                          placeholder="format"
                        />
                      </div>
                      <input
                        className="input-field-sm mb-2"
                        value={param.description}
                        onChange={e => onUpdateParameter(selected.id, param.id, 'description', e.target.value)}
                        placeholder="description"
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={param.required}
                          onChange={e => onUpdateParameter(selected.id, param.id, 'required', e.target.checked)}
                          className="w-3 h-3"
                        />
                        <span className="text-[11px]" style={{ color: 'var(--text-faint)' }}>Required</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selected.method !== 'GET' && selected.method !== 'HEAD' && (
              <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: '1.5rem' }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-heading)' }}>Request Body</h3>
                <div
                  className="rounded-lg p-4 border"
                  style={{ backgroundColor: 'var(--bg-parameter)', borderColor: 'var(--border-card)' }}
                >
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={selected.requestBody?.required || false}
                      onChange={e => onUpdate(selected.id, 'requestBody', {
                        ...selected.requestBody,
                        required: e.target.checked,
                        content: selected.requestBody?.content || { 'application/json': { schema: { type: 'object' } } },
                      })}
                      className="w-3 h-3"
                    />
                    <span className="text-[11px]" style={{ color: 'var(--text-faint)' }}>Required</span>
                  </label>
                  <input
                    className="input-field-sm mb-2"
                    value={selected.requestBody?.description || ''}
                    onChange={e => onUpdate(selected.id, 'requestBody', {
                      ...selected.requestBody,
                      description: e.target.value,
                      required: selected.requestBody?.required || false,
                      content: selected.requestBody?.content || { 'application/json': { schema: { type: 'object' } } },
                    })}
                    placeholder="Request body description"
                  />
                  <input
                    className="input-field-sm font-mono"
                    value={selected.requestBody?.content?.['application/json']?.schema?.$ref || '#/components/'}
                    onChange={e => onUpdate(selected.id, 'requestBody', {
                      ...selected.requestBody,
                      required: selected.requestBody?.required || false,
                      content: {
                        'application/json': {
                          schema: e.target.value
                            ? { $ref: e.target.value }
                            : { type: 'object' },
                        },
                      },
                    })}
                    placeholder="$ref: '#/components/schemas/User'"
                  />
                </div>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border-card)', paddingTop: '1.5rem' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>Responses</h3>
                <button onClick={() => onAddResponse(selected.id)} className="btn-small">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>
              {selected.responses.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--text-faint)' }}>No responses defined (defaults to 200 OK)</p>
              ) : (
                <div className="space-y-3">
                  {selected.responses.map((res, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg p-4 border"
                      style={{ backgroundColor: 'var(--bg-parameter)', borderColor: 'var(--border-card)' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Response</span>
                        <button onClick={() => handleRemoveResponse(selected.id, idx, res.statusCode)} style={{ color: 'var(--text-faint)' }}>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          className="input-field-sm"
                          value={res.statusCode}
                          onChange={e => onUpdateResponse(selected.id, idx, 'statusCode', e.target.value)}
                          placeholder="200"
                        />
                        <input
                          className="input-field-sm col-span-2"
                          value={res.description}
                          onChange={e => onUpdateResponse(selected.id, idx, 'description', e.target.value)}
                          placeholder="description"
                        />
                      </div>
                      <div className="mt-2">
                        <input
                          className="input-field-sm font-mono"
                          value={res.content?.['application/json']?.schema?.$ref || '#/components/'}
                          onChange={e => onUpdateResponseContent(selected.id, idx, 'application/json', e.target.value)}
                          placeholder="$ref: '#/components/schemas/Error'"
                        />
                      </div>
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

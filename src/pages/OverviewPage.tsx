import type { OpenAPISpec } from '../models/openapi'

interface Props {
  spec: OpenAPISpec
}

const methodColors: Record<string, string> = {
  GET: 'var(--method-get)',
  POST: 'var(--method-post)',
  PUT: 'var(--method-put)',
  PATCH: 'var(--method-patch)',
  DELETE: 'var(--method-delete)',
}

export function OverviewPage({ spec }: Props) {
  const methodCounts: Record<string, number> = {}
  for (const ep of spec.endpoints) {
    methodCounts[ep.method] = (methodCounts[ep.method] || 0) + 1
  }
  const total = spec.endpoints.length || 1

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>
          {spec.info.title}
        </h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>{spec.info.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Endpoints', value: spec.endpoints.length },
          { label: 'Schemas', value: spec.schemas.length },
          { label: 'Servers', value: spec.servers.length },
          { label: 'Tags', value: spec.tags.length },
        ].map(stat => (
          <div
            key={stat.label}
            className="rounded-xl p-6 border"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              {stat.label}
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-heading)' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {spec.endpoints.length > 0 && (
        <div
          className="rounded-xl p-6 border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
            Method Distribution
          </p>
          <div className="space-y-3">
            {Object.entries(methodCounts).map(([method, count]) => (
              <div key={method} className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase w-16" style={{ color: methodColors[method] || 'var(--text-muted)' }}>
                  {method}
                </span>
                <div className="flex-1 rounded-full h-2.5" style={{ backgroundColor: 'var(--bg-active)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(count / total) * 100}%`,
                      backgroundColor: methodColors[method] || 'var(--text-muted)',
                    }}
                  />
                </div>
                <span className="text-sm w-8 text-right" style={{ color: 'var(--text-muted)' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className="rounded-xl p-6 border"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
      >
        <p className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          Spec Info
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-muted)' }}>Version</span>
            <span className="font-medium" style={{ color: 'var(--text-heading)' }}>{spec.info.version}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-muted)' }}>Contact</span>
            <span className="font-medium" style={{ color: 'var(--text-heading)' }}>{spec.info.contact.name || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-muted)' }}>License</span>
            <span className="font-medium" style={{ color: 'var(--text-heading)' }}>{spec.info.license.name || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

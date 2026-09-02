import type { SidebarSection } from '../models/openapi'
import type { OpenAPISpec } from '../models/openapi'
import { useTheme } from '../contexts/ThemeContext'

interface SidebarProps {
  spec: OpenAPISpec
  activeSection: SidebarSection
  onSectionChange: (section: SidebarSection) => void
  selectedEndpointId: string | null
  onSelectEndpoint: (id: string) => void
  selectedSchemaId: string | null
  onSelectSchema: (id: string) => void
}

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

const sections: { key: SidebarSection; label: string; icon: string }[] = [
  { key: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
  { key: 'info', label: 'Info', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { key: 'servers', label: 'Servers', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01' },
  { key: 'security', label: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { key: 'tags', label: 'Tags', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z' },
  { key: 'endpoints', label: 'Endpoints', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  { key: 'schemas', label: 'Schemas', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
]

export function Sidebar({
  spec,
  activeSection,
  onSectionChange,
  selectedEndpointId,
  onSelectEndpoint,
  selectedSchemaId,
  onSelectSchema,
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div
      className="w-64 flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-primary)' }}
    >
      <div
        className="px-5 py-5"
        style={{ borderBottom: '1px solid var(--border-primary)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-heading)' }}>GeneSpec</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        <div className="pt-4 pb-1 px-2 first:pt-0">
          <span
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-faint)' }}
          >
            Navigation
          </span>
        </div>
        {sections.map(s => (
          <button
            key={s.key}
            onClick={() => onSectionChange(s.key)}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-left text-sm transition-colors"
            style={{
              backgroundColor: activeSection === s.key ? 'var(--bg-active)' : 'transparent',
              color: activeSection === s.key ? 'var(--text-heading)' : 'var(--text-secondary)',
            }}
          >
            <svg className="w-4 h-4 flex-shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
            </svg>
            {s.label}
          </button>
        ))}

        {spec.endpoints.length > 0 && (
          <>
            <div className="pt-4 pb-1 px-2">
              <span
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-faint)' }}
              >
                Endpoints
              </span>
            </div>
            {spec.endpoints.map(ep => (
              <button
                key={ep.id}
                onClick={() => { onSectionChange('endpoints'); onSelectEndpoint(ep.id) }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-left text-sm transition-colors"
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
                <span className="truncate font-mono text-xs">{ep.path}</span>
              </button>
            ))}
          </>
        )}

        {spec.schemas.length > 0 && (
          <>
            <div className="pt-4 pb-1 px-2">
              <span
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-faint)' }}
              >
                Schemas
              </span>
            </div>
            {spec.schemas.map(s => (
              <button
                key={s.id}
                onClick={() => { onSectionChange('schemas'); onSelectSchema(s.id) }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-left text-sm transition-colors"
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
          </>
        )}
      </div>

      <div
        className="px-3 py-3 flex items-center justify-between"
        style={{ borderTop: '1px solid var(--border-primary)' }}
      >
        <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
          {theme === 'dark' ? 'Dark' : 'Light'} Mode
        </span>
        <button
          onClick={toggleTheme}
          className="relative w-10 h-5 rounded-full transition-colors duration-200"
          style={{ backgroundColor: theme === 'dark' ? 'var(--accent)' : 'var(--bg-active)' }}
          aria-label="Toggle theme"
        >
          <span
            className="absolute top-0.5 w-4 h-4 rounded-full transition-transform duration-200 flex items-center justify-center"
            style={{
              backgroundColor: 'white',
              transform: theme === 'dark' ? 'translateX(22px)' : 'translateX(2px)',
            }}
          >
            {theme === 'dark' ? (
              <svg className="w-2.5 h-2.5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="w-2.5 h-2.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}
          </span>
        </button>
      </div>
    </div>
  )
}

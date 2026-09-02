interface Props {
  info: {
    title: string
    description: string
    version: string
    contact: { name: string; email: string; url: string }
    license: { name: string; url: string }
  }
  onUpdate: (field: string, value: string) => void
  onContactUpdate: (field: string, value: string) => void
  onLicenseUpdate: (field: string, value: string) => void
}

export function InfoPage({ info, onUpdate, onContactUpdate, onLicenseUpdate }: Props) {
  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>API Information</h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Configure your API details</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Title</label>
          <input
            className="input-field"
            value={info.title}
            onChange={e => onUpdate('title', e.target.value)}
            placeholder="My API"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description</label>
          <textarea
            className="input-field resize-y"
            rows={3}
            value={info.description}
            onChange={e => onUpdate('description', e.target.value)}
            placeholder="A brief description of your API"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Version</label>
          <input
            className="input-field"
            value={info.version}
            onChange={e => onUpdate('version', e.target.value)}
            placeholder="1.0.0"
          />
        </div>
      </div>

      <div className="pt-8" style={{ borderTop: '1px solid var(--border-card)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>Contact</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Name</label>
            <input
              className="input-field"
              value={info.contact.name}
              onChange={e => onContactUpdate('name', e.target.value)}
              placeholder="API Support"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <input
              className="input-field"
              value={info.contact.email}
              onChange={e => onContactUpdate('email', e.target.value)}
              placeholder="support@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>URL</label>
            <input
              className="input-field"
              value={info.contact.url}
              onChange={e => onContactUpdate('url', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      <div className="pt-8" style={{ borderTop: '1px solid var(--border-card)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-heading)' }}>License</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Name</label>
            <input
              className="input-field"
              value={info.license.name}
              onChange={e => onLicenseUpdate('name', e.target.value)}
              placeholder="MIT"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>URL</label>
            <input
              className="input-field"
              value={info.license.url}
              onChange={e => onLicenseUpdate('url', e.target.value)}
              placeholder="https://opensource.org/licenses/MIT"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import type { OpenAPISpec } from '../models/openapi'
import { generateYaml } from '../services/yamlGenerator'
import { useConfirm } from './ConfirmContext'

interface YamlPreviewProps {
  spec: OpenAPISpec
  onImport: (yaml: string) => void
}

export function YamlPreview({ spec, onImport }: YamlPreviewProps) {
  const yaml = useMemo(() => generateYaml(spec), [spec])
  const lineCount = yaml.split('\n').length
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [parseError, setParseError] = useState('')
  const { confirm } = useConfirm()

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml)
  }

  const handleExport = () => {
    const blob = new Blob([yaml], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${spec.info.title.toLowerCase().replace(/\s+/g, '-')}.yaml`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePasteClick = () => {
    setIsEditing(true)
    setEditValue('')
  }

  const handleImport = async () => {
    if (editValue.trim()) {
      setParseError('')
      const confirmed = await confirm('Import this spec? Current data will be replaced.', {
        confirmLabel: 'Import',
        confirmColor: 'var(--accent)',
      })
      if (confirmed) {
        try {
          onImport(editValue)
          setIsEditing(false)
          setEditValue('')
        } catch (e: any) {
          setParseError(e.message || 'Failed to parse YAML')
        }
      }
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValue('')
    setParseError('')
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--yaml-bg)' }}>
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--yaml-border)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Live Preview
          </span>
          <span className="text-[10px] ml-1" style={{ color: 'var(--text-faintest)' }}>
            {lineCount} lines
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleImport}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-white rounded transition-colors"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Import
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors"
                style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-card-solid)' }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handlePasteClick}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors"
                style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-card-solid)' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Paste & Import
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors"
                style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-card-solid)' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-white rounded transition-colors"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {isEditing ? (
          <div className="flex flex-col h-full">
            {parseError && (
              <div
                className="px-4 py-2 text-xs"
                style={{ backgroundColor: 'var(--method-delete-bg)', color: 'var(--method-delete)' }}
              >
                {parseError}
              </div>
            )}
            <textarea
              className="flex-1 w-full p-4 text-[12px] leading-relaxed font-mono resize-none focus:outline-none"
              style={{
                backgroundColor: 'var(--yaml-bg)',
                color: 'var(--yaml-text)',
              }}
              value={editValue}
              onChange={(e) => { setEditValue(e.target.value); setParseError('') }}
              placeholder="Paste your OpenAPI YAML here..."
              autoFocus
            />
          </div>
        ) : (
          <pre
            className="p-4 text-[12px] leading-relaxed font-mono whitespace-pre"
            style={{ color: 'var(--yaml-text)' }}
          >
            {yaml}
          </pre>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'

interface ConfirmToastProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmToast({ message, onConfirm, onCancel }: ConfirmToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onCancel, 200)
  }

  const handleConfirm = () => {
    setIsVisible(false)
    setTimeout(onConfirm, 200)
  }

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-200 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateX(-50%) translateY(${isVisible ? 0 : 20}px)`,
      }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border"
        style={{
          backgroundColor: 'var(--bg-card-solid)',
          borderColor: 'var(--border-card)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--method-delete)' }}
          />
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            {message}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={handleConfirm}
            className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--method-delete)',
              color: 'white',
            }}
          >
            Delete
          </button>
          <button
            onClick={handleClose}
            className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--bg-hover)',
              color: 'var(--text-secondary)',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

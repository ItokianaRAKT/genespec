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
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200"
      style={{
        opacity: isVisible ? 1 : 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: isVisible ? 'blur(4px)' : 'none',
      }}
      onClick={handleClose}
    >
      <div
        className="flex flex-col items-center gap-4 px-6 py-5 rounded-xl shadow-xl border transition-all duration-200"
        style={{
          backgroundColor: 'var(--bg-card-solid)',
          borderColor: 'var(--border-card)',
          transform: `scale(${isVisible ? 1 : 0.95})`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--method-delete)' }}
          />
          <span
            className="text-base font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            {message}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--method-delete)',
              color: 'white',
            }}
          >
            Delete
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
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

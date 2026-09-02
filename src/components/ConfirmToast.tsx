import { useState, useEffect, useRef } from 'react'

interface ConfirmToastProps {
  message: string
  confirmLabel?: string
  confirmColor?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmToast({ message, confirmLabel = 'Delete', confirmColor = 'var(--method-delete)', onConfirm, onCancel }: ConfirmToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    timerRef.current = setTimeout(onCancel, 200)
  }

  const handleConfirm = () => {
    setIsVisible(false)
    timerRef.current = setTimeout(onConfirm, 200)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200"
      style={{
        opacity: isVisible ? 1 : 0,
        backgroundColor: isVisible ? 'rgba(0, 0, 0, 0.3)' : 'transparent',
        backdropFilter: isVisible ? 'blur(4px)' : 'none',
        pointerEvents: isVisible ? 'auto' : 'none',
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
            style={{ backgroundColor: confirmColor }}
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
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            style={{
              backgroundColor: confirmColor,
              color: 'white',
            }}
          >
            {confirmLabel}
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer"
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

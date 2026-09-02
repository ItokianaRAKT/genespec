import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { ConfirmToast } from './ConfirmToast'

interface ConfirmState {
  message: string
  confirmLabel: string
  confirmColor: string
  onConfirm: () => void
  onCancel: () => void
}

interface ConfirmOptions {
  confirmLabel?: string
  confirmColor?: string
}

interface ConfirmContextType {
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextType | null>(null)

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider')
  }
  return context
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null)

  const confirm = useCallback((message: string, options?: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        message,
        confirmLabel: options?.confirmLabel ?? 'Delete',
        confirmColor: options?.confirmColor ?? 'var(--method-delete)',
        onConfirm: () => {
          setConfirmState(null)
          resolve(true)
        },
        onCancel: () => {
          setConfirmState(null)
          resolve(false)
        },
      })
    })
  }, [])

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {confirmState && (
        <ConfirmToast
          message={confirmState.message}
          confirmLabel={confirmState.confirmLabel}
          confirmColor={confirmState.confirmColor}
          onConfirm={confirmState.onConfirm}
          onCancel={confirmState.onCancel}
        />
      )}
    </ConfirmContext.Provider>
  )
}

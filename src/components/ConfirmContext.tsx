import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { ConfirmToast } from './ConfirmToast'

interface ConfirmState {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

interface ConfirmContextType {
  confirm: (message: string) => Promise<boolean>
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

  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        message,
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
          onConfirm={confirmState.onConfirm}
          onCancel={confirmState.onCancel}
        />
      )}
    </ConfirmContext.Provider>
  )
}

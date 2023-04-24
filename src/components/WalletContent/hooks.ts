import { create } from 'zustand'

interface WalletModalState {
  visible: boolean
  toggleVisible: () => void
  setVisible: (nextValue: boolean) => void
}

export const useWalletModal = create<WalletModalState>((set) => ({
  visible: false,
  toggleVisible: () => set((state) => ({ ...state, visible: !state.visible })),
  setVisible: (nextValue) => set((state) => ({ ...state, visible: nextValue })),
}))

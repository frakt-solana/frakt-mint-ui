import { create } from 'zustand'

type ThemeType = 'light' | 'dark'

interface ThemeState {
  themeType: ThemeType
  toggleThemeType: () => void
}

export const useThemeType = create<ThemeState>((set) => ({
  themeType: 'light',
  toggleThemeType: () =>
    set((state) => ({
      ...state,
      themeType: state.themeType === 'dark' ? 'light' : 'dark',
    })),
}))

import { create } from 'zustand'

export type ThemeType = 'light' | 'dark'

interface ThemeState {
  themeType: ThemeType
  toggleThemeType: () => void
  set: (theme: ThemeType) => void
}

export const useThemeType = create<ThemeState>((set) => ({
  themeType: 'dark',
  set: (theme) =>
    set((state) => ({
      ...state,
      themeType: theme,
    })),
  toggleThemeType: () =>
    set((state) => ({
      ...state,
      themeType: state.themeType === 'dark' ? 'light' : 'dark',
    })),
}))

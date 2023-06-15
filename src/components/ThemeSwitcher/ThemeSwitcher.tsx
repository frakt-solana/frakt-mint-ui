import { useEffect, FC } from 'react'
import classNames from 'classnames'
import Switch from 'react-switch'

import { Sun, Moon } from '@frakt/icons'

import { useThemeType } from './hooks'

import styles from './styles.module.scss'

export const ThemeSwitcher: FC = () => {
  const { themeType, toggleThemeType } = useThemeType()

  useEffect(() => {
    document.documentElement.dataset.theme = themeType
    localStorage.setItem('theme', themeType)
  }, [themeType])

  const checked = themeType === 'dark'

  return <></>
}

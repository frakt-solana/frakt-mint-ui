import { FC } from 'react'
import classNames from 'classnames'

import { HeaderStateProvider, useHeaderState } from './headerState'

import styles from './AppLayout.module.scss'

interface LayoutProps {
  children: JSX.Element[] | JSX.Element
  className?: string
}

const AppLayout: FC<LayoutProps> = ({ children, className }) => {
  const { onContentScroll } = useHeaderState()

  return (
    <HeaderStateProvider>
      <div
        id="app-content"
        onScroll={onContentScroll}
        className={classNames(styles.content, className)}
      >
        {children}
      </div>
    </HeaderStateProvider>
  )
}

export default AppLayout

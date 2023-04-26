import { FC } from 'react'
import classNames from 'classnames'

import styles from './AppLayout.module.scss'

interface LayoutProps {
  children: JSX.Element[] | JSX.Element
  className?: string
}

const AppLayout: FC<LayoutProps> = ({ children, className }) => (
  <div className={classNames(styles.content, className)}>
    <div className={styles.contentInner}>{children}</div>
  </div>
)

export default AppLayout

import { FC } from 'react'
import AppLayout from '@frakt/layouts/AppLayout/AppLayout'

import styles from './RootPage.module.scss'

const RootPage: FC = () => {
  return (
    <AppLayout>
      <div className={styles.content}>
        <h2 className={styles.title}>Meet BANX</h2>
        <h3 className={styles.subtitle}>Next SOLANA blue chip</h3>
        <div className={styles.timer}>
          <h4 className={styles.numberText}>5d : 14h : 13m</h4>
          <p className={styles.smallText}>Until mint</p>
        </div>
      </div>
    </AppLayout>
  )
}

export default RootPage

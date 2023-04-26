import { FC } from 'react'
import AppLayout from '@frakt/layouts/AppLayout/AppLayout'

import styles from './RootPage.module.scss'
// import PendingMintView from './views/PendingMint'
import LiveMint from './views/LiveMint'
// import PublicMint from './views/PublicMint'

const RootPage: FC = () => {
  return (
    <AppLayout>
      <div className={styles.content}>
        {/* <PendingMintView /> */}
        <LiveMint />
        {/* <PublicMint /> */}
      </div>
    </AppLayout>
  )
}

export default RootPage

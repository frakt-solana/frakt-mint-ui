import { FC } from 'react'
import AppLayout from '@frakt/layouts/AppLayout/AppLayout'

import styles from './RootPage.module.scss'
import PendingMintView from './views/PendingMint'
import Heading from './components/Heading'
import LiveMint from './views/LiveMint'
import ProgressBar from './components/ProgressBar'

const RootPage: FC = () => {
  return (
    <AppLayout>
      <div className={styles.content}>
        <Heading />
        {/* <PendingMintView /> */}
        <LiveMint />
      </div>
    </AppLayout>
  )
}

export default RootPage

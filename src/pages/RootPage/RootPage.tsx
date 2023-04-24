import { FC } from 'react'
import AppLayout from '@frakt/layouts/AppLayout/AppLayout'

import styles from './RootPage.module.scss'
import PendingMintView from './components/PendingMintView'
import LiveMintView from './components/LiveMintView'
import Heading from './components/Heading'

const RootPage: FC = () => {
  return (
    <AppLayout>
      <div className={styles.content}>
        <Heading />
        {/* <PendingMintView /> */}
        <LiveMintView />
      </div>
    </AppLayout>
  )
}

export default RootPage

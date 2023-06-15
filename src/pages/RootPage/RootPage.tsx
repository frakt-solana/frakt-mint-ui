import { FC } from 'react'
import AppLayout from '@frakt/layouts/AppLayout/AppLayout'

import PendingMint from './views/PendingMint'
import LiveMint from './views/LiveMint'
import PublicMint from './views/PublicMint'

const RootPage: FC = () => {
  return (
    <AppLayout>
      {/* <PendingMint /> */}
      <LiveMint />
      {/* <PublicMint /> */}
    </AppLayout>
  )
}

export default RootPage

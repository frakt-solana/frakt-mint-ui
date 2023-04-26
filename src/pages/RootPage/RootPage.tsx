import { FC } from 'react'
import AppLayout from '@frakt/layouts/AppLayout/AppLayout'

// import PendingMintView from './views/PendingMint'
import LiveMint from './views/LiveMint'
// import PublicMint from './views/PublicMint'

const RootPage: FC = () => {
  return (
    <AppLayout>
      {/* <PendingMintView /> */}
      <LiveMint />
      {/* <PublicMint /> */}
    </AppLayout>
  )
}

export default RootPage

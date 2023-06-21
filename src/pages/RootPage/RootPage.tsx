import { FC } from 'react'
import AppLayout from '@frakt/layouts/AppLayout/AppLayout'

import LiveMint from './views/LiveMint'

const RootPage: FC = () => {
  return (
    <AppLayout>
      <LiveMint />
    </AppLayout>
  )
}

export default RootPage

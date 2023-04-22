import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { FC, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Router } from '@frakt/router/router'
import { ENDPOINT } from './config'

const queryClient = new QueryClient()

const App: FC = () => {
  const wallets = useMemo(() => [], [])

  return (
    <ConnectionProvider endpoint={ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App

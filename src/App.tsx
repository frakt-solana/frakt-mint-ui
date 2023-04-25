import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SlopeWalletAdapter,
  GlowWalletAdapter,
  CoinbaseWalletAdapter,
  TorusWalletAdapter,
  MathWalletAdapter,
  SolletWalletAdapter,
  ExodusWalletAdapter,
  BackpackWalletAdapter,
} from '@solana/wallet-adapter-wallets'

import { FC, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Router } from '@frakt/router/router'
import { ENDPOINT } from './config'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

const queryClient = new QueryClient()

const App: FC = () => {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SlopeWalletAdapter(),
      new GlowWalletAdapter(),
      new LedgerWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new TorusWalletAdapter(),
      new MathWalletAdapter(),
      new ExodusWalletAdapter(),
      new BackpackWalletAdapter(),
      new SolletWalletAdapter({ network: WalletAdapterNetwork.Mainnet }),
    ],
    [],
  )

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

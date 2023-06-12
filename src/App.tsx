import { FC, ReactNode, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Router } from '@frakt/router/router'
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
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
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'

import { ENDPOINT } from './config'
import { UmiContext } from './helpers/umi'
const queryClient = new QueryClient()

export const UmiProvider = ({
  endpoint,
  children,
}: {
  endpoint: string
  children: ReactNode
}) => {
  const wallet = useWallet()
  const umi = createUmi(endpoint)
    .use(walletAdapterIdentity(wallet))
    .use(mplTokenMetadata())
    .use(mplCandyMachine())

  return <UmiContext.Provider value={{ umi }}>{children}</UmiContext.Provider>
}

const App: FC = () => {
  const endpoint = 'https://api.devnet.solana.com'

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
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <UmiProvider endpoint={endpoint}>
          <QueryClientProvider client={queryClient}>
            <Router />
          </QueryClientProvider>
        </UmiProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App

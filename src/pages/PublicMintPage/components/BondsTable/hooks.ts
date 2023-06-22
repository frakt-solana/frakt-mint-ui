import { useUmi } from '@frakt/helpers/umi'
import { web3 } from 'fbonds-core'
import { Umi } from '@metaplex-foundation/umi'

import {
  fetchCandyGuard,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine'
import { borrowAndMint } from 'fbonds-core/lib/fbond-protocol/functions/bond/creation'
import {
  generateSigner,
  publicKey,
  some,
  transactionBuilder,
} from '@metaplex-foundation/umi'
import { mintV2 } from '@metaplex-foundation/mpl-candy-machine'

import { setComputeUnitLimit } from '@metaplex-foundation/mpl-essentials'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { VersionedMessage, VersionedTransaction } from '@solana/web3.js'
import {
  CANDY_MACHINE_PUBKEY,
  DESTINATION_PUBKEY,
  WL_TOKEN_MINT,
} from '@frakt/constants'
import { NFT, mintPresaleNftsQuery } from '@frakt/api/nft'
import {
  WalletContextState,
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react'
import { fetchMarketAndPairs, getBondOrderParams } from './helpers'
import { BondCartOrder } from 'fbonds-core/lib/fbond-protocol/types'
import { useAnimationStore } from '../../hooks/useWhiteListTransactions'
import { throwLogsError } from '@frakt/utils'
import { parseNft } from '@frakt/pages/RootPage/views/LiveMint/components/MintForNFTs/helpers'

export const useMintAndBorrow = ({ onCancelModal }) => {
  const umi = useUmi()
  const wallet = useWallet()
  const { connection } = useConnection()

  const setIsLoading = useAnimationStore((state) => state.setIsLoading)
  const setIsStartAnimation = useAnimationStore(
    (state) => state.setIsStartAnimation,
  )
  const setStartTxnOneByOne = useAnimationStore(
    (state) => state.setStartTxnOneByOne,
  )
  const setMintedNft = useAnimationStore((state) => state.setMintedNft)

  const onSumbit = async (nft: NFT) => {
    try {
      onCancelModal()
      setIsLoading(true)

      const { market, pairs } = await fetchMarketAndPairs(
        nft?.bondParams?.marketPubkey,
        wallet?.publicKey,
      )

      if (!market) return

      const bondOrderParams = getBondOrderParams({
        market,
        pairs,
        maxLoanValue: nft?.maxLoanValue,
      })

      const { tx: transactionMint, signers } = await makeMintTransaction({
        umi,
      })

      const result = await borrowSingleAndMint({
        nft,
        bondOrderParams: bondOrderParams?.orderParams,
        wallet,
        connection,
        transactionMint,
      })

      if (!result) {
        throw new Error('Borrow failed')
      }

      const [response] = await mintPresaleNftsQuery([
        {
          mint: signers[0]?.publicKey?.toBase58(),
          user: wallet?.publicKey?.toBase58(),
          txId: null,
        },
      ])

      console.log(response?.success, 'success')

      console.log('New metadata: ', response?.metadata)

      if (!response?.success) {
        return false
      }

      const parsedNewMetadata = parseNft(response?.metadata)

      setMintedNft(parsedNewMetadata)
      setIsStartAnimation(true)
    } catch (error) {
      throwLogsError(error)
      setIsLoading(false)
      setStartTxnOneByOne(false)
    } finally {
      setIsLoading(false)
      setStartTxnOneByOne(false)
    }
  }

  return { onSumbit }
}

type MakeMintTransaction = (params: {
  umi: Umi
}) => Promise<{ tx: web3.VersionedTransaction; signers: web3.Keypair[] }>

export const makeMintTransaction: MakeMintTransaction = async ({ umi }) => {
  const nftSigner = generateSigner(umi)
  const candyMachine = await fetchCandyMachine(
    umi,
    publicKey(CANDY_MACHINE_PUBKEY),
  )

  const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)

  const tx = transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 800_000 }))
    .add(
      mintV2(umi, {
        candyMachine: candyMachine.publicKey,
        collectionMint: candyMachine.collectionMint,
        collectionUpdateAuthority: candyMachine.authority,
        nftMint: nftSigner,
        candyGuard: candyGuard?.publicKey,
        group: some('Wls'),
        mintArgs: {
          tokenBurn: some({
            mint: publicKey(WL_TOKEN_MINT),
            amount: 1,
          }),
          freezeSolPayment: some({
            destination: publicKey(DESTINATION_PUBKEY),
            freezeSolPayment: 0,
          }),
        },
        tokenStandard: TokenStandard.ProgrammableNonFungible,
      }),
    )

  const txAndBlockhash = await tx.setLatestBlockhash(umi)
  const readyTx = txAndBlockhash.build(umi)

  const message = VersionedMessage.deserialize(readyTx.serializedMessage)
  const transactionMint = new VersionedTransaction(message, readyTx.signatures)
  const rightNftSigner = web3.Keypair.fromSecretKey(nftSigner.secretKey)
  transactionMint.sign([rightNftSigner])
  const signers: web3.Keypair[] = []
  signers.push(rightNftSigner)

  return { tx: transactionMint, signers }
}

const borrowSingleAndMint = async ({
  nft,
  bondOrderParams,
  connection,
  wallet,
  transactionMint,
}: {
  nft: NFT
  bondOrderParams: BondCartOrder[]
  connection: web3.Connection
  wallet: WalletContextState
  transactionMint: web3.VersionedTransaction
}) => {
  const order = {
    borrowNft: {
      mint: nft.mint,
      bondParams: {
        marketPubkey: nft?.bondParams?.marketPubkey,
        whitelistEntry: {
          publicKey: nft.bondParams?.whitelistEntry?.publicKey,
          fraktMarket: nft.bondParams?.fraktMarket,
        },
        oracleFloor: nft.bondParams?.oracleFloor,
      },
    },
    bondOrderParams,
  }

  return await borrowAndMint({
    notBondTxns: [],
    orders: [order],
    connection,
    wallet,
    isLedger: false,
    skipPreflight: false,
    transactionMint,

    onAfterSend: () => {},
    onError: () => {},
    onSuccess: () => {},
  })
}

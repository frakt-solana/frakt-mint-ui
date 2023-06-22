import { mintPresaleNftsQuery } from '@frakt/api/nft'
import { CANDY_MACHINE_PUBKEY, RECEIVER_PUBKEY } from '@frakt/constants'
import { useUmi } from '@frakt/helpers/umi'
import {
  MintedNft,
  parseNft,
} from '@frakt/pages/RootPage/views/LiveMint/components/MintForNFTs/helpers'
import { encodeSignature, throwLogsError } from '@frakt/utils'
import {
  fetchCandyGuard,
  fetchCandyMachine,
  mintV2,
} from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-essentials'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import {
  base58PublicKey,
  generateSigner,
  publicKey,
  some,
  transactionBuilder,
} from '@metaplex-foundation/umi'
import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'

export const usePublicMint = () => {
  const umi = useUmi()
  const wallet = useWallet()
  const { connected } = useWallet()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isStartAnimation, setIsStartAnimation] = useState<boolean>(false)
  const [mintedNft, setMintedNft] = useState<MintedNft>(null)
  const [startTxnOneByOne, setStartTxnOneByOne] = useState(false)

  const onSubmit = async () => {
    try {
      setIsLoading(true)

      const candyMachine = await fetchCandyMachine(
        umi,
        publicKey(CANDY_MACHINE_PUBKEY),
      )

      const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)

      const nftSigner = generateSigner(umi)

      const tx = transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 800_000 }))
        .add(
          mintV2(umi, {
            candyMachine: candyMachine.publicKey,
            collectionMint: candyMachine.collectionMint,
            collectionUpdateAuthority: candyMachine.authority,
            nftMint: nftSigner,
            candyGuard: candyGuard?.publicKey,
            group: some('Public'),
            mintArgs: {
              freezeSolPayment: some({
                destination: publicKey(RECEIVER_PUBKEY),
                freezeSolPayment: 0,
              }),
            },
            tokenStandard: TokenStandard.ProgrammableNonFungible,
          }),
        )

      const { signature, result } = await tx.sendAndConfirm(umi, {
        confirm: { commitment: 'finalized' },
        send: { skipPreflight: true },
      })

      const encodedSignature = encodeSignature(signature)

      if (result.value.err !== null) {
        return false
      }

      const [response] = await mintPresaleNftsQuery([
        {
          mint: base58PublicKey(nftSigner?.publicKey?.bytes),
          user: wallet?.publicKey?.toBase58(),
          txId: encodedSignature,
        },
      ])

      if (result.value.err !== null) {
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

  const showReveal = isStartAnimation || isLoading
  const showConnectedState = connected && !showReveal && !startTxnOneByOne

  const handleResetAnimation = () => {
    setIsStartAnimation(false)
    setIsLoading(false)
    setStartTxnOneByOne(true)
  }

  return {
    mintedNft,
    startTxnOneByOne,

    onSubmit,
    showReveal,
    showConnectedState,

    handleResetAnimation,
    isLoading,
  }
}

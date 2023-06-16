import { useEffect, useState } from 'react'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-essentials'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import {
  generateSigner,
  publicKey,
  some,
  transactionBuilder,
  base58PublicKey,
} from '@metaplex-foundation/umi'
import {
  fetchCandyGuard,
  fetchCandyMachine,
  mintV2,
} from '@metaplex-foundation/mpl-candy-machine'

import { CANDY_MACHINE_PUBKEY, DESTINATION_PUBKEY } from '@frakt/constants'
import { throwLogsError } from '@frakt/utils'
import { useUmi } from '@frakt/helpers/umi'

import {
  MintedNft,
  getCertainGroupByNft,
  getMetadataByCertainNft,
} from '../helpers'
import { useSelectedNFTs } from './../nftsState'
import { useWalletNfts } from './useWalletNfts'

export const useMintForNFTs = () => {
  const { connection } = useConnection()
  const { publicKey: walletPublicKey } = useWallet()

  const { nfts } = useWalletNfts()
  const umi = useUmi()

  const [isBulkMint, setIsBulkMint] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isStartAnimation, setIsStartAnimation] = useState<boolean>(false)

  const [mintedNft, setMintedNft] = useState<MintedNft>(null)

  const {
    selection,
    toggleLoanInSelection,
    clearSelection,
    findLoanInSelection,
    setSelection,
  } = useSelectedNFTs()

  useEffect(() => {
    if (!selection?.length && nfts?.length && !isBulkMint) {
      toggleLoanInSelection(nfts[0])
    }
  }, [nfts, isBulkMint, selection])

  useEffect(() => {
    clearSelection()
  }, [walletPublicKey])

  const selectedNft = selection[0]

  const defaultImage = selection?.length
    ? selectedNft?.imageUrl
    : nfts[0]?.imageUrl

  const onSelectNFTs = (): void => {
    if (selection.length) {
      clearSelection()
    } else {
      setSelection(nfts)
    }
  }

  const onSingleMint = async () => {
    try {
      setIsLoading(true)

      //TODO: need fetch ceartain CANDY_MACHINE_PUBKEY for each nft

      const candyMachine = await fetchCandyMachine(
        umi,
        publicKey(CANDY_MACHINE_PUBKEY),
      )

      const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)
      const group = getCertainGroupByNft(selectedNft)
      const nftMint = generateSigner(umi)

      const mintArgs = {
        nftPayment: some({
          mint: publicKey(selectedNft?.mint),
          destination: publicKey(DESTINATION_PUBKEY),
          tokenStandard: TokenStandard.NonFungible,
        }),
      }

      const tx = transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 600_000 }))
        .add(
          mintV2(umi, {
            candyMachine: candyMachine.publicKey,
            collectionMint: candyMachine.collectionMint,
            collectionUpdateAuthority: candyMachine.authority,
            nftMint,
            candyGuard: candyGuard?.publicKey,
            group: some(group),
            mintArgs,
            tokenStandard: TokenStandard.ProgrammableNonFungible,
          }),
        )

      const { result } = await tx.sendAndConfirm(umi, {
        confirm: { commitment: 'finalized' },
        send: {
          skipPreflight: true,
        },
      })

      const receivedNftMint = base58PublicKey(nftMint?.publicKey?.bytes)

      console.log('TRANSACTION RESULT: ', result)

      if (result.value.err !== null) {
        return
      }

      const nft = await getMetadataByCertainNft({
        nftMint: receivedNftMint,
        connection,
      })

      if (!nft?.mint) {
        return
      }

      setMintedNft(nft)
      setIsStartAnimation(true)
    } catch (error) {
      throwLogsError(error)
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    nfts,
    onSelectNFTs,
    toggleLoanInSelection,
    clearSelection,
    findLoanInSelection,
    selection,
    onSubmit: onSingleMint,
    isBulkMint,
    setIsBulkMint,
    isLoading,
    isStartAnimation,
    defaultImage,
    mintedNft,
    selectedNft,
  }
}

import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-essentials'
import {
  generateSigner,
  publicKey,
  some,
  transactionBuilder,
} from '@metaplex-foundation/umi'
import {
  fetchCandyGuard,
  fetchCandyMachine,
  mintV2,
} from '@metaplex-foundation/mpl-candy-machine'
import { useUmi } from '@frakt/helpers/umi'

import { throwLogsError } from '@frakt/utils'

import { useDevnetWalletNfts, useWalletNfts } from './useWalletNfts'
import { useSelectedNFTs } from './../nftsState'
import { CANDY_MACHINE_PUBKEY, RECEIVER_PUBKEY } from '@frakt/constants'

export const useMintForNFTs = () => {
  const { nfts } = useWalletNfts()
  // const { devnetNfts: nfts } = useDevnetWalletNfts()
  const umi = useUmi()

  const {
    selection,
    toggleLoanInSelection,
    clearSelection,
    findLoanInSelection,
    setSelection,
  } = useSelectedNFTs()

  const onSelectNFTs = (): void => {
    if (selection.length) {
      clearSelection()
    } else {
      setSelection(nfts)
    }
  }

  const onSubmit = async () => {
    try {
      const candyMachine = await fetchCandyMachine(
        umi,
        publicKey(CANDY_MACHINE_PUBKEY),
      )

      const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)

      const nftMint = generateSigner(umi)

      const tx = transactionBuilder()
        .add(setComputeUnitLimit(umi, { units: 600_000 }))
        .add(
          mintV2(umi, {
            candyMachine: candyMachine.publicKey,
            collectionMint: candyMachine.collectionMint,
            collectionUpdateAuthority: candyMachine.authority,
            nftMint: nftMint.publicKey,
            candyGuard: candyGuard?.publicKey,
            group: some('OGs'),
            mintArgs: {
              tokenGate: some({
                mint: publicKey('FPMRWy8QY4Qi6myiDwTpsEkU2AHQ8KUfiqKVsDHkQQ6N'),
                amount: 1,
              }),
              solPayment: some({
                lamports: 0,
                destination: publicKey(RECEIVER_PUBKEY),
              }),
            },
            tokenStandard: TokenStandard.ProgrammableNonFungible,
          }),
        )

      const { signature, result } = await tx.sendAndConfirm(umi, {
        confirm: { commitment: 'finalized' },
        send: {
          skipPreflight: true,
        },
      })

      console.log(signature, 'signature')
      console.log(result, `TRANSACTION RESULT: ${result}`)

      if (result.value.err !== null) {
        //? Transaction failed
      }

      //? Transaction completed successfully
    } catch (error) {
      throwLogsError(error)
    }
  }

  return {
    nfts,
    onSelectNFTs,
    toggleLoanInSelection,
    clearSelection,
    findLoanInSelection,
    selection,
    onSubmit,
  }
}

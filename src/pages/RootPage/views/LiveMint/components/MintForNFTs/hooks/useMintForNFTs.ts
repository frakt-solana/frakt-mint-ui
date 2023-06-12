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

import { useDevnetWalletNfts } from './useWalletNfts'
import { useSelectedNFTs } from './../nftsState'

export const useMintForNFTs = () => {
  // const { nfts } = useWalletNfts()
  const { devnetNfts: nfts } = useDevnetWalletNfts()
  const umi = useUmi()

  console.log(
    nfts.filter(
      ({ pubkey }) =>
        pubkey?.toBase58() === 'Enz6YisCetoX6ybF4WQDWVBpyNMupHKnJxHYWPeF4kZz',
    ),
  )

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
        publicKey('4JNrYHaw6nKno1iLjWYR1pDqZboLTRVBfCdd89VAJPre'),
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
                destination: publicKey(
                  'DhbQatLWDf7TqYvmiwMPK4HKBasrjS2KkUtBUHyoDaQP',
                ),
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
    findLoanInSelection,
    selection,
    onSubmit,
  }
}

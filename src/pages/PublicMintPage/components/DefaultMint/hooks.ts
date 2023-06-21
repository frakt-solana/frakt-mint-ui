import { CANDY_MACHINE_PUBKEY, RECEIVER_PUBKEY } from '@frakt/constants'
import { useUmi } from '@frakt/helpers/umi'
import { encodeSignature, throwLogsError } from '@frakt/utils'
import {
  fetchCandyGuard,
  fetchCandyMachine,
  mintV2,
} from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-essentials'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import {
  generateSigner,
  publicKey,
  some,
  transactionBuilder,
} from '@metaplex-foundation/umi'
import { useState } from 'react'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'

export const usePublicMint = () => {
  const umi = useUmi()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isStartAnimation, setIsStartAnimation] = useState<boolean>(false)

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
        .add(setComputeUnitLimit(umi, { units: 600_000 }))
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
        send: {
          skipPreflight: true,
        },
      })

      const encodedSignature = encodeSignature(signature)

      if (result.value.err !== null) {
        return false
      }
      setIsStartAnimation(true)
    } catch (error) {
      console.log(error)
      throwLogsError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const showReveal = isStartAnimation || isLoading

  const handleResetAnimation = () => {
    setIsStartAnimation(false)
    setIsLoading(false)
  }

  return { onSubmit, showReveal, handleResetAnimation, isLoading }
}

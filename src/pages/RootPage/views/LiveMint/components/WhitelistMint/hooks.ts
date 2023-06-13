import { throwLogsError } from '@frakt/utils'
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
import {
  CANDY_MACHINE_PUBKEY,
  RECEIVER_PUBKEY,
  WL_TOKEN_MINT,
} from '@frakt/constants'

export const useWhitelostMint = () => {
  const umi = useUmi()

  const onSubmit = async () => {
    try {
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
            group: some('Wls'),
            mintArgs: {
              tokenBurn: some({
                mint: publicKey(WL_TOKEN_MINT),
                amount: 1,
              }),
              solPayment: some({
                lamports: 10000000000,
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
      console.log(error)
      throwLogsError(error)
    }
  }

  return { onSubmit }
}
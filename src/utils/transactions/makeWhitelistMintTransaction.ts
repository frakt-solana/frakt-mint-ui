import { DESTINATION_PUBKEY } from './../../constants/index'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-essentials'
import { mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import { CANDY_MACHINE_PUBKEY, WL_TOKEN_MINT } from '@frakt/constants'
import {
  fetchCandyGuard,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine'
import {
  generateSigner,
  publicKey,
  some,
  transactionBuilder,
} from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { VersionedMessage, VersionedTransaction } from '@solana/web3.js'
import { web3 } from '@project-serum/anchor'

export const buildPublicMintTransaction = async ({ umi }) => {
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

  return { transaction: tx, nftSigner }
}

export const makeWhitelistMintTransaction = async ({ umi }) => {
  const { transaction, nftSigner } = await buildPublicMintTransaction({
    umi,
  })

  const txAndBlockhash = await transaction.setLatestBlockhash(umi)
  const readyTx = txAndBlockhash.build(umi)

  const message = VersionedMessage.deserialize(readyTx.serializedMessage)
  const transactionMint = new VersionedTransaction(message, readyTx.signatures)
  const rightNftSigner = web3.Keypair.fromSecretKey(nftSigner.secretKey)
  transactionMint.sign([rightNftSigner])

  return { transactionMint, nftSigner }
}

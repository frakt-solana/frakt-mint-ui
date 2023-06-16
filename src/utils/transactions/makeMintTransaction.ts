import {
  KeypairSigner,
  TransactionBuilder,
  Umi,
} from '@metaplex-foundation/umi'
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
import { mintV2 } from '@metaplex-foundation/mpl-candy-machine'

import { setComputeUnitLimit } from '@metaplex-foundation/mpl-essentials'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { VersionedMessage, VersionedTransaction } from '@solana/web3.js'
import { web3 } from '@project-serum/anchor'
import { DESTINATION_PUBKEY } from '@frakt/constants'

type MakeMintTransaction = (params: {
  umi: Umi
  group: string
  candyMachineAddress: string
  selectedNftMint: string
}) => Promise<web3.VersionedTransaction>

export const makeMintTransaction: MakeMintTransaction = async ({
  umi,
  group,
  candyMachineAddress,
  selectedNftMint,
}) => {
  const { transaction, nftSigner } = await buildMintTransaction({
    umi,
    group,
    candyMachineAddress,
    selectedNftMint,
  })

  const txAndBlockhash = await transaction.setLatestBlockhash(umi)
  const readyTx = txAndBlockhash.build(umi)

  const message = VersionedMessage.deserialize(readyTx.serializedMessage)
  const transactionMint = new VersionedTransaction(message, readyTx.signatures)
  const rightNftSigner = web3.Keypair.fromSecretKey(nftSigner.secretKey)
  transactionMint.sign([rightNftSigner])

  return transactionMint
}

type BuildMintTransaction = (params: {
  umi: Umi
  group: string
  candyMachineAddress: string
  selectedNftMint: string
}) => Promise<{ transaction: TransactionBuilder; nftSigner: KeypairSigner }>

export const buildMintTransaction: BuildMintTransaction = async ({
  umi,
  group,
  candyMachineAddress,
  selectedNftMint,
}) => {
  const nftSigner = generateSigner(umi)
  const candyMachine = await fetchCandyMachine(
    umi,
    publicKey(candyMachineAddress),
  )

  const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)

  const tx = transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 600_000 }))
    .add(
      mintV2(umi, {
        candyMachine: candyMachine.publicKey,
        collectionMint: candyMachine.collectionMint,
        collectionUpdateAuthority: candyMachine.authority,
        nftMint: nftSigner,
        candyGuard: candyGuard?.publicKey,
        group: some(group),
        mintArgs: {
          nftPayment: some({
            mint: publicKey(selectedNftMint),
            destination: publicKey(DESTINATION_PUBKEY),
            tokenStandard: TokenStandard.NonFungible,
          }),
        },
        tokenStandard: TokenStandard.ProgrammableNonFungible,
      }),
    )

  return { transaction: tx, nftSigner }
}

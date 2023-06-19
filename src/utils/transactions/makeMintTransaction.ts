import { DESTINATION_PUBKEY } from '@frakt/constants'
import {
  fetchCandyGuard,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine'
import { mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-essentials'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import {
  KeypairSigner,
  TransactionBuilder,
  Umi,
} from '@metaplex-foundation/umi'
import {
  generateSigner,
  publicKey,
  some,
  transactionBuilder,
} from '@metaplex-foundation/umi'
import { web3 } from '@project-serum/anchor'
import { VersionedMessage, VersionedTransaction } from '@solana/web3.js'

type MakeMintTransaction = (params: {
  umi: Umi
  group: string
  candyMachineAddress: string
  selectedNftMint: string
}) => Promise<{
  transactionMint: web3.VersionedTransaction
  nftSigner: KeypairSigner
}>

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

  return { transactionMint, nftSigner }
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

  console.log('group: ', group)

  const tx = transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 800_000 }))
    .add(
      mintV2(umi, {
        candyMachine: candyMachine.publicKey,
        collectionMint: candyMachine.collectionMint,
        collectionUpdateAuthority: candyMachine.authority,
        nftMint: nftSigner,
        candyGuard: candyGuard?.publicKey,
        group: some(group),
        mintArgs: {
          freezeSolPayment: some({
            destination: publicKey(DESTINATION_PUBKEY),
          }),
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

import { Connection, PublicKey } from '@solana/web3.js'
import { web3 } from '@project-serum/anchor'
import { programs } from '@metaplex/js'
import axios from 'axios'
import BN from 'bn.js'

import { getAllUserTokens } from '../accounts'

export type NFTMetadata = {
  pubkey?: PublicKey
  mint: PublicKey
  isFrozen: boolean
  onchainMetadata: programs.metadata.MetadataData
  externalMetadata: {
    attributes: Array<any>
    collection: any
    description: string
    edition: number
    external_url: string
    image: string
    name: string
    properties: {
      files: Array<string>
      category: string
      creators: Array<{
        pubKey: string
        address: string
      }>
    }
    seller_fee_basis_points: number
  }
}

const {
  metadata: { Metadata },
} = programs

const getNFTMetadata = async (
  token: {
    pubkey: web3.PublicKey
    mint: web3.PublicKey
    state: number
  },
  conn: Connection,
): Promise<NFTMetadata | undefined> => {
  try {
    const metadataPDA = await Metadata.getPDA(token.mint)
    const onchainMetadata = (await Metadata.load(conn, metadataPDA)).data
    const externalMetadata = (await axios.get(onchainMetadata.data.uri)).data

    return {
      pubkey: token.pubkey || undefined,
      mint: token.mint,
      isFrozen: token.state === 2,
      onchainMetadata,
      externalMetadata,
    }
  } catch (error) {
    console.error(`failed to pull metadata for token ${token.mint.toBase58()}`)
  }
}

export const getNFTMetadataForMany = async (
  tokens: {
    pubkey: web3.PublicKey
    mint: web3.PublicKey
    state: number
  }[],
  conn: Connection,
): Promise<NFTMetadata[]> => {
  const promises: Promise<NFTMetadata | undefined>[] = []
  tokens.forEach((token) => promises.push(getNFTMetadata(token, conn)))
  const nfts = (await Promise.all(promises)).filter((n) => !!n)
  return nfts
}

export const getNFTsByOwner = async (
  owner: PublicKey,
  conn: Connection,
): Promise<NFTMetadata[]> => {
  const tokenAccounts = await getAllUserTokens({
    connection: conn,
    walletAddress: owner,
  })

  const tokens = tokenAccounts
    .filter((tokenAccount) => {
      const { amount } = tokenAccount
      return amount.eq(new BN(1))
    })
    .map((tokenAccount) => {
      return {
        pubkey: tokenAccount.pubkey,
        mint: tokenAccount.mint,
        state: tokenAccount.state,
      }
    })

  return await getNFTMetadataForMany(tokens, conn)
}

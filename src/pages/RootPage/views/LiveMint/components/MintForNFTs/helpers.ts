import { web3 } from '@project-serum/anchor'

import { getNFTMetadata } from '@frakt/utils/nfts/'
import { NFT } from '@frakt/api/nft'
import {
  FRAKTS_GROUP,
  FRAKT_CREATOR,
  GNOMIES_GROUP,
  GNOMIE_CREATOR,
  creators,
} from '@frakt/constants'

export interface MintedNft {
  mint: string
  name: string
  imageUrl: string
}

const parseNft = (nft: any): MintedNft => {
  return {
    mint: nft?.mint?.toBase58(),
    name: nft?.externalMetadata?.name,
    imageUrl: nft?.externalMetadata?.image,
  }
}

export const getCertainGroupByNft = (nft: NFT): string => {
  const creator = creators.find(
    (creator) =>
      creator === nft?.bondParams?.whitelistEntry?.whitelistedAddress,
  )

  if (creator === FRAKT_CREATOR) return FRAKTS_GROUP
  if (creator === GNOMIE_CREATOR) return GNOMIES_GROUP

  return ''
}

export const getMetadataByCertainNft = async ({
  nftMint,
  connection,
}: {
  nftMint: string
  connection: web3.Connection
}) => {
  const token = {
    pubkey: undefined,
    mint: new web3.PublicKey(nftMint),
    state: null,
  }
  const nft = await getNFTMetadata(token, connection)
  console.log(nft)

  const parsedNft = parseNft(nft)

  return parsedNft
}

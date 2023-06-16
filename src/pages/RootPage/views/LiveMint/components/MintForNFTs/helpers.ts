import { web3 } from '@project-serum/anchor'

import { getNFTMetadata } from '@frakt/utils/nfts/'

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

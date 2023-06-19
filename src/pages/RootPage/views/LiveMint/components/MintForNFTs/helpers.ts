import { NFT } from '@frakt/api/nft'
import {
  FRAKTS_GROUP,
  FRAKT_CREATOR,
  GNOMIES_GROUP,
  GNOMIE_CREATOR,
  creators,
} from '@frakt/constants'
import { getNFTMetadata } from '@frakt/utils/nfts/'
import { web3 } from '@project-serum/anchor'

export interface MintedNft {
  mint: string
  name: string
  imageUrl: string
  attributes: {
    rarity: string
    body: string
    background: string
    fur: string
    eyes: string
  }
}

const findAttributeValue = (attributes: any[], traitType: string) => {
  const attribute = attributes.find(
    ({ trait_type }) => trait_type === traitType,
  )
  return attribute ? attribute.value : undefined
}

export const parseNft = (nft: any): MintedNft => {
  const { name, image, attributes } = nft

  const rarity = findAttributeValue(attributes, 'Tier')
  const body = findAttributeValue(attributes, 'Body')
  const fur = findAttributeValue(attributes, 'Fur')
  const background = findAttributeValue(attributes, 'Background')
  const eyes = findAttributeValue(attributes, 'Eyes')

  return {
    mint: name,
    name,
    imageUrl: image,
    attributes: {
      rarity,
      body,
      fur,
      background,
      eyes,
    },
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

  // const parsedNft = parseNft(nft)

  return nft
}

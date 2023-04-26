import { NFTMetadata } from '@frakt/utils/nfts'

export interface NFT {
  nftMint: string
  collectionName: string
  collectionImage: string
}

export const mapNFTsAccounts = (NFTs: NFTMetadata[]): NFT[] => {
  return NFTs.map((nft) => {
    return {
      nftMint: nft.mint?.toBase58(),
      collectionName: nft.externalMetadata.name,
      collectionImage: nft.externalMetadata.image,
    }
  })
}

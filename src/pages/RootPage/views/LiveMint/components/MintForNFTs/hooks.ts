import { NFT, mapNFTsAccounts } from './helpers'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { getNFTsByOwner } from '@frakt/utils/nfts'
import { useEffect, useState } from 'react'
import { useSelectedNFTs } from './nftsState'
import { throwLogsError } from '@frakt/utils'

export const useFetchAllUserNFTs = () => {
  const [nfts, setNfts] = useState<NFT[]>([])
  const { publicKey } = useWallet()
  const { connection } = useConnection()

  useEffect(() => {
    ;(async () => {
      if (!!publicKey) {
        const userNfts = await getNFTsByOwner(publicKey, connection)
        const nfts = mapNFTsAccounts(userNfts)
        setNfts(nfts)
      }
    })()
  }, [publicKey])

  return { nfts }
}

export const useMintForNFTs = () => {
  const { nfts } = useFetchAllUserNFTs()
  const {
    selection,
    toggleLoanInSelection,
    clearSelection,
    findLoanInSelection,
    setSelection,
  } = useSelectedNFTs()

  const onSelectNFTs = (): void => {
    if (selection.length) {
      clearSelection()
    } else {
      setSelection(nfts)
    }
  }

  const onSubmit = async () => {
    try {
      Promise.resolve(() => console.log(selection))
    } catch (error) {
      throwLogsError(error)
    }
  }

  return {
    nfts,
    onSelectNFTs,
    toggleLoanInSelection,
    findLoanInSelection,
    selection,
    onSubmit,
  }
}

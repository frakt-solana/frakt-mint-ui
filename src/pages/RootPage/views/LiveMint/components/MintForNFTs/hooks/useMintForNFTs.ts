import { throwLogsError } from '@frakt/utils'

import { useSelectedNFTs } from './../nftsState'
import { useWalletNfts } from './useWalletNfts'

export const useMintForNFTs = () => {
  const { nfts } = useWalletNfts()
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

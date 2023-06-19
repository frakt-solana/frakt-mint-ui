import { create } from 'zustand'
import produce from 'immer'

import { NFT } from '@frakt/api/nft'

interface SelectedNFTsState {
  selection: NFT[]
  setSelection: (selection: NFT[]) => void
  findLoanInSelection: (nftPubkey: string) => NFT | null
  addLoanToSelection: (nft: NFT) => void
  removeLoanFromSelection: (nftPubkey: string) => void
  toggleNftInSelection: (nft: NFT) => void
  clearSelection: () => void
}

export const useSelectedNFTs = create<SelectedNFTsState>((set, get) => ({
  selection: [],
  setSelection: (selection) => {
    set(
      produce((state: SelectedNFTsState) => {
        state.selection = selection
      }),
    )
  },
  findLoanInSelection: (nftPubkey) => {
    const { selection } = get()
    return selection.find(({ mint }) => mint === nftPubkey) ?? null
  },
  addLoanToSelection: (nft) => {
    set(
      produce((state: SelectedNFTsState) => {
        state.selection.push(nft)
      }),
    )
  },
  removeLoanFromSelection: (nftPubkey) => {
    set(
      produce((state: SelectedNFTsState) => {
        state.selection = state.selection.filter(
          ({ mint }) => mint !== nftPubkey,
        )
      }),
    )
  },
  clearSelection: () => {
    set(
      produce((state: SelectedNFTsState) => {
        state.selection = []
      }),
    )
  },
  toggleNftInSelection: (nft: NFT) => {
    const { findLoanInSelection, addLoanToSelection, removeLoanFromSelection } =
      get()
    const isLoanInSelection = !!findLoanInSelection(nft.mint)
    isLoanInSelection
      ? removeLoanFromSelection(nft.mint)
      : addLoanToSelection(nft)
  },
}))

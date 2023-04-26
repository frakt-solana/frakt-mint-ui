import { create } from 'zustand'
import produce from 'immer'
import { NFT } from './helpers'

interface SelectedNFTsState {
  selection: NFT[]
  setSelection: (selection: NFT[]) => void
  findLoanInSelection: (nftPubkey: string) => NFT | null
  addLoanToSelection: (nft: NFT) => void
  removeLoanFromSelection: (nftPubkey: string) => void
  toggleLoanInSelection: (nft: NFT) => void
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
    return selection.find(({ nftMint }) => nftMint === nftPubkey) ?? null
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
          ({ nftMint }) => nftMint !== nftPubkey,
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
  toggleLoanInSelection: (loan: NFT) => {
    const { findLoanInSelection, addLoanToSelection, removeLoanFromSelection } =
      get()
    const isLoanInSelection = !!findLoanInSelection(loan.nftMint)
    isLoanInSelection
      ? removeLoanFromSelection(loan.nftMint)
      : addLoanToSelection(loan)
  },
}))

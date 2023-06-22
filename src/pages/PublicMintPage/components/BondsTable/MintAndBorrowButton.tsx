import { NFT } from '@frakt/api/nft'
import { Button } from '@frakt/components/Button'
import { FC } from 'react'

import styles from './BondsTable.module.scss'
import { useMintAndBorrow } from './hooks'
import { MINT_PRICE } from '@frakt/constants'

const MintAndBorrowButton: FC<{ nft?: NFT; onCancelModal: () => void }> = ({
  nft,
  onCancelModal,
}) => {
  const { onSumbit } = useMintAndBorrow({ onCancelModal })

  return (
    <Button
      onClick={() => onSumbit(nft)}
      className={styles.button}
      type="secondary"
    >
      Mint for {(nft?.maxLoanValue / 1e9 - MINT_PRICE)?.toFixed(2)} ◎
    </Button>
  )
}

export default MintAndBorrowButton

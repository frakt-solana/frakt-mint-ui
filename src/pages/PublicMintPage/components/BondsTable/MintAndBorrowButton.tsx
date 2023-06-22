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

  const mintValue = parseFloat(
    (nft?.maxLoanValue / 1e9 - MINT_PRICE)?.toFixed(2),
  )

  return (
    <Button
      onClick={() => onSumbit(nft)}
      className={styles.button}
      type="secondary"
    >
      Mint for {mintValue > 0 ? 0 : mintValue * -1} ◎
    </Button>
  )
}

export default MintAndBorrowButton

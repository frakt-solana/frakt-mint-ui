import { NFT } from '@frakt/api/nft'
import { Button } from '@frakt/components/Button'
import { FC } from 'react'

import styles from './BondsTable.module.scss'
import { useMintAndBorrow } from './hooks'

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
      Mint use this for 4.5◎
    </Button>
  )
}

export default MintAndBorrowButton

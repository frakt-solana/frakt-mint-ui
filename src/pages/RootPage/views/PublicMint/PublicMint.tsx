import { FC } from 'react'

import { Button } from '@frakt/components/Button'
import { MINT_PRICE } from '@frakt/constants'
import { Solana } from '@frakt/icons'

import Heading from '../../components/Heading'

import styles from './PublicMint.module.scss'

const PublicMint: FC = () => {
  return (
    <div className={styles.container}>
      <Heading />
      <h4 className={styles.totalMinted}>5,000/20,000</h4>
      <div className={styles.mintInfo}>
        <p>Mint price</p>
        <p className={styles.mintPrice}>
          {MINT_PRICE} <Solana />
        </p>
      </div>
      <Button className={styles.button}>Mint</Button>
    </div>
  )
}

export default PublicMint

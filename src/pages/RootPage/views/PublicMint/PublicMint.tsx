import { FC } from 'react'

import { StatsValues } from '@frakt/components/StatsValues'
import { Button } from '@frakt/components/Button'
import { MINT_PRICE } from '@frakt/constants'

import Heading from '../../components/Heading'

import styles from './PublicMint.module.scss'

const PublicMint: FC = () => {
  return (
    <div className={styles.container}>
      <Heading />
      <div className={styles.content}>
        <h4 className={styles.totalMinted}>5,000/20,000</h4>
        <StatsValues label="Mint price" value={MINT_PRICE}></StatsValues>
        <Button type="secondary" className={styles.button}>
          Mint
        </Button>
      </div>
    </div>
  )
}

export default PublicMint

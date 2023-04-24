import { FC } from 'react'
import { Button } from '@frakt/components/Button'

import styles from './LiveMint.module.scss'

const LiveMintView: FC = () => {
  return (
    <div className={styles.container}>
      <h4 className={styles.totalMinted}>5,000/20,000</h4>
      <div className={styles.buttonWrapper}>
        <Button className={styles.button} type="secondary">
          I have FRAKT or PG
        </Button>
        <Button className={styles.button} type="secondary">
          I have WL
        </Button>
      </div>
    </div>
  )
}

export default LiveMintView

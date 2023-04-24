import { FC, useState } from 'react'
import { Button } from '@frakt/components/Button'

import WhitelistMint from './components/WhitelistMint/WhitelistMint'
import ProgressBar from '../../components/ProgressBar'

import styles from './LiveMint.module.scss'

enum MintTypes {
  WHITELIST = 'whitelist',
  FOR_NFTS = 'nfts',
}

const LiveMintView: FC = () => {
  const [mintType, setMintType] = useState<MintTypes>(null)

  const onBack = () => setMintType(null)

  return (
    <div className={styles.container}>
      <h4 className={styles.totalMinted}>5,000/20,000</h4>
      <ProgressBar value={3000} />
      {mintType === null && (
        <div className={styles.buttonWrapper}>
          <Button
            onClick={() => setMintType(MintTypes.FOR_NFTS)}
            className={styles.button}
            type="secondary"
          >
            I have FRAKT or PG
          </Button>
          <Button
            onClick={() => setMintType(MintTypes.WHITELIST)}
            className={styles.button}
            type="secondary"
          >
            I have WL
          </Button>
        </div>
      )}
      {mintType === MintTypes.WHITELIST && <WhitelistMint onBack={onBack} />}
      {mintType === MintTypes.FOR_NFTS && <WhitelistMint onBack={onBack} />}
    </div>
  )
}

export default LiveMintView

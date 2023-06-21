import { FC, useState } from 'react'
import classNames from 'classnames'

import MintForNFTs from './components/MintForNFTs'
import Heading from '../../components/Heading'

import styles from './LiveMint.module.scss'

enum MintTypes {
  FOR_NFTS = 'nfts',
}

const LiveMintView: FC = () => {
  const [mintType, setMintType] = useState<MintTypes>(MintTypes.FOR_NFTS)

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.center]: mintType === null,
      })}
    >
      {mintType === null && <Heading />}
      <div className={styles.container}>
        {mintType === MintTypes.FOR_NFTS && <MintForNFTs />}
      </div>
    </div>
  )
}

export default LiveMintView

import Button from '@frakt/components/Button'
import styles from './MintForNFTs.module.scss'

import Gnomie from '@frakt/icons/GnomieCollection.png'
import Frakt from '@frakt/icons/FraktCollection.png'
import { Tensor } from '@frakt/icons'

const NoSuitableNftsState = () => {
  return (
    <>
      <h2 className={styles.heading}>You don't have suitable nfts</h2>
      <div className={styles.notConnectedContainer}>
        <div className={styles.notSuitableNftCard}>
          <img className={styles.notConnectedSmallImage} src={Gnomie} />
          <a
            href="https://www.tensor.trade/trade/pawnshop_gnomies"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className={styles.connectButton} type="secondary">
              <Tensor />
              Buy Frakts
            </Button>
          </a>
        </div>
        <div className={styles.notSuitableNftCard}>
          <img className={styles.notConnectedSmallImage} src={Frakt} />
          <a
            href="https://www.tensor.trade/trade/frakt"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className={styles.connectButton} type="secondary">
              <Tensor />
              Buy Gnomies
            </Button>
          </a>
        </div>
      </div>
    </>
  )
}

export default NoSuitableNftsState

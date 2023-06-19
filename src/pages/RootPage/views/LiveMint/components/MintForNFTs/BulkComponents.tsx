import Button from '@frakt/components/Button'
import styles from './MintForNFTs.module.scss'

export const ColumnValue = ({ label, value }) => (
  <div className={styles.columnValue}>
    <span className={styles.value}>{value}</span>
    <span className={styles.label}>{label}</span>
  </div>
)

export const BulkMintStats = ({ totalSelectedNfts, totalNfts }) => (
  <div className={styles.stats}>
    <ColumnValue
      label="Nfts selected"
      value={`${totalSelectedNfts}/${totalNfts}`}
    />
    {/* <ColumnValue label="Banx minted" value={`${0}/${totalNfts}`} /> */}
  </div>
)

export const BulkMintButtons = ({
  onSelectNFTs,
  onSubmit,
  selection,
  nfts,
}) => (
  <div className={styles.buttonWrapper}>
    <Button
      onClick={onSelectNFTs}
      disabled={!nfts.length}
      className={styles.button}
    >
      {selection.length ? 'Deselect all' : 'Select all'}
    </Button>
    <Button
      onClick={onSubmit}
      className={styles.button}
      type="primary"
      disabled={!selection.length}
    >
      Mint
    </Button>
  </div>
)

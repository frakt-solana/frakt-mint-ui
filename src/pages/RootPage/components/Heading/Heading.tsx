import { FC } from 'react'

import styles from './Heading.module.scss'

const Heading: FC = () => (
  <div className={styles.heading}>
    <h2 className={styles.title}>Meet BANX</h2>
    <h3 className={styles.subtitle}>Next SOLANA blue chip</h3>
  </div>
)

export default Heading

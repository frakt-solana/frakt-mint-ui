import { FC } from 'react'

import AppLayout from '@frakt/layouts/AppLayout/AppLayout'
import WhitelistMint from './components/WhitelistMint'

import styles from './PresaleMintPage.module.scss'

const PresaleMintPage: FC = () => {
  return (
    <AppLayout>
      <div className={styles.container}>
        <WhitelistMint />
      </div>
    </AppLayout>
  )
}
export default PresaleMintPage

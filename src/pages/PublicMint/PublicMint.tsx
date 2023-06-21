import { FC } from 'react'

import AppLayout from '@frakt/layouts/AppLayout/AppLayout'
import WhitelistMint from './components/WhitelistMint'

import styles from './PublicMint.module.scss'
// import DefaultMint from './components/DefaultMint/Defaultmint'

const PublicMint: FC = () => {
  return (
    <AppLayout>
      <div className={styles.container}>
        <WhitelistMint />
        {/* {<DefaultMint />} */}
      </div>
    </AppLayout>
  )
}
export default PublicMint

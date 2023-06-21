import AppLayout from '@frakt/layouts/AppLayout'

import DefaultMint from './components/DefaultMint/DefaultMint'
import WhitelistMint from './components/WhitelistMint'
import styles from './PublicMintPage.module.scss'

const PublicMintPage = () => {
  return (
    <AppLayout>
      <div className={styles.container}>
        <WhitelistMint />
        {/* <DefaultMint /> */}
      </div>
    </AppLayout>
  )
}

export default PublicMintPage

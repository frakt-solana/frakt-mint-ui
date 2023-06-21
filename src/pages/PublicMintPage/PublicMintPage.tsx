import AppLayout from '@frakt/layouts/AppLayout'

import DefaultMint from './components/DefaultMint/DefaultMint'
import styles from './PublicMintPage.module.scss'

const PublicMintPage = () => {
  return (
    <AppLayout>
      <div className={styles.container}>
        <DefaultMint />
      </div>
    </AppLayout>
  )
}

export default PublicMintPage

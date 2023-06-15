import { web3 } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID, AccountLayout } from '@solana/spl-token'
import BN from 'bn.js'

interface TokenView {
  pubkey: web3.PublicKey
  mint: web3.PublicKey
  amount: BN
  state: number
}

type getAllUserTokens = (props: {
  walletAddress: web3.PublicKey
  connection: web3.Connection
}) => Promise<TokenView[]>

export const getAllUserTokens: getAllUserTokens = async ({
  walletAddress,
  connection,
}) => {
  const { value: tokenAccounts } = await connection.getTokenAccountsByOwner(
    walletAddress,
    { programId: TOKEN_PROGRAM_ID },
    'singleGossip',
  )

  return (
    tokenAccounts?.map(({ pubkey, account }) => {
      const accountData = AccountLayout.decode(account.data)

      return {
        pubkey,
        mint: new web3.PublicKey(accountData.mint),
        amount: new BN(accountData.amount || 0, 10, 'le'),
        state: Number(accountData.state),
      }
    }) || []
  )
}

import { useEthers } from "../context/EthersContext"

export default function WalletButton() {

  const { account, requestAccount, logout } = useEthers()

  if (account) {
    return (
      <button 
        className="absolute top-4 md:right-8 py-2 px-4 rounded-xl font-bold bg-purple-300 text-purple-700 hover:bg-purple-200 hover:text-purple-900"
        onClick={logout}
      >
        Disconnect {`${account.substring(0,5)}...${account.slice(-4)}`}
      </button>
    )
  }

  return (
    <button 
      className="absolute top-4 md:right-8 py-2 px-4 rounded-xl font-bold bg-purple-300 text-purple-700 hover:bg-purple-200 hover:text-purple-900"
      onClick={requestAccount}
    >
      Connect Wallet
    </button>
  )

}
import '../styles/globals.css'
import EthersProvider from "../context/EthersContext"
import WalletButton from '../components/WalletButton';

function MyApp({ Component, pageProps }) {

  return (
    <EthersProvider>
      <div className="relative h-screen grid place-items-center px-2">
        <WalletButton />
        <Component {...pageProps} />
      </div>
    </EthersProvider>
  )

}

export default MyApp

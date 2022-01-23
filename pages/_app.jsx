import '../styles/globals.css'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from "web3modal"

function MyApp({ Component, pageProps }) {

  const [provider, setProvider] = useState()
  const [address, setAddress] = useState()

  async function requestAccount() {
    const web3Modal = new Web3Modal()
    try {
      const connection = await web3Modal.connect()
      const newProvider = new ethers.providers.Web3Provider(connection)
      const newAddress = await newProvider.getSigner().getAddress()
      setAddress(newAddress)
      setProvider(newProvider)
    } catch(e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (typeof window.ethereum === 'undefined') {
      console.log("Please install metamask to use this website");
      return;
    }
    // Open popup inmediately, i just want to keep the session on refresh
    // requestAccount()

    // Emmited when user connects, disconnects or change their current metamask account
    window.ethereum.on("accountsChanged", (accounts) => {
      const address = accounts[0]
      setAddress(address)
    })
  }, [])

  return (
    <div className="relative h-screen grid place-items-center px-2">
      <button 
        className="absolute top-4 md:right-8 py-2 px-4 rounded-xl font-bold bg-purple-300 text-purple-700 hover:bg-purple-200 hover:text-purple-900"
        onClick={requestAccount}>
        {address ?
          `${address.substring(0,5)}...${address.slice(-4)}`
        :
          "Connect wallet"
        }
      </button>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp

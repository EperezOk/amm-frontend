import { useContext, useState, useEffect, createContext } from "react";
import { ethers } from 'ethers';
import Web3Modal from "web3modal"

const EthersContext = createContext()

export function useEthers() {
  return useContext(EthersContext)
}

export default function EthersProvider({ children }) {

  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const validChainId = "0x61" // BSC testnet

  async function requestAccount() {
    const web3Modal = new Web3Modal()
    let provider
    try {
      const connection = await web3Modal.connect()
      provider = new ethers.providers.Web3Provider(connection)
      const address = await provider.getSigner().getAddress()
      setAccount(address)
    } catch(e) {
      console.log(e)
    }

    const chain = (await provider.getNetwork()).chainId
    setChainId(decToHex(chain))

    const chainName = "BSC - Testnet"
    const rpcUrl = "https://data-seed-prebsc-1-s1.binance.org:8545/"
    const currency = "BNB"
    const explorer = "https://testnet.bscscan.com"
    switchOrCreateNetwork(validChainId, chainName, rpcUrl, currency, explorer)
  }

  function logout() {
    setAccount(null)
  }

  function isValidChain() {
    return chainId === validChainId;
  }

  function decToHex(number) {
    return `0x${parseInt(number).toString(16)}`
  }

  async function switchOrCreateNetwork(chainIdHex, chainName, rpcUrl, currency, explorer) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainIdHex,
                chainName: chainName,
                rpcUrls: [rpcUrl],
                nativeCurrency: {
                  name: currency,
                  symbol: currency,
                  decimals: 18,
                },
                blockExplorerUrls: [explorer],
              },
            ],
          });
        } catch (e) {
          console.log(e.message);
        }
      }
    }
  }

  useEffect(() => {
    if (typeof window.ethereum === 'undefined') {
      console.log("Please install metamask to use this website");
      return;
    }

    // Opens popup inmediately, which isn't the best UX
    // requestAccount()

    // Emmited when user connects, disconnects or change their current metamask account
    window.ethereum.on("accountsChanged", (accounts) => {
      const address = accounts[0]
      setAccount(address)
    })

    window.ethereum.on("chainChanged", newChain => {
      setChainId(decToHex(newChain))
    })
  }, [])

  return (
    <EthersContext.Provider
      value={{
        account,
        requestAccount,
        logout,
        chainId,
        setChainId,
        isValidChain,
      }}
    >
      {children}
    </EthersContext.Provider>
  )
}

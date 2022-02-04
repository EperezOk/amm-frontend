import { useEthers } from "../context/EthersContext"
import Button from "../components/Button"
import { useState } from "react"
import Link from "next/link"

import { ethers } from "ethers"
import Erc20 from "../contracts/Erc20.json"

export default function GetToken() {

  const { isValidChain, account, requestAccount, setNotificationStatus } = useEthers()
  const [loading, setLoading] = useState(false)

  const daiAddress = "0x1685264bF5845711A1f544df984C5611233C1b6A"
  const busdAddress = "0x4552169AD309A7B915bB09B4b564d1a405B7ceF3"

  async function addTokenToMetamask(address) {
    const tokenAddress = address
    const tokenSymbol = address === daiAddress ? "DAI" : "BUSD"
    const tokenDecimals = 18

    try {
      const wasAdded = await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
          },
        },
      });

      if (wasAdded) {
        console.log('LP token added to your wallet');
      } else {
        console.log('Could not add LP token to your wallet');
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function transferToken(tokenAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_TOKEN_WALLET, provider)
    const token = new ethers.Contract(tokenAddress, Erc20.abi, signer)

    setLoading(true)
    try {
      if (!account || !isValidChain())
        requestAccount()

      await token.transfer(account, ethers.utils.parseEther("10"))
      setNotificationStatus({ show: true, error: false })
    } catch(e) {
      console.log(e)
      setNotificationStatus({ show: true, error: true })
    }
    setLoading(false)
    addTokenToMetamask(tokenAddress)
  }

  return (
    <div className="space-y-4 text-center">
      <Link href="/">
        <span className="cursor-pointer text-purple-800 underline underline-offset-1">Go back</span>
      </Link>
      <Button loading={loading} disabled={!account || loading} onClick={() => transferToken(daiAddress)}>Get 10 DAI</Button>
      <Button loading={loading} disabled={!account || loading} onClick={() => transferToken(busdAddress)}>Get 10 BUSD</Button>
      <p className="text-purple-800">Just connect your wallet and get some tokens to test the AMM functionality.</p>
      <p className="text-purple-800">
        If you need BNB, you can get some at the <a className=" underline underline-offset-2" href="https://testnet.binance.org/faucet-smart" target="_blank" rel="noopener noreferrer">BSC faucet</a>.
      </p>
    </div>
  )

}
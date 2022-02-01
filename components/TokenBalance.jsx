import { ethers } from "ethers";
import { useEthers } from "../context/EthersContext";
import Erc20 from "../contracts/Erc20.json"

import { useState, useEffect } from "react"

export default function TokenBalance({ tokenAddress, className }) {

  const [balance, setBalance] = useState()

  const { account } = useEthers()

  const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");

  useEffect(() => {
    if (!account)
      return

    if (tokenAddress === 0)
      getBnbBalance()
    else if (tokenAddress)
      getTokenBalance()
  }, [tokenAddress, account])

  async function getBnbBalance() {
    try {
      const _balance = ethers.utils.formatUnits(await provider.getBalance(account))
      setBalance(parseFloat(_balance))
    } catch(e) {
      console.log(e)
    }
  }

  async function getTokenBalance() {
    const token = new ethers.Contract(tokenAddress, Erc20.abi, provider)
    try {
      const _balance = ethers.utils.formatUnits(await token.balanceOf(account))
      setBalance(parseFloat(_balance))
    } catch(e) {
      console.log(e)
    }
  }

  return (
    <span className={`${className} block text-purple-300 font-semibold sm:text-sm`}>
      Balance: {balance ? balance.toFixed(4) : ".."}
    </span>
  )

}
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import TokenInput from "../components/TokenInput";
import { SwitchVerticalIcon } from "@heroicons/react/outline"
import MainCard from "../components/MainCard";
import Button from "../components/Button";

import { ethers } from "ethers";
import { useEthers } from "../context/EthersContext";
import Registry from "../contracts/Registry.json"
import Exchange from "../contracts/Exchange.json"
import Erc20 from "../contracts/Erc20.json"

const registryAddress = "0xDEa3108cdeeC65712606bc692A173A983435223e"

export default function Home() {

  const [fromTokenModalOpen, setFromTokenModalOpen] = useState(false)
  const [fromToken, setFromToken] = useState({ address: null, symbol: "BNB" })
  const [fromValue, setFromValue] = useState("")
  const [toTokenModalOpen, setToTokenModalOpen] = useState(false)
  const [toToken, setToToken] = useState({})
  const [toValue, setToValue] = useState("")
  const [loading, setLoading] = useState(false)

  const [fromToRate, setFromToRate] = useState(0)
  const [exchangeAddress, setExchangeAddress] = useState()

  const { account, isValidChain, requestAccount } = useEthers()

  function isValidInput(input) {
    const regex = /^[0-9\b,.]+$/
    return input === '' || regex.test(input)
  }

  function handleFromInput(e) {
    const input = e.target.value
    if (!isValidInput(input))
      return
    
    setFromValue(input)
    setToValue(input * fromToRate)
  }

  function handleToInput(e) {
    const input = e.target.value
    if (!isValidInput(input))
      return
    
    setToValue(input)
    setFromValue(input / fromToRate)
  }

  function switchFromTo() {
    const aux = { fromToken, fromValue }
    setFromToken(toToken)
    setFromValue(toValue)
    setToToken(aux.fromToken)
    setToValue(aux.fromValue)
  }

  function changeFromToken(newToken) {
    if (newToken.address === toToken.address)
      switchFromTo()
    else
      setFromToken(newToken)
  }

  function changeToToken(newToken) {
    if (newToken.address === fromToken.address)
      switchFromTo()
    else
      setToToken(newToken)
  }

  async function getRate(currency, method) {
    const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545")
    const registry = new ethers.Contract(registryAddress, Registry.abi, provider)

    let outputAmount
    try {
      const _exchangeAddress = await registry.getExchange(currency.address)
      setExchangeAddress(_exchangeAddress)

      console.log(`Exchange for ${currency.symbol}: ${_exchangeAddress}`)

      if (_exchangeAddress == 0)
        return 0

      const exchange = new ethers.Contract(_exchangeAddress, Exchange.abi, provider)
      if (method === "ethToToken")
        outputAmount = await exchange.getTokenAmount(ethers.utils.parseEther("1"))
      else if (method === "tokenToEth")
        outputAmount = await exchange.getEthAmount(ethers.utils.parseEther("1"))
      else
        outputAmount = await exchange.getTokenToTokenAmount(ethers.utils.parseEther("1"), toToken.address)
    } catch (e) {
      console.log(e)
      return 0
    }
    return ethers.utils.formatUnits(outputAmount)
  }

  async function refreshRate() {
    let rate

    if (!fromToken.address)
      rate = await getRate(toToken, "ethToToken")
    else if (!toToken.address)
      rate = await getRate(fromToken, "tokenToEth")
    else 
      rate = await getRate(fromToken, "tokenToToken")

    setFromToRate(rate)
  }

  function getMinAmount(amount) {
    const slipperage = 0.1
    const minAmount = (amount * (1-slipperage)).toString()
    return ethers.utils.parseEther(minAmount)
  }

  async function swapToken() {
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    setLoading(true)
    try {
      if (!account || !isValidChain())
        requestAccount()

      const exchange = new ethers.Contract(exchangeAddress, Exchange.abi, signer)
      let tx

      if (!fromToken.address)
        await exchange.ethToTokenSwap(getMinAmount(toValue))
      else if (!toToken.address) {
        const token = new ethers.Contract(fromToken.address, Erc20.abi, signer)
        tx = await token.approve(exchangeAddress, ethers.utils.parseEther(fromValue))
        await tx.wait()
        await exchange.tokenToEthSwap(ethers.utils.parseEther(fromValue), getMinAmount(toValue))
      }
      else {
        const token = new ethers.Contract(fromToken.address, Erc20.abi, signer)
        tx = await token.approve(exchangeAddress, ethers.utils.parseEther(fromValue))
        await tx.wait()
        await exchange.tokenToTokenSwap(ethers.utils.parseEther(fromValue), getMinAmount(toValue), toToken.address)
      } 

      setFromValue(0)
      setToValue(0)
    } catch (e) {
      console.log(e)
      if (e.data.message === 'execution reverted: insufficient output amount')
        console.log("Insufficient liquidity for this trade") // display notification
    }
    refreshRate()
    setLoading(false)
  }

  useEffect(async () => {

    if (!toToken.symbol || !fromToken.symbol)
      return

    refreshRate()
    
  }, [fromToken, toToken])

  return (
    <>
      <MainCard title="Swap" description="Trade tokens in an instant">  
        <TokenInput from tokenName={fromToken.symbol} setTokenModalOpen={setFromTokenModalOpen} onChange={handleFromInput} value={fromValue} />
        <button className="p-3 rounded-full bg-purple-300 text-purple-700 hover:bg-purple-200 hover:text-purple-900" onClick={switchFromTo}>
          <SwitchVerticalIcon className="h-5 w-5" aria-hidden />
        </button>
        <TokenInput tokenName={toToken.symbol} setTokenModalOpen={setToTokenModalOpen} onChange={handleToInput} value={toValue} />
        {fromToRate == 0 ?
          <Button disabled>No pool for this trade</Button>
          :
          <Button disabled={!(fromValue > 0 && toValue > 0) || loading} onClick={swapToken}>
            Swap
          </Button>
        }
      </MainCard>
      
      <Modal open={fromTokenModalOpen} setOpen={setFromTokenModalOpen} setSelectedToken={changeFromToken} />
      <Modal open={toTokenModalOpen} setOpen={setToTokenModalOpen} setSelectedToken={changeToToken} />
    </>
  )

}
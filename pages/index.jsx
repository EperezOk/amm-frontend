import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import TokenInput from "../components/TokenInput";
import { SwitchVerticalIcon } from "@heroicons/react/outline"
import MainCard from "../components/MainCard";
import Button from "../components/Button";

import { ethers } from "ethers";
import Registry from "../contracts/Registry.json"

const registryAddress = "0x00331B1a597F4CC93343dD7358C7154F3304fBd4"

export default function Home() {

  const [fromTokenModalOpen, setFromTokenModalOpen] = useState(false)
  const [fromToken, setFromToken] = useState({ address: null, symbol: "BNB" })
  const [fromValue, setFromValue] = useState("")
  const [toTokenModalOpen, setToTokenModalOpen] = useState(false)
  const [toToken, setToToken] = useState({})
  const [toValue, setToValue] = useState("")

  const [fromToRate, setFromToRate] = useState()

  function isValidInput(input) {
    const regex = /^[0-9\b,.]+$/
    return input === '' || regex.test(input)
  }

  function handleFromInput(e) {
    isValidInput(e.target.value) && setFromValue(e.target.value)
  }

  function handleToInput(e) {
    isValidInput(e.target.value) && setToValue(e.target.value)
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

  useEffect(async () => {
    if (!toToken.symbol || !fromToken.symbol)
      return
    
    // update fromToRate or display "Insufficient liquidity" in the button if there's no pool created or insufficient liquidity in the pool
    const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");
    const registry = new ethers.Contract(registryAddress, Registry.abi, provider)
    try {
      const exchange = await registry.getExchange(fromToken.address);
      console.log(`Exchange for ${fromToken.symbol}: ${ethers.utils.formatUnits(exchange)}`)
    } catch (e) {
      console.log(e)
    }
  }, [fromToken, toToken])

  return (
    <>
      <MainCard title="Swap" description="Trade tokens in an instant">  
        <TokenInput from tokenName={fromToken.symbol} setTokenModalOpen={setFromTokenModalOpen} onChange={handleFromInput} value={fromValue} />
        <button className="p-3 rounded-full bg-purple-300 text-purple-700 hover:bg-purple-200 hover:text-purple-900" onClick={switchFromTo}>
          <SwitchVerticalIcon className="h-5 w-5" aria-hidden />
        </button>
        <TokenInput tokenName={toToken.symbol} setTokenModalOpen={setToTokenModalOpen} onChange={handleToInput} value={toValue} />
        <Button>Swap</Button>
      </MainCard>
      
      <Modal open={fromTokenModalOpen} setOpen={setFromTokenModalOpen} setSelectedToken={changeFromToken} />
      <Modal open={toTokenModalOpen} setOpen={setToTokenModalOpen} setSelectedToken={changeToToken} />
    </>
  )

}
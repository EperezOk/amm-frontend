import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import TokenInput from "../components/TokenInput";
import { SwitchVerticalIcon } from "@heroicons/react/outline"
import MainCard from "../components/MainCard";
import Button from "../components/Button";

export default function Home() {

  const [fromTokenModalOpen, setFromTokenModalOpen] = useState(false)
  const [fromToken, setFromToken] = useState({ address: null, symbol: "BNB" })
  const [fromValue, setFromValue] = useState("")
  const [toTokenModalOpen, setToTokenModalOpen] = useState(false)
  const [toToken, setToToken] = useState({})
  const [toValue, setToValue] = useState("")

  function isValidInput(input) {
    const regex = /^[0-9\b]+$/
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

  useEffect(() => {
    if (!toToken.symbol)
      return
    
    // update exchange rate
    
  }, [fromToken])

  useEffect(() => {
    if (!fromToken.symbol)
      return
    
    // update exchange rate
    
  }, [toToken])

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
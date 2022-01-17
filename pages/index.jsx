import { useState } from "react";
import Modal from "../components/Modal";
import TokenInput from "../components/TokenInput";
import { SwitchVerticalIcon } from "@heroicons/react/outline"
import MainCard from "../components/MainCard";
import Button from "../components/Button";

export default function Home() {

  const [fromTokenModalOpen, setFromTokenModalOpen] = useState(false)
  const [fromToken, setFromToken] = useState({ address: null, symbol: "BNB" })
  const [toTokenModalOpen, setToTokenModalOpen] = useState(false)
  const [toToken, setToToken] = useState({})

  return (
    <>
      <div className="h-screen grid place-items-center px-2">
        <MainCard title="Swap" description="Trade tokens in an instant">  
          <TokenInput from tokenName={fromToken.symbol} setTokenModalOpen={setFromTokenModalOpen} />
          <button className="p-3 rounded-full bg-purple-300 text-purple-700 hover:bg-purple-200 hover:text-purple-900">
            <SwitchVerticalIcon className="h-5 w-5" aria-hidden />
          </button>
          <TokenInput tokenName={toToken.symbol} setTokenModalOpen={setToTokenModalOpen} />
          <Button>Swap</Button>
        </MainCard>
      </div>

      <Modal open={fromTokenModalOpen} setOpen={setFromTokenModalOpen} setSelectedToken={setFromToken} />
      <Modal open={toTokenModalOpen} setOpen={setToTokenModalOpen} setSelectedToken={setToToken} />
    </>
  )

}
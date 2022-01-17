import { useState } from "react";
import Button from "../components/Button";
import CurrencyButton from "../components/CurrencyBtn";
import MainCard from "../components/MainCard";
import Modal from "../components/Modal";
import LiquidityInput from "../components/LiquidityInput";

export default function Liquidity() {

  const [tokenModalOpen, setTokenModalOpen] = useState(false)
  const [pool, setPool] = useState({ address: null, symbol: "Select a currency" })

  return (
    <>
      <MainCard title="Liquidity" description="Add or remove liquidity from a pool">
        <div className="flex justify-between w-full">
          <span className="text-purple-700 font-semibold">Pool</span>
          <CurrencyButton tokenName={pool.symbol} setTokenModalOpen={setTokenModalOpen} />
        </div>

        <div className="mb-4 mt-2 space-y-4">
          <LiquidityInput>{pool.symbol}</LiquidityInput>
          <LiquidityInput>BNB</LiquidityInput>
          <Button>Add liquidity</Button>
        </div>

        <LiquidityInput>LP tokens</LiquidityInput>
        <Button>Remove liquidity</Button>
      </MainCard>

      <Modal open={tokenModalOpen} setOpen={setTokenModalOpen} setSelectedToken={setPool} liquidity />
    </>
  )

}
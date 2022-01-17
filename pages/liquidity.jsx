import { useState } from "react";
import Button from "../components/Button";
import CurrencyButton from "../components/CurrencyBtn";
import MainCard from "../components/MainCard";
import Modal from "../components/Modal";
import LiquidityInput from "../components/LiquidityInput";

export default function Liquidity() {

  const [tokenModalOpen, setTokenModalOpen] = useState(false)

  return (
    <>
      <div className="h-screen h grid place-items-center px-2">
        <MainCard title="Liquidity" description="Add or remove liquidity from a pool">
          <div className="flex justify-between w-full">
            <span className="text-purple-700 font-semibold">Pool</span>
            <CurrencyButton tokenName="DAI" setTokenModalOpen={setTokenModalOpen} />
          </div>

          <div className="my-4 space-y-4">
            <LiquidityInput>DAI</LiquidityInput>
            <LiquidityInput>BNB</LiquidityInput>
            <Button>Add liquidity</Button>
          </div>

          <LiquidityInput>LP tokens</LiquidityInput>
          <Button>Remove liquidity</Button>
        </MainCard>
      </div>

      <Modal open={tokenModalOpen} setOpen={setTokenModalOpen} />
    </>
  )

}
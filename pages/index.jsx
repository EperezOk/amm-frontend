import { useState } from "react";
import Modal from "../components/Modal";
import TokenInput from "../components/TokenInput";
import { SwitchVerticalIcon } from "@heroicons/react/outline"
import MainCard from "../components/MainCard";
import Button from "../components/Button";

export default function Home() {

  const [tokenModalOpen, setTokenModalOpen] = useState(false)

  return (
    <>
      <div className="h-screen grid place-items-center px-2">
        <MainCard title="Swap" description="Trade tokens in an instant">  
          <TokenInput from tokenName="BNB" setTokenModalOpen={setTokenModalOpen} />
          <button className="p-3 rounded-full bg-purple-300 text-purple-700 hover:bg-purple-200 hover:text-purple-900">
            <SwitchVerticalIcon className="h-5 w-5" aria-hidden />
          </button>
          <TokenInput setTokenModalOpen={setTokenModalOpen} />
          <Button>Swap</Button>
        </MainCard>
      </div>

      <Modal open={tokenModalOpen} setOpen={setTokenModalOpen} />
    </>
  )

}
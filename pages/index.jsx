import { useState } from "react";
import Modal from "../components/Modal";
import TokenInput from "../components/TokenInput";
import { SwitchVerticalIcon } from "@heroicons/react/outline"

export default function Home() {

  const [tokenModalOpen, setTokenModalOpen] = useState(false)

  return (
    <>
      <div className="h-screen grid place-items-center px-2">
        <div>
          {/* Header */}
          <div className="p-4 text-center border border-purple-900 rounded-tl-lg rounded-tr-lg border-opacity-50 space-y-1">
              <p className="text-purple-900 font-bold text-lg">Swap</p>
              <p className="text-sm text-purple-700">Trade tokens in an instant</p>
          </div>

          {/* Body */}
          <div className="p-4 border border-purple-900 border-t-0 rounded-bl-lg rounded-br-lg border-opacity-50 flex flex-col justify-center items-center gap-4">
            <TokenInput from tokenName="BNB" setTokenModalOpen={setTokenModalOpen} />

            <button className="p-3 rounded-full bg-purple-300 text-purple-700 hover:bg-purple-200 hover:text-purple-900">
              <SwitchVerticalIcon className="h-5 w-5" aria-hidden />
            </button>

            <TokenInput setTokenModalOpen={setTokenModalOpen} />
          </div>
        </div>
      </div>

      <Modal open={tokenModalOpen} setOpen={setTokenModalOpen} />
    </>
  )

}
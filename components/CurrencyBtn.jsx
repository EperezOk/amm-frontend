import { ChevronDownIcon } from "@heroicons/react/outline"

export default function CurrencyButton({ setTokenModalOpen, tokenName = "Select a currency" }) {

  return (
    <button
      onClick={() => setTokenModalOpen(true)}
      className="p-1 border-transparent bg-transparent text-purple-400 sm:text-sm rounded-md hover:bg-purple-50 flex gap-1 items-center"
    >
      {tokenName} <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
    </button>
  )

}
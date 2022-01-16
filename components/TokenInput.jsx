import { ChevronDownIcon } from "@heroicons/react/outline"

export default function TokenInput({ from = false, setTokenModalOpen, tokenName = "Select a currency" }) {

  return (
    <div className="relative rounded-md shadow-sm">
      <span className="absolute top-1 left-3 text-purple-500 font-semibold sm:text-sm">
        { from ? "From" : "To"}
      </span>
      <input
        type="text"
        name="price"
        id="price"
        autocomplete="off"
        className="focus:ring-purple-800 focus:border-purple-800 w-full pl-3 pr-40 sm:pr-36 pt-8 sm:text-sm border-purple-400 rounded-md text-purple-600 placeholder:text-purple-400"
        placeholder="0.00"
      />
      <button
        onClick={() => setTokenModalOpen(true)}
        className="absolute bottom-1 right-2 p-1 border-transparent bg-transparent text-purple-400 sm:text-sm rounded-md hover:bg-purple-50 flex gap-1 items-center"
      >
        {tokenName} <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
  
}
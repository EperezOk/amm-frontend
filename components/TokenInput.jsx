import CurrencyButton from "./CurrencyBtn";

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

      <div className="absolute bottom-1 right-2">
        <CurrencyButton tokenName={tokenName} setTokenModalOpen={setTokenModalOpen} />
      </div>
    </div>
  )
  
}
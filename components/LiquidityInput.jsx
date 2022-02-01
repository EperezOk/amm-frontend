import TokenBalance from "./TokenBalance"

export default function LiquidityInput({ children, disabled, onChange, value, tokenAddress }) {

  return(
    <>
      <TokenBalance tokenAddress={tokenAddress} className="pb-1" />
      <div className="relative mb-3 rounded-md shadow-sm">
        <input
          type="text"
          name="price"
          id="price"
          autoComplete="off"
          disabled={disabled}
          onChange={onChange}
          value={value}
          className={`w-full pl-3 pr-20 sm:text-sm rounded-md ${disabled ? "border-gray-400" : "border-purple-400 focus:ring-purple-800 focus:border-purple-800 text-purple-600 placeholder:text-purple-400"}`}
          placeholder="0.00"
        />

        <div className="absolute bottom-2 right-3">
          <span className={`text-sm ${disabled ? "text-gray-700" : "text-purple-700"}`}>
            {children}
          </span>
        </div>
      </div>
    </>
  )

}
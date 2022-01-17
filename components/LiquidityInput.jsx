export default function LiquidityInput({ children }) {

  return(
    <div className="relative rounded-md shadow-sm">
      <input
        type="text"
        name="price"
        id="price"
        autoComplete="off"
        className="focus:ring-purple-800 focus:border-purple-800 w-full pl-3 pr-20 sm:text-sm border-purple-400 rounded-md text-purple-600 placeholder:text-purple-400"
        placeholder="0.00"
      />

      <div className="absolute bottom-2 right-3">
        <span className="text-sm text-purple-700">{children}</span>
      </div>
    </div>
  )

}
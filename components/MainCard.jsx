import Link from "next/link"

export default function MainCard({ title, description, children }) {

  return (
    <div>
      {/* Select option */}
      <div className="border border-purple-900 rounded-tl-lg rounded-tr-lg border-opacity-50 grid grid-cols-2">
        <Link href="/">
          <button className="py-3 border-r rounded-tl-lg border-purple-900 border-opacity-50 text-purple-700 hover:bg-purple-50">
            Swap
          </button>
        </Link>
        <Link href="/liquidity">
          <button className="py-3 rounded-tr-lg text-purple-700 hover:bg-purple-50">
            Liquidity
          </button>
        </Link>
      </div>

      {/* Header */}
      <div className="p-4 pb-0 text-center border-x border-purple-900 border-opacity-50 space-y-1">
          <p className="text-purple-900 font-bold text-lg">{title}</p>
          <p className="text-sm text-purple-700">{description}</p>
      </div>

      {/* Body */}
      <div className="p-4 border border-t-0 border-purple-900 rounded-bl-lg rounded-br-lg border-opacity-50 flex flex-col justify-center items-center gap-4">
        {children}
      </div>
    </div>
  )

}
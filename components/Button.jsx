import { RefreshIcon } from "@heroicons/react/outline"

export default function Button({ children, disabled, onClick, loading }) {

  return (
    <button onClick={onClick} disabled={disabled} className={`py-3 w-full font-bold rounded-lg grid place-items-center ${disabled ? "bg-gray-300 text-gray-700" : "bg-purple-300 text-purple-700 hover:bg-purple-200 hover:text-purple-900"}`}>
      {
        loading ?
        <RefreshIcon className="animate-spin h-5 w-5 text-gray-900" aria-hidden="true" />
        :
        children
      }
    </button>
  )

}
export default function Button({ children, disabled, onClick }) {

  return (
    <button onClick={onClick} disabled={disabled} className={`py-3 w-full font-bold rounded-lg ${disabled ? "bg-gray-300 text-gray-700" : "bg-purple-300 text-purple-700 hover:bg-purple-200 hover:text-purple-900"}`}>
      {children}
    </button>
  )

}
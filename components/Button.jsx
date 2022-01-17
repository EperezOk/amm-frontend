export default function Button({ children }) {

  return (
    <button className="py-3 w-full font-bold rounded-lg bg-purple-300 text-purple-700 hover:bg-purple-200 hover:text-purple-900">
      {children}
    </button>
  )

}
import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { QuestionMarkCircleIcon, TrashIcon } from "@heroicons/react/outline"
import { useLocalStorage } from "../hooks/useStorage"
import { ethers } from 'ethers'
import Erc20 from "../contracts/Erc20.json"

// Tokens from BSC testnet
const defaultTokenList = [
  {
    address: null,
    symbol: "BNB",
    logo: "/token-logos/bnb.svg",
  },
  {
    address: "0x1685264bF5845711A1f544df984C5611233C1b6A",
    symbol: "DAI",
    logo: "/token-logos/dai.svg",
  },
  {
    address: "0x4552169AD309A7B915bB09B4b564d1a405B7ceF3",
    symbol: "BUSD",
    logo: "/token-logos/busd.svg",
  },
]

export default function Modal({ open, setOpen, setSelectedToken, liquidity = false }) {
  
  const inputRef = useRef(null)

  let tokenList, setTokenList

  if (typeof window !== "undefined")
    [tokenList, setTokenList] = useLocalStorage("CustomTokens", defaultTokenList)

  async function handleKeyDown(e) {
    if (e.key !== "Enter")
      return;
    
    const address = inputRef.current.value
    const matches = tokenList.filter(token => token.address === address)
      
    if (matches.length > 0) {
      inputRef.current.value = ""
      return;
    }
      
    inputRef.current.disabled = true
    const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");
    const token = new ethers.Contract(address, Erc20.abi, provider)
    const symbol = await token.symbol()
    const newToken = { address, symbol }
    setTokenList(prevTokenList => [...prevTokenList, newToken])
    inputRef.current.value = ""
    inputRef.current.disabled = false
  }

  function handleCurrencyClick(e, token) {
    if (e.target.nodeName === "path" || e.target.nodeName === "svg")
      removeCurrency(token.address)
    else {
      setSelectedToken(token)
      setOpen(false)
    }
  }

  function removeCurrency(address) {
    setTokenList(prevTokenList => prevTokenList.filter(token => token.address !== address))
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
        <div className="flex items-center justify-center min-h-screen text-center px-2">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 align-middle sm:max-w-lg ">
              {/* Modal text */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="text-center sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-purple-900">
                      Select a token
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-purple-700">
                      Paste the token address and press enter, or select one from the list below.
                    </p>
                    <input onKeyDown={handleKeyDown} ref={inputRef} type="text" className="mt-4 w-full rounded-md border focus:ring-purple-800 focus:border-purple-800 border-purple-400 text-purple-600 placeholder:text-purple-400" placeholder='0x000000' />
                  </div>
                </div>
              </div>
              {/* Token list */}
              <div className="bg-white">
                {tokenList && tokenList.map(token => {
                  if (liquidity && token.address == null)
                    return;
                  
                  return (
                    <button 
                      className="w-full px-4 py-4 sm:px-6 flex justify-between items-center hover:bg-purple-50"
                      onClick={(e) => handleCurrencyClick(e, token)}
                      key={token.address || token.symbol}
                    >
                      <div className='flex gap-3 items-center'>
                        {token.logo ?
                          <img className="h-6 w-6" src={token.logo} alt={token.symbol} />
                          :
                          <QuestionMarkCircleIcon className="h-6 w-6 text-purple-400" aria-hidden="true" />
                        }
                        <div className="grid grid-cols-1 place-items-start">
                          <span className="font-semibold text-purple-900 self-start">{token.symbol}</span>
                          {token.address &&
                            <span className="text-purple-300 text-xs">{`${token.address.substring(0,5)}...${token.address.slice(-4)}`}</span>
                          }
                        </div>
                      </div>
                      <TrashIcon className="h-5 w-5 text-purple-400" aria-hidden="true" />
                    </button>
                  )
}               )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon, CurrencyPoundIcon } from '@heroicons/react/outline'

// Tokens from BSC testnet
const defaultTokenList = [
  {
    address: null,
    symbol: "BNB",
    logo: "/token-logos/bnb.svg",
  },
  {
    address: "0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867",
    symbol: "DAI",
    logo: "/token-logos/dai.svg",
  },
  {
    address: "0x78867bbeef44f2326bf8ddd1941a4439382ef2a7",
    symbol: "BUSD",
    logo: "/token-logos/busd.svg",
  },
]

export default function Modal({ open, setOpen, setSelectedToken, liquidity = false }) {
  
  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setOpen}>
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
                      Paste the token address or select one from the list below.
                    </p>
                    <input type="text" className="mt-4 w-full rounded-md border focus:ring-purple-800 focus:border-purple-800 border-purple-400 text-purple-600 placeholder:text-purple-400" placeholder='0x000000' />
                  </div>
                </div>
              </div>
              {/* Token list */}
              <div className="bg-white">
                {defaultTokenList.map(token => {
                  if (liquidity && token.address == null)
                    return;
                  
                  return (
                    <button 
                      className="w-full px-4 py-4 sm:px-6 flex gap-2 hover:bg-purple-50"
                      onClick={() => {
                        setSelectedToken(token)
                        setOpen(false)
                      }}>
                      {/* <CurrencyPoundIcon className="h-6 w-6 text-yellow-500" aria-hidden="true" /> */}
                      <img className="h-6 w-6" src={token.logo} alt={token.symbol} />
                      <span className="font-semibold text-purple-900">{token.symbol}</span>
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

import { useEffect } from "react"
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid"
import { useEthers } from "../context/EthersContext"

export default function Notification() {

  const { notificationStatus, setNotificationStatus } = useEthers()

  useEffect(() => {
    let timeout
    if (notificationStatus.show) {
      timeout = setTimeout(() => {
        setNotificationStatus(prevStatus => {
          return { show: false, error: prevStatus.error }
        })
      }, 3000)
    }
    return (() => clearTimeout(timeout))
  }, [notificationStatus])

  return (
    <div className={`${!notificationStatus.show && "hidden"} absolute bottom-4 right-4 lg:right-auto lg:top-4 lg:bottom-auto p-4 md:text-lg rounded-xl flex gap-2 items-center bg-purple-900 text-purple-50`}>
      {notificationStatus.error ?
        <XCircleIcon className="h-6 w-6 md:h-8 md:w-8" aria-hidden />
        :
        <CheckCircleIcon className="h-6 w-6 md:h-8 md:w-8" aria-hidden="true" />
      }
      {notificationStatus.error ?
        "Error"
        :
        "Success"
      }
    </div>
  )

}

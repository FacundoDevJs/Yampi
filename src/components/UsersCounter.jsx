import { useEffect, useState } from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { useUser } from "../context/UserContext"

export const UsersCounter = () => {
  const [counter, setCounter] = useState(null)
  
  const {usersCounter} = useUser()

  useEffect(()=> {
    const callUsers = async () => {
      const numberOfUsers = await usersCounter()
      setCounter(numberOfUsers)
    }
    callUsers()
  }, [])

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg shadow-black/30 mt-6 text-black text-xl">
      Cantidad de Usuarios: {
        counter === null
        ? <AiOutlineLoading3Quarters className='animate-spin h-12 w-5'/>
        : counter
      }
    </div>
  )
}

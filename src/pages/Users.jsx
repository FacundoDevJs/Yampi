import { useEffect, useState } from "react"
import { useUser } from "../context/UserContext"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import UserCard from "../components/UserCard"
import SideBar from "../components/SideBar"

const Users = () => {

  const [shownUsers, setShownUsers] = useState([])

  const { users, getUsers } = useUser()

  useEffect(() => {
    if (users.length === 0) {
      getUsers()
    }
  }, [])

  useEffect(()=>{
    setShownUsers(users)
  }, [users])

  const handleChange = async (text)=>{
    setShownUsers(users.filter(user => user.name.includes(text)))
  }

  return (
    <div className="bg-red-500 w-full min-h-[100vh] py-12">
      <SideBar/>
      <div className='text-white text-4xl font-bold text-center py-6'>
        Usuarios 👨
      </div>
      <div className="flex">
        <input
          className="outline-none w-[90%] max-w-[600px] p-4 text-black text-xl font-bold shadow-lg shadow-black/30 rounded-lg m-auto"
          placeholder='Ingresa el Nombre'
          onChange={(e)=>{
            handleChange(e.target.value)
          }}
        />
      </div>
      {
        shownUsers.length !== 0
        &&
        shownUsers.map(user => (
          <UserCard user={user}/>
        ))
      }
    </div>
  )
}

export default Users
import { FaRegTrashAlt } from "react-icons/fa";
import { FaPhone, FaUser } from "react-icons/fa6";
import { HiIdentification } from "react-icons/hi2";
import { TbEdit } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";

const UserCard = ({user}) => {
  
  const navigate = useNavigate()

  const { deleteUser } = useUser()

  const handleDelete= ()=>{
    toast(t=>(
        <div>
            <p className='text-white text-xl font-semibold'>¿Seguro que quieres eliminar a este cliente?</p>
            <div>
                <button 
                className='bg-red-500 hover:bg-red-400 px-3 py-2 rounded-sm text-sm mx-2 text-white'
                onClick={()=> {
                    deleteUser(user?.id)
                    toast.dismiss(t.id)
                    navigate('/users')
                }}
                >
                    Eliminar
                </button>
                <button className='bg-slate-400 hover:bg-slate-500 px-3 py-2 rounded-sm mx-2 text-white'
                onClick={()=> toast.dismiss(t.id)}
                >
                    Cancelar
                </button>
            </div>
        </div>
    ), {
        style:{
            background: "#202020"
        }
    })
  }

  return (
    <div className="m-auto my-6 bg-white p-4 shadow-lg shadow-black/30 rounded-xl text-xl font-semibold w-[90%] max-w-[600px]">
      <div className="flex items-center">
        <FaUser className="mr-2"/> {user.name}
      </div>
      <div className="flex items-center">
        <HiIdentification className="mr-2"/> {user.dni}
      </div>
      <div className="flex items-center">
        <FaPhone className="mr-2"/> {user.phone_number}
      </div>
      <div className="flex items-center justify-around py-2">
        <div 
        onClick={(e)=> {
          e.preventDefault()
          navigate(`/user/${user.id}`)
        }} 
        className="p-2 bg-lime-500 rounded-xl flex shadow-md shadow-black/40 cursor-pointer">
          <TbEdit className='h-6 w-6 text-white m-auto'/>
        </div>  

        <div 
        onClick={(e)=> {
          e.preventDefault()
          handleDelete()
        }} 
        className="p-2 bg-red-500 rounded-xl flex shadow-md shadow-black/40 cursor-pointer">
          <FaRegTrashAlt  className='h-6 w-6 text-white m-auto'/>
        </div>  
      </div>
    </div>
  )
}


export default UserCard

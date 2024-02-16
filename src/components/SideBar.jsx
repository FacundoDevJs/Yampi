import { useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { RiMenu2Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import { useUser } from "../context/UserContext"

const SideBar = () => {
  const [isOpenNavBar, setIsOpenNavbar] = useState(false)

  const { logout } = useAuth()
  // const { localUser } = useUser()
  const { user } = useAuth();
  
  const navigate = useNavigate()

  return (
    <div className='transition-all'>
      <div 
      className={
        isOpenNavBar
        ?'fixed h-[100vh] w-full bg-white z-20 text-3xl transition-all top-0'
        :'fixed h-[100vh] w-[0px] bg-white z-20 transition-all top-0'
      }
      >
        {
          user
          ?
          <div className={
            isOpenNavBar
            ?'w-full h-[100vh] text-3xl flex flex-col transition-all delay-150'
            :'w-full h-[100vh] invisible'
          }>
            <div className='h-[10vh] w-full flex items-center justify-end px-[20px] font-semibold'>
              <AiOutlineClose className=' transition-all duration-0 cursor-pointer' onClick={()=>{setIsOpenNavbar(false)}}/>
            </div>
            <Link
            to='/tus-productos'
            className='block p-2 w-52 m-4 border-2 border-black hover:bg-black hover:text-white rounded font-bold text-center'
            >
              Tus Productos 🍨 
            </Link>
            <Link
            to='/productos/admin'
            className='block p-2 w-52 m-4 border-2 border-black hover:bg-black hover:text-white rounded font-bold text-center'
            >
              Productos 🍦 
            </Link>
            <Link
            to='/users'
            className='block p-2 w-52 m-4 border-2 border-black hover:bg-black hover:text-white rounded font-bold text-center'
            >
              Usuarios 👨 
            </Link>
            <Link
            to='/orders' 
            className='block p-2 w-52 m-4 border-2 border-black hover:bg-black hover:text-white rounded font-bold text-center'
            >
              Encargos en linea 📑
            </Link>
            <Link
            to='/purchases' 
            className='block p-2 w-52 m-4 border-2 border-black hover:bg-black hover:text-white rounded font-bold text-center'
            >
              Compras en el local 🏢
            </Link>
            {/* <div
            onClick={ () => {
              navigate('/')
              logout()
            }}
            className='block p-2 w-64 m-4 border-2 border-black hover:bg-black hover:text-white rounded font-bold text-center'
            >
              Cerrar Sesión 
            </div> */}
          </div>
          :
          <div className={
            isOpenNavBar
            ?'w-full h-[100vh] text-3xl flex flex-col transition-all delay-150'
            :'w-full h-[100vh] invisible'
          }>
            <div className='h-[10vh] w-full flex items-center justify-end px-[20px] font-semibold'>
              <AiOutlineClose className=' transition-all duration-0 cursor-pointer' onClick={()=>{setIsOpenNavbar(false)}}/>
            </div>
            <Link
            to='/profile'
            className='block p-2 w-52 m-4 border-2 border-black hover:bg-black hover:text-white rounded font-bold text-center'
            >
              Perfil 👨‍💼
            </Link>
            <div
            onClick={ () => {
              navigate('/')
              logout()
            }}
            className='block p-2 w-64 m-4 border-2 border-black hover:bg-black hover:text-white rounded font-bold text-center'
            >
              Cerrar Sesión 
            </div>
          </div>
         
        }
      </div>
      <div className='fixed text-2xl top-5 left-4 cursor-pointer z-10 select-none p-3 rounded-xl bg-white shadow-xl shadow-black/20'>
        <RiMenu2Line
        onClick={()=>{setIsOpenNavbar(true)}}
        />
      </div>
    
    </div>
  )
}

export default SideBar
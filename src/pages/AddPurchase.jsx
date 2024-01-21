import { useState } from "react"

import ArrowBack from "../components/ArrowBack"

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useUser } from "../context/UserContext";
import { useOrder } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";

import handleError from "../utils/handleError"

const AddPurchase = () => {
  const [value, setValue] = useState({
    name: null, 
    phone_number: null, 
  })
  const [dni, setDni] = useState(null)
  const [isOpenCreateAccount, setIsOpenCreateAccount] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { getUserByDni, createUser  } = useUser()
  const { saveClientInfo } = useOrder()

  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      if (dni !== null) {
        const userData = await getUserByDni(dni)
        if (userData  === undefined) {
          if ((value.name === null || value.name.length === 0) && (value.phone_number === null || value.phone_number.length === 0)) {
            handleError('No se encontró un cliente con ese documento')
            setIsLoading(false)
          }
          else if (value.name === null || value.name.length === 0) {
            handleError('Escribe un nombre')
            setIsLoading(false)
          }
          else if (value.phone_number === null || value.phone_number.length === 0) {
            handleError('Escribe un numero de telefono')
            setIsLoading(false)
          }
          else {
            const newUserData = await createUser({
              name: value.name,
              dni,
              phone_number: value.phone_number
            }, false)
            await saveClientInfo(newUserData)
            navigate('/new-purchase')
          }
        } 
        else {
          await saveClientInfo(userData)
          navigate('/new-purchase')
        }
      }
      else {
        handleError('Escribe un documento')
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
      handleError('Algo salió mal, vuelve a intentarlo')
      setIsLoading(false)
    }
  }

  return (
    <div className='bg-red-500 w-full min-h-[100vh] px-4 pt-20'>
      <ArrowBack/>
      <div className='text-white text-4xl font-bold text-center py-6'>
        Nueva compra 😋
      </div>
      <form
      className='bg-white max-w-[600px] m-auto rounded-xl py-6 px-8 shadow-xl shadow-black/40 font-bold'
      >
        <div className='flex flex-col'>
          <label htmlFor="dni" className='mt-4 text-xl text-center'>Documento del comprador</label>
          <input
            name='dni'
            id='dni' 
            autoComplete="off"
            placeholder="12345678"
            className="p-4 bg-neutral-100 rounded-2xl mt-2 outline-none focus:outline-none transition-all"
            onChange={(e) => setDni(e.target.value )}
          />
        </div>
        <div 
        onClick={()=>setIsOpenCreateAccount(!isOpenCreateAccount)}      
        className="my-4 text-red-400 flex cursor-pointer">
          Crear una cuenta {
            isOpenCreateAccount 
            ? <IoIosArrowUp className="mx-2 h-6 w-6"/>
            : <IoIosArrowDown className="mx-2 h-6 w-6"/>
          }
        </div>
        <div
        className={
          isOpenCreateAccount 
          ? 'max-h-auto transition-all py-2'
          : 'h-0 transition-all'
        }
        >
          <div className= {isOpenCreateAccount ? '' : 'hidden'}>
            <div className='flex flex-col'>
              <label htmlFor="name" className='text-xl text-center'>Nombre y Apellido</label>
              <input
                name='name' 
                id='name'
                autoComplete="off"
                placeholder="Nombre y Apellido"
                className="p-4 bg-neutral-100 rounded-2xl mt-2 outline-none focus:outline-none transition-all"
                onChange={(e) => setValue({ ...value, name: e.target.value })}
              />
            </div>
        
            <div className='flex flex-col'>
              <label htmlFor="phone_number" className='mt-4 text-xl text-center'>Numero de telefono</label>
              <input
              id='phone_number'
              type='number'
              required
              className="p-4 bg-neutral-100 rounded-2xl mt-2 outline-none focus:outline-none transition-all"
              placeholder='123456789'
              onChange={(e) => setValue({ ...value, phone_number: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="flex">
          <button 
          className='mt-8 text-xl text-white p-3 bg-blue-500 rounded-lg mx-auto shadow-lg shadow-black/40 m-auto'
          onClick={(e)=>{
            e.preventDefault()
            handleSubmit()
          }}
          >
          {
            isLoading 
            ? <AiOutlineLoading3Quarters className='animate-spin h-12 w-5 m-auto'/>
            : 'Continuar'
          }
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddPurchase
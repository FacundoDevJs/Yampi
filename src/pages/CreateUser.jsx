import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useUser } from "../context/UserContext"
import handleError from "../utils/handleError"

import { AiOutlineLoading3Quarters } from "react-icons/ai"

const CreateUser = () => {
  const [value, setValue] = useState({
    name: null,
    dni: null,
    phone_number: null
  }) 
  const [isLoading, setIsLoading] = useState(false)

  const { createUser, getUserByDni } = useUser()
  const navigate = useNavigate()


  const handleSubmit =  async () => {
    try {
      setIsLoading(true)
      if (value.dni === null || value.dni.length === 0) {
        handleError('Escribe un documento')
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
        const userData = await getUserByDni(value.dni)
        if (userData  === undefined) {
          await createUser(value, true)
          navigate('/productos')
        } else {
          handleError('Ya existe un cliente con este documento')
          setIsLoading(false)
        }
      }
    } catch (error) {
      handleError('Algo salió mal, vuelve a intentarlo')
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-[100vh] flex flex-col items-center bg-red-500 py-10">
      <div className="w-[90%] max-w-[600px] shadow-lg shadow-black/50 rounded-xl px-8 py-6 bg-white text-xl mb-12">
        <h1 className="font-bold text-3xl">Crea una cuenta </h1>
      </div>
      <form
        className="w-[90%] max-w-[600px] flex flex-col  shadow-lg shadow-black/50 rounded-xl px-8 py-6 bg-white text-xl"
      >
        <div className='flex flex-col'>
          <label htmlFor="name" className='text-xl text-center font-semibold'>Nombre y Apellido</label>
          <input
            name='name' 
            id='name'
            autoComplete="off"
            placeholder="Nombre y Apellido"
            className="p-4 bg-black/10 rounded-xl mt-2 outline-none"
            onChange={(e) => setValue({ ...value, name: e.target.value })}
          />
        </div>

        <div className='flex flex-col'>
          <label htmlFor="dni" className='mt-4 text-xl text-center font-semibold'>Documento</label>
          <input
          id='dni'
          type='number'
          required
          className="p-4 bg-black/10 rounded-xl mt-2 outline-none"
          placeholder='12345678'
          onChange={(e) => setValue({ ...value, dni: e.target.value })}
          />
        </div>
    
        <div className='flex flex-col'>
          <label htmlFor="phone_number" className='mt-4 text-xl text-center font-semibol'>Numero de telefono</label>
          <input
          id='phone_number'
          type='number'
          required
          className="p-4 bg-black/10 rounded-xl mt-2 outline-none"
          placeholder='12345678910'
          onChange={(e) => setValue({ ...value, phone_number: e.target.value })}
          />
        </div>

      <button 
      onClick={(e)=>{
        e.preventDefault()
        handleSubmit()
      }}
      className="bg-red-500 mt-8 transition-allmy-3 text-white font-bold py-2 px-2 rounded outline-none" type="submit">
      {
         isLoading 
         ? <AiOutlineLoading3Quarters className='animate-spin h-12 w-5 m-auto'/>
         : 'Crear Usuario'
       }
      </button>
      <button
        className="inline-block align-baseline font-bold mt-4 text-red-500"
        onClick={(e)=>{
          e.preventDefault()
          navigate('/productos')
        }}
      >
        Continuar sin una cuenta
      </button>
    </form>

    <div className="mt-8 bg-white p-4 text-xl rounded-xl shadow-xl shadow-black/40 font-semibold">
        <div
        onClick={()=> navigate('/login')}
        >
          ¿Ya tienes una cuenta? <b className="text-red-700 font-semibold cursor-pointer">Inicia Sesion.</b>
        </div>
    </div>
  </div>
  )
}

export default CreateUser
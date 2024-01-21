import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useUser } from "../context/UserContext"
import handleError from "../utils/handleError"

import { AiOutlineLoading3Quarters } from "react-icons/ai"

const LoginUser = () => {
  const [value, setValue] = useState({
    dni: null,
  }) 
  const [isLoading, setIsLoading] = useState(false)

  const { loginUser } = useUser()
  const navigate = useNavigate()

  const handleSubmit =  async () => {
    try {
      if (value.dni === null || value.dni.length === 0)  {
        handleError('Escribe un documento')
      } 
      else {
        setIsLoading(true)
        const userData = await loginUser(value)
        if (userData  === undefined) {
          handleError('No se encontró un cliente con ese documento')
          setIsLoading(false)
        }
        else {
          navigate('/productos')
        }
      }
    } 
    catch (error) {
      handleError('Algo salió mal, vuelve a intentarlo')
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-[100vh] flex flex-col items-center bg-red-500 py-10">
        <h1 className="font-bold text-3xl mb-12 text-white">Iniciar Sesion</h1>
      <form
        className="w-[90%] max-w-[600px] flex flex-col  shadow-lg shadow-black/50 rounded-xl px-8 py-6 bg-white text-xl"
      >

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
    
      <button 
      onClick={(e)=>{
        e.preventDefault()
        handleSubmit()
      }}
      className="bg-red-500 mt-8 transition-allmy-3 text-white font-bold py-2 px-2 rounded outline-none" type="submit">
       {
          isLoading 
          ? <AiOutlineLoading3Quarters className='animate-spin h-12 w-5 m-auto'/>
          : 'Iniciar Sesion'
        }
      </button>
    </form>

    <div className="mt-8 bg-white p-4 text-xl rounded-xl shadow-xl shadow-black/40 font-semibold">
        <div
        onClick={()=> navigate('/create-user')}
        >
          ¿No tienes una cuenta? <b className="text-red-700 font-semibold cursor-pointer">Create una</b>
        </div>
    </div>
  </div>
  )
}

export default LoginUser
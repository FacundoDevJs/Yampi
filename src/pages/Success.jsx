import { Link, useParams } from "react-router-dom"
import image from "./logo2.png"

const Success = () => {

  const params = useParams()

  return (
    <div className='bg-red-500 w-full min-h-[100vh] pt-8'>
    <img src={image} className="w-32 m-auto mb-6"/>
        <div className='bg-white w-[90vw] m-auto rounded-xl py-6'>
            <div className='bg-red-500 w-[90%] m-auto rounded-xl text-white text-2xl font-extrabold p-4 text-center'>
            🎉 ¡Encargo realizado con éxito! 
            </div>
            <div className='w-[80%] m-auto text-2xl font-semibold pt-4 flex flex-col items-center'>
                <div className='my-3 w-full'>
                    🍦 Tu pedido está en camino. Pronto recibirás tu helado favorito.
                </div>
                <div className='my-8 w-full'>
                    { 
                    params.delivery === 'purchase'
                    ? 
                    <Link
                    className="bg-blue-500 p-4 rounded-lg text-lg font-semibold text-white"
                    to='/tus-productos'
                    >
                        Volver Al inicio
                    </Link>
                    : '🍨 ¡Disfruta de tu dulce momento helado!'
                    }
                </div>

            </div>
        </div>
    </div>
  )
}

export default Success

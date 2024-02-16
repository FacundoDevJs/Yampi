import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { useOrder } from '../context/OrderContext'

import ArrowBack from '../components/ArrowBack';

import handleError from "../utils/handleError"
          
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { MdDeliveryDining } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import image from "./mercadopago.png"
import { useUser } from '../context/UserContext';

const AddOrder = () => {
  const [value, setValue] = useState({
    name: null, 
    dni: null, 
    address: null, 
    phone_number: null, 
  })
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('none')
  const [isOpenProducts, setIsOpenProducts] = useState(false)

  const navigate = useNavigate()

  const { addOrder, price, orderedProducts } = useOrder()
  const {localUser} = useUser()

  const handleSubmit = async ()=>{
      try {
        if (paymentMethod === 'none'){
          handleError('Elige un metodo de pago')
        } else if (localUser) {
          setIsLoading(true)
          const result = await addOrder({
            name: localUser.name, 
            dni: localUser.dni,
            address: value.address, 
            phone_number: localUser.phone_number, 
          },
          paymentMethod
          )
          if (paymentMethod === 'mercadopago'){
            if (result === false){ 
              navigate('/success/redeeemed')
            } else {
              window.location.href = result.init_point
            }
          } 
          else {
            navigate('/cashSuccess/delivery')
          }
        } else if (value.name === null || value.dni === null || value.address === null || value.phone_number === null) {
          handleError('Completa todos los campos')
        } else {
          setIsLoading(true)
          const result = await addOrder(value, paymentMethod)
          if (paymentMethod === 'mercadopago'){
            if (result === false){
              navigate('/success/redeeemed')
          } else {
              window.location.href = result.init_point
            } 
          } 
          else {
            navigate('/cashSuccess/delivery')
          }
          }
      } catch (error) {
        handleError('Algo salió mal, vuelve a intentarlo')
      }
    }

    useEffect(()=>{
      if (price === 0) {
        setPaymentMethod('points')
      }
    }, [price])

  return (
    <div className=' bg-[linear-gradient(#ef4444,#fde68a)] min-h-[100vh] w-full font-bold p-4 pt-20'>
      <ArrowBack/>
      <div className='text-white text-4xl font-bold text-center py-6'>
        Completar pedido 😋
      </div>
      <form
      className='bg-white max-w-[600px] m-auto rounded-xl py-6 px-8 shadow-xl shadow-black/40'
      >
        <div className='text-2xl font-bold py-3 border-black'>
          Precio: ${price + 400}
        </div>
        <div 
        onClick={()=>setIsOpenProducts(!isOpenProducts)}      
        className="my-4 text-neutral-500 flex cursor-pointer">
          Ver Productos {
            isOpenProducts
            ? <IoIosArrowUp className="mx-2 h-6 w-6"/>
            : <IoIosArrowDown className="mx-2 h-6 w-6"/>
          }
        </div>
        <div
        className={
          isOpenProducts
          ? 'max-h-auto transition-all py-2'
          : 'h-0 transition-all'
        }
        >
          {
            isOpenProducts &&
            orderedProducts.map((product)=>(
              <div className='flex items-center text-md font-semibold py-2'>
                <img src={product.product.imageURL} className='h-6 w-6 mr-2'/>
                {product.product.name}
              </div>
            ))
          }
          {
            isOpenProducts &&
            <div className='flex items-center text-md font-semibold py-2'>
              <MdDeliveryDining className='h-6 w-6 mr-2'/>
              Envío
            </div>
          }
        </div>

      <div className='flex flex-col'>
        <label htmlFor="address" className='mt-8 text-xl text-center'>Direccion</label>
        <input
          name='address'
          id='address' 
          autoComplete="off"
          placeholder="Direccion"
          className="p-4 bg-neutral-100 rounded-2xl mt-2 outline-none focus:outline-none transition-all"
          onChange={(e) => setValue({ ...value, address: e.target.value })}
        />
      </div>

      {
      !localUser &&
      <div>
        <div className='text-2xl font-bold pt-3 pb-6 border-t mt-10 border-black'>
          Información de contacto
        </div>

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
          <label htmlFor="dni" className='mt-4 text-xl text-center'>Documento</label>
          <input
          id='dni'
          type='number'
          required
          className="p-4 bg-neutral-100 rounded-2xl mt-2 outline-none focus:outline-none transition-all"
          placeholder='12345678'
          onChange={(e) => setValue({ ...value, dni: e.target.value })}
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
      }

      {
        price !== 0
        &&
        <div>
          <div className='text-2xl font-bold pt-3 pb-6 border-t mt-10 border-black'>
            Metodo de pago
          </div>

          <div className='flex shadow-lg shadow-black/40 rounded-xl cursor-pointer'>
            <div className={
              paymentMethod === 'mercadopago'
              ? 'w-[50%] p-4 rounded-l-xl border-l-2 border-t-2 border-b-2 border-blue-500 bg-blue-500 text-white'
              : 'w-[50%] p-4 rounded-l-xl border-l-2 border-t-2 border-b-2 border-blue-500'
            }
            onClick={()=>{setPaymentMethod('mercadopago')}}
            >
              Mercado Pago <img src={image} className='w-6 h-6'/>
            </div>
            <div className={
              paymentMethod === 'cash'
              ? 'w-[50%] p-4 rounded-r-xl border-2 border-red-500 bg-red-500 text-white'
              : 'w-[50%] p-4 rounded-r-xl border-2 border-red-500 '
            }
            onClick={()=>{setPaymentMethod('cash')}}
            >
              Efectivo 💵
            </div>
          </div>
        </div>
      }
      
    </form>
    <div className='flex'>
      <button 
      className='mt-8 text-xl text-white p-3 bg-blue-500 rounded-lg mx-auto shadow-lg shadow-black/40'
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
    </div>
  )
}

export default AddOrder
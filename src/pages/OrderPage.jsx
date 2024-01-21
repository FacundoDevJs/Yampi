import { useNavigate, useParams } from "react-router-dom"

import { useOrder } from "../context/OrderContext"
import ArrowBack from "../components/ArrowBack"

import toast from "react-hot-toast"

import { FiShoppingBag } from 'react-icons/fi'

import image from "./mercadopago.png"
import { useEffect, useState } from "react"

const OrderPage = () => {

  const [order, setOrder] = useState();
  const [date, setDate] = useState();
  const [orderState, setOrderState] = useState()

  const { updateOrder, deleteOrder, orders, getOrder, setAsSeenOrder } = useOrder()

  const params = useParams()
  const navigate = useNavigate()
  
  const handleDelete= ()=>{
    toast(t=>(
        <div>
            <p className='text-white text-xl font-semibold'>¿Seguro que quieres eliminar esta orden?</p>
            <div>
                <button 
                className='bg-red-500 hover:bg-red-400 px-3 py-2 rounded-sm text-sm mx-2 text-white'
                onClick={()=> {
                    deleteOrder(order?.id)
                    toast.dismiss(t.id)
                    navigate('/orders')
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
  
  useEffect(()=>{

    const callData = async () => {
      let orderCalled;
      const data = await getOrder(params.id)
      orderCalled = data.data()
      orderCalled.id = data.id
      setOrder(orderCalled)
      const date = new Date(orderCalled?.created_at.seconds * 1000)
      setDate(date)
      console.log("LLAMADA")
    }

    const order = orders.filter((order) => order?.id === params.id)[0]
    if(order){
      const date = new Date(order?.created_at.seconds * 1000)
      setDate(date)
      setOrder(order)
    } else {
      callData()
    }
    setAsSeenOrder(params.id)
  }, [])

  return (
      <div className="bg-red-500 min-h-[100vh] w-full pt-24">
        <ArrowBack/>
        <h1 className="pl-6 text-3xl mb-10 font-bold text-white max-w-[650px] w-full m-auto">
          Compra en linea
        </h1>
        {
          orderState === 'completed'
          ?
          <div className='bg-white max-w-[700px] w-[90vw] pl-4 py-4 m-auto rounded-lg font-bold text-2xl my-4 shadow-xl shadow-black/30'>
              ✅ Completado
          </div>
          : 
          orderState === 'incompleted'
          ? ''
          :
          order?.completed && 
          <div className='bg-white max-w-[700px] w-[90vw] pl-4 py-4 m-auto rounded-lg font-bold text-2xl my-4 shadow-xl shadow-black/30'>
              ✅ Completado
          </div>
        }
        <div className="p-4 bg-white max-w-[700px] rounded-lg w-[90vw] m-auto text-lg font-semibold mb-4 shadow-xl shadow-black/30">
          <h1 className="text-2xl mb-3">
            Informacion de contacto:
          </h1>
          <div> 
            🧑 {order?.name}
          </div>
          <div> 
            📱 {order?.phone_number}
          </div>
          <div> 
          🕥 {date?.getDate()}/{date?.getMonth() + 1}/{date?.getHours()}:{date?.getMinutes()}
          </div>
          <div> 
            Puntos obtenidos: {order?.points}
          </div>

        </div>
        <div className="max-w-[700px] rounded-lg w-[90vw] m-auto text-lg">
          
          <div className='bg-white pl-4 p-4 rounded-lg font-bold text-2xl shadow-xl shadow-black/30'>
            <div className="pt-2"> 
              Precio: ${order?.price}
            </div>
              {
                order?.paymentMethod === 'cash'
                ? 
                <div>
                  <div className="font-semibold pt-4">Pago Realizado en:</div>
                  <div>Efectivo 💵</div>
                </div>
                : order?.paymenteMethod === 'points'
                ? 
                <div className="font-bold pt-4">Canjeado por Puntos</div>
                :
                <div>
                  <div className="font-semibold pt-4">Pago Realizado a través de:</div>
                  <img src={image} className='w-8 h-6 inline mr-1'/> Mercado Pago
                </div>
              }
            </div> 
            <div className='bg-white pl-4 py-4 rounded-lg font-bold text-2xl mt-4 shadow-xl shadow-black/30'>
              
              <div className="py-2"> 
                  <div className="font-semibold">
                    Direccion:
                  </div>
                   🏠 {order?.address}
                </div> 
              {
                order?.delivery === 'delivery'
                ? '🛵 Entrega a domicilio'
                : '🏢 Retira en el local'
              }
            </div>
          </div>
      <h1 className="pl-6 text-3xl my-6 font-bold text-white max-w-[650px] w-full m-auto">
        Productos:
      </h1>
        {
        order?.orderedProducts.map((product) => (
            <div key={product.productId} className='flex items-center mt-4 bg-white max-w-[700px] rounded-lg w-[90vw] m-auto text-lg py-4 px-2 shadow-xl shadow-black/30'>
                {
                product.product?.imageURL
                    ? 
                    <div className='mx-[5px]'>
                        <img className='object-cover h-20 w-20 rounded-xl' src={product.product.imageURL} alt={product.product.name}/>
                    </div> 
                    :
                    <FiShoppingBag className='h-12 w-12'/>
                }    
                
                <div className='flex flex-col mx-[5px]'>
                    <div className='font-semibold text-xl'>
                       {product.quantity} {product.product.name}
                    </div>
                    <div className='border-b border-black font-semibold text-xl'>
                       {
                        product.product.price === 0 && 'Canjeado por puntos'
                       }
                    </div>
                    {
                      product.tastes.map((taste) => (
                        <div key={taste}>
                          🍨 {taste}
                        </div>
                      ))
                    }
                </div>
            </div>
        ))
        }
        
        <div className='w-full max-w-[700px] m-auto flex items-center justify-around font-semibold text-2xl py-6'>
        {
            orderState === 'completed'
            ?
            <button
            onClick={()=>{
              updateOrder(order?.id, { completed: !order?.completed })
              setOrderState('incompleted')
            }}
            className='shadow-md shadow-black/60 p-2 bg-white rounded-xl flex hover:shadow-black/80'>
              📦
            </button>
            :
            orderState === 'incompleted'
            ?
            <button
            onClick={()=>{
              updateOrder(order?.id, { completed: !order?.completed })
              setOrderState('completed')
            }}
            className='shadow-md shadow-black/60 p-2 bg-white rounded-xl flex hover:shadow-black/80'>
              👍
            </button> 
            :
            order?.completed
            ? 
            <button
            onClick={()=>{
              updateOrder(order?.id, { completed: !order?.completed })
              setOrderState('incompleted')
            }}
            className='shadow-md shadow-black/60 p-2 bg-white rounded-xl flex hover:shadow-black/80'>
              📦
            </button>
            :<button
            onClick={()=>{
              updateOrder(order?.id, { completed: !order?.completed })
              setOrderState('completed')
            }}
            className='shadow-md shadow-black/60 p-2 bg-white rounded-xl flex hover:shadow-black/80'>
              👍
            </button> 
            }
          
          <button 
          onClick={handleDelete}
          className='shadow-md shadow-black/60 p-2 bg-white rounded-xl flex hover:shadow-black/80'>
            🗑️ 
          </button>
        </div>
    </div>
  )
}

export default OrderPage
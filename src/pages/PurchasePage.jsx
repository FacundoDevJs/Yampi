import { useNavigate, useParams } from "react-router-dom"

import { useOrder } from "../context/OrderContext"
import ArrowBack from "../components/ArrowBack"


import { FiShoppingBag } from 'react-icons/fi'

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaCheck, FaRegTrashAlt } from "react-icons/fa"

const PurchasePage = () => {


  const [order, setOrder] = useState();
  const [date, setDate] = useState();
  const [orderState, setOrderState] = useState()

  const { updateOrder, deleteOrder, purchases, getOrder} = useOrder()

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
                    navigate('/purchases')
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
    }

    const order = purchases.filter((order) => order?.id === params.id)[0]
    if(order){
      const date = new Date(order?.created_at.seconds * 1000)
      setDate(date)
      setOrder(order)
    } else {
      callData()
    }
  }, [])

  return (
    <div className="bg-red-500 min-h-[100vh] w-full pt-24">
      <ArrowBack/>
      <h1 className="pl-6 text-3xl mb-10 font-bold text-white max-w-[650px] w-full m-auto">
        Compra en el local
      </h1>
      <div className="bg-white max-w-[700px] rounded-lg w-[90vw] m-auto text-xl font-semibold shadow-xl shadow-black/30">
        <div className="p-4 font-semibold"> 
          Precio de la compra: 
          <div className=" font-bold text-2xl">
            $ {order?.price}
          </div>
        </div> 
        <div className="p-4">
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
          <button 
          onClick={handleDelete}
          className='shadow-md shadow-black/60 p-2 bg-white rounded-xl flex hover:shadow-black/80'>
          <FaRegTrashAlt/>
          </button>
        </div>
    </div>
  )
}

export default PurchasePage
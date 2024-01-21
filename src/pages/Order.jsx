import { useNavigate, useParams } from 'react-router-dom'

import OrderCard from '../components/OrderCard'
import ArrowBack from '../components/ArrowBack'
import { useOrder } from '../context/OrderContext'
import handleError from '../utils/handleError'

import { IoIosArrowForward } from 'react-icons/io'

const Order = ()=>{

  const navigate = useNavigate()
  const params = useParams()

  const {orderedProducts, addPurchase} = useOrder()

  const handleCLick = async () => {
    if ( orderedProducts.length > 0 ) {
      if ( params.admin === 'true') {
          const result = await addPurchase()
          if (result === true) {
            navigate('/cashSuccess/purchase')
          }
      } 
      else {
        navigate('/productos/add-order')
      }
    } 
    else {
      handleError('Debes elegir por lo menos un producto')
    }
  }

  return (
    <div 
    className='w-full min-h-[100vh] bg-[linear-gradient(#ef4444,#fde68a)] text-xl flex flex-col items-center p-4 pt-24'
    >
      <ArrowBack/>
      <div
      onClick={()=> handleCLick()}
      className='flex items-center justify-between cursor-pointer w-[90vw] max-w-[390px] mb-4 px-4 py-4 text-white bg-red-500 shadow-lg shadow-black/30 font-bold text-2xl rounded-xl'
      >
        {params.admin === 'true' ? 'Completar compra' : 'Ordenar Carrito'}  <IoIosArrowForward/>
      </div>
        
      <div className='flex flex-col items-center w-full'>
        {
            orderedProducts.map((orderedProduct)=>{
                return <OrderCard orderedProduct={orderedProduct} key={orderedProduct.productId} id={orderedProduct.productId}/>
            })
        }
      </div>
    </div>
)
}

export default Order
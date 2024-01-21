import { useOrder } from '../context/OrderContext';

import { MdOutlineDoNotDisturbOn } from "react-icons/md";
import {FiShoppingBag} from 'react-icons/fi'

const OrderCard = ({orderedProduct, id}) => {
  const { product } = orderedProduct;
  const { deleteProduct } = useOrder()

  return (
    <div className='flex justify-between items-center p-3 rounded-xl bg-white shadow-xl shadow-black/30 my-4'>
          <button 
          onClick={()=>{
            deleteProduct(id, product.price , product.points)
           }}
          className='text-red-500 mr-2'>
            <MdOutlineDoNotDisturbOn className='h-8 w-8 cursor-pointer'/>
          </button>
          <div className='flex'>
            {product?.imageURL 
                ? <img className='object-cover w-24 h-24 rounded-xl m-auto' src={product.imageURL} alt={product.name}/> 
                : <FiShoppingBag className='h-24 w-24 text-neutral-800 m-auto'/>
                }    
          </div>
          <div className='text-2xl font-semibold mr-auto ml-4'>
            <div className='font-bold'>
              {orderedProduct.quantity} de {product.name}
            </div>
            <div className="flex items-end my-2">
             <p className="text-red-500 text-sm pr-1">$</p>{product.price}
            </div>
          </div>
    </div>
  )
}

export default OrderCard
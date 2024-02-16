import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useProduct } from "../context/ProductContext";

import {FiShoppingBag} from 'react-icons/fi';
import { TbEdit, TbShoppingBagPlus } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";
import { useOrder } from "../context/OrderContext";
import { useUser } from "../context/UserContext";

const ProductCard = ({product, admin, purchase}) => {

  const { deleteProduct } = useProduct()
  const { clientInfo } = useOrder()
  const { localUser } = useUser()
  const navigate = useNavigate()


  const handleDelete= ()=>{
    toast(t=>(
        <div>
            <p className='text-white text-xl font-semibold'>¿Seguro que quieres eliminar ese producto?</p>
            <div>
                <button 
                className='bg-red-500 hover:bg-red-400 px-3 py-2 rounded-sm text-sm mx-2 text-white'
                onClick={()=> {
                    deleteProduct(product?.id)
                    toast.dismiss(t.id)
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
  } // NXCKNi2nKGURUwhRKtTy

  if (product.id === 'NXCKNi2nKGURUwhRKtTy' && !admin && !purchase) {
    return <></>
  }

  return (
    <div 
    onClick={()=>{
      if(!admin && product?.stock) {
        navigate(`/productos/${product.id}`)
      }
    }}
    className={
      admin
      ? "bg-white py-6 px-3 rounded-xl my-4 flex flex-col m-auto text-center max-w-[250px] items-center shadow-lg shadow-black/60"
      : "bg-white py-6 px-3 rounded-xl my-4 flex flex-col m-auto text-center max-w-[250px] items-center shadow-lg shadow-black/60 cursor-pointer"
    }
    >
      <div className="pb-3 font-bold text-xl text-red-500">
        {
          (clientInfo !== null && product.redeemable)
          ?
            clientInfo?.points >= product.exchangePoints
            ? '¡Canjeable por puntos!'
            : ''
          :''
        }
      </div>
      <div className="pb-3 font-bold text-xl">
        {
          !product.stock &&
          'No hay Stock'
        }
      </div>
      {
      product?.imageURL 
        ? <img className='object-cover max-w-full h-[250px] max-h-[20vh] rounded-xl shadow-lg shadow-black/60' src={product.imageURL } alt={product.name}/> 
        :<div className='w-full h-[250px] flex'><FiShoppingBag className='h-[200px] w-[200px] text-white m-auto'/></div>
      }
      <div className="flex flex-col pl-4 text-2xl font-bold pt-6">
        <div className="">{product.name}</div>
        <div className="font-semibold flex items-center justify-center"><div className="text-red-500 text-sm">$</div>{product.price}</div>
      </div>
       {
        admin
        ? 
        <div className='flex'>
          <div 
          onClick={(e)=> {
            e.preventDefault()
            navigate(`/edit/${product.id}`)
          }} 
          className="mt-3 p-2 bg-red-500 rounded-xl flex shadow-md shadow-black/40 cursor-pointer mr-6">
            <TbEdit  className='h-8 w-8 text-white m-auto'/>
          </div>  
          <div 
          onClick={(e)=> {
            e.preventDefault()
            handleDelete()
          }} 
          className="mt-3 p-2 bg-red-500 rounded-xl flex shadow-md shadow-black/40 cursor-pointer ml-6">
            <FaRegTrashAlt  className='h-8 w-8 text-white m-auto'/>
          </div>  
        </div>
        : 
        product.stock &&
        <div 
        onClick={(e)=> {
          e.preventDefault()
          if (product.stock) {
            navigate(`/productos/${product.id}`)
          }
        }} 
        className="mt-3 p-2 bg-red-500 rounded-xl flex shadow-md shadow-black/40 cursor-pointer">
           <TbShoppingBagPlus className='h-8 w-8 text-white m-auto'/>
        </div>
       }
    </div>
  )
}

export default ProductCard
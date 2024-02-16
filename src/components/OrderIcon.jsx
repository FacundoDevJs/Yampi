import { TbShoppingBag } from "react-icons/tb"
import { useNavigate } from "react-router-dom"
import OrderNumber from "./OrderNumber"
import { useOrder } from "../context/OrderContext"

const OrderIcon = ({white, admin}) => {
  const navigate = useNavigate()
 
  const {clientInfo} = useOrder()

  return (
    <div
    onClick={()=>{
      if(admin === true || clientInfo){
        navigate(`/productos/orden/${true}`)
      } else {
        navigate(`/productos/orden/${false}`)
      }
    }}    
    className={
      white
      ? 'fixed cursor-pointer top-5 right-4 z-10 select-none w-[48px] h-[48px] flex rounded-xl bg-white text-black shadow-xl shadow-black/20'
      : 'fixed cursor-pointer top-5 right-4 z-10 select-none w-[48px] h-[48px] flex rounded-xl bg-red-500 text-white shadow-xl shadow-black/20'
    }>
      <TbShoppingBag
      className="m-auto w-[24px] h-[24px]"
      />
      <OrderNumber white={!white}/>
    </div>
  )
}

export default OrderIcon
import { IoIosArrowForward } from "react-icons/io"
import { useNavigate } from "react-router-dom"

const ShopOrderCard = ({ order }) => {
  const date = new Date(order.created_at.seconds * 1000)
  const navigate = useNavigate()

  return (
    <div
    onClick={()=>{
      if (order.purchase){
        navigate(`/purchase/${order.id}`)
      }else {
        navigate(`/order/${order.id}`)
      }
    }}
    className='text-black bg-white rounded-lg w-[85%] shadow-lg shadow-black/40 flex flex-col my-[13px] font-semibold text-lg pb-4'>
      <div className='p-4 font-bold text-2xl'>
          {
            order.seen || order.purchase
            ? ''
            : '❗ Nueva Orden'
          }
          {
            order?.completed && 
            '✅ Completado'
          }
      </div>
      <div className='px-5 py-2 flex justify-between items-center'>
        <div className='flex flex-col text-lg'>
          <div> 🧑 {order.name}</div> 
          <div className="font-bold text-2xl"> 🕥 {date.getDate()}/{date.getMonth() + 1}/{date.getHours()}:{date.getMinutes()} </div>
        </div>
        <div>
          <IoIosArrowForward className="h-8 w-8 cursor-pointer"/>
        </div>
      </div>
    </div>
  )
}

export default ShopOrderCard

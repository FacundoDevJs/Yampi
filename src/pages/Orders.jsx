import { useEffect } from "react"
import SideBar from "../components/SideBar"
import { useOrder } from "../context/OrderContext"
import ShopOrderCard from "../components/ShopOrderCard"
import NavBar from "../components/NavBar"

const Orders = () => {

  const { getOrders, orders } = useOrder()

  useEffect( ()=>{
    if(orders.length === 0) {
      getOrders()
      console.log('LLAMADA DE ORDERS')
    }
  }, [])

  return (
  <div className="w-full min-h-[100vh] bg-red-500 pt-12 pb-24">
    <NavBar admin={true}/>
    <SideBar/>
    <h1 className="pl-6 pt-16 text-3xl mb-10 font-bold text-white max-w-[650px] w-full m-auto">
         Encargos en linea 📑
      </h1>
    <div className="flex flex-col items-center">
      {
        orders 
        ?
        orders.map((order)=>{
          return <ShopOrderCard order={order} key={order.id} />
        })
        :
        'No tienes ordenes todavia'
      }
    </div>
  </div>
  )
}

export default Orders
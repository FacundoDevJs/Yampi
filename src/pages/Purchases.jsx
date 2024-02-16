import { useEffect } from "react"
import { useOrder } from "../context/OrderContext"
import NavBar from "../components/NavBar"
import SideBar from "../components/SideBar"
import ShopOrderCard from "../components/ShopOrderCard"

const Purchases = () => {

  const { getPurchases, purchases } = useOrder()

  useEffect( ()=>{
    if(purchases.length === 0) {
      getPurchases()
    }
  }, [])

  return (
    <div className="w-full min-h-[100vh] bg-red-500 py-12">
    <NavBar admin={true}/>
    <SideBar/>
    <h1 className="pl-6 pt-16 text-3xl mb-10 font-bold text-white max-w-[650px] w-full m-auto">
      Compras en el local 🏢
    </h1>
    <div className="flex flex-col items-center">
      {
        purchases 
        ?
        purchases.map((order)=>{
          return <ShopOrderCard order={order} key={order.id} />
        })
        :
        'No tienes ordenes todavia'
      }
    </div>
  </div>
  )
}

export default Purchases
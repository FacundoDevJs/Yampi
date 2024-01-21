import { useEffect, useState } from "react"
import ArrowBack from "../components/ArrowBack"
import { useUser } from "../context/UserContext"
import { useOrder } from "../context/OrderContext"
import { FiShoppingBag } from "react-icons/fi"

const Profile = () => {
  const [orders, setOrders] = useState([])

  const { localUser } = useUser()
  const { getOrder } = useOrder()

  useEffect(()=>{

    const callOrders = async () => {
      console.log("Llamada")
        let listOfOrders = [];

        for (let order of localUser.orders ){
          const fullOrder =  await getOrder(order)
          let data = fullOrder.data()
          if (data !== undefined) {
            data.id = fullOrder.id
            listOfOrders.push(data)
          }
        }

        setOrders(listOfOrders)

      }

    if (localUser?.orders.length > 0){
      callOrders()
    }

  }, [localUser])

  return (
    <div className="bg-red-500 w-full min-h-[100vh] pt-20 px-8 pb-12">
      <ArrowBack/>
      <div className="bg-white w-full max-w-[600px] font-semibold text-xl m-auto rounded-xl p-3">
        {localUser?.name} {localUser?.surname}
        <div className="mt-4 mb-2">
          Puntos: {localUser?.points}
        </div>
      </div>
      <div className="text-3xl font-bold mt-6 text-white">
        Compras
      </div>
      {
        orders.map(( order )=>(
          <div key={ order.id } className="bg-white w-full max-w-[600px] font-semibold text-xl m-auto rounded-xl p-3 my-3">
            Costo: { order.price }
            <div className="my-2">
              Puntos sumados: { order.points }
            </div>
            {
              order.orderedProducts.map((product) => (
                <div key={product.ProductId} className="my-3">
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
                        <div className='border-b border-black font-semibold text-xl'>
                            {product.quantity} {product.product.name}
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
          </div>
        ))
      }
    </div>
  )
}

export default Profile
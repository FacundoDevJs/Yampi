import { useEffect } from "react"
import ArrowBack from "../components/ArrowBack"
import { useProduct } from "../context/ProductContext"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

const PointsTable = () => {  
  const { getProducts, products } = useProduct()

  useEffect(()=>{
    if (products.length === 0 ) {
      getProducts()
    }
    
  }, [])

  return (
    <div className="bg-red-500 w-full min-h-[100vh] py-24">
      <ArrowBack/>
      <div className="bg-white w-[90vw] m-auto min-h-[600px] max-w-[800px] rounded-xl p-4 sm:text-lg">
        <div className="grid grid-cols-3 font-bold sm:text-xl">
          <div className="border-r-2 border-neutral-500 mr-3">Producto</div>
          <div className="border-r-2 border-neutral-500 mr-3">Puntos</div>
          <div>Puntos para canjearlo</div>
        </div>
          {
            products.length > 0 
            ?
            products.map((product) => (
              <div className="grid grid-cols-3 font-bold my-6 border-t-2 border-neutral-500 p-3">
                <div className="border-r-2 border-neutral-500 mr-3">{product.name}</div>
                <div className="border-r-2 border-neutral-500 mr-3">{product.points}</div>
                <div>{product.redeemable && product.exchangePoints}</div>
              </div>
            ))
            :
            <AiOutlineLoading3Quarters className='animate-spin h-12 w-5 m-auto mt-6'/>
          }
      </div>
    </div>
  )
}

export default PointsTable
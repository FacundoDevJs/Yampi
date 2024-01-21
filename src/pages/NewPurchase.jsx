import { useEffect } from "react"
import ArrowBack from "../components/ArrowBack"
import ProductCard from "../components/ProductCard"
import OrderIcon from "../components/OrderIcon"

import { useProduct } from "../context/ProductContext"

import { AiOutlineLoading3Quarters } from "react-icons/ai"

const NewPurchase = () => {

  const { getProducts, products } = useProduct()

  useEffect(()=>{
    if(products.length === 0) {
      getProducts()
    }
  }, [])

  return (
    <div className='bg-red-500 w-full min-h-[100vh] pt-20 pb-8'>
      <ArrowBack/>
      <OrderIcon white={true} admin={true}/>
      <h1 className="p-6 text-3xl font-bold text-white max-w-[650px] w-full m-auto">
        Elige los productos 👜
      </h1>
    
      {
        products.length > 0 
        ?
        products.map((product) => (
          <ProductCard product={product} key={product.id} admin={false}/>
        ))
        :
        <AiOutlineLoading3Quarters className='animate-spin h-12 w-5 m-auto mt-6'/>
      }
    </div>
  )
}

export default NewPurchase
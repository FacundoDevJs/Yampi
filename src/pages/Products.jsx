import { useEffect } from "react"
import { useParams } from "react-router-dom"

import { useUser } from "../context/UserContext"
import { useProduct } from "../context/ProductContext"

import ProductCard from "../components/ProductCard"
import SideBar from "../components/SideBar"
import PointsTableIcon from "../components/PointsTableIcon"
import OrderIcon from "../components/OrderIcon"

import image from "./logo2.png"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

const Products = ({admin}) => {

  const { getProducts, products } = useProduct()
  const { localUser } = useUser()


  useEffect(()=>{
    if (products.length === 0 ) {
      getProducts()
    }
    
  }, [])

  return (
    <div className={
      admin === true
      ?"bg-neutral-900 w-full min-h-[100vh] pt-12"
      :"bg-red-500 w-full min-h-[100vh] pt-12"
    }>
      {
        localUser &&
        <SideBar/>
      }
      <OrderIcon white={true}/>
      <PointsTableIcon top={false}/>
        
      <img src={image} className="w-32 m-auto"/>
      
      <h1 className="p-6 text-3xl font-bold text-white max-w-[650px] w-full m-auto">
        {
          localUser !== null
          ?
          <div>
            Bienvenido
            <div className="bg-white w-full max-w-[600px] font-semibold text-xl my-4 m-auto rounded-xl p-3 text-black">
              {localUser?.name} {localUser?.surname}
              <div className="mt-4 mb-2">
                Puntos: {localUser?.points}
              </div>
            </div>
            Explora nuestro catalogo
          </div>
          :
          ''
        }
      </h1>
      <div className="pt-6">
        <div className="rounded-xl min-h-[150vh] m-auto w-[90%] max-w-[650px] p-4 pb-[20vh]">
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
      </div>
    </div>
  )
}

export default Products
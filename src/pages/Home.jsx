import { useEffect } from "react"
import NavBar from "../components/NavBar"
import SideBar from "../components/SideBar"
import { useProduct } from "../context/ProductContext"
import image from "./logo2.png"
import ProductCard from "../components/ProductCard"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import OrderIcon from "../components/OrderIcon"
import { useUser } from "../context/UserContext"

const Home = ({admin}) => {

  const { getProducts, products } = useProduct()
  const { localUser } = useUser()

  useEffect(()=>{
    getProducts()
  }, [])

  return (
    <div className="bg-red-500 w-full min-h-[100vh] pt-12">
      {
        localUser &&
        <SideBar/>
      }
      {
        admin
        ?
        <NavBar admin={admin}/>
        :
        <OrderIcon white={true}/>
      }

      <img src={image} className="w-32 m-auto"/>
      <h1 className="p-6 text-3xl font-bold text-white max-w-[650px] w-full m-auto">
        {
          admin
          ? 'Tus productos 🍦'
          : '¡Explora nuestra selección irresistible! 🍦😋'
        }
      </h1>
      <div className="pt-[5vh]">
        <div className="bg-neutral-100 rounded-xl min-h-[150vh] m-auto w-[90%] max-w-[650px] p-4 pb-[20vh]">
          {
            products.length > 0 
            ?
            products.map((product) => (
              <ProductCard product={product} key={product.id} admin={admin}/>
            ))
            :
            <AiOutlineLoading3Quarters className='animate-spin h-12 w-5 m-auto mt-6'/>
          }
        </div>
      </div>
    </div>
  )
}

export default Home
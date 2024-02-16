import { useEffect } from "react"
import NavBar from "../components/NavBar"
import SideBar from "../components/SideBar"
import { useProduct } from "../context/ProductContext"
import image from "./logo2.png"
import ProductCard from "../components/ProductCard"
import { AiOutlineLink, AiOutlineLoading3Quarters } from "react-icons/ai"
import OrderIcon from "../components/OrderIcon"
import { useUser } from "../context/UserContext"
import toast from "react-hot-toast"
import PointsTableIcon from "../components/PointsTableIcon"
import { UsersCounter } from "../components/UsersCounter"

const Home = ({admin}) => {

  const { getProducts, products } = useProduct()
  const { localUser } = useUser()

  const copiarAlPortapapeles = () => {
    navigator.clipboard.writeText('https://yampi-sc.web.app/')
    toast.success('Link copiado', {
      style:{
          fontSize: "1.5rem",
          lineHeight: "1.75rem",
          fontWeight: 700,
      }
  })
  
  }

  useEffect(()=>{
    if (products.length === 0 ) {
      getProducts()
    }
    
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
      {
        admin
        &&
        <PointsTableIcon top={true}/>
      }

      <img src={image} className="w-32 m-auto"/>
      <h1 className="p-6 text-3xl font-bold text-white max-w-[650px] w-full m-auto">
        {
          admin
          ? 
          <div>
            Tus productos 🍦
            <button
            className='bg-white rounded-xl p-4 text-xl font-bold text-black flex items-center mt-6 shadow-lg shadow-black/30 outline-none'
            onClick={()=>{copiarAlPortapapeles()}}
            >
              Copiar link <AiOutlineLink className='w-8 h-8 ml-2'/>
            </button>
          </div>
          : 
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
        {
          admin &&
          <UsersCounter/>
        }
      </h1>
      <div className="pt-6">
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
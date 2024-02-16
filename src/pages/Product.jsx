import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { useProduct } from "../context/ProductContext"
import ArrowBack from "../components/ArrowBack"


import { FiShoppingBag } from "react-icons/fi"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import OrderIcon from "../components/OrderIcon"
import TastesList from "../components/TastesList"
import { TbShoppingBagPlus } from "react-icons/tb"
import { useOrder } from "../context/OrderContext"
import toast from "react-hot-toast"
import { VscError } from "react-icons/vsc"
import { useUser } from "../context/UserContext"
import { IoIosCheckmark, IoMdAdd } from "react-icons/io"


const Product = () => {
  const [selectedTastes, setSelectedTastes] = useState([])
  const [product, setProduct] = useState()
  const [counter, setCounter] = useState(1)

  const {addToOrder, addPrice, addPoints, clientInfo} = useOrder()
  const { getProduct , listOfTastes, products } = useProduct()

  const listOfCategorys = Object.keys(listOfTastes)

  const params = useParams()
  const navigate = useNavigate()

  const handleError = (message)=>{
    toast(() => (
        <div className='flex text-white items-center'>
            <div className='w-[20%] h-full flex items-center'>
                <VscError className='text-white w-8 h-8'/>
            </div>
              <div className='w-[80%]'>
                  <div className='font-semibold text-[15px]'>{message}</div>
              </div>
        </div>
    ), {
        style:{
            background: "#262626",
        }
    })
}

  const handleSubmit = async (redeemed)=>{
    if (redeemed){
      if (selectedTastes.length === 0 && product.tastesLimit > 0 && !clientInfo) {
        handleError(`Debes elegir por lo menos 1 gusto de helado`)
      } else {
        await addToOrder({ product: {name: product.name, price: 0, imageURL: product.imageURL}, productId: product.id, quantity: counter, tastes: selectedTastes, redeemed })
        addPoints(-product.exchangePoints * counter)
        setSelectedTastes([])
      } 
    } else {
      if (selectedTastes.length === 0 && product.tastesLimit > 0 && !clientInfo) {
        handleError(`Debes elegir por lo menos 1 gusto de helado`)
      } else {
        await addToOrder({ product: {name: product.name, price: product.price, imageURL: product.imageURL}, productId: product.id, quantity: counter, tastes: selectedTastes, redeemed })
        await addPrice(product.price * counter)
        if (clientInfo !== null) {
          addPoints(product.points * counter)
        } else {
          addPoints(0)
        }
        setSelectedTastes([])
      } 
    }
    if (clientInfo){
      navigate('/new-purchase')
    } else {
      navigate('/productos')
    }
  }

  useEffect(()=>{
    const callData = async () => {
      let productCalled;
      const data = await getProduct(params.id)
      productCalled = data.data()
      productCalled.id = data.id
      setProduct(productCalled)
    }

    const productFiltered = products.filter((product) => product.id === params.id)[0]
    if(productFiltered){
      setProduct(productFiltered)
    } else {
      callData()
    }
  }, [getProduct, params.id])

  return (
 
    <div className="bg-neutral-100 w-full min-h-[100vh]">
      <ArrowBack/>
      <OrderIcon white={false}/>
      <div className="pt-[96px] pb-12">
        {
          product
          ?
          <div className="flex flex-col items-center">
            {
            product?.imageURL 
              ? <img className='object-cover max-w-full h-[200px] rounded-xl shadow-xl shadow-black/40' src={product.imageURL } alt={product.name}/> 
              :<div className='w-full h-[200px] flex'><FiShoppingBag className='h-[150px] w-[150px] text-white m-auto'/></div>
            }
            <div className="bg-neutral-50 rounded-xl  m-auto w-[90%] max-w-[650px] p-4 pb-6 mt-[80px] shadow-xl shadow-black/40">
              <div className='flex items-center justify-between px-2 text-white w-[150px] font-bold text-2xl rounded-full bg-red-500 absolute top-[348px] left-0 right-0 ml-auto mr-auto shadow-xl shadow-black/30'>
                  <div 
                  className='w-14 h-14 cursor-pointer text-center flex items-center justify-center'
                  onClick={()=>{
                      if(counter !== 1){
                          setCounter(counter - 1)
                      }
                  }}
                  >
                      -
                  </div>
                  <div className='text-center py-[7px] flex-items-center'>
                      {counter}
                  </div>
                  <div 
                  className='w-14 h-14 cursor-pointer text-center flex items-center justify-center'
                  onClick={()=>{setCounter(counter + 1)}}
                  >
                      +
                  </div>
              </div>
              <div className="text-2xl font-bold flex pt-16 pl-8">
                  <div>
                    {product.name}
                  </div>
                  <div className="flex items-end px-6">
                  <p className="text-red-500 text-sm pr-1">$</p>{product.price}
                  </div>
              </div>
              <div className="text-2xl font-semibold pt-8 pl-8">
                    Puntos: {product?.points}
              </div>
              {
                (product.redeemable && clientInfo) &&
                <div className="text-2xl font-semibold pt-8 pl-8">
                      Puntos para canjearlo: {product?.exchangePoints}
                </div>
              }
              <div className="p-4 text-xl font-semibold">
              {
                !clientInfo &&
                product.tastes.length > 15
                ?
                  listOfCategorys.length > 0 ?
                  listOfCategorys.map(category => (
                    <TastesList 
                    key={category} 
                    category={category} 
                    list={listOfTastes[category]} 
                    tastes={product.tastes}
                    selectedTastes={selectedTastes}
                    setSelectedTastes={setSelectedTastes}
                    tastesLimit={product.tastesLimit}
                    counter={counter}
                    />
                  ))
                  : <AiOutlineLoading3Quarters className='animate-spin h-12 w-5 m-auto'/>
                : 
                !clientInfo &&
                product.tastes.length > 0
                ?
                <div>
                {
                 product.tastes.map((taste) => (
                    <li
                      key={taste}
                      className={
                         selectedTastes.includes(taste) 
                          ? "flex items-center p-2 bg-red-500 text-white my-3 rounded-lg" 
                          : "flex items-center p-2 bg-neutral-300 my-3 rounded-lg" 
                        }
                    >
                    {
                      selectedTastes.includes(taste)
                      ?
                      <IoIosCheckmark
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => {
                        setSelectedTastes(selectedTastes.filter(
                          (selectedTaste) => selectedTaste !== taste ))
                      }}
                      />
                      :
                      <IoMdAdd
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => { 
                        if ( selectedTastes.length === 1 ) {
                          handleError(`No puedes elegir mas de 1 gusto de helado en este producto`)
                      } else {
                          setSelectedTastes([...selectedTastes, taste]);
                      }
                      }}
                    />
                    }
                     
                      <div
                        className={
                          selectedTastes.includes(taste) ? "px-2 text-white w-[80%]" : "px-2 w-[80%]"
                        }
                      >
                        {taste}
                      </div>

                    </li>
                 )) 
                }
                </div>
                : ''
              }
              </div>
              {
              (clientInfo !== null && product.redeemable)
              ?
              clientInfo?.points >= (product.exchangePoints * counter)
              ?
              <div>
                <div 
                onClick={()=> handleSubmit(true)} 
                className="mt-3 p-2 bg-red-500 rounded-xl shadow-xl shadow-black/20 cursor-pointer text-center text-white text-2xl font-bold">
                  Canjear Por puntos
                </div>
                <div 
                onClick={()=> handleSubmit(false)} 
                className="mt-3 p-2 bg-red-500 rounded-xl flex shadow-xl shadow-black/20 cursor-pointer">
                  <TbShoppingBagPlus className='h-12 w-12 text-white m-auto'/>
                </div>
              </div>
              :
              <div 
              onClick={()=> handleSubmit(false)} 
              className="mt-3 p-2 bg-red-500 rounded-xl flex shadow-xl shadow-black/20 cursor-pointer">
                <TbShoppingBagPlus className='h-12 w-12 text-white m-auto'/>
              </div>
              :
              <div 
              onClick={()=> handleSubmit(false)} 
              className="mt-3 p-2 bg-red-500 rounded-xl flex shadow-xl shadow-black/20 cursor-pointer">
                <TbShoppingBagPlus className='h-12 w-12 text-white m-auto'/>
              </div>
              }
              
            </div>
          </div>
          :
          <AiOutlineLoading3Quarters className='animate-spin h-8 w-8 m-auto'/>
        }
      </div>
    </div>
  )
}

export default Product
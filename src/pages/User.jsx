import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import ArrowBack from "../components/ArrowBack"
import { useUser } from "../context/UserContext"
import { FaCheck, FaPhone, FaUser } from "react-icons/fa"
import { HiIdentification } from "react-icons/hi2"
import { TbEdit } from "react-icons/tb"

const User = () => {
  const [orders, setOrders] = useState([])
  const [user, setUser] = useState()
  const [inputEdit, setInputEdit] = useState('none')
  const [value, setValue] = useState({
    name: null,
    dni: null,
    phone_number: null,
  })

  const params = useParams()

  const {users, getUser, updateUser} = useUser()

  const handleSubmit = async () => {
    updateUser(value, user.id)
    // setUser({
    //   ...user, 
    //   name: value.name,
    //   dni: value.dni,
    //   phone_number: value.phone_number
    // })
  }

  useEffect(()=>{
    const callData = async () => {
      let userCalled;
      const data = await getUser(params.id)
      userCalled = data.data()
      userCalled.id = data.id
      setUser(userCalled)
      setValue({
        name: userCalled.name,
        dni: userCalled.dni,
        phone_number: userCalled.phone_number,
      })
      if (userCalled.orders.length > 0 && orders.length === 0){
        callOrders()
      }
    }

    const userFiltered = users?.filter((user) => user.id === params.id)[0]
    if(userFiltered){
      setUser(userFiltered)
      setValue({
        name: userFiltered.name,
        dni: userFiltered.dni,
        phone_number: userFiltered.phone_number,
      })
    } else {
      callData()
    }

    const callOrders = async () => {
        let listOfOrders = [];

        for (let order of user.orders ){
          const fullOrder =  await getOrder(order)
          let data = fullOrder.data()
          if (data !== undefined) {
            data.id = fullOrder.id
            listOfOrders.push(data)
          }
        }
        setOrders(listOfOrders)
      }

  }, [user])

  return (
    <div className="bg-red-500 w-full min-h-[100vh] pt-20 px-8 pb-12">
      <ArrowBack/>
      <div className="bg-white w-full max-w-[600px] font-semibold text-xl m-auto rounded-xl p-3">
        
      <div className="flex items-center">
        <FaUser className="mr-2"/> 
        {
          inputEdit === 'name'
          ?
          <input 
          autoFocus
          className="bg-neutral-300 outline-none w-[90%] rounded-lg pl-2"
          onChange={(e) => setValue({ ...value, name: e.target.value })}
          defaultValue={value?.name}/>
          :
          value.name !== null
          && value.name
        }
        {
          inputEdit === 'name'
          ?
          <div 
          onClick={()=> {
            handleSubmit()
            setInputEdit('none')
          }} 
          className="p-1 bg-neutral-300 rounded-lg flex cursor-pointer ml-2">
            <FaCheck className='m-auto'/>
          </div> 
          :
          <div 
          onClick={()=> {
            setInputEdit('name')
          }} 
          className="p-1 bg-neutral-300 rounded-lg flex cursor-pointer ml-2">
            <TbEdit className='m-auto'/>
          </div> 
        } 
      </div>
      <div className="flex items-center">
        <HiIdentification className="mr-2"/>
        {
          inputEdit === 'dni'
          ?
          <input 
          autoFocus
          className="bg-neutral-300 outline-none w-[90%] rounded-lg pl-2"
          onChange={(e) => setValue({ ...value, dni: e.target.value })}
          defaultValue={value?.dni}/>
          :
          value.dni !== null
          && value.dni
        }
        {
          inputEdit === 'dni'
          ?
          <div 
          onClick={()=> {
            handleSubmit()
            setInputEdit('none')
          }} 
          className="p-1 bg-neutral-300 rounded-lg flex cursor-pointer ml-2">
            <FaCheck className='m-auto'/>
          </div> 
          :
          <div 
          onClick={()=> {
            setInputEdit('dni')
          }} 
          className="p-1 bg-neutral-300 rounded-lg flex cursor-pointer ml-2">
            <TbEdit className='m-auto'/>
          </div> 
        }  
      </div>
      <div className="flex items-center">
        <FaPhone className="mr-2"/> 
        {
          inputEdit === 'phone-number'
          ?
          <input 
          autoFocus
          className="bg-neutral-300 outline-none w-[90%] rounded-lg pl-2"
          onChange={(e) => {
            setValue({ ...value, phone_number: e.target.value })
          }}
          defaultValue={value?.phone_number}/>
          :
          value.phone_number !== null
          && value.phone_number
        }
        {
          inputEdit === 'phone-number'
          ?
          <div 
          onClick={()=> {
            handleSubmit()
            setInputEdit('none')
          }} 
          className="p-1 bg-neutral-300 rounded-lg flex cursor-pointer ml-2">
            <FaCheck className='m-auto'/>
          </div> 
          :
          <div 
          onClick={()=> {
            setInputEdit('phone-number')
          }} 
          className="p-1 bg-neutral-300 rounded-lg flex cursor-pointer ml-2">
            <TbEdit className='m-auto'/>
          </div>  
        }  
      </div>
        <div className="mt-4 mb-2">
          Puntos: {user?.points}
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

export default User

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ArrowBack from "../components/ArrowBack"
import TastesList from "../components/TastesList";
import { useProduct } from "../context/ProductContext"
import TastesSkeleton from "../componentSkeletons/TastesSkeleton";

import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { TbCameraPlus } from "react-icons/tb";

import handleError from "../utils/handleError"

const AddProduct = () => {
  const [selectedTastes, setSelectedTastes] = useState([])
  const [state, setState] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [counter, setCounter] = useState(0)
  const [initialValues, setInitialValues] = useState(false)
  const [value, setValue] = useState({
      name: null, 
      price: null, 
      points: null,
      exchangePoints: null,
      imageFile: null, 
    }
   )
   const [redeemable, setRedeemable] = useState(false)
   const [stock, setStock] = useState(true)

  const { addProduct, listOfTastes, products, getProduct, updateProduct } = useProduct()

  const listOfCategorys = Object.keys(listOfTastes)
  
  const navigate = useNavigate()
  const params = useParams()

  const edit = !!params.id

function resizeImage(file, maxWidth, maxHeight, callback) {
  const reader = new FileReader();
  reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      img.onload = function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          let newWidth = img.width;
          let newHeight = img.height;

          if (img.width > maxWidth) {
              newWidth = maxWidth;
              newHeight = (img.height * maxWidth) / img.width;
          }
          if (newHeight > maxHeight) {
              newHeight = maxHeight;
              newWidth = (img.width * maxHeight) / img.height;
          }

          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          canvas.toBlob((blob) => {
            callback(blob); // Devuelve el archivo blob resultante
          }, "image/jpeg");
      };
  };
  reader.readAsDataURL(file);
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (value.name === null) {
      handleError(`Debes escribir un nombre`)
    } else if (value.price === null) {
      handleError(`Debes elegir un precio`)
    } else if (value.points === null) {
      handleError(`Debes elegir los puntos`)
    } else {
      e.preventDefault()
      setIsLoading(true)
      if (params.id){
        if (value.imageFile) {
          resizeImage(value.imageFile, 640, 640, async (resizedBlob) => {
            updateProduct({
              name: value.name,
              price: value.price,
              points: value.points,
              exchangePoints: value.exchangePoints,
              imageFile: resizedBlob,
              tastes: selectedTastes,
              tastesLimit: counter,
              redeemable,
              stock,
            }, params.id).then(()=> navigate('/tus-productos'));
          })
        } else {
          updateProduct({
            name: value.name,
            price: value.price,
            points: value.points,
            exchangePoints: value.exchangePoints,
            imageURL: value.imageURL,
            tastes: selectedTastes,
            tastesLimit: counter,
            redeemable,
            stock,
          }, params.id).then(()=> navigate('/tus-productos'));
        }
      } else {
        if (value.imageFile) {
          resizeImage(value.imageFile, 640, 640, async (resizedBlob) => {
            addProduct({
              name: value.name,
              price: value.price,
              points: value.points,
              exchangePoints: value.exchangePoints,
              imageFile: resizedBlob,
              tastes: selectedTastes,
              tastesLimit: counter,
              redeemable,
              stock,
            }).then(()=> navigate('/tus-productos'));
          })
        } else {
          addProduct({
            name: value.name,
            price: value.price,
            points: value.points,
            exchangePoints: value.exchangePoints,
            imageURL: value.imageURL,
            tastes: selectedTastes,
            tastesLimit: counter,
            redeemable,
            stock,
          }).then(()=> navigate('/tus-productos'));
        }
      }
    }
  }

  const readFile = (file)=>{
    const reader = new FileReader()
    reader.readAsDataURL(file)
    return reader.addEventListener("load", e=>{
        let newImg = `<img src='${e.currentTarget.result}' class='object-cover h-32 w-32 rounded-lg' alt="avatar"></img>`
        document.querySelector(".resultado").innerHTML=newImg
  })}

  useEffect(()=>{
    if (params.id){
      const callData = async () => {
        let productCalled;
        const data = await getProduct(params.id)
        productCalled = data.data()
        productCalled.id = data.id
        setCounter(productCalled.tastesLimit)
        setRedeemable(productCalled.redeemable)
        setStock(productCalled.stock)
        setInitialValues(productCalled)
        setValue({
          name: productCalled.name,
          price: productCalled.price, 
          points: productCalled.points, 
          exchangePoints: productCalled.exchangePoints,
          imageFile: null, 
          imageURL: productCalled.imageURL,
        })
        setSelectedTastes(productCalled.tastes)
      }
  
      const productFiltered = products.filter((product) => product.id === params.id)[0]
      if(productFiltered){
        setInitialValues(productFiltered)
        setCounter(productFiltered.tastesLimit)
        setRedeemable(productFiltered.redeemable)
        setStock(productFiltered.stock)
        setSelectedTastes(productFiltered.tastes)
        setValue({
          name: productFiltered.name,
          price: productFiltered.price, 
          points: productFiltered.points, 
          exchangePoints: productFiltered.exchangePoints,
          imageFile: null, 
          imageURL: productFiltered.imageURL
        })
      } else {
        callData()
      }
    }
  }, [])

  return (
    <div className='w-full min-h-[100vh] text-black bg-red-500'>
      <ArrowBack/>
      <div className=" pt-[100px] pb-10">
        <h1 className="py-6 text-3xl font-bold max-w-[650px] w-full m-auto text-center text-white">
          { edit ? 'Editar producto 🍨' : 'Agregar producto 🍨'}
        </h1>
        <form className=" bg-neutral-50 w-[94%] max-w-[600px] min-h-[130vh] m-auto rounded-xl pb-5">
            <div className='flex items-center p-6'>
            <label 
            htmlFor="file-1"
            className='p-2 bg-white rounded-xl text-neutral-700 cursor-pointer shadow-md shadow-black/60'
            >
              
            {
                state
                ?<div className='resultado'></div> 
                :
                initialValues?.imageURL
                ?<img src={initialValues.imageURL} className='object-cover h-20 w-20 rounded-lg' alt="avatar"></img>
                : <TbCameraPlus className="w-24 h-24"/>
            }
            
            </label> 
            
            <h2 className="h-24 pl-5 py-2 text-2xl font-bold">
              { edit ? 'Cambia la imagen' : 'Agrega una imagen' }
            </h2>

            <input 
            type="file" 
            name="imageFile" 
            className='absolute invisible'
            id="file-1"
            onChange={e => {
              readFile(e.target.files[0])
              setState(true)
              setValue({...value, imageFile: e.target.files[0]})
            }}
            />
          </div>
                
          <div className='flex flex-col px-4 items-center text-center'>
            <label htmlFor="name" className='mt-4 text-xl font-bold'>Nombre</label>
            <input
            id='name'
            defaultValue={initialValues ? initialValues.name: ""}
            className="p-4 bg-neutral-200 rounded-xl mt-2 outline-none focus:outline-none w-[90%] transition-all"
            placeholder='Cucurucho triple'
            onChange={(e) => setValue({ ...value, name: e.target.value })}
            />
          </div>

          <div className='flex flex-col px-4 items-center text-center'>
            <label htmlFor="price" className='mt-4 text-xl font-bold'>Precio</label>

            <input
            id='price'
            type='number'
            defaultValue={initialValues ? initialValues.price: ""}
            className="p-4 bg-neutral-200 rounded-xl mt-2 outline-none focus:outline-none w-[90%] transition-all"
            placeholder='1000'
            onChange={(e) => setValue({ ...value, price: e.target.value })}
            />
          </div>

          <div className='flex flex-col px-4 items-center text-center'>
            <label htmlFor="points" className='mt-4 text-xl font-bold'>Puntos por compra</label>
            <input
            id='points'
            type='number'
            defaultValue={initialValues ? initialValues.points: ""}
            className="p-4 bg-neutral-200 rounded-xl mt-2 outline-none focus:outline-none w-[90%] transition-all"
            placeholder='500'
            onChange={(e) => setValue({ ...value, points: e.target.value })}
            />
          </div>

          <div className='flex flex-col px-4 items-center text-center'>
            <label htmlFor="exchangePoints" className='mt-4 text-xl font-bold'>Puntos necesarios para canjearlo</label>
            <input
            id='exchangePoints'
            type='number'
            defaultValue={initialValues ? initialValues.exchangePoints: ""}
            className="p-4 bg-neutral-200 rounded-xl mt-2 outline-none focus:outline-none w-[90%] transition-all"
            placeholder='10000'
            onChange={(e) => setValue({ ...value, exchangePoints: e.target.value })}
            />
          </div>
          <div className='flex flex-col px-4 items-center text-center'>
            <div className='mt-4 text-xl font-bold'>
              Cantidad de gustos que tienen que elegir 🍨
            </div>
            
            <div className='flex items-center justify-between px-2 text-white font-bold text-2xl rounded-full bg-red-500 mt-3'>
                <div 
                className='w-14 h-14 cursor-pointer text-center flex items-center justify-center'
                onClick={()=>{
                    if(counter !== 0){
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
          </div>
          <div className="p-4 text-center font-bold">
            <div className='my-4 text-xl'>
              ¿Canjeable por puntos?
            </div>
            <div className='flex shadow-lg shadow-black/40 rounded-xl cursor-pointer w-[140px] m-auto'>
              <div className={
                redeemable
                ? 'w-[50%] p-4 rounded-l-xl bg-red-500 text-white'
                : 'w-[50%] p-4 border-2 border-red-500 rounded-l-xl'
              }
              onClick={()=>{setRedeemable(true)}}
              >
                Si
              </div>
              <div className={
                !redeemable
                ? 'w-[50%] p-4 rounded-r-xl bg-red-500 text-white'
                : 'w-[50%] p-4 border-t-2 border-r-2 border-b-2 border-red-500 rounded-r-xl'
              }
              onClick={()=>{setRedeemable(false)}}
              >
                No
              </div>
            </div>
          </div>
          <div className="p-4 text-center font-bold">
            <div className='my-4 text-xl'>
              ¿Hay Stock de este producto?
            </div>
            <div className='flex shadow-lg shadow-black/40 rounded-xl cursor-pointer w-[140px] m-auto'>
              <div className={
                stock
                ? 'w-[50%] p-4 rounded-l-xl bg-red-500 text-white'
                : 'w-[50%] p-4 border-2 border-red-500 rounded-l-xl'
              }
              onClick={()=>{setStock(true)}}
              >
                Si
              </div>
              <div className={
                !stock
                ? 'w-[50%] p-4 rounded-r-xl bg-red-500 text-white'
                : 'w-[50%] p-4 border-t-2 border-r-2 border-b-2 border-red-500 rounded-r-xl'
              }
              onClick={()=>{setStock(false)}}
              >
                No
              </div>
            </div>
          </div>
          <div className="p-4 text-xl font-semibold">
            {

              listOfCategorys.length > 0 ?
              listOfCategorys.map(category => (
                <TastesList 
                key={category} 
                category={category} 
                list={listOfTastes[category]} 
                selectedTastes={selectedTastes}
                setSelectedTastes={setSelectedTastes}
                admin={true}
                />
              ))
             : <TastesSkeleton/>
            }
          </div>
          <button 
          onClick={(e)=>handleSubmit(e)}
          className="px-6 py-3 text-2xl rounded-xl bg-red-500 font-semibold text-white m-auto block">
          {
            isLoading 
            ? <AiOutlineLoading3Quarters className='animate-spin h-12 w-5 m-auto'/>
            : 'Guardar'
          }
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddProduct
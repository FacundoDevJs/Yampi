import { useEffect, useState } from "react";
import { useProduct } from "../context/ProductContext";
import toast from "react-hot-toast";

import { IoIosArrowDown, IoIosArrowUp, IoIosCheckmark, IoMdAdd } from "react-icons/io";
import { VscError } from "react-icons/vsc";
import { MdOutlineDoNotDisturbOn } from "react-icons/md";

const TastesList = ({ category, selectedTastes, setSelectedTastes, admin, tastesLimit, counter, tastes }) => {
  const [isOpenList, setIsOpenList] = useState(false);
  const [locallySelecteds, setLocallySelecteds] = useState([])
  const [isOpenAddNewTaste, setIsOpenAddNewTaste] = useState(false)
  const [newTaste, setNewTaste] = useState('')
  const [list, setList] = useState([])

  const  { addNewTaste, deleteTaste, listOfTastes } = useProduct()


  const handleDeleteTaste = async (taste, category)=>{
    const res = await deleteTaste(taste, category)
    setList(res)
  }

  const handleDelete = (taste, category)=>{
    toast(t=>(
        <div>
            <p className='text-white text-xl font-semibold'>¿Seguro que quieres eliminar este sabor?</p>
            <div>
                <button 
                className='bg-red-500 hover:bg-red-400 px-3 py-2 rounded-sm text-sm mx-2 text-white'
                onClick={()=> {
                  handleDeleteTaste(taste, category)
                  toast.dismiss(t.id)
                }}
                >
                    Eliminar
                </button>
                <button className='bg-slate-400 hover:bg-slate-500 px-3 py-2 rounded-sm mx-2 text-white'
                onClick={()=> toast.dismiss(t.id)}
                >
                    Cancelar
                </button>
            </div>
        </div>
    ), {
        style:{
            background: "#202020"
        }
    })
  }
  
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

  useEffect(()=>{
    setList(listOfTastes[category])
  }, [listOfTastes])

  return (
    <div className={list.every(elem => selectedTastes.includes(elem)) ? "p-2 bg-red-300 my-3 rounded-xl transition-all" : "p-2 bg-neutral-200 my-3 rounded-xl transition-all"}>
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center justify-center">
          {
            admin
            ?
            
            list.every(elem => selectedTastes.includes(elem))
            ?
            <IoIosCheckmark
            className="cursor-pointer"
            onClick={() => {
              let newList = list.filter((taste) => !selectedTastes.includes(taste));
              setSelectedTastes(newList);
              setLocallySelecteds([])
            }}
            /> 
            :
            <IoMdAdd
            className="cursor-pointer"
            onClick={() => {
             
                let newSelectedsList = list.map((taste) =>
                  selectedTastes.includes(taste) ? undefined : taste
                );
                newSelectedsList = newSelectedsList.filter((taste) => taste !== undefined);
                
                setSelectedTastes([...selectedTastes, ...newSelectedsList]);
                setLocallySelecteds([...locallySelecteds, ...newSelectedsList]);
              
            }}
            /> 
            :
            ''
          }
          <div className="px-2">{category === "Dulce_De_Leche" ? "Dulce de Leche" : category}</div>
        </div>
        <div>
          {isOpenList ? (
            <IoIosArrowUp className="cursor-pointer" onClick={() => setIsOpenList(!isOpenList)} />
          ) : (
            <IoIosArrowDown className="cursor-pointer" onClick={() => setIsOpenList(!isOpenList)} />
          )}
        </div>
      </div>
      <ul
        className={
          isOpenList
            ? "max-h-auto transition-all px-4 py-2"
            : "h-0 transition-all"
        }
      >
        {list.map((taste) => (
          admin
          ?
          <li
            key={taste}
            className={
              isOpenList
              ? selectedTastes.includes(taste) 
                ? "flex items-center p-2 bg-red-500 text-white my-3 rounded-lg" 
                : "flex items-center p-2 bg-neutral-300 my-3 rounded-lg" 
              : "hidden"}
          >
          {
            selectedTastes.includes(taste)
            ?
            <IoIosCheckmark
            className="w-6 h-6 cursor-pointer"
            onClick={() => {
              let newSelectedTastes;
              newSelectedTastes = selectedTastes.filter(
                (selectedTaste) => selectedTaste !== taste );
              let newLocallySelectedTastes = locallySelecteds.filter(
                (selectedTaste) => selectedTaste !== taste );
              setSelectedTastes(newSelectedTastes);
              setLocallySelecteds(newLocallySelectedTastes);
            }}
            />
            :
            <IoMdAdd
            className="w-6 h-6 cursor-pointer"
            onClick={() => { 
              if ( selectedTastes.length > (tastesLimit * counter) -1 ) {
                handleError(`No puedes elegir mas de  ${tastesLimit * counter} gustos de helado`)
            } else {
                let newSelectedTastes;
                newSelectedTastes = [...selectedTastes, taste];
                setSelectedTastes(newSelectedTastes);
                setLocallySelecteds([...locallySelecteds, taste]);
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
            
            <MdOutlineDoNotDisturbOn 
            onClick={()=>{
              handleDelete(taste, category)
            }}
            className='h-8 w-8 cursor-pointer'/>
          </li>
          :
          tastes?.includes(taste)
          ?
          <li
            key={taste}
            className={
              isOpenList
              ? selectedTastes.includes(taste) 
                ? "flex items-center p-2 bg-red-500 text-white my-3 rounded-lg" 
                : "flex items-center p-2 bg-neutral-300 my-3 rounded-lg" 
              : "hidden"}
          >
          {
            selectedTastes.includes(taste)
            ?
            <IoIosCheckmark
            className="w-6 h-6 cursor-pointer"
            onClick={() => {
              let newSelectedTastes;
              newSelectedTastes = selectedTastes.filter(
                (selectedTaste) => selectedTaste !== taste );
              let newLocallySelectedTastes = locallySelecteds.filter(
                (selectedTaste) => selectedTaste !== taste );
              setSelectedTastes(newSelectedTastes);
              setLocallySelecteds(newLocallySelectedTastes);
            }}
            />
            :
            <IoMdAdd
            className="w-6 h-6 cursor-pointer"
            onClick={() => { 
              if ( selectedTastes.length > (tastesLimit * counter) -1 ) {
                handleError(`No puedes elegir mas de  ${tastesLimit * counter} gustos de helado`)
            } else {
                let newSelectedTastes;
                newSelectedTastes = [...selectedTastes, taste];
                setSelectedTastes(newSelectedTastes);
                setLocallySelecteds([...locallySelecteds, taste]);
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
          :
          ''
        ))}
        {
          admin
          ?
          isOpenList 
          ?
          isOpenAddNewTaste
          ?
          <div
          className="flex items-center p-2 bg-neutral-300 my-3 rounded-lg"
          >
          <input 
          autoFocus
          onChange={(e) => {
            setNewTaste(e.target.value)
          }}
          className="bg-neutral-300 outline-none w-[90%]"
          />
          <IoMdAdd
          className="w-6 h-6 cursor-pointer"
          onClick={()=>{
            addNewTaste(newTaste, category)
            setIsOpenAddNewTaste(false)
          }}
          />
        </div>
          :
          
          <button 
          onClick={(e)=>{
            e.preventDefault()
            setIsOpenAddNewTaste(true)
          }} 
          className="flex items-center border-2 border-red-500 p-1 rounded-lg mt-2"
          >
          <IoMdAdd/>
          Agregar sabor
        </button>
        :''
        :''
        }
      </ul>
    </div>
  );
};

export default TastesList;
